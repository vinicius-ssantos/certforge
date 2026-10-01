# Diretrizes da interface web

> Tradução de [`docs/engineering/web-ui-guidelines.md`](../../docs/engineering/web-ui-guidelines.md). O inglês é a fonte canônica.

Como o app web se parece e se comporta, e por quê. O código está em `web/`; a decisão de stack está na [ADR 0009](../adr/0009-web-frontend-stack.md).

## Visual: a mesa editorial

O produto é um lugar para estudar com cuidado e para escrever e revisar questões com cuidado, então a interface se inspira na revisão de provas: papel frio, tinta escura e cor contida, que só aparece quando significa algo.

- **Tokens** ficam em `web/src/tokens.css`. Toda cor do app vem deles, com um esquema escuro.
  - Papel `--bg`, tinta `--text`, texto secundário `--muted`.
  - Azul `--accent` para links e o anel de foco.
  - Estado: verde `--ok` (aprovada, publicada, correta), latão `--review` (em revisão), vermelho `--danger` (mudanças pedidas, incorreta).
- **Tipografia**: Source Serif 4 para o que é feito para ser lido (questões, explicações, títulos), IBM Plex Sans para a interface e JetBrains Mono para código. As fontes são empacotadas com o app (`@fontsource`), então o app não faz requisições a terceiros.
- **Layout**: tabelas densas para varrer a lista, coluna de leitura limitada a 44rem, duas colunas (conteúdo e decisões) em telas largas e uma coluna em telas estreitas.

## Regras

1. **A cor nunca carrega o estado sozinha.** Todo estado é uma palavra, em geral com um símbolo (`○ Draft`, `◐ In review`, `● Approved`, `✓ Published`). Respostas corretas e incorretas são ditas em palavras.
2. **Contraste.** Texto e cores de estado devem ter pelo menos 4,5:1 sobre o fundo e o anel de foco pelo menos 3:1, nos dois esquemas. O axe em navegador real verifica cada página visitada no CI, **apenas no esquema claro**; o esquema escuro usa cores escolhidas para as mesmas razões, mas ainda não é verificado automaticamente, então precisa de conferência manual.
3. **O foco acompanha o conteúdo.** Depois de navegar, o foco vai para o título da página, a menos que a página já tenha colocado o foco em outro lugar de propósito (uma confirmação, a próxima questão, o resultado de uma resposta).
4. **Erros dizem o que fazer.** As mensagens são escolhidas pelos códigos de erro estáveis do servidor (`web/src/ui/messages.ts`), nunca pelo texto do servidor. Um resumo no topo do formulário recebe foco e leva a cada campo.
5. **O servidor decide, a tela dá as palavras.** A completude de uma revisão, quem pode revisar e o que pode ser publicado são regras do servidor. A interface mostra o que o servidor diz e nunca duplica uma regra que depois teria de acompanhar. Esconder um botão é cortesia, não proteção.
6. **Código é código.** As questões usam blocos cercados (três crases). Eles aparecem em um bloco monoespaçado, rolável pelo teclado, e o texto nunca é inserido como HTML.

## A mesa editorial

Rotas em `/editorial`, para contas com `CONTENT_AUTHOR`, `CONTENT_REVIEW` ou `CONTENT_PUBLISH`:

- **Fila** (`/editorial`): todas as questões ou filtradas pelo estado da última revisão.
- **Nova questão** (`/editorial/new`) e **uma questão** (`/editorial/questions/:id`): o autor de um rascunho recebe o editor; os demais recebem a revisão como um revisor a lê (a questão exatamente como o aluno a verá, depois o gabarito e as razões, depois as notas de revisão).
- **Salvar** guarda um rascunho inacabado. **Send for review** pergunta ao servidor se a revisão está completa e lista o que falta ao lado do formulário, cada item levando ao seu campo.

Uma revisão é uma sequência numerada (escrita, em revisão, aprovada, publicada), então é desenhada como uma.
