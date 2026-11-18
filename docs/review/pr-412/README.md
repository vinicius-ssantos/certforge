# CertForge PR #412 — evidências de revisão visual

Capturas feitas em 18/11/2026 com o código da PR #412, em uma instância Docker **descartável e isolada**, com PostgreSQL de teste e questões explicitamente identificadas como *E2E fixtures*. Não são questões oficiais da Oracle nem dados de produção.

**Estado em 18/11/2026:** captura automatizada, inspeção visual de desktop/mobile pelo assistente e CI da PR aprovados. Após a apresentação das evidências e pergunta de aceite, o usuário respondeu **“SEGUE”**, autorizando a continuidade da integração. Isso **não significa** que o proprietário abriu ou examinou individualmente cada imagem.

## Amostra desktop e mobile

| Tela | Evidência | Verificação |
| --- | --- | --- |
| Início — desktop, 1280 px | [Trilhas e próximo passo](02-tracks.png) | Hierarquia, revisão e acesso ao catálogo |
| Início — mobile, 390 px | [Trilhas 390 px](02a-tracks-mobile-390.png) | Cards empilhados e navegação |
| Início — mobile, 320 px | [Trilhas 320 px](02a-tracks-mobile-320.png) | Sem rolagem horizontal na página |
| Detalhes da trilha — mobile | [Java Certification 390 px](03a-track-mobile.png) | Tópicos, botões e disponibilidade do simulado |
| Prática — mobile | [Questão 390 px](05-question-mobile.png) | Legibilidade e controles de resposta |
| Progresso — desktop | [Progresso 1280 px](10-progress.png) | Filtros, tabelas e comparação |
| Resultado do simulado — mobile | [Resultado 390 px](10d-mock-result-mobile.png) | Rolagem própria da tabela e filtro de questões |
| Editorial — desktop | [Fila editorial 1280 px](11-editorial-queue.png) | Busca e leitura das linhas |
| Internacionalização — desktop | [Trilha em português](pt-04-track.png) | Tradução e layout |

As capturas foram geradas pelo teste opcional `web/e2e/screenshots.spec.ts`, com `CAPTURE=1` e `MOCK_CAPTURE=1`. Ele verifica explicitamente que a largura do documento não excede **320 px e 390 px** nos fluxos mobile adicionais. O roteiro de captura passou integralmente após corrigir um seletor ambíguo de texto na fila de revisão.

O resultado de simulado ilustrado contém 50 questões **não respondidas de propósito** para demonstrar o estado de resultados e os filtros. A disponibilidade do simulado na captura da trilha se deve exclusivamente aos conteúdos de teste inseridos no banco descartável.

## Critério final do proprietário

Verificações registradas: inspeção das telas desktop e mobile, em inglês e português, para hierarquia, contraste, rolagem e legibilidade; testes de foco e navegação cobertos por Playwright. O usuário autorizou a continuidade com “SEGUE” em resposta à solicitação anterior de aprovação visual. A tarefa `3.4` foi concluída com base na inspeção documentada e no CI aprovado. Essa autorização não substitui a revisão manual individual do proprietário, caso deseje novos ajustes. Os testes CI e E2E são evidências técnicas separadas.
