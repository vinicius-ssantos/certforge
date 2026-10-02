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
| [0010](0010-first-deployment-posture.md) | Rodar a v0.1.0 como uma instância atrás de um terminador TLS, com backups diários fora do host | **Proposta** |
| [0011](0011-grade-content-evidence.md) | Graduar a evidência do conteúdo e verificar referências mecanicamente | **Proposta** |
| [0012](0012-interface-language.md) | Traduzir a interface e manter o texto das questões em inglês | **Proposta** |

Novas ADRs devem incluir contexto, decisão, consequências, alternativas rejeitadas e status. ADRs substituídas permanecem no histórico e apontam para sua substituta.
