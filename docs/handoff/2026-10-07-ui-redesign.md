> **Superado em 2026-10-08.** O plano de UI deste documento virou issues rastreadas.
> Comece pela **epic [#184](https://github.com/vinicius-ssantos/certforge/issues/184)** e pela
> milestone **"UI redesign — remaining screens"**, não pelas seções §3 e §9 abaixo.
> A epic carrega o vocabulário de design, as regras inegociáveis e as armadilhas do repositório;
> as seis filhas ([#185](https://github.com/vinicius-ssantos/certforge/issues/185)–[#190](https://github.com/vinicius-ssantos/certforge/issues/190))
> são uma por PR. Protótipos aprovados:
> [quatro telas](https://claude.ai/artifact/WReMi2BkRwN6yzZqjtHEeu) (implementadas) e
> [doze telas](https://claude.ai/artifact/4iDNEmCRhLzCTnY4UG76PP) (a fazer).
>
> O resto deste documento continua válido como estado medido em 2026-10-07: ambiente, bloqueador
> do simulado (#138), e os relatórios dos dois agentes.

# Handoff — 2026-10-07, 19h40 (America/Sao_Paulo)

Documento de passagem de bastão. Escrito para que outro assistente (ChatGPT ou qualquer um)
continue exatamente de onde paramos, sem reconstruir contexto. **Nada aqui é decisão nova** — é o
estado medido da árvore mais o que já foi aprovado pelo dono do projeto.

Motivo da passagem: o limite de sessão do Claude foi atingido (reset às 16:10, horário de SP);
o agente de triagem morreu com HTTP 429 `rate_limit` — mas **já havia terminado e gravado o
relatório** (ver §5).

---

## 1. O projeto em dez linhas

CertForge — plataforma de estudo para certificação Java (1Z0-830) e, em construção, trilha de
entrevista Java backend.

| | |
|---|---|
| Diretório | `C:\Users\vinicius\Documents\workspace\certforge` |
| Backend | Spring Boot 4.1.1, Java 25 (enforcer trava em `[25,26)`), Spring Modulith, JdbcClient, Flyway, PostgreSQL 18.6 via Testcontainers |
| Módulos | platform, identity, preparationcatalog, questionbank, study, progress, review, audit |
| Frontend | `web/` — React 19, TypeScript strict, Vite, TanStack Query, contrato via `openapi-typescript`, Vitest + Testing Library + vitest-axe, Playwright + `@axe-core/playwright` |
| Task runner | `just` (`set windows-shell` fixado em Git Bash) |
| Migrations | V1–V15 |
| ADRs | 0001–0016 |
| Releases | v0.1.0 `ff8f24f`, v0.2.0 `2f47640` |

### Armadilhas do ambiente local (já custaram tempo)

1. **JDK:** o PATH tem JDK 26, o enforcer exige 25. O JDK 25 está em
   `/c/Users/vinicius/.jdks/openjdk-25.0.1`. Rode via `just`, que já resolve isso.
2. **CRLF:** todos os arquivos da árvore de trabalho são CRLF e `core.autocrlf=true`. Substituições
   com `sed`/`perl` multi-linha **falham em silêncio** nesses arquivos. Use edição por ferramenta ou
   scripts que casem `\r?\n` **e saiam com código diferente de zero nomeando cada miss**.
3. **Heredoc longo no Bash trunca.** Um `cat > arquivo <<'EOF'` com ~400 linhas foi cortado no meio e
   deu `unexpected EOF`. Para arquivo grande, escreva pela ferramenta de escrita de arquivo.
4. `node -e` com regex inline é destruído pelo quoting do shell. Grave o script e rode `node <path>`.

### Comandos

```
just check          # test-backend + test-web + lint + typecheck + budget
just test-web       # vitest
just typecheck      # tsc --noEmit
just lint
just e2e            # Playwright
just screenshots    # regera docs/release/screenshots/*.png
just format
just contract       # regera os tipos do OpenAPI
just review-packet
just demo / up / down / reset
```

---

## 2. Onde estamos — estado medido da árvore

```
branch: feat/ui-redesign
HEAD  : f02bcfe  (main está 1 commit À FRENTE: 1cbf165 "content: clarify switch
                  expression yield wording (#149)")
commits próprios no branch: NENHUM — todo o trabalho está só na árvore de trabalho

modificados:
  M web/src/tokens.css     (+~80 linhas: paleta nova + escalas)
  M web/src/styles.css     (reescrito: 982 → ~1300 linhas)

não rastreados:
  ?? docs/release/v0.3.0-scope-proposal.md   (relatório do agente de escopo, 25 KB)
  ?? docs/release/review-triage.md           (relatório do agente de triagem, 940 linhas)
  ?? docs/handoff/2026-10-07-ui-redesign.md  (este arquivo)
```

**Primeira coisa a fazer:** `git rebase main` (ou merge) — o branch está 1 commit atrás.

### Verificação já rodada no redesenho (resultado real, não estimativa)

| Checagem | Resultado |
|---|---|
| `npx tsc --noEmit` | **limpo** |
| `npx eslint src` | **0 erros**, 1 warning pré-existente (`MockExamPage.tsx:78` — `useEffect` sem `exam` nas deps; já existia antes, não foi introduzido agora) |
| `npx vitest run` | **179/179 passando, 21 arquivos** |
| Tokens usados vs. definidos | fechado. `--shell` faltava e foi adicionado em `tokens.css`. `--review-bg` está definido e ainda sem uso |

Ainda **não** rodados: `just e2e` (Playwright), `just budget` (bundle), `just screenshots`.

---

## 3. A tarefa viva: o redesenho de UI

### Como chegamos aqui

O dono do projeto disse que "o UI/UX pode melhorar — usabilidade e interface poderiam ser
melhores". Escolheu, por pergunta explícita:

- **"Redesenho completo"** — inclui paleta, layout e navegação, **aceitando** que a evidência de
  acessibilidade do v0.1.0 tem de ser refeita e que toda tela precisa de validação humana.
- **As quatro áreas de tela:** sessão de prática, trilhas + progresso, simulado, mesa editorial.

A direção visual foi publicada como artifact e aprovada com **"GOSTEI"**:
`https://claude.ai/artifact/WReMi2BkRwN6yzZqjtHEeu`
(fonte local: `<scratchpad>/certforge-redesign.html`)

### Decisões de design já fixadas e aprovadas

1. Mantém o par tipográfico IBM Plex Sans + Source Serif 4.
2. Mantém a regra **"estado nunca só por cor"** — toda cor de estado é acompanhada de palavra,
   glifo ou forma.
3. `.cards`: `auto-fill` → **`auto-fit`** (com `auto-fill` um único card ficava estreito ao lado do
   vazio).
4. Novo: **trilho de progresso** na sessão de prática.
5. Opções de resposta como **alvo de largura total** (toda a linha clicável).
6. Confiança como **segmented control feito de radios reais** (setas navegam, um só tab stop).
7. Navegador do simulado: **grade de quadrados**, canto dobrado para marcada, tique para
   respondida.
8. Mesa editorial: **duas colunas desde o topo**, com painel fixo "antes de enviar".
9. Mostrar a **saída do programa de verificação** na tela de feedback (a alegação e a evidência na
   mesma tela).
10. O título repetido sai da tela de sessão para o enunciado ser o maior elemento — **mas o `h1`
    permanece no DOM** (`useRouteFocus` e os snapshots de aria dependem dele), estilizado como
    kicker pela classe `.eyebrow`. Hierarquia visual ≠ hierarquia de headings.

### O que já está feito

**`web/src/tokens.css` — completo.**
Paleta nova em claro e escuro, mais escalas que antes não existiam:

- espaçamento `--s1`..`--s7` (0.25 → 3rem)
- tipo `--t-xs`..`--t-3xl` (0.78 → 2.1rem)
- `--measure: 68ch` (largura máxima de texto corrido)
- `--shell: 68rem` (largura da página; header e `main` compartilham)
- `--radius`, `--radius-lg`, `--touch: 2.75rem`

**`web/src/styles.css` — reescrito por completo (982 → ~1300 linhas).**
Regra que vale para o arquivo: *comprimento literal é bug*, salvo borda de 1px, ajuste óptico
comentado, ou breakpoint. Cobre as 79 classes que já existiam, **define `review-queue`** (era usada
em `ReviewPage.tsx:118` e não existia no CSS) e adiciona as classes novas que o redesenho pede:
`.eyebrow`, `.session-progress` / `-track` / `-fill`, `.segmented`, `.verified`, `.numeric`.

Detalhes de implementação que não são óbvios ao ler:

- **Alvo de largura total sem mexer na marcação:** `.choice label::before` com `position:absolute;
  inset:0` cobre a linha inteira; o clique vai para o label, que seleciona o input. O input mantém
  o próprio anel de foco porque o overlay é transparente.
- **`.segmented`** esconde os radios só visualmente (`clip`), e o estado marcado vem de
  `input:checked + label`. `margin-left: -1px` colapsa a borda compartilhada; o segmento marcado
  recebe `position: relative` para a borda dele ficar acima da do vizinho. Abaixo de 30rem viram
  pilha vertical.
- **`.with-aside`** perdeu o `order: -1` do mobile: a lista de requisitos acima do formulário virava
  um muro entre o autor e o trabalho. Agora segue a ordem do documento, com borda de separação.
- **Navegador do simulado:** `.answered::before` é um ✓, `.flagged::after` é o canto dobrado (um
  triângulo por bordas). O `aria-label` de cada botão já nomeia o estado
  (`t.mock.questionButtonLabel(n, answered, flagged)`), então o glifo é a segunda pista visual —
  antes "respondida" era **só** cor de fundo, o que violava a própria regra do projeto.
- `td:has(time)` e `.numeric` recebem `font-variant-numeric: tabular-nums`.

### O que falta — ordem sugerida

1. **`git rebase main`** (1 commit atrás).
2. **Marcação dos componentes** — é aqui que o trabalho para. Nada abaixo foi tocado:
   - `web/src/study/QuestionForm.tsx` — adicionar `className="segmented"` no `fieldset` de
     confiança; o `h1`/`h2` da sessão virar `.eyebrow`.
   - `web/src/study/AnswerFeedback.tsx` — bloco `.verified` com a saída do programa.
   - `web/src/study/SessionPage.tsx` — trilho `.session-progress` (o número em palavras ao lado;
     a barra é ilustração, logo `aria-hidden`).
   - `web/src/mock/MockExamPage.tsx` — legenda do navegador mostrando os marcadores de verdade.
   - Trilhas/progresso: `TracksPage`, `TrackPage`, `ProgressPage`.
   - Mesa editorial: `RevisionEditor`.
3. **`just check`** inteiro, depois **`just e2e`**.
4. **`just screenshots`** — regerar `docs/release/screenshots/*.png`.
5. **Refazer a evidência de acessibilidade do v0.1.0** (consequência aceita do redesenho completo).

### Restrição que NÃO pode ser violada

**Não fazer merge do redesenho sem validação visual do dono do projeto.** Foi um compromisso
explícito. Nenhuma superfície voltada ao usuário vai ao ar sem uma pessoa ter olhado.

---

## 4. Bloqueador verificado: o simulado não pode começar

Isto não é alegação de agente — cada elo foi lido no código.

| Elo | Evidência |
|---|---|
| O blueprint exige **5 questões publicadas por tópico**, em 10 tópicos | `MockExamBlueprintCatalog.java:15` — `new MockExamBlueprint("1Z0-830", 50, Duration.ofMinutes(120), 68, 5)` |
| O planner **recusa** em vez de encurtar a prova | `MockExamPlanner.java:82` — `if (eligible.size() < blueprint.questionsPerTopic()) throw … "insufficient_mock_content"` |
| A publicação só emite questão **revisada e aprovada** | `deploy/publish-pack.mjs:63` — `status.state === "reviewed" && status.verdict === "APPROVED"` |
| Há **20** revisadas, **exatamente 2 por tópico** | `content/java-se-21/review.json` — contado: `{"t01":2,…,"t10":2}` |

2 < 5 nos dez tópicos. Logo o cronômetro, o navegador, a regra de feedback adiado, a tela de
resultado e o relatório de tópicos fracos estão todos construídos e **nenhum deles é alcançável**.

Registrado como **issue #138**. A falta é pequena e limitada: **30 questões revisadas a mais, 3 por
tópico**, de 130 esperando.

**O que NÃO é conserto:** publicar questão não revisada (viola ADR 0005 e a política de conteúdo),
nem baixar `questionsPerTopic` para 2 (muda o que o produto afirma ser um simulado para caber no que
o pacote por acaso tem).

---

## 5. Os dois agentes que rodaram em paralelo

### `docs/release/v0.3.0-scope-proposal.md` — proposta de escopo (25 KB)

Status: **proposta, nada decidido.** Escrita para ser contestada no mérito pelo dono.
Mede os 26 commits desde v0.2.0 (333 arquivos, ~14.000 linhas) e chega a três conclusões:

1. O blueprint do simulado não foi verificado (#113).
2. **O simulado não pode começar** (§4 acima) — maior que #113 e não estava registrado.
3. Os 26 commits **não são majoritariamente simulados** — a maior mudança visível ao aprendiz é a
   interface em português, que o roadmap não pediu.

Escopo proposto — **dentro:** simulados (runner, resultado, histórico, feedback adiado); idioma da
interface; conteúdo = 150 questões com programa + **30 recém-revisadas por humano, 3 por tópico**,
que é o que torna o simulado iniciável. **Carregado, não alegado:** a fundação da trilha de
entrevista e a visão de catálogo editorial entram na tag porque estão na árvore e são sólidas, mas
não fazem parte do resultado e as notas de release têm de dizer isso.

**Fora:** conteúdo de entrevista e qualquer superfície de entrevista (#17 e filhas); qualquer
alegação de prontidão/maestria/nota prevista; fila de revisão cruzando tópicos numa sessão; execução
de código; segunda trilha; simulado de outro código de exame.

O documento tem uma seção "o que isto não significa" que vale ler inteira. Resumo: 130 de 150
questões não têm revisão humana e "provado pelo build" não é revisão; toda revisão do pacote é de
uma pessoa, que também é o autor; o português teve **uma** leitura de falante nativo — o próprio
autor; a trilha de entrevista está vazia; ninguém estudou com nada disso; **nenhum simulado foi
exercitado em navegador de ponta a ponta** (`web/e2e/` não tem spec de simulado).

### `docs/release/review-triage.md` — triagem das 130 não revisadas (940 linhas)

O agente morreu no 429 **depois** de gravar o relatório. Ele está completo.

**A restrição foi respeitada e verificada:** `content/java-se-21/review.json` está intocado
(`git status` vazio para o arquivo, 20 entradas). O agente foi instruído explicitamente:
*"Você não pode revisar, aprovar ou publicar nenhuma questão, e não pode escrever em
`content/java-se-21/review.json`."* O documento começa dizendo **"This document approves nothing"**
e aponta para ADR 0005 e ADR 0011.

O achado estrutural que enquadra o resto:

| | contagem |
|---|---|
| Chave de resposta ligada mecanicamente à saída do programa | **30** |
| `expected.txt` começa com `COMPILE_ERROR:` → checagem da chave pulada | **11** |
| Opções em prosa, saída de diagnóstico multi-linha → checagem pulada em silêncio | **89** |

Ou seja: **100 de 130 questões têm programa que o build compila e roda, e chave de resposta que o
build nunca confere.** Não é defeito — ADR 0011 nomeia isso —, mas significa que o nível "Verified"
aqui é mais fraco do que "150/150 com programa" sugere.

57 das 130 têm pelo menos uma flag; 73 não têm nada. Flags por alcance:

| # | Flag | Questões |
|---|---|---|
| 1 | Referência é landing page sem âncora, ou o título nomeia errado o alvo | 20 |
| 2 | O programa não estabelece a alegação que a chave faz | 15 |
| 3 | Explicação ou comentário de código afirma algo falso/sem suporte | 7 |
| 4 | Depende de locale/CLDR, estado global da JVM ou do comando de lançamento | 6 |
| 5 | `explanation` de uma opção não explica por que ela está errada | 4 |
| 6 | Enunciado ambíguo, ou admite mais de uma resposta verdadeira | 4 |
| 7 | Linha impressa é constante hardcoded, não medição | 4 |
| 8 | Quase-duplicata de outra questão do pacote | 3 |
| 9 | Distratores implausíveis / `difficultyRationale` não casa com o testado | 1 |

Ordem de leitura sugerida pelo relatório: as 20 flags de referência são mecânicas e se varrem numa
sentada (quase todas é anexar uma âncora que já existe); as 15 de "programa não estabelece a chave"
precisam de quem conhece Java 21, e nove delas se concentram em t07 e t09. As três de **título**
errado foram verificadas contra as páginas oficiais ao vivo — são a correção mais barata e a única
classe em que o pacote hoje afirma algo checavelmente falso sobre as próprias fontes.

Resultado negativo limpo, que vale registrar: a suspeita de `difficultyRationale` que só repete o
enunciado **não se confirmou** — todas as 130 nomeiam uma razão.

---

## 6. Restrições permanentes do projeto (quem assumir precisa herdar)

- **ADR 0005** — IA não é fonte de correção técnica. **ADR 0011** — separa verificação mecânica de
  revisão humana. `content/java-se-21/review.json` grava um revisor **humano nomeado**.
  Consequência prática: *nenhum agente revisa, aprova ou publica questão, e nenhum agente escreve em
  `review.json`.* Isso já foi recusado uma vez nesta sessão e a recusa deve continuar.
- Decisões arquiteturais viram **ADR**, para o dono contestar.
- **Nunca fechar issue cujo critério de aceite precisa de humano.**
- **Nunca entregar superfície de usuário que nenhuma pessoa validou.**
- PR usa o template do repositório; esperar CI com `gh pr checks <n> --watch`; **squash-merge**;
  apagar o branch.
- O ADR 0012 tem espelho em pt-BR que **já saiu de sincronia uma vez** — não existe checagem
  automática de drift. Ao editar um ADR, editar o espelho.

---

## 7. Issues abertas relevantes

| # | O que é |
|---|---|
| **#138** | *(aberta nesta sessão)* O simulado não pode começar em nenhuma instalação que a nossa própria ferramenta produz. §4 acima. |
| #113 | Os três números do blueprint não foram verificados contra a página da Oracle (a página estava fora do ar). |
| #80 | 130 questões sem revisão humana — **trabalho do dono**, não delegável. `review-triage.md` existe para encurtar isso. |
| #17–#24 | Épico da trilha de entrevista. Fundação pronta (ADR 0016, V13/V14/V15, regras condicionais, catálogo editorial); **zero questões**. |

Fechada nesta sessão: Dependabot #134 (TypeScript 7.0.2) — `openapi-typescript@7.13.0` fixa
`peer typescript@"^5.x"`, então `npm ci` quebra com ERESOLVE antes de qualquer type check.

---

## 8. Erros desta sessão que vale não repetir

- O corpo do PR #117 citava "#117" como se fosse a issue, mas o número foi para o PR; a issue virou
  #118. Conferir numeração depois de abrir.
- A issue #118 que eu mesmo abri estava **errada**: afirmava que `MockExamResultPage` tinha o bug de
  remontagem de heading. Medido contra o `main` intocado: `MockExamPage` falha,
  `MockExamResultPage` **passa**. Corrigido por comentário público, e a mudança na página de
  resultado foi entregue como *guarda*, não como correção.
- `surefire:test` rodou classes velhas e mostrou 2 falhas já corrigidas. Rodar `test-compile` antes.
- Comparação de `Integer` com `!=` em `RevisionRules` (boxing) — trocado por `Objects.equals`.
- `getInt("java_release")` lia null como 0 para versões de entrevista — trocado por
  `getObject(..., Integer.class)`.
- `INNER JOIN` em `catalog_certification_profile` escondia a trilha de entrevista do catálogo admin —
  provado com teste falhando primeiro, depois `LEFT JOIN`.

---

## 9. O próximo passo concreto

```
cd C:\Users\vinicius\Documents\workspace\certforge
git rebase main
# depois: marcação dos componentes, na ordem de §3.
```

O CSS e os tokens estão prontos e verificados (tsc limpo, 179/179 testes, eslint limpo). O que falta
do redesenho é **só marcação de componente**, nas quatro áreas que o dono escolheu. Nada vai para o
`main` sem ele olhar as telas.


---

## 9. Continuação em 2026-10-08 — redesign pronto para aceite visual

O trabalho pendente da seção 3 foi retomado sobre `origin/main`, com rebase limpo e o WIP
preservado. A branch continua `feat/ui-redesign` e **nada foi levado ao main**.

### Marcação concluída

- `QuestionForm`: hierarquia `.eyebrow` e confiança em `.segmented`.
- `SessionPage`: trilho `.session-progress`, apenas ilustrativo para AT.
- `MockExamPage`: legenda real dos marcadores Respondida / Marcada / Atual.
- `TrackPage`: linhas de tópico com cópia e ação separadas, inclusive no mobile.
- `ProgressPage`: números tabulares e regiões de tabela roláveis/focáveis no mobile.
- `RevisionEditor`: formulário e painel de requisitos recebem a superfície `.stage`.
- Tabelas largas do produto foram consolidadas no componente
  `web/src/ui/ScrollableTable.tsx`, mantendo reflow sem retirar o acesso por teclado.

### Achados durante a validação

A suíte E2E encontrou dois problemas reais do redesign antes da entrega:

1. o primeiro CSS do controle segmentado tornava o radio nativo minúsculo/recortado; corrigido para
   um input transparente que ocupa todo o segmento;
2. o primeiro reflow mobile deixava tabelas horizontais roláveis sem foco de teclado; corrigido com
   `ScrollableTable`.

Ambos têm regressão automatizada coberta e a suíte voltou a zero falhas.

### Gates atuais

- `just check`: verde.
- Vitest: **179/179**.
- ESLint: **0 erros**, 1 warning preexistente em `MockExamPage.tsx:78`.
- TypeScript: verde.
- Build de produção: verde.
- Budget: **144.0 KB JS gzip / 170 KB** e **5.9 KB CSS / 12 KB**.
- Playwright release-like isolado: **42 passed, 16 skips previstos, 0 failed**.
- Screenshots: **15/15 regeneradas** em `docs/release/screenshots/`.

A evidência automatizada de acessibilidade foi reescrita em
`docs/release/ui-redesign-accessibility-evidence.md`. O antigo readiness do v0.1.0 não foi
alterado porque é registro histórico daquela release.

### Gap deliberado: `.verified`

`AnswerFeedback` continua sem o bloco `.verified`. Isso não é marcação faltante: `expected.txt`
é evidência do pack/build e hoje **não é persistido na revisão nem exposto pelo contrato de feedback
ao aprendiz**. Exibi-lo corretamente exige uma decisão de domínio/API. O frontend não deve inventar
essa evidência nem reconstruí-la a partir do texto da alternativa.

### Único gate restante

**Aceite visual humano do dono do projeto.** Revisar as telas regeneradas (incluindo dark mode,
zoom/phone, ordem de teclado e, idealmente, NVDA) e dizer explicitamente se o redesign pode seguir.
Até isso acontecer, não fazer merge.


### Aceite visual humano — 2026-10-08

O dono do projeto revisou as telas regeneradas apresentadas após a validação automatizada e respondeu
explicitamente **"aprovado"**. Com isso, o gate de direção visual do redesign está aceito.

Esse aceite significa que a direção visual, hierarquia, densidade e organização das telas podem
seguir para PR. Ele **não é registrado como se fosse** uma sessão manual completa de NVDA,
navegação apenas por teclado ou inspeção humana em 200%/400% de zoom; essas formas de evidência
continuam distintas quando forem exigidas por uma release.

A aprovação autoriza preparar commits e PR da `feat/ui-redesign`; **não autoriza merge automático**.
