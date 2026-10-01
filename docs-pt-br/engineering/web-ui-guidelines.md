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
- **Layout**: tabelas densas para varrer a lista, coluna de leitura limitada a 44rem, duas colunas (conteúdo e decisões) em telas largas e uma coluna em telas estreitas. Toda página reflui para uma janela de 320 pixels CSS sem rolagem lateral (WCAG 1.4.10), o que o CI verifica; um bloco de código longo rola sozinho em vez de alargar a página.

## Regras

1. **A cor nunca carrega o estado sozinha.** Todo estado é uma palavra, em geral com um símbolo (`○ Draft`, `◐ In review`, `● Approved`, `✓ Published`). Respostas corretas e incorretas são ditas em palavras.
2. **Contraste.** Texto e cores de estado têm pelo menos 4,5:1 sobre o fundo e o anel de foco pelo menos 3:1, **nos dois esquemas**. O axe em navegador real verifica cada página visitada no CI, uma vez por esquema. Ele mede com movimento reduzido emulado, porque o app faz transição de cor em 150 ms e medir durante a troca amostra uma mistura dos dois temas, e não um deles. O que o axe não julga, como se o esquema escuro é agradável de ler, ainda pede uma pessoa.
3. **Teclado e leitor de tela são testados, não presumidos.** O CI percorre cada tela com Tab (todo controle alcançável, anel de foco em cada um, o link de pular conteúdo primeiro, uma confirmação que toma o foco e o devolve) e afirma a árvore de acessibilidade das telas principais, que é o que um leitor de tela anuncia. Um leitor de tela real e um julgamento da ordem de tabulação ainda pedem uma pessoa.
4. **O foco acompanha o conteúdo.** Depois de navegar, o foco vai para o título da página, a menos que a página já tenha colocado o foco em outro lugar de propósito (uma confirmação, a próxima questão, o resultado de uma resposta).
5. **Erros dizem o que fazer.** As mensagens são escolhidas pelos códigos de erro estáveis do servidor (`web/src/ui/messages.ts`), nunca pelo texto do servidor. Um resumo no topo do formulário recebe foco e leva a cada campo.
6. **O servidor decide, a tela dá as palavras.** A completude de uma revisão, quem pode revisar e o que pode ser publicado são regras do servidor. A interface mostra o que o servidor diz e nunca duplica uma regra que depois teria de acompanhar. Esconder um botão é cortesia, não proteção.
7. **Código é código.** As questões usam blocos cercados (três crases). Eles aparecem em um bloco monoespaçado, rolável pelo teclado, e o texto nunca é inserido como HTML.

## A mesa editorial

Rotas em `/editorial`, para contas com `CONTENT_AUTHOR`, `CONTENT_REVIEW` ou `CONTENT_PUBLISH`:

- **Fila** (`/editorial`): todas as questões ou filtradas pelo estado da última revisão.
- **Nova questão** (`/editorial/new`) e **uma questão** (`/editorial/questions/:id`): o autor de um rascunho recebe o editor; os demais recebem a revisão como um revisor a lê (a questão exatamente como o aluno a verá, depois o gabarito e as razões, depois as notas de revisão).
- **Salvar** guarda um rascunho inacabado. **Send for review** pergunta ao servidor se a revisão está completa e lista o que falta ao lado do formulário, cada item levando ao seu campo.

- **Decidir**: o revisor vê, ao lado da revisão, um checklist da política de conteúdo e um comentário, e então **Approve** ou **Request changes** (o comentário é obrigatório e a revisão volta ao autor como rascunho). Os itens marcados do checklist são gravados com a decisão e mostrados, com o nome do revisor, nas notas de revisão; eles não condicionam a aprovação. As pessoas aparecem pelo nome (o e-mail) no cabeçalho de uma revisão e nas notas, que só a equipe pode abrir. O administrador vê **Publish** (desabilitado até a revisão ser aprovada) e, em uma revisão publicada, **Retire**. O autor vê **Start a new revision** na última revisão publicada ou aposentada, que a copia para um novo rascunho.
- **Passos irreversíveis pedem confirmação.** Publicar e aposentar usam uma confirmação que diz o que vai acontecer; o foco vai para o botão que confirma e volta ao primeiro botão se a pessoa desistir.
- **Comparar**: uma revisão que tem antecessora abre mostrando o que mudou desde ela, palavra por palavra e campo por campo (questão, alternativas e se estão corretas, razões, explicação, referências). Acréscimos são sublinhados e remoções riscadas, e ambos também são anunciados em palavras.
- **Alterações não salvas são protegidas.** Sair do editor com edições não salvas, por um link, pelo botão voltar ou fechando a aba, pergunta antes; ficar mantém tudo e devolve o foco a Save draft. O app usa um roteador de dados (`createBrowserRouter`) para isso.
- **Sempre atual.** A fila e a questão são lidas de novo toda vez que abrem, porque outra pessoa pode tê-las aprovado ou publicado nesse meio-tempo.

Uma revisão é uma sequência numerada (escrita, em revisão, aprovada, publicada), então é desenhada como uma.
