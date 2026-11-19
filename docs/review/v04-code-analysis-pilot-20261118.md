# v0.4.0 — piloto editorial de Code Analysis

**Escopo aprovado em 18/11/2026. Aceite editorial posterior: 6/6 questões aprovadas expressamente pelo proprietário**, que declarou nesta conversa: “tudo foi aprovado, revisei detalhadamente”. Registro rastreável na [issue #417](https://github.com/vinicius-ssantos/certforge/issues/417), comentário de aceite com gabaritos e hashes dos artefatos. O aceite inclui os gabaritos, a explicação principal e as justificativas das opções existentes; **não autoriza modificar conteúdo nem publicar a release v0.4.0**.

## O que foi aprovado

1. Reutilizar `answer.verification` da API de resultado **terminal** e o componente `VerificationEvidence` existente para mostrar código fixo e saída gravada, sem execução livre de código, backend ou migração de banco (issue #415; PR #416).
2. Revisar **seis exemplos Java SE 21** com o proprietário, um por um, confrontando o JSON de questões, o código fixo, o resultado de `expected.txt`, a versão Java 21 e as regras da JLS/JVMS correspondentes.
3. Preservar o isolamento do gabarito enquanto o mock está ativo, e a proteção do processo editorial: evidência de compilador **não** substitui aceite de revisão humana.

## Conjunto de revisão selecionado

| Questão (arquivo `content/java-se-21/<id>/question.json`) | Comportamento alvo | Prova fixa | Situação editorial nesta iniciativa |
| --- | --- | --- | --- |
| `t01-bigdecimal-nonterminating-divide` | `BigDecimal.divide` sem arredondamento vs. `MathContext` | `ArithmeticException`, escala e `expected.txt` | **APROVADA — #417** |
| `t02-switch-dominance` | Dominância em `switch` com padrões | `COMPILE_ERROR: pattern.dominated` | **APROVADA — #417** |
| `t07-exports-and-opens` | `exports` vs. `opens` e reflexão profunda | indicadores de acesso e output | **APROVADA — #417** |
| `t07-requires-transitive` | Leitura implícita de módulos `requires transitive` | `read implicitly` | **APROVADA — #417** |
| `t08-completablefuture-join-vs-get` | `CompletionException` vs. `ExecutionException` | saída de tratamento de falhas | **APROVADA — #417** |
| `t08-volatile-increment` | Visibilidade de `volatile` não garante atomicidade de `++` | invariantes e contador | **APROVADA — #417** |

**6/6 aceites editoriais registrados na issue #417.** A revisão detalhada é afirmada pelo proprietário; não se afirma que todas as questões tenham sido exibidas integralmente nesta conversa. Os arquivos e os estados editoriais preexistentes no sistema não foram alterados. As observações anteriores sobre `exports/opens` e `volatile` continuam como possíveis melhorias futuras, não como alterações aprovadas.

## Protocolo de revisão por questão (referência do processo)

- Conferir texto original do enunciado, versão do Java 21, alternativas, resposta(s) marcada(s), explicações principal e por opção.
- Compilar/executar o exemplo fixo no contexto dos testes, inclusive falhas esperadas, e confrontar `expected.txt` e a sintaxe/semântica formal da JLS/JVMS.
- Examinar se a explicação ensina *por que* o comportamento ocorre, inclusive alternativas incorretas e casos não determinísticos.
- Conferir que a interface não confunde prova mecânica com revisão humana e não libera material de resposta antes da finalização do simulado.
- Apresentar o diagnóstico ao proprietário; registrar **somente** respostas e mudanças que ele aprovar explicitamente, com IDs e evidências.
- Se houver correção, abrir PR editorial específica com hashes do conteúdo e testes; nunca alterar `main` nem publicar gabaritos sem o gate previsto.

## Condições de conclusão do piloto

**PR #414 e PR #416 já foram integradas à `main`**, com CI e CodeQL pós-merge aprovados no commit `a5e4f77`. O checklist de revisão individual foi concluído na issue #417 (6/6). **A release v0.4.0 continua não publicada**: ainda requer sincronizar/arquivar o OpenSpec e cumprir o gate próprio de release.

**Referências:** issue #413, issue #415, PR #414, PR #416, ADR 0011 e `docs/release/v0.4.0-gap-audit.md`.
