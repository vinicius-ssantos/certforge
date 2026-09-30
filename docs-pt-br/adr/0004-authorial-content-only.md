# ADR 0004: Permitir apenas conteúdo autoral de certificação

> Tradução de [`docs/adr/0004-authorial-content-only.md`](../../docs/adr/0004-authorial-content-only.md). O inglês é a fonte canônica.

- Status: Aceita
- Data: 2026-07-30

## Contexto

Dumps de provas e material comercial copiado geram riscos legais, éticos e educacionais. Eles também incentivam a memorização e tornam difícil confiar em um projeto de portfólio open-source.

## Decisão

Aceitar somente questões, explicações e exemplos originais do CertForge, apoiados em referências públicas autoritativas e em revisão técnica. Proibir material de prova vazado, reconstruído, copiado ou parafraseado de forma muito próxima.

## Consequências

- O crescimento do conteúdo é mais lento e exige esforço editorial.
- O repositório permanece publicável e defensável.
- A qualidade do aprendizado e a responsabilidade dos revisores passam a ser preocupações de primeira classe.
- Contribuições que não consigam demonstrar sua procedência são rejeitadas.

## Alternativas rejeitadas

- Importar dumps com avisos legais.
- Tratar licenças de bancos de questões externos como dependência inicial do produto.
