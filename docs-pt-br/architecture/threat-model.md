# Modelo de Ameaças Inicial

> Tradução de [`docs/architecture/threat-model.md`](../../docs/architecture/threat-model.md). O inglês é a fonte canônica.

## Escopo

Este documento cobre o produto definido na documentação e registra cedo os riscos da futura execução de código. Ele não substitui revisões de segurança específicas de cada funcionalidade.

## Ativos

- Credenciais e sessões de contas.
- Dados de tentativas e de progresso dos alunos.
- Questões não publicadas, respostas esperadas e explicações.
- Aprovações editoriais e histórico de auditoria.
- Credenciais do banco de dados e segredos da aplicação.
- Capacidade futura do runner e isolamento do host.

## Fronteiras de confiança

- Navegador para a aplicação web.
- Frontend web para a API do backend.
- Endpoints do aluno para endpoints administrativos.
- Aplicação para o PostgreSQL.
- Futura aplicação para o runner isolado.
- Automação dos mantenedores para o GitHub e os sistemas de deploy.

## Ameaças iniciais e controles

### Divulgação prematura de respostas

Ameaça: os alunos obtêm as respostas esperadas por meio de payloads de API, identificadores, logs, caches ou mensagens de erro antes de submeter.

Controles: separar os modelos de entrega ao aluno dos modelos editoriais; não serializar metadados de resposta em fluxos não respondidos; evitar material de resposta em logs e em bundles do cliente; usar `no-store` quando apropriado; testar as fronteiras de privacidade.

### Alteração não autorizada de conteúdo

Ameaça: um aluno ou um editor sem privilégio suficiente aprova ou publica uma questão.

Controles: permissões explícitas, autorização no servidor, eventos de auditoria, revisões publicadas imutáveis, testes dos endpoints administrativos.

### Perda de integridade histórica

Ameaça: editar uma questão muda o que uma tentativa antiga parece ter contido.

Controles: as tentativas referenciam identificadores de revisão imutáveis; correções criam novas revisões; nenhuma substituição em cascata das evidências de tentativas.

### Abuso de contas

Ameaça: credential stuffing, força bruta, roubo de sessão, enumeração ou escalonamento de privilégios.

Controles: tratamento seguro de senhas ou provedor de identidade confiável, rate limits, erros de autenticação genéricos, práticas seguras de cookie ou token, revogação de sessão, testes de autorização, dados mínimos de conta.

### Injeção e renderização insegura

Ameaça: prosa de questão ou trechos de código maliciosos provocam SQL injection, XSS ou renderização insegura de Markdown.

Controles: persistência parametrizada, codificação de saída, processamento restritivo de Markdown, content security policy, revisão de dependências, testes em nível de navegador.

### Telemetria sensível

Ameaça: logs ou traces capturam credenciais, respostas esperadas, conteúdo completo submetido ou dados pessoais desnecessários.

Controles: campos de telemetria estruturados e em lista de permissão, redação, retenção limitada, controles de acesso, testes negativos.

## Situação na v0.1.0

Cada controle acima como foi construído, e o que o prova. "CI" significa que roda a cada mudança.

| Ameaça | Controle como construído | Prova |
|---|---|---|
| Divulgação prematura de respostas | Os payloads do aluno são tipos separados, sem correção, razões, explicação nem referências; a resposta só chega na resposta a um envio aceito; respostas autenticadas são `no-store`; a sessão de outro aluno dá `404`, não `403`; respostas não aparecem em nenhuma linha de log | `AttemptSubmissionIT`, `StudySessionIT`; o `privacy.spec.ts` inspeciona cada resposta, a página, o armazenamento do navegador, cabeçalhos de cache, o acesso direto à API e o bundle construído em um navegador real; o `verify-privacy.mjs` varre os logs (CI) |
| Alteração não autorizada de conteúdo | Permissões explícitas checadas no servidor; revisões imutáveis depois de enviadas (também garantido por gatilhos do banco); publicar exige uma revisão aprovada e, por padrão, outro revisor; eventos de auditoria | O `AuthorizationMatrixIT` é construído a partir dos próprios mapeamentos de requisição da aplicação, então um endpoint sem regra de acesso reprova o build, e confere cada papel nos dois sentidos mais o CSRF em todo endpoint que altera estado; `QuestionBankIT` (CI) |
| Perda de integridade histórica | Tentativas e snapshots de sessão referenciam ids de revisões imutáveis; substituir uma questão cria uma nova revisão e aposenta a antiga | `history-integrity.spec.ts`: uma resposta continua mostrando a revisão que o aluno viu depois que a questão é substituída; `HistoryIT` (CI) |
| Abuso de contas | bcrypt, política de senha por tamanho, limitação por endereço e por conta, erros de login genéricos, sessões no servidor revogadas ao mudar papel ou desabilitar, CSRF por cookie duplicado | `IdentityIT`, `CsrfFlowIT`; o proxy não pode ser usado para forjar o endereço do cliente (abaixo) |
| Injeção e renderização insegura | SQL parametrizado; texto de questão renderizado como texto, nunca como HTML (código só em blocos cercados); uma Content Security Policy que permite só a origem do próprio app; sem estilos nem scripts inline | `prompt.test.tsx`; o `verify-release.sh` confere a política; a suíte ponta a ponta reprova qualquer página que provoque violação da política e roda o axe nos dois esquemas de cor (CI) |
| Telemetria sensível | Conjuntos fixos de rótulos com limite de valores distintos; ids de requisição aleatórios; logs sem respostas nem credenciais | `OperabilityIT`; o `verify-privacy.mjs` confere tags de métricas e logs depois de tráfego real (CI) |

## Ameaças encontradas ao validar a v0.1.0

A validação contra as imagens de release achou estas; cada uma foi corrigida e testada.

- **Corpos de erro que saíram do contrato.** Falhas levantadas antes de um controller rodar (caminho desconhecido, método ou tipo de conteúdo errado) respondiam com o corpo do próprio framework, sem `code` nem id de requisição e com texto sobre o servidor. Agora todo erro tem o mesmo corpo (`FrameworkErrorContractIT`).
- **Endereço do cliente atrás de um proxy.** Os limitadores usam o endereço do cliente, então atrás de um proxy todos dividiriam um balde, e um proxy que acrescentasse ao `X-Forwarded-For` deixaria o cliente escolher o próprio. O proxy de release sobrescreve o cabeçalho e o backend o lê; o `verify-release.sh` prova que um cabeçalho forjado não burla o limite.
- **Dependências vulneráveis.** A primeira varredura de imagens achou avisos críticos no Tomcat (incluindo bypass de restrição de segurança e de autenticação) e avisos altos no Jackson em versões gerenciadas pelo Spring Boot 4.1.1. Elas são sobrescritas no `pom.xml`, e a varredura agora reprova o build com qualquer achado alto ou crítico corrigível.
- **Uma política que o app teria quebrado.** A Content Security Policy estrita bloqueia fontes `data:`, que o build embutia. O build não embute mais recursos.

## Riscos residuais e limites aceitos

Conhecidos, declarados e não escondidos pelos testes acima.

- **Sem verificação de e-mail e sem recuperação de senha** (ADR 0008). O e-mail de uma conta não é verificado, e uma senha esquecida exige um administrador.
- **A limitação por taxa é em memória por instância.** Rode uma única instância do backend até ele ter um armazenamento compartilhado.
- **O TLS não está nas imagens.** Termine-o na frente do container web e defina `SESSION_COOKIE_SECURE=true` (veja o documento do ambiente de release).
- **A equipe vê o e-mail uns dos outros** como nomes de autor, revisor e publicador, em endpoints só da equipe. Alunos nunca veem.
- **Backups têm hashes de senha e todas as respostas dos alunos** e devem ser protegidos de acordo; restaurar um pode reviver sessões revogadas, então encerre todas as sessões depois de uma restauração (veja o guia de operação).
- **A correção do conteúdo é um julgamento humano.** O checklist que o revisor marca é registrado como evidência do que ele diz ter conferido; não faz uma questão estar certa. O pacote inicial de conteúdo ainda não passou por essa revisão humana.
- **A varredura de vulnerabilidades cobre pacotes, não lógica.** Ela não substitui este documento.

## Ameaças futuras do runner

Antes da `v0.5.0`, uma revisão dedicada do runner deve tratar:

- execução arbitrária de código e escape de sandbox;
- fork bombs e esgotamento de processos;
- esgotamento de CPU, memória, disco, inodes e saída;
- acesso à rede e exfiltração;
- acesso ao sistema de arquivos do host e ao runtime de containers;
- acesso a segredos e a variáveis de ambiente;
- contaminação entre jobs;
- bytecode malicioso, agents, bibliotecas nativas, reflection e subprocessos;
- loops infinitos e compilações demoradas;
- automação abusiva e negação de serviço;
- saída de diagnóstico insegura.

Direção exigida: ambientes descartáveis e restritos, sem rede, sem credenciais de banco de dados, imagem base somente leitura, armazenamento gravável limitado, execução sem root, limites estritos de tempo e recursos, quotas de jobs, truncamento de saída, procedência de imagens, aplicação de patches e monitoramento específico do runner.

## Cadência de revisão

Atualize este documento quando for introduzida uma nova fronteira de confiança, um novo campo de dado pessoal, uma nova capacidade administrativa, uma integração externa ou um mecanismo de execução.
