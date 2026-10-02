# ADR 0010: Rodar a v0.1.0 como uma instância atrás de um terminador TLS, com backups diários fora do host

> Tradução de [`docs/adr/0010-first-deployment-posture.md`](../../docs/adr/0010-first-deployment-posture.md). O inglês é a fonte canônica.

- Status: **Aceita** em 2026-10-02, como escrita. Estas são as decisões que a [revisão de prontidão](../release/v0.1.0-readiness.md) deixou para uma pessoa antes da primeira implantação. Aceitá-las não implanta nada: uma implantação ainda precisa ser montada conforme, e o guia de operações diz como.
- Data: 2026-10-01

## Contexto

A `v0.1.0` está construída e testada, mas não foi implantada em lugar nenhum. Três perguntas não têm resposta técnica, porque são sobre quanto risco o operador aceita e o que ele se dispõe a manter:

1. Quem termina o TLS, já que as imagens falam HTTP puro por desenho.
2. Com que frequência os backups são feitos e onde ficam.
3. Qual ponto e qual tempo de recuperação o serviço promete.

Elas estão juntas porque as respostas se condicionam: uma única instância faz o tempo de recuperação depender de quão rápido uma máquina é reconstruída, e isso decide se backups de hora em hora compram alguma coisa.

Duas propriedades da release estabelecem o piso. A limitação por taxa é em memória por instância (ADR 0008), então mais de uma instância do backend enfraquece a proteção de login e cadastro até existir um armazenamento compartilhado. E todo o estado está no PostgreSQL, então o banco é a única coisa para salvar em backup.

## Decisão

### 1. O TLS é terminado na frente do container web, por um proxy reverso que o operador já mantém

Recomendado: um proxy reverso que termina TLS (Caddy, nginx ou um balanceador da nuvem) na frente do `web`, com certificados do Let's Encrypt onde não houver uma autoridade certificadora própria. Então defina `SESSION_COOKIE_SECURE=true`, adicione `Strict-Transport-Security` no terminador e continue encaminhando `X-Forwarded-Proto`.

Por que não na imagem: a aplicação teria de cuidar da renovação de certificados, que é uma preocupação operacional com boas soluções existentes, e as imagens continuam úteis atrás do que o operador já tem. O `web` já sobrescreve `X-Forwarded-For` para o backend distinguir clientes; um terminador na frente precisa fazer o mesmo, ou os limites voltam a ver um só endereço.

### 2. Uma instância do backend, até a limitação por taxa ter um armazenamento compartilhado

Recomendado: um único container `app`. Rodar dois silenciosamente dobra quantas tentativas de login um endereço consegue antes de ser limitado, e nada avisa sobre isso.

### 3. Backups diários, guardados fora do host do banco, retidos por 30 dias e restaurados de verdade a cada trimestre

Recomendado: `pg_dump -Fc` uma vez por dia, gravado em armazenamento que não seja o host do banco; 30 dias de retenção; e o `deploy/rehearse-restore.sh` rodado contra uma cópia de um backup real pelo menos trimestralmente, não só no CI.

Por que diário e não contínuo: o que se perde em um dia é um dia de respostas de alunos e o trabalho editorial ainda não publicado. É desagradável, mas não é ruinoso, e a alternativa, arquivamento contínuo, é um compromisso operacional permanente que um serviço neste estágio não justifica. Por que fora do host: um backup no mesmo disco não sobrevive à falha para a qual ele existe. Por que restaurar de verdade: o ensaio no CI prova o procedimento, não os backups de fato.

Backups têm hashes de senha e todas as respostas dos alunos, então são protegidos como o próprio banco, e uma restauração é seguida de encerrar todas as sessões (veja o [guia de operação](../engineering/operations.md#backup-e-restauração)).

### 4. Objetivos de recuperação: 24 horas de dados, um dia útil para voltar

Recomendado como a promessa declarada, não como aspiração: **ponto de recuperação de 24 horas**, que decorre dos backups diários, e **tempo de recuperação de um dia útil**, que é o que reconstruir uma instância à mão mais restaurar um dump leva sem um ambiente em espera.

Diga isso claramente a quem usa, em vez de insinuar algo melhor. Se qualquer um dos dois for fraco demais para um público real, a correção honesta é mais infraestrutura, não um número mais bonito.

## Consequências

- Uma implantação precisa de um terminador TLS que o operador mantém; as imagens sozinhas não ficam expostas à internet.
- Até um dia de respostas e de trabalho editorial não publicado pode ser perdido. O conteúdo publicado também vive em `content/` no repositório, então o pacote em si nunca se perde com o banco.
- Uma única instância significa que um reinício é uma indisponibilidade. Com um tempo de recuperação de um dia útil, isso é aceito.
- Escalar além de uma instância está bloqueado por um armazenamento compartilhado para a limitação por taxa, uma limitação já registrada no modelo de ameaças e na ADR 0008.
- A restauração trimestral é uma tarefa permanente sem automação por trás; se ninguém for dono dela, ela não acontece, e os backups voltam a ser uma suposição.

## Alternativas rejeitadas

- **TLS dentro da imagem web.** A renovação de certificados vira problema da aplicação, e a imagem deixa de compor com o que o operador já roda.
- **Arquivamento contínuo (recuperação a um ponto no tempo).** Cortaria o ponto de recuperação para minutos, e é a resposta certa quando houver alunos cujo trabalho tenha valor comercial. Hoje compra um número melhor ao custo de um compromisso operacional de que ninguém ainda é responsável.
- **Duas ou mais instâncias do backend por disponibilidade.** Enfraquece as proteções do login, que são uma propriedade de segurança, para melhorar uma propriedade de disponibilidade que o tempo de recuperação declarado não exige.
- **Deixar os objetivos sem declarar.** Um objetivo não declarado é lido como "nenhuma perda de dados e nenhuma indisponibilidade", o que não é verdade em nenhum dos arranjos acima.

## Como aceitar isto

Mude o status para Aceita, com a data e quaisquer números alterados, e o quarto bloqueio da revisão de prontidão estará fechado. Se outro arranjo for escolhido, mude primeiro as decisões aqui: o guia de operação aponta para este registro para os números.
