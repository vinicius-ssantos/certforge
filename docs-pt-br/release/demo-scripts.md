# Roteiros de demonstração da v0.1.0

> Tradução de [`docs/release/demo-scripts.md`](../../docs/release/demo-scripts.md). O inglês é a fonte canônica. As imagens são as mesmas; a interface está em inglês.

Dois roteiros que uma pessoa pode seguir para ver a release funcionando, e um terceiro que só uma pessoa pode fazer. Os roteiros A e B são exatamente o que a suíte ponta a ponta executa a cada mudança, então, quando passam no CI, os passos abaixo funcionam. As imagens foram capturadas das imagens de release com `CAPTURE=1 npm run demo:screens` (em `web/`); as questões nelas são as **questões de teste** da suíte ponta a ponta, que dizem ser dados de teste, não conteúdo de prova.

## Antes de começar

Você precisa do Docker. Na raiz do repositório:

```sh
export DB_PASSWORD=local-demo BOOTSTRAP_ADMIN_EMAIL=admin@example.com BOOTSTRAP_ADMIN_PASSWORD='uma senha local longa'
docker compose -f compose.release.yaml up --build -d     # o app fica em http://localhost:8081
```

Depois dê questões ao app, de um de dois jeitos:

- **O pacote real**, que é para o que o produto serve de fato. A revisão técnica dele está feita e [registrada](../../content/java-se-21/review.json), então dois comandos o publicam pelo fluxo editorial real:

  ```sh
  just reviewer reviewer@example.com 'uma senha longa'   # uma vez: a aprovação exige uma segunda conta
  just publish-content reviewer@example.com 'uma senha longa'
  ```

  O segundo segura qualquer questão que o registro de revisão não cubra mais. Veja o [guia de autoria de conteúdo](../engineering/content-authoring.md) para o fluxo na mão.
- **Uma olhada rápida com dados de teste.** Suba o stack com as configurações de teste (`docker compose -f compose.release.yaml -f compose.e2e.yaml up --build -d`) e então, em `web/`, `npm ci`, `npx playwright install chromium` e `E2E_BASE_URL=http://localhost:8081 npx playwright test e2e/learner.spec.ts -g "signing out"`. Essa execução publica dez questões de teste claramente identificadas pelo fluxo editorial.

## Roteiro A: o aluno

1. Abra `http://localhost:8081`. Você é levado ao **Sign in** ([imagem](../../docs/release/screenshots/01-sign-in.png)). Escolha **Create an account**, informe um e-mail e uma senha de pelo menos 12 caracteres e envie. Você cai nas trilhas ([imagem](../../docs/release/screenshots/02-tracks.png)).
2. Abra **Java Certification**. Ela lista os tópicos em ordem, com o link dos objetivos oficiais ([imagem](../../docs/release/screenshots/03-track.png)).
3. Aperte **Practice** em um tópico. Uma sessão começa e o foco vai para a questão ([imagem](../../docs/release/screenshots/04-question.png); [no celular](../../docs/release/screenshots/05-question-mobile.png)). Nada na tela diz qual opção é a correta.
4. Escolha uma resposta, diga o quanto você está confiante e envie. Agora você vê se estava certa, a razão de cada opção, a explicação e as referências ([imagem](../../docs/release/screenshots/06-feedback.png)). Use **Next question** para continuar; a última oferece **Finish session**.
5. Para sair antes, use **End session without finishing** e confirme ([imagem](../../docs/release/screenshots/07-session-ended.png)).
6. Abra **History** ([imagem](../../docs/release/screenshots/08-history.png)) e depois uma sessão para rever cada resposta com a explicação ([imagem](../../docs/release/screenshots/09-session-review.png)).
7. Abra **Progress** para ver tentativas, acertos, erros e precisão por tópico ([imagem](../../docs/release/screenshots/10-progress.png)).
8. Faça **Sign out** e tente abrir `/history`: você é levado ao login.

Esperado: todos os passos funcionam só com o teclado; as mensagens de erro dizem o que fazer; nada é mostrado sobre a resposta antes do passo 4.

## Roteiro B: o editor, o revisor e o administrador

Você precisa de três contas. Um administrador concede papéis com `PUT /api/admin/accounts/{id}/roles` (`EDITOR`, `REVIEWER`, `ADMINISTRATOR`); o primeiro administrador é o inicial.

1. **Como editor**, abra **Editorial** ([imagem](../../docs/release/screenshots/11-editorial-queue.png)) e **New question**. Preencha o formulário (tipo, tópico, dificuldade e por quê, a questão com o código em bloco cercado, pelo menos duas opções com uma razão cada e a correta marcada, uma explicação, uma referência oficial com link https). **Save draft** guarda o trabalho inacabado.
2. Aperte **Send for review** em um rascunho incompleto: uma lista ao lado do formulário diz o que falta e cada item leva ao seu campo ([imagem](../../docs/release/screenshots/12-editor-missing.png)). Complete e envie de novo: agora está **In review**.
3. **Como revisor**, abra a questão em **Waiting for review**. Você a vê como o aluno verá, depois o gabarito e as razões ([imagem](../../docs/release/screenshots/13-review.png)). Marque só os itens da política que você conferiu, comente se quiser e **Approve** (ou **Request changes**, que exige comentário e devolve ao autor como rascunho).
4. **Como administrador**, abra a questão aprovada e aperte **Publish revision 1**. Pedimos confirmação, porque uma revisão publicada não pode ser editada ([imagem](../../docs/release/screenshots/14-publish-confirm.png)). Confirme: está **Published** e os alunos já podem recebê-la.
5. **Como editor**, abra a questão publicada e **Start a new revision**. É uma cópia como rascunho. Mude o texto e envie. O revisor agora vê **What changed since revision 1**, palavra por palavra. Depois da aprovação e da publicação, a revisão antiga fica **Replaced** e a nova **Published**.
6. **Como o aluno que respondeu a revisão antiga**, abra **History**: a resposta continua mostrando o texto original, e a revisão diz isso.

Esperado: o autor não pode aprovar a própria revisão (a menos que a demonstração relaxe isso); uma revisão nunca muda depois de publicada; o histórico está intacto.

## Roteiro C: o que só uma pessoa pode conferir

Verificações automáticas não julgam isto, e a release não está pronta até que uma pessoa o tenha feito (veja a [revisão de prontidão](v0.1.0-readiness.md)):

- **Só teclado.** Faça os roteiros A e B sem mouse. O CI já verifica que todo controle é alcançável pelo Tab, que cada um mostra o anel de foco, que o link de pular conteúdo vem primeiro e funciona, e que uma confirmação toma o foco e o devolve. O que ele não verifica é se a **ordem** faz sentido: o Tab vai para onde você espera, há algo alcançável mas surpreendente, o caminho até uma ação comum é longo demais.
- **Leitor de tela.** Com um leitor de tela (por exemplo o NVDA com Firefox ou Chrome), faça o roteiro A e a primeira metade do B. O CI afirma a árvore de acessibilidade de onde eles leem, então papéis, nomes e aninhamento já são sabidamente corretos. Resta o que só o ouvido pega: se as **mensagens de status** depois de salvar, enviar, aprovar ou responder são de fato anunciadas, se a ordem dos anúncios faz sentido, e se algo é lido duas vezes ou não é lido.
- **Esquema escuro.** Mude o sistema operacional para escuro e olhe todas as telas. O contraste é medido automaticamente nos dois esquemas, então o que sobra para você é julgamento: lê-se com conforto, algo parece sujo ou ofuscante, as cores de estado ainda significam o que deveriam.
- **Zoom e telas pequenas.** Amplie a 200% e a 400% e use uma janela da largura de um celular. O CI verifica que nenhuma página exige rolagem lateral até a largura de 320 pixels; o que você procura é se continua utilizável e em ordem sensata, não apenas se não quebrou.
- **O texto dos objetivos.** As questões já foram revisadas, mas o texto dos objetivos no catálogo ainda precisa ser conferido com a página da Oracle. A tela de catálogo lista esse texto para a versão de exame ativa, tópico a tópico, que é o lugar mais fácil para comparar: como administrador, abra **Editorial › Catalog › Java Certification** ([imagem](../../docs/release/screenshots/15-catalog-track.png)). Um segundo par de olhos nas questões em si continua valendo a pena; o [pacote de revisão](../../docs/release/content-review-packet.md) as organiza questão a questão, com os vereditos registrados.
