# Roteiros de demonstração

> Tradução de [`docs/release/demo-scripts.md`](../../docs/release/demo-scripts.md). O inglês é a fonte canônica. As imagens são as mesmas; a interface está em inglês. **Esta tradução ainda não cobre todo o conteúdo do Roteiro C em inglês** (faltam, por exemplo, os itens "the other language" e "when it goes wrong"); o inglês é o que manda nesses pontos.

Roteiros que uma pessoa pode seguir para ver a release funcionando, e um que só uma pessoa pode fazer. Os roteiros A, B e D são exatamente o que a suíte ponta a ponta executa a cada mudança, então, quando passam no CI, os passos abaixo funcionam. As imagens foram capturadas das imagens de release com `CAPTURE=1 npm run demo:screens` (em `web/`); as questões nelas são as **questões de teste** da suíte ponta a ponta, que dizem ser dados de teste, não conteúdo de prova.

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

## Roteiro D: o mock exam

O blueprint exige cinco questões publicadas em cada um dos dez tópicos de Certificação Java — cinquenta no total — antes que um mock consiga começar. Uma instalação nova, semeada só pelo `publish-pack.mjs`, já tem isso, porque a revisão humana do pacote se encerrou sob a ADR 0025. Continue a partir do Roteiro A, na mesma conta, ou em qualquer conta sem mock já aberto.

1. Abra **Java Certification** e olhe sob a lista de tópicos: a entrada do mock nomeia o código da prova e lê a contagem de questões, a duração e a meta de prática do próprio blueprint do servidor, não de um texto fixo. Aperte **Start 1Z0-830 mock**.
2. Você cai no mock, questão 1 de 50, com uma contagem regressiva visível e uma contagem de questões respondidas. Marque a questão para revisão: é uma nota para você mesmo, guardada no navegador, e não muda nada na nota.
3. Responda algumas questões e use a navegação numerada para ir direto a qualquer questão, em qualquer ordem. Revisite uma já respondida: ela diz que a resposta foi salva, e continua sem dizer se estava certa. Nada na página, na árvore de acessibilidade ou no corpo da resposta revela uma opção correta, uma explicação ou uma referência enquanto o mock está `IN_PROGRESS`.
4. Deixe algumas questões sem resposta e aperte **Finish and score mock**. A confirmação nomeia quantas questões vão contar como erradas se você submeter agora, e é o único passo irreversível de todo o percurso.
5. Confirme. A tela de resultado mostra a nota contra as cinquenta inteiras, não só as respondidas; um selo de meta de prática; o tempo decorrido; uma tabela de repartição por tópico; e, para cada questão, inclusive as puladas, a explicação e a referência completas, agora liberadas porque o mock terminou.
6. Deixe um mock passar do prazo ao menos uma vez (numa imagem de release isso significa esperar os 120 minutos de verdade, ou iniciar um perto do vencimento): é o servidor, não o relógio do navegador, que encerra o mock, e o resultado de um mock vencido conta cada questão sem resposta como erro, exatamente como um envio deliberado faz.

Esperado: a contagem regressiva pertence ao servidor, então recarregar a página ou perder a conexão não a reinicia; a navegação direta alcança qualquer questão; nada antes do passo 5 revela uma resposta; o prazo, não só o botão de enviar, pode encerrar um mock.

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

Verificações automáticas não julgam isto, e a release não está pronta até que uma pessoa o tenha feito (veja a revisão de prontidão: [v0.1.0](v0.1.0-readiness.md), [v0.2.0](v0.2.0-readiness.md), [v0.3.0](v0.3.0-readiness.md)):

- **Só teclado.** Faça os roteiros A, B e D sem mouse. O CI já verifica que todo controle é alcançável pelo Tab, que cada um mostra o anel de foco, que o link de pular conteúdo vem primeiro e funciona, e que uma confirmação toma o foco e o devolve. O que ele não verifica é se a **ordem** faz sentido: o Tab vai para onde você espera, há algo alcançável mas surpreendente, o caminho até uma ação comum é longo demais.
- **Leitor de tela.** Com um leitor de tela (por exemplo o NVDA com Firefox ou Chrome), faça o roteiro A, a primeira metade do B, e o D. O CI afirma a árvore de acessibilidade de onde eles leem, então papéis, nomes e aninhamento já são sabidamente corretos. Resta o que só o ouvido pega: se as **mensagens de status** depois de salvar, enviar, aprovar ou responder são de fato anunciadas, se a ordem dos anúncios faz sentido, e se algo é lido duas vezes ou não é lido. Para o Roteiro D especificamente: se a contagem regressiva é compreensível ouvida em vez de vista; se o aviso da confirmação de encerramento sobre quantas questões vão contar como erradas é inequívoco ouvido em voz alta, sem depender de uma pista só visual; e se a tabela de repartição por tópico no resultado é seguível na ordem de leitura, tópico a tópico, sem enxergar o layout dela.
- **Esquema escuro.** Mude o sistema operacional para escuro e olhe todas as telas. O contraste é medido automaticamente nos dois esquemas, então o que sobra para você é julgamento: lê-se com conforto, algo parece sujo ou ofuscante, as cores de estado ainda significam o que deveriam.
- **Zoom e telas pequenas.** Amplie a 200% e a 400% e use uma janela da largura de um celular. O CI verifica que nenhuma página exige rolagem lateral até a largura de 320 pixels; o que você procura é se continua utilizável e em ordem sensata, não apenas se não quebrou.
- **O texto dos objetivos.** As questões já foram revisadas, mas o texto dos objetivos no catálogo ainda precisa ser conferido com a página da Oracle. A tela de catálogo lista esse texto para a versão de exame ativa, tópico a tópico, que é o lugar mais fácil para comparar: como administrador, abra **Editorial › Catalog › Java Certification** ([imagem](../../docs/release/screenshots/15-catalog-track.png)). Um segundo par de olhos nas questões em si continua valendo a pena; o [pacote de revisão](../../docs/release/content-review-packet.md) as organiza questão a questão, com os vereditos registrados.
