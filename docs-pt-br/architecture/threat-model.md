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
