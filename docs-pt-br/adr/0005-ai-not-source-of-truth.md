# ADR 0005: Não usar IA como fonte de correção

> Tradução de [`docs/adr/0005-ai-not-source-of-truth.md`](../../docs/adr/0005-ai-not-source-of-truth.md). O inglês é a fonte canônica.

- Status: Aceita
- Data: 2026-07-30

## Contexto

Modelos generativos podem explicar e variar material, mas também podem alucinar regras da linguagem, saídas de programas, citações ou comportamentos específicos de versão. A preparação para certificações exige correção reproduzível.

## Decisão

A IA pode apoiar a redação de rascunhos, a reformulação de explicações, a variação de prática e o planejamento. Ela não pode aprovar conteúdo, determinar a correção final quando houver validação determinística possível, fabricar referências nem se sobrepor a evidências revisadas.

## Consequências

- Os recursos de IA permanecem como camadas opcionais de melhoria.
- O conteúdo publicado exige revisão técnica humana.
- Dá-se preferência a compilação, testes, referências à especificação e regras determinísticas.
- As saídas de IA devem ser claramente distinguidas das explicações canônicas quando forem introduzidas.

## Alternativas rejeitadas

- Publicar automaticamente questões geradas por IA.
- Usar a resposta de um modelo de linguagem como único gabarito.
