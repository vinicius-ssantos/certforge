# Política de Conteúdo de Certificação

> Tradução de [`docs/product/content-policy.md`](../../docs/product/content-policy.md). O inglês é a fonte canônica.

## Propósito

A qualidade do conteúdo é uma capacidade central do produto. Uma plataforma tecnicamente polida, mas com questões pouco confiáveis, não cumpre a visão do CertForge.

## O que esta política governa

O conteúdo que o projeto **publica**: os pacotes em `content/`, que este repositório distribui sob a sua licença, e qualquer coisa que uma implantação sirva a alunos. Não é uma regra sobre o que um mantenedor pode ler ou guardar. Material de estudo de que alguém tem licença fica fora do repositório, em `content/private/`, que o git ignora e que o CI se recusa a deixar versionar; veja o [guia de autoria de conteúdo](../engineering/content-authoring.md).

## Conteúdo permitido

- Questões originais escritas para o CertForge.
- Explicações e exemplos originais.
- Pequenos trechos de código criados especificamente para ensinar uma regra da linguagem.
- Referências a especificações, documentação, JEPs e documentação de APIs públicas e autoritativas.
- Rascunhos assistidos por IA que recebam revisão técnica humana e não sejam copiados de fontes protegidas.

## Conteúdo proibido

- Dumps de provas, questões vazadas ou questões reconstruídas apresentadas como conteúdo real de prova.
- Cópias não autorizadas ou paráfrases muito próximas de bancos de questões comerciais, livros ou plataformas de treinamento.
- Afirmações não verificáveis sobre o que apareceu em uma prova.
- Questões publicadas sem resposta e explicação revisadas.
- Conteúdo Java ambíguo quanto à versão.

## Governança de fontes de certificação

Um perfil de certificação aqui é **material de estudo autoral**. Nunca é cópia das questões de uma
prova, nunca é derivado delas e nunca é apresentado como tal. Nenhuma trilha é rotulada "oficial",
porque não existe autorização para isso.

**Dois tipos de fonte, e eles não se substituem.** Uma *fonte conceitual* — a documentação do próprio
produto, uma especificação, uma referência de API — é evidência de que uma **resposta** está correta.
Um *documento de prova* — a página de objetivos publicada pelo fornecedor — é evidência de que a
questão é **sobre algo que a prova cobre**. Fonte conceitual nunca estabelece cobertura, e página de
objetivos nunca estabelece correção. Misturar as duas é como um quiz começa a insinuar que veio de
uma prova.

**Uma leitura, registrada.** Cobertura vem de um lugar só: uma leitura da página de objetivos do
próprio fornecedor, registrada com o nome da versão segundo ele, a data em que foi lida, a página
HTTPS de onde veio, um digest `sha256:` dessa página e os objetivos encontrados nela. Nada neste
projeto busca essa página sozinho — não há raspagem automática, por política —, então uma leitura é
um ato que uma pessoa realiza e assina.

**Status, e o que cada estado pode afirmar.**

| Estado | Significado | O que pode ser afirmado |
|---|---|---|
| `UNVERIFIED` | ninguém leu a página do fornecedor para esta versão | a trilha pode existir e ser estudada; **nenhuma cobertura de objetivos de prova pode ser afirmada** |
| `VERIFIED` | existe uma leitura e se acredita que está vigente | cobertura dos objetivos daquela leitura |
| `STALE` | o fornecedor publicou algo mais novo e a leitura não acompanhou | a leitura pode ser lida e **não pode ser apresentada como vigente** |
| `RETIRED` | a prova não existe mais | apenas histórico |

`STALE` é observação, não cálculo: idade não é desatualização, e os objetivos de uma prova estável
podem ter anos e estar exatos. Quem percebe que o fornecedor mudou registra.

**O revisor vê isso, não só quem administra e registrou.** Um revisor julgando se o objetivo
citado por uma questão é real lê o mesmo status, a mesma página fonte e a mesma data de
verificação ao lado das próprias referências da questão — uma referência é evidência para a
*resposta*; isto é a evidência separada de que o *objetivo* citado é uma linha real na página do
fornecedor. Chegar até isso não exige permissão de administração do catálogo: ler a fonte contra a
qual se julga uma afirmação não é administrar o catálogo.

**Quando o fornecedor muda a prova.** Leia a página nova e registre. A leitura nova substitui a
anterior — um snapshot é uma leitura de uma página, então objetivo que não está mais listado não é
mais objetivo. Uma coisa que a leitura nova não pode fazer: derrubar objetivo que uma questão
publicada ainda declara. Essa questão seguiria citando algo que a página não lista mais, e a recusa
nomeia as chaves para que sejam revisadas ou depreciadas antes.

**O que a CI garante, e o que ela não alcança.** A build recusa referência fora da política de fontes
da trilha, página lida em HTTP puro, digest que não é digest, leitura sem objetivo nenhum, chave de
objetivo repetida e questão publicada contra objetivo que a leitura da prova não lista. O que a build
não faz é ler a página do fornecedor, julgar se um objetivo foi transcrito fielmente ou saber que uma
prova mudou. Isso é de uma pessoa nomeada, pela [ADR 0005](../adr/0005-ai-not-source-of-truth.md), e
build verde nunca significa prova verificada.

## Metadados obrigatórios

Toda questão publicável deve incluir:

- trilha de certificação e versão da prova;
- tópico e subtópico opcional;
- compatibilidade com a release do Java;
- tipo de questão;
- justificativa da dificuldade;
- resposta esperada;
- explicação da alternativa correta e das alternativas incorretas materialmente plausíveis;
- referências autoritativas;
- procedência de autor e revisor;
- identificador de revisão imutável.

## Ciclo de vida editorial

`DRAFT -> TECHNICAL_REVIEW -> APPROVED -> PUBLISHED -> DEPRECATED`

Regras:

- Somente revisões aprovadas podem ser publicadas.
- Uma revisão publicada é imutável.
- Correções criam uma nova revisão.
- Tentativas históricas continuam referenciando a revisão originalmente exibida.
- A depreciação impede novas seleções, mas mantém o histórico de auditoria e de tentativas.
- Publicação, substituição e depreciação são eventos administrativos auditáveis.

## Verificações de qualidade

Um revisor deve verificar:

- uma única interpretação defensável do enunciado;
- correção da resposta para a release do Java declarada;
- compilabilidade quando a compilação for relevante;
- ausência de dependência oculta de comportamento de ambiente não especificado;
- distratores plausíveis, sem pegadinhas deliberadas de redação que não tenham relação com o objetivo;
- completude da explicação;
- acessibilidade da formatação de código e de texto;
- referências suficientes para verificação independente.

## Política de IA

A IA pode ajudar a fazer brainstorming, simplificar, traduzir ou gerar variações candidatas. Ela não pode publicar conteúdo, aprovar correção, inventar citações nem se sobrepor a evidências determinísticas e à revisão humana -- com uma única exceção estreita e declarada.

**A via rápida da revisora de IA ([ADR 0022](../adr/0022-ai-reviewer-provisional-publication.md), [ADR 0024](../adr/0024-ai-reviewer-verified-tier.md), [ADR 0025](../adr/0025-ai-reviewer-approval-is-final.md), [ADR 0026](../adr/0026-ai-reviewer-fast-lane-for-every-pack.md)).** Uma conta com `CONTENT_AI_REVIEW` pode aprovar e publicar uma versão de qualquer camada de evidência ([ADR 0011](../adr/0011-grade-content-evidence.md)) em um passo só, registrando quais checagens de política ela fez, do mesmo jeito que o checklist de uma revisora humana. Essa aprovação é gravada como `AI_APPROVED`, nunca disfarçada de aprovação comum, e um aluno olhando aquela questão é avisado que ela foi revisada por IA e não por uma pessoa. A aprovação é definitiva: não há prazo nem etapa de confirmação, e ela fica elegível para novo estudo exatamente como uma versão aprovada normalmente, desde o momento em que é publicada. A via alcança todo pacote de conteúdo e todo tipo de trilha (ADR 0026), não só o pacote Java SE 21 com que começou.
