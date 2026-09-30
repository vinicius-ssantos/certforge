# Identidade e Acesso

> Tradução de [`docs/architecture/identity-and-access.md`](../../docs/architecture/identity-and-access.md). O inglês é a fonte canônica.

Issue: #5 — Implementar identidade, autenticação e autorização baseada em papéis. Registro da decisão: [ADR 0008](../adr/0008-session-cookie-authentication.md).

## Papéis e permissões

As permissões são a unidade de autorização. Os papéis apenas as agrupam.

| Permissão | Protege |
|---|---|
| `STUDY` | Operações de estudo do aluno |
| `CONTENT_AUTHOR` | Criar e editar questões em rascunho |
| `CONTENT_REVIEW` | Registrar decisões de revisão e aprovar revisões |
| `CONTENT_PUBLISH` | Publicar, substituir e depreciar revisões |
| `CATALOG_MANAGE` | Operações controladas do catálogo |
| `ACCOUNT_MANAGE` | Atribuir papéis e ativar ou desativar contas |

| Papel | Permissões |
|---|---|
| `LEARNER` | `STUDY` |
| `EDITOR` | `CONTENT_AUTHOR` |
| `REVIEWER` | `CONTENT_REVIEW` |
| `ADMINISTRATOR` | `CATALOG_MANAGE`, `CONTENT_AUTHOR`, `CONTENT_REVIEW`, `CONTENT_PUBLISH`, `ACCOUNT_MANAGE` |

Toda conta tem `LEARNER`. Os papéis podem ser combinados, por exemplo uma conta pode ser `EDITOR` e `REVIEWER` ao mesmo tempo. Os outros módulos protegem operações com `@PreAuthorize("hasAuthority('CONTENT_PUBLISH')")` e obtêm o chamador com `CurrentActor`; nunca verificam nomes de papéis.

## Endpoints

| Endpoint | Acesso |
|---|---|
| `GET /api/auth/csrf` | Público. Emite o cookie `XSRF-TOKEN` e devolve o nome do header e o token. |
| `POST /api/auth/register` | Público. Cria uma conta `LEARNER`. |
| `POST /api/auth/login` | Público. Inicia uma sessão. |
| `POST /api/auth/logout` | Autenticado. Destrói a sessão. |
| `GET /api/auth/me` | Autenticado. Conta atual, papéis e permissões. |
| `PUT /api/admin/accounts/{id}/roles` | `ACCOUNT_MANAGE`. Substitui os papéis da conta. |
| `POST /api/admin/accounts/{id}/disable`, `.../enable` | `ACCOUNT_MANAGE`. |
| `GET /actuator/health`, `/actuator/info` | Público. |

Todo o resto exige autenticação. O padrão é negar, então um endpoint novo fica protegido até ser listado como público.

## Sessões

- As sessões ficam em `certforge.identity_session` e são identificadas pelo cookie `CERTFORGE_SESSION`: `HttpOnly`, `SameSite=Lax`, caminho `/`.
- `Secure` segue o esquema da requisição. Defina `SESSION_COOKIE_SECURE=true` quando o TLS for terminado por um proxy na frente da aplicação.
- O timeout por inatividade é de 30 minutos (`spring.session.timeout`). Ainda não há tempo de vida absoluto.
- O id da sessão é trocado no login, para evitar session fixation.
- O nome do principal da sessão é o id da conta. Mudar os papéis de uma conta ou desativá-la apaga todas as suas sessões, então a mudança vale imediatamente.
- O logout destrói a sessão no servidor; um cookie copiado deixa de funcionar.

## CSRF

Requisições que alteram estado devem enviar o header `X-XSRF-TOKEN` com o valor do cookie `XSRF-TOKEN`. Um cliente chama `GET /api/auth/csrf` primeiro. Tokens ausentes ou diferentes retornam `403` com o código `csrf_invalid`. Scripts que não usam navegador devem fazer o mesmo.

## Credenciais

- As senhas recebem hash com o encoder delegante do Spring Security (bcrypt). O texto puro nunca é armazenado, registrado em log nem devolvido.
- Política: pelo menos 12 caracteres e no máximo 72 bytes (o bcrypt ignora o que passa de 72 bytes); a senha não pode ser igual ao e-mail. Deliberadamente não há regras de composição. Uma lista de bloqueio de senhas vazadas fica adiada.
- Os e-mails são comparados sem diferenciar maiúsculas e minúsculas, e cada valor é armazenado uma única vez.

## Proteção contra abuso

- As falhas de login são contadas por e-mail e por endereço do cliente em uma janela deslizante de 15 minutos: 5 por e-mail e 50 por endereço por padrão. Acima do limite a resposta é `429` com `Retry-After`, mesmo para a senha correta.
- Os cadastros são limitados a 10 por endereço do cliente por janela.
- Os limites são por instância da aplicação e ficam em memória. Eles se perdem ao reiniciar.
- Como o endereço é `getRemoteAddr()`, deployments atrás de um proxy reverso devem configurar headers encaminhados confiáveis (`server.forward-headers-strategy`); caso contrário todos os clientes compartilham o endereço do proxy.
- Trade-off: um terceiro pode falhar logins de propósito para um e-mail conhecido e bloqueá-lo por uma janela. O limite por endereço restringe o quanto uma única origem consegue fazer isso.

## Contrato de erros

Os endpoints de identidade retornam respostas de problema RFC 9457 com um `code` estável. Os corpos nunca incluem valores enviados.

| Status | `code` | Significado |
|---|---|---|
| 400 | `validation_failed` | Requisição inválida; `fields` lista apenas os nomes dos campos |
| 400 | `password_too_short`, `password_too_long`, `password_equals_email` | Política de senha |
| 401 | `unauthenticated` | Sem sessão válida |
| 401 | `invalid_credentials` | Login falhou. Idêntico para e-mail desconhecido, senha errada e conta desativada |
| 403 | `forbidden` | Autenticado, mas sem a permissão |
| 403 | `csrf_invalid` | Token CSRF ausente ou incorreto |
| 404 | `account_not_found` | A conta alvo não existe |
| 409 | `email_already_registered` | Cadastro com um e-mail já existente |
| 409 | `own_admin_access` | Um administrador tentou remover ou desativar o próprio acesso |
| 429 | `too_many_attempts` | Limite de taxa atingido |

Uma conta desativada só é rejeitada depois de a senha ser verificada, então não dá para distingui-la de uma senha errada nem pela resposta nem pelo tempo.

### Trade-off conhecido de enumeração

`email_already_registered` revela que um e-mail tem conta. Isso é inerente ao cadastro aberto sem verificação de e-mail, em que a pessoa que se cadastra precisa ser informada. É mitigado pelo limite de taxa de cadastro. O login, caminho usado em credential stuffing, não revela se a conta existe.

## Primeiro administrador

Defina `BOOTSTRAP_ADMIN_EMAIL` e `BOOTSTRAP_ADMIN_PASSWORD` na primeira inicialização. Uma conta `ADMINISTRATOR` só é criada se não existir nenhum administrador; a senha deve atender à política. A senha nunca é registrada em log, e os dois valores devem ser removidos do ambiente depois da primeira inicialização. Não existe administrador padrão.

## Desenvolvimento local

- Rode `docker compose up -d postgres` e depois a aplicação com as variáveis de bootstrap definidas para criar um administrador.
- Os padrões locais não exigem segredos de produção. Não reutilize as credenciais do banco local em nenhum outro lugar.
- Sobre HTTP puro, o cookie não é `Secure`, o que é esperado localmente.

## Adiado

Verificação de e-mail, recuperação de senha, autenticação multifator, login social ou SSO, tempo de vida absoluto de sessão, lista de bloqueio de senhas vazadas, armazenamento compartilhado de limite de taxa e eventos de auditoria para mudanças de conta (veja #12).
