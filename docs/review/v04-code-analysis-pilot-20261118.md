# v0.4.0 — piloto editorial de Code Analysis

**Escopo aprovado pelo proprietário em 18/11/2026.** Aprovação do *recorte e da execução da revisão*, não de quaisquer respostas, alternativas, explicações, conteúdo ou release.

## O que foi aprovado

1. Reutilizar `answer.verification` da API de resultado **terminal** e o componente `VerificationEvidence` existente para mostrar código fixo e saída gravada, sem execução livre de código, backend ou migração de banco (issue #415; PR #416).
2. Revisar **seis exemplos Java SE 21** com o proprietário, um por um, confrontando o JSON de questões, o código fixo, o resultado de `expected.txt`, a versão Java 21 e as regras da JLS/JVMS correspondentes.
3. Preservar o isolamento do gabarito enquanto o mock está ativo, e a proteção do processo editorial: evidência de compilador **não** substitui aceite de revisão humana.

## Conjunto de revisão selecionado

| Questão (arquivo `content/java-se-21/<id>/question.json`) | Comportamento alvo | Prova fixa | Situação editorial nesta iniciativa |
| --- | --- | --- | --- |
| `t01-bigdecimal-nonterminating-divide` | `BigDecimal.divide` sem arredondamento vs. `MathContext` | `ArithmeticException`, escala e `expected.txt` | **PENDENTE** |
| `t02-switch-dominance` | Dominância em `switch` com padrões | `COMPILE_ERROR: pattern.dominated` | **PENDENTE** |
| `t07-exports-and-opens` | `exports` vs. `opens` e reflexão profunda | indicadores de acesso e output | **PENDENTE** |
| `t07-requires-transitive` | Leitura implícita de módulos `requires transitive` | `read implicitly` | **PENDENTE** |
| `t08-completablefuture-join-vs-get` | `CompletionException` vs. `ExecutionException` | saída de tratamento de falhas | **PENDENTE** |
| `t08-volatile-increment` | Visibilidade de `volatile` não garante atomicidade de `++` | invariantes e contador | **PENDENTE** |

Estes seis identificadores foram selecionados para **revisão individual**, não publicados, corrigidos, aceitos nem rejeitados por este documento. O estado editorial existente de cada questão no sistema também não é alterado.

## Protocolo de revisão por questão

- [ ] Conferir texto original do enunciado, versão do Java 21, alternativas, resposta(s) marcada(s), explicações principal e por opção.
- [ ] Compilar/executar o exemplo fixo no contexto dos testes, inclusive falhas esperadas, e confrontar `expected.txt` e a sintaxe/semântica formal da JLS/JVMS.
- [ ] Examinar se a explicação ensina *por que* o comportamento ocorre, inclusive alternativas incorretas e casos não determinísticos.
- [ ] Conferir que a interface não confunde prova mecânica com revisão humana e não libera material de resposta antes da finalização do simulado.
- [ ] Apresentar o diagnóstico ao proprietário; registrar **somente** respostas e mudanças que ele aprovar explicitamente, com IDs e evidências.
- [ ] Se houver correção, abrir PR editorial específica com hashes do conteúdo e testes; nunca alterar `main` nem publicar gabaritos sem o gate previsto.

## Condições de conclusão do piloto

PR #414 de OpenSpec e PR #416 de interface podem ser integradas depois das proteções e do CI; o checklist editorial permanece aberto até as seis decisões específicas. Finalizar a release v0.4.0 depende ainda da verificação e do aceite de release próprios, não deste aceite de escopo.

**Referências:** issue #413, issue #415, PR #414, PR #416, ADR 0011 e `docs/release/v0.4.0-gap-audit.md`.
