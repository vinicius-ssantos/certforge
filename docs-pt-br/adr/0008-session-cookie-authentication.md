# ADR 0008: Autenticar com sessões no servidor e cadastro aberto

> Tradução de [`docs/adr/0008-session-cookie-authentication.md`](../../docs/adr/0008-session-cookie-authentication.md). O inglês é a fonte canônica.

- Status: Aceita
- Data: 2026-09-30

## Contexto

A `v0.1.0` precisa de contas individuais de aluno e de autorização explícita para as capacidades de aluno, editor, revisor e administrador. O futuro frontend web (#13) não deve expor material de autenticação ao código do navegador, e o logout ou a revogação precisam valer imediatamente. Duas decisões de produto foram tomadas para esta release: como os clientes se autenticam e se qualquer pessoa pode criar uma conta.

## Decisão

- Autenticar com **sessões no servidor**, armazenadas no PostgreSQL (Spring Session JDBC) e identificadas por um cookie `HttpOnly` e `SameSite=Lax`. O atributo `Secure` segue o esquema da requisição, a menos que seja configurado explicitamente.
- Proteger requisições que alteram estado com **tokens CSRF**, usando o padrão double-submit cookie (cookie `XSRF-TOKEN` devolvido no header `X-XSRF-TOKEN`).
- Permitir **cadastro aberto**: qualquer pessoa pode criar uma conta de aluno com e-mail e senha. Papéis superiores só são concedidos por um administrador. O primeiro administrador é criado a partir de configuração quando não existe nenhum.
- Gerar o hash das senhas com o encoder delegante do Spring Security (bcrypt). A política de senha é baseada em tamanho (mínimo de 12 caracteres, máximo de 72 bytes, sem regras de composição).
- Manter o nome do principal da sessão igual ao **id da conta**, para que as sessões possam ser encontradas e revogadas por conta sem usar o e-mail.
- Aplicar a autorização no servidor por meio de **permissões** explícitas. Os papéis apenas agrupam permissões; outros módulos verificam permissões, nunca nomes de papéis.

## Consequências

- Logout, mudança de papéis e desativação de conta valem imediatamente, porque as sessões afetadas são apagadas no servidor.
- Nenhum token é legível por JavaScript, exceto o token CSRF, que sozinho não concede autoridade.
- As sessões são compartilhadas entre instâncias da aplicação pelo banco de dados, ao custo de uma leitura no banco por requisição autenticada.
- O cadastro aberto expõe o endpoint de registro a abuso. Isso é mitigado com limite de taxa por endereço e respostas de erro estáveis, mas não é possível esconder que um e-mail já está cadastrado, porque a resposta de e-mail duplicado precisa ser visível a quem está se cadastrando.
- Verificação de e-mail e recuperação de senha **não** fazem parte desta decisão e ficam adiadas. Até existirem, o e-mail de uma conta não é verificado e uma senha esquecida não pode ser recuperada sem um administrador.
- O limite de taxa fica em memória, por instância. Rodar várias instâncias exige antes um armazenamento compartilhado.

## Alternativas rejeitadas

- **Access tokens JWT sem estado:** a revogação e o logout imediato exigiriam uma lista de bloqueio ou tokens de vida curta com refresh, e o token normalmente ficaria acessível ao código do navegador.
- **Provedor de identidade externo (OIDC):** adiciona infraestrutura e uma dependência externa antes de a `v0.1.0` provar valor. Continua possível depois, atrás da fronteira do módulo `identity`.
- **Somente contas provisionadas:** mais seguro para um produto privado, mas rejeitado como padrão da release para que os alunos possam se cadastrar sozinhos.
