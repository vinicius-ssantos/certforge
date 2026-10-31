# Architecture Decision Records (ADRs)

> Tradução de [`docs/adr/README.md`](../../docs/adr/README.md). O inglês é a fonte canônica.

As ADRs registram decisões que são estruturalmente importantes, custosas de reverter ou necessárias para preservar a integridade do produto.

| ADR | Decisão | Status |
|---|---|---|
| [0001](0001-modular-monolith.md) | Começar como um monolito modular | Aceita |
| [0002](0002-postgresql-source-of-truth.md) | Usar PostgreSQL como fonte da verdade | Aceita |
| [0003](0003-version-published-questions.md) | Versionar questões publicadas imutáveis | Aceita |
| [0004](0004-authorial-content-only.md) | Permitir apenas conteúdo autoral de certificação | Aceita |
| [0005](0005-ai-not-source-of-truth.md) | Não usar IA como fonte de correção | Aceita |
| [0006](0006-isolate-code-execution.md) | Isolar a futura execução de código | Aceita |
| [0007](0007-generalize-preparation-catalog.md) | Generalizar a raiz do catálogo sem generalizar o comportamento da v0.1 | Aceita |
| [0008](0008-session-cookie-authentication.md) | Autenticar com sessões no servidor e cadastro aberto | Aceita |
| [0009](0009-web-frontend-stack.md) | Construir o app web do aluno como uma SPA React orientada a contrato | Aceita |
| [0010](0010-first-deployment-posture.md) | Rodar a v0.1.0 como uma instância atrás de um terminador TLS, com backups diários fora do host | Aceita |
| [0011](0011-grade-content-evidence.md) | Graduar a evidência do conteúdo e verificar referências mecanicamente | Aceita |
| [0012](0012-interface-language.md) | Traduzir a interface e manter o texto das questões em inglês | Aceita |
| [0013](0013-derived-review-queue.md) | Derivar a fila de revisão da evidência das tentativas, e dizer por que cada item está nela | **Proposta** |
| [0014](0014-one-topic-one-track.md) | Manter um tópico em uma trilha só, e pôr os fundamentos na trilha de entrevista | **Proposta** |
| [0015](0015-separate-mock-exam-aggregate.md) | Modelar simulados como um agregado de estudo separado | Aceita |
| [0016](0016-interview-track-taxonomy.md) | Modelar a trilha de entrevista como uma taxonomia versionada, e mantê-la pequena | Aceita |
| [0017](0017-infrastructure-certification-tracks.md) | Adicionar trilhas de infraestrutura e gerais, com snapshots verificados de versões de exame | **Proposta** |
| [0018](0018-maintainer-may-review-their-own-work.md) | Deixar o mantenedor revisar o próprio trabalho, e dizer isso no registro | Aceita |
| [0019](0019-behavioural-preparation-is-guidance-not-grading.md) | Preparação comportamental é orientação revisada, e nada nela é pontuado | Aceita |
| [0020](0020-interview-sessions-as-a-third-aggregate.md) | Modelar sessões de entrevista como um terceiro agregado de estudo | Aceita |
| [0021](0021-job-description-blueprints-explain-every-weight.md) | Pesar uma descrição de vaga com um dicionário revisado, e explicar cada peso | Aceita |
| [0022](0022-ai-reviewer-provisional-publication.md) | Deixar um revisor de IA aprovar e publicar provisoriamente conteúdo da camada Asserted, com aviso e prazo | Aceita |
| [0023](0023-ai-reviewer-fast-lane-for-content-packs.md) | Estender a via rápida da revisora de IA aos scripts de publicação de pacotes de conteúdo | Aceita |
| [0024](0024-ai-reviewer-verified-tier.md) | Estender a via rápida da revisora de IA à camada Verified, com seu próprio checklist registrado | Aceita |
| [0025](0025-ai-reviewer-approval-is-final.md) | Tornar definitiva a aprovação da revisora de IA, sem etapa de confirmação humana | Aceita |
| [0026](0026-ai-reviewer-fast-lane-for-every-pack.md) | Estender a via rápida da revisora de IA a todo pacote de conteúdo e todo tipo de trilha | Aceita |

Novas ADRs devem incluir contexto, decisão, consequências, alternativas rejeitadas e status. ADRs substituídas permanecem no histórico e apontam para sua substituta.
