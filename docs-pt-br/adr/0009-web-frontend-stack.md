# ADR 0009: Construir o app web do aluno como uma SPA React orientada a contrato

> Tradução de [`docs/adr/0009-web-frontend-stack.md`](../../docs/adr/0009-web-frontend-stack.md). O inglês é a fonte canônica.

- Status: Aceita
- Data: 2026-09-30

## Contexto

A `v0.1.0` precisa de um app web do aluno (#13) que funcione com a autenticação por cookie de sessão da ADR 0008, seja acessível por teclado e leitor de tela e não possa divergir da API que consome.

## Decisão

- Construir uma **single-page app** em `web/` com React 19, TypeScript (strict), Vite, React Router e TanStack Query para estado do servidor.
- Tornar a API **orientada a contrato**. O backend gera `web/openapi.json` a partir da aplicação em execução (springdoc, no `OpenApiContractIT`); o frontend gera `src/api/schema.d.ts` a partir dele com `openapi-typescript` e chama a API por `openapi-fetch`. Não há modelos de API escritos à mão. O CI falha se o contrato versionado diferir do que o backend produz, ou se os tipos gerados diferirem do contrato. Para atualizar: `mvn -Dtest=OpenApiContractIT -Dopenapi.update=true verify` e `npm run api:generate`.
- Manter o app na **mesma origem** da API (proxy reverso em produção, proxy do Vite em desenvolvimento). A sessão fica no cookie `HttpOnly`; o código só lê o cookie CSRF (ou busca `/api/auth/csrf`) para enviar `X-XSRF-TOKEN` em requisições que alteram estado. Nenhum token de autenticação existe em JavaScript nem no armazenamento do navegador.
- Mostrar **mensagens voltadas ao aluno escolhidas por códigos de erro estáveis**, nunca títulos ou detalhes do servidor, e sempre exibir o `requestId` para que uma falha possa ser reportada.
- Tratar a **acessibilidade como requisito testado**: ESLint `jsx-a11y`, verificações `vitest-axe` em cada página, link de pular conteúdo, marcos rotulados, erros de formulário em um resumo que recebe foco e aponta para os campos, e foco movido para o título da página após a navegação. Testes ponta a ponta com Playwright e axe vêm junto com o fluxo de estudo.
- Descartar tudo que está em cache na memória ao sair, para que nada de um aluno fique visível ao próximo.

## Consequências

- Mudanças na API aparecem na revisão como diff do `openapi.json` e quebram o build web em tempo de compilação, não em tempo de execução.
- Gerar o contrato exige rodar os testes do backend; mudar o formato de uma resposta é uma atualização em dois passos.
- O documento OpenAPI fica disponível apenas para os testes (`springdoc.api-docs.enabled=false` por padrão); a aplicação em execução não o publica.
- Uma SPA precisa do proxy ou de um host estático que sirva o `index.html` para as rotas do cliente.

## Alternativas rejeitadas

- **Páginas renderizadas no servidor (Thymeleaf/HTMX):** implantação mais simples, mas menos adequada ao fluxo de estudo interativo e a um contrato tipado compartilhado com clientes futuros.
- **Framework React full-stack (Next.js):** adiciona um segundo runtime de servidor e um segundo lugar para a lógica de autenticação.
- **Tipos de API escritos à mão:** divergem do backend sem aviso.
- **Autenticação por token no navegador:** rejeitada na ADR 0008.
