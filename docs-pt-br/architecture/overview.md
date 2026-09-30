# Visão Geral da Arquitetura

> Tradução de [`docs/architecture/overview.md`](../../docs/architecture/overview.md). O inglês é a fonte canônica.

## Estilo

O CertForge começa como um monolito modular. O objetivo é ter fronteiras de domínio independentes e transações coesas, sem introduzir distribuição em rede antes de ela se justificar.

## Módulos iniciais

Os módulos são implementados e verificados conforme descrito em [Convenções de módulos](module-conventions.md). Nomes de módulo com hífen correspondem a pacotes Java sem hífen (por exemplo, `preparation-catalog` é `dev.certforge.preparationcatalog`).

### `identity`

Autenticação, ciclo de vida de contas, papéis e permissões. Os demais módulos consomem identificadores de identidade estáveis e decisões de autorização, em vez de detalhes de persistência de identidade.

### `preparation-catalog`

Trilhas de preparação, tópicos estáveis, ordenação, ciclo de vida e metadados de preparação específicos de cada perfil.

A `v0.1.0` comprometida expõe apenas o perfil de certificação Java. Metadados específicos de certificação, como provedor, versão da prova, objetivos e release do Java, permanecem explícitos dentro da fronteira do catálogo, em vez de serem achatados em campos genéricos. O comportamento futuro de trilhas de entrevista está fora da primeira release.

### `question-bank`

Identidades de questões, revisões imutáveis, alternativas, respostas esperadas, explicações, referências, fluxo editorial, publicação e depreciação.

### `study`

Ciclo de vida das sessões de estudo, seleção de questões, orquestração da submissão de respostas e divulgação dos resultados ao aluno.

### `progress`

Resumos derivados das tentativas e modelos de consulta. As tentativas persistidas continuam sendo a fonte de evidência; as projeções de progresso podem ser reconstruídas.

### `audit`

Eventos administrativos relevantes para segurança e integridade, especialmente as mudanças no ciclo de vida das questões.

## Direção das dependências

- `study` pode referenciar contratos de questões publicadas, mas não pode modificar o conteúdo editorial.
- `progress` consome fatos de tentativas e não é dono dos comandos de sessão de estudo.
- `question-bank` referencia identificadores do preparation-catalog, mas não é dono do catálogo.
- `identity` não deve depender dos módulos de aprendizado.
- As interfaces administrativas orquestram as capacidades dos módulos, mas não contornam as regras de domínio.
- Nenhum módulo pode acessar diretamente os repositórios ou as entidades de persistência de outro módulo.

## Persistência

O PostgreSQL é a fonte da verdade. Cada módulo é dono de suas tabelas conceitualmente, mesmo com um único banco de dados. Escritas entre módulos devem ocorrer por meio de APIs de módulo e de fronteiras transacionais explícitas, e não por acesso arbitrário a repositórios.

O Flyway gerencia as mudanças de schema. As migrações de produção devem ser seguras para avançar (forward-safe), observáveis e testadas contra o PostgreSQL.

## Interfaces

A primeira aplicação pode expor uma API web consumida por um frontend web separado. Os contratos públicos são conscientes de versão, os erros de validação são estáveis e as APIs do aluno evitam expor o material de resposta antes de a tentativa ser submetida.

## Fronteira futura de entrevistas

O catálogo poderá expor depois trilhas `INTERVIEW`, mas metadados de cargo/senioridade específicos de entrevista, avaliação de respostas guiadas, blueprints derivados de descrições de vaga e o comportamento de entrevistador simulado não fazem parte da `v0.1.0`.

Onde a semântica de certificação e a de entrevista diferirem, prefere-se tipos de domínio explícitos a campos genéricos anuláveis ou significados sobrecarregados.

## Fronteira futura do runner

O runner de código é intencionalmente excluído do monolito modular. Quando for introduzido, ele receberá jobs de execução limitados por meio de um contrato estreito, devolverá resultados sanitizados e não terá acesso direto ao banco de dados principal nem a credenciais internas.

## Direção tecnológica, não compromisso de implementação

A stack esperada é Java moderno, Spring Boot, Spring Modulith, PostgreSQL, Flyway, Maven, Testcontainers, um frontend web em TypeScript e Playwright. As versões exatas são escolhidas durante o bootstrap da implementação e registradas separadamente.
