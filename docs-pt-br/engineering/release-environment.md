# Ambiente de release

> Tradução de [`docs/engineering/release-environment.md`](../../docs/engineering/release-environment.md). O inglês é a fonte canônica.

Como o CertForge roda como imagens atrás de um proxy, o que essa configuração garante e como o CI prova isso. Para desenvolvimento use o [bootstrap do backend](backend-bootstrap.md) e os servidores de desenvolvimento; este é o formato de uma implantação.

## O que roda

| Container | Imagem | Papel |
|---|---|---|
| `postgres` | `postgres:18.6-alpine` | O único armazenamento. O volume dele é o dado a ser salvo em backup. |
| `app` | construída do `Dockerfile` | O backend. Roda como usuário sem privilégios e é acessível do host só em `127.0.0.1:8080`, para verificações de saúde e operação. |
| `web` | construída do `web/Dockerfile` | nginx servindo o app web construído e fazendo proxy de `/api` para o `app`. É o único container feito para ser acessado por usuários. |

```sh
DB_PASSWORD=... BOOTSTRAP_ADMIN_EMAIL=... BOOTSTRAP_ADMIN_PASSWORD=... \
  docker compose -f compose.release.yaml up --build
# o app fica então em http://localhost:8081 (mude com WEB_PORT)
```

`DB_PASSWORD` não tem valor padrão, então um segredo ausente interrompe a subida em vez de rodar com um segredo conhecido. O administrador inicial só é criado quando não existe nenhum; defina as duas variáveis na primeira subida e depois remova-as.

## O que o container web garante

- **Uma origem.** O navegador fala com o `web` tanto para o app quanto para a API, então o cookie de sessão nunca cruza origens.
- **Content Security Policy estrita.** Scripts, estilos, fontes, imagens e conexões só da própria origem do app; sem enquadramento; sem objetos. O build nunca embute recursos como URIs `data:`, porque a política os bloquearia.
- **Cabeçalhos de segurança**: `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY`, uma `Permissions-Policy` mínima e nenhuma versão do servidor.
- **Endpoints de operação ficam por dentro.** `/actuator/` responde 404 pelo proxy. A saúde é acessível na porta do backend exposta só ao host.
- **Cache.** Os recursos construídos têm hash no nome e são guardados por um ano; a página em si nunca é guardada em cache.
- **Endereços de clientes não são falsificáveis.** O backend limita login e cadastro por endereço de cliente. Atrás de um proxy ele precisa ler esse endereço de `X-Forwarded-For` (`SERVER_FORWARD_HEADERS_STRATEGY=framework`), e por isso o nginx **sobrescreve** esse cabeçalho com o endereço que viu e nunca acrescenta ao do cliente. Sem isso todos os usuários dividiriam o balde do proxy; com um proxy que acrescenta, um cliente poderia escolher o próprio endereço e nunca ser limitado.

## TLS

As imagens falam HTTP puro. Em uma implantação real termine o TLS na frente do `web` (um balanceador ou um proxy TLS) e então:

- defina `SESSION_COOKIE_SECURE=true` para o cookie de sessão só ser enviado por HTTPS;
- adicione `Strict-Transport-Security` no terminador de TLS;
- continue encaminhando `X-Forwarded-Proto: https`; o `web` o repassa.

Deixe `SESSION_COOKIE_SECURE` sem definir apenas para experimentar o stack em `http://localhost` puro.

## Como o CI prova isso

O job `release` constrói essas imagens e então:

1. **Varre as duas imagens** com o Trivy atrás de vulnerabilidades altas e críticas com correção disponível e falha com qualquer uma. Um aviso novo pode derrubar uma mudança sem relação; a correção quase sempre é subir uma versão (a primeira execução dessa varredura achou um aviso crítico no Tomcat e altos no Jackson, corrigidos sobrescrevendo as versões gerenciadas no `pom.xml`, e pacotes do sistema operacional desatualizados, corrigidos com a atualização nos Dockerfiles).
2. Sobe o stack com as configurações de release e roda o `deploy/verify-release.sh`: cabeçalhos de segurança, endpoints de operação escondidos, liveness e readiness do backend, o contrato de erro pelo proxy, e que um `X-Forwarded-For` forjado não burla o limite de cadastro por endereço.
3. Reinicia com banco novo usando o `compose.e2e.yaml`, que relaxa apenas a separação entre autor e revisor e o limitador de cadastro, e roda toda a suíte do Playwright contra as imagens de release, exercitando o proxy, os cabeçalhos e a Content Security Policy reais. A suíte reprova qualquer página que provoque uma violação da Content Security Policy e inclui as jornadas de privacidade das respostas e de integridade histórica.
4. Inspeciona o stack em execução, depois desse tráfego, com o `deploy/verify-privacy.mjs`: uma dúzia de requisições que falham devem responder cada uma com o corpo de problema (`code` estável, o id da requisição também no cabeçalho da resposta, sem stack trace, nome de classe nem SQL), nenhuma tag de métrica pode ter um id ou e-mail nem mais de 50 valores, e os logs não podem ter texto de resposta, senha, cookie ou valor de autorização. A aplicação registra pouco no nível INFO, então essa checagem dos logs protege contra vazamentos futuros mais do que dá evidência sobre o volume de hoje.

5. Mede os fluxos principais de um aluno (entrar, listar trilhas, iniciar uma sessão, lê-la, enviar uma resposta, terminar, ler histórico e progresso) e a inicialização do backend, e falha se o percentil 95 de um fluxo passar do orçamento. Os orçamentos são várias vezes a linha de base medida em uma máquina de desenvolvimento, então um runner compartilhado lento não os viola e uma regressão real viola. Não são uma afirmação de capacidade: um cliente, uma instância, requisições sequenciais.
6. **Ensaia a recuperação**: faz backup do banco que acabou de receber todo esse tráfego, restaura em um PostgreSQL novo e compara cada tabela por contagem de linhas e checksum do conteúdo, além do histórico de migrações.

O `compose.e2e.yaml` serve só a esse propósito.

## Outras barreiras no CI

| Barreira | O que garante |
|---|---|
| Varredura de segredos | gitleaks sobre todo o histórico do git, regras padrão mais uma exceção estreita e documentada (`.gitleaks.toml`). |
| CodeQL | Análise de segurança do backend Java e do app TypeScript, em pull requests, na `main` e toda semana. |
| Auditoria de dependências | `npm audit` para tudo que vai ao navegador; Dependabot para os dois ecossistemas e os workflows. |
| Análise estática | PMD e o compilador no build do backend; ESLint com as regras de acessibilidade e TypeScript estrito no app web. |
| Orçamento de tamanho | O tamanho gzip do JavaScript e do CSS no primeiro carregamento (`npm run budget`). Determinístico, então é apertado. |
| Teste de upgrade | O `MigrationUpgradeIT` aplica cada migração sobre a anterior e atualiza um banco que contém uma revisão revisada. |

## Rode você mesmo as mesmas verificações

```sh
export DB_PASSWORD=local-test BOOTSTRAP_ADMIN_EMAIL=admin@example.com BOOTSTRAP_ADMIN_PASSWORD='uma senha local longa'
docker compose -f compose.release.yaml up --build -d
bash deploy/verify-release.sh
```

## Limites conhecidos

- Não estão incluídos TLS, backups nem envio de logs; veja o guia de operação para o que fazer em cada caso.
- O limitador é em memória por instância do backend (ADR 0008). Rode uma instância do backend até ele ter um armazenamento compartilhado.
- A varredura de vulnerabilidades cobre pacotes do sistema operacional e de Java/bibliotecas nas imagens, não a lógica da própria aplicação. Ela não substitui o modelo de ameaças.
