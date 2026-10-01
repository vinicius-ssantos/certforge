# Operações

> Tradução de [`docs/engineering/operations.md`](../../docs/engineering/operations.md). O inglês é a fonte canônica.

Issue: #12 — Adicionar auditoria, observabilidade, prontidão e contratos de erro seguros. Este documento explica como ver o que a aplicação está fazendo e como reagir quando algo está errado. O bootstrap e a configuração local estão no [bootstrap do backend](backend-bootstrap.md).

## O que a telemetria pode conter

A telemetria (logs, métricas, observações e, no futuro, traces) nunca contém credenciais, chaves de sessão ou de idempotência, endereços de e-mail, respostas enviadas, gabaritos, explicações nem conteúdo não publicado. Os identificadores de contas e de sessões também ficam fora dela: a telemetria HTTP usa o caminho com template (`/api/admin/accounts/{id}/roles`), nunca o caminho concreto. Testes garantem isso em logs, métricas, observações e corpos de erro (`OperabilityIT`).

O único identificador que está deliberadamente em todo lugar é o **request id**, que é aleatório e não carrega informação.

## Correlacionando uma requisição

Toda requisição recebe um id antes de qualquer outra coisa:

- Um cliente pode enviar `X-Request-Id`. Ele só é mantido se tiver de 8 a 64 letras, dígitos, pontos, sublinhados ou hífens; qualquer outra coisa é substituída por um id aleatório, então um id nunca consegue injetar conteúdo em uma linha de log.
- O id volta no header de resposta `X-Request-Id`, aparece em toda linha de log da requisição (`[<id>] ` depois do nível) e em todo corpo de erro como `requestId`. Nunca é colocado em uma URL.
- Os registros de auditoria também o guardam, então uma ação auditada pode ser ligada às suas linhas de log.

Para investigar uma falha, peça ao usuário o `requestId` do corpo de erro (ou leia o header) e procure por ele nos logs.

Os logs são texto puro por padrão. Defina `LOGGING_STRUCTURED_FORMAT_CONSOLE=logstash` (ou `ecs`) para logs em JSON, em que o id é um campo.

## Contrato de erros

Todo erro é um problema RFC 9457 (`application/problem+json`) produzido em um único lugar:

```json
{"type":"about:blank","title":"Not Found","status":404,"code":"session_not_found","requestId":"…"}
```

- `code` é estável e legível por máquina; os códigos de cada funcionalidade estão listados nos documentos de arquitetura.
- Falhas de validação usam `validation_failed` com uma lista `fields` só de nomes, e os erros do framework mantêm o mesmo corpo, com um código para o tipo de falha: `invalid_request` (JSON malformado e semelhantes), `not_found` (caminho desconhecido), `method_not_allowed`, `unsupported_media_type` e `not_acceptable`. Nenhum carrega texto do framework.
- Qualquer falha inesperada devolve `500` com `internal_error` e o título genérico `Unexpected error`. O corpo não tem stack trace, classe nem mensagem da exceção; os detalhes completos vão para o log, sob o mesmo `requestId`.
- Falhas de autenticação e de autorização (`unauthenticated`, `forbidden`, `csrf_invalid`) seguem o mesmo formato.

## Trilha de auditoria

A aprovação, a publicação, a substituição e a depreciação de uma revisão de questão são registradas em `audit_event`: o ator, a ação, o assunto (`question-revision:<id>`), o momento e o request id. Os registros são gravados na mesma transação da ação, então a ação e o seu registro são confirmados ou desfeitos juntos: se o registro não puder ser gravado, a ação falha. A tabela é somente de acréscimo para qualquer escritor, inclusive SQL direto.

Leia com `GET /api/admin/audit` (permissão `AUDIT_READ`, dos administradores). Filtros: `subject`, `actorId`, `action`. As páginas vêm da mais nova para a mais antiga com `cursor` e `size` (1 a 50).

Os registros de auditoria são evidência e são mantidos indefinidamente.

## Saúde

| Endpoint | Significado | O que verifica |
|---|---|---|
| `/actuator/health/liveness` | O processo está vivo. Uma falha significa reiniciá-lo | Apenas o processo. Nunca olha o banco de dados |
| `/actuator/health/readiness` | A instância consegue fazer trabalho útil. Uma falha significa parar de enviar tráfego | O estado de prontidão, o banco de dados e as migrações do Flyway |
| `/actuator/health` | Status geral | Os dois |

O grupo de prontidão informa `db` e `flywayMigrations`. `flywayMigrations` fica `DOWN` quando uma migração falhou ou ainda está pendente. A saúde é pública, mas mostra só nomes e status, nunca detalhes.

A separação importa: uma queda do banco ou uma migração falha deixa a instância **sem prontidão**, o que para o tráfego, mas não a deixa **morta**, então um orquestrador não reinicia em laço processos saudáveis.

## Métricas

`GET /actuator/metrics` (e `/actuator/metrics/<nome>`) exige a permissão `OPERATIONS_VIEW`, dos administradores. Apenas `health`, `info` e `metrics` são expostos; qualquer outro endpoint de gerenciamento não existe.

| Métrica | Rótulos | Conta |
|---|---|---|
| `certforge.auth.failures` | `reason`: `invalid_credentials`, `throttled` | Logins falhos e tentativas bloqueadas |
| `certforge.sessions.created` | nenhum | Sessões de estudo iniciadas |
| `certforge.attempts.submitted` | `outcome`: `correct`, `incorrect` | Respostas aceitas |
| `certforge.attempts.replayed` | nenhum | Repetições idempotentes de uma resposta aceita |
| `certforge.editorial.transitions` | `action`: `created`, `revision_started`, `submitted`, `approved`, `changes_requested`, `published`, `replaced`, `deprecated` | Transições editoriais aceitas |
| `certforge.domain.failures` | `code`: um código de problema estável | Requisições rejeitadas por motivo |
| `certforge.unexpected.failures` | nenhum | Falhas inesperadas do servidor (`internal_error`) |
| `certforge.session.start`, `certforge.attempt.submit`, `certforge.editorial.publish` | `error` | Timers das operações críticas |
| `http.server.requests` | `uri` com template, método, status, resultado | Timers HTTP padrão |

Os rótulos vêm de conjuntos fixos, nunca de entrada do usuário, e um filtro limita o número de valores distintos de cada rótulo como rede de segurança. As métricas padrão da JVM, do pool de conexões e de HTTP também estão disponíveis.

As operações críticas também são observações do Micrometer: hoje viram timers e viram spans de trace quando uma ponte de tracing for adicionada. Exportar traces não faz parte da `v0.1.0`; isso exige uma ponte de tracing e um exportador, e as observações não carregam identificadores, então podem ser exportadas com segurança.

## Logs e retenção

Os logs vão para o console. Quando o log em arquivo está habilitado (`logging.file.name`), os arquivos rolam e são mantidos por um tempo limitado: 14 dias, 50 MB por arquivo, 1 GB no total. Mude isso em `logging.logback.rollingpolicy`. Envie os logs do console ao repositório de logs da plataforma e aplique a retenção dele; 30 dias é um teto razoável para logs operacionais. As sessões são removidas pelo armazenamento de sessões quando expiram.

## Triagem de incidentes

Comece pelo sinal e depois pelo request id.

| Sinal | Causa provável | O que fazer |
|---|---|---|
| Prontidão `DOWN`, `flywayMigrations` `DOWN`, vivacidade `UP` | Uma migração falhou ou está pendente | Leia o log da inicialização; corrija a causa e repare a linha falha em `flyway_schema_history`, depois reinicie. Não edite migrações aplicadas |
| Prontidão `DOWN`, `db` `DOWN` | O banco está inacessível ou saturado | Verifique o banco, a conectividade e as credenciais. A aplicação se recupera sozinha quando o banco volta |
| `certforge.unexpected.failures` subindo, respostas `internal_error` | Um bug ou a falha de uma dependência | Pegue um `requestId` de uma resposta afetada e encontre a linha de log dele para o stack trace |
| `certforge.auth.failures{reason=throttled}` subindo | Força bruta, ou usuários atrás de um mesmo endereço compartilhando o limite | Verifique os endereços de origem. Atrás de um proxy reverso, configure headers encaminhados confiáveis, senão todos compartilham o endereço do proxy. Os limites são por instância e ficam em memória |
| `certforge.domain.failures{code=idempotency_key_reused}` ou `concurrent_submission` | Um cliente reutilizando chaves de forma errada ou repetindo em paralelo | Verifique o cliente. As chaves devem ser únicas por resposta e reutilizadas só em repetições da mesma requisição |
| `certforge.domain.failures{code=insufficient_content}` | Um tópico tem poucas questões publicadas | Publique mais conteúdo para o tópico ou reduza a quantidade pedida |
| `certforge.domain.failures{code=topic_not_active}` ou `java_release_mismatch` ao publicar | O tópico ou a versão da prova não está ativo ou mira outra release | Corrija o estado do catálogo e publique de novo |
| O progresso de um aluno parece errado | A projeção divergiu das tentativas | `GET /api/progress/reconciliation` mostra a diferença, `POST /api/progress/rebuild` repara. As tentativas são a evidência e nunca são alteradas |
| Uma questão foi publicada ou retirada de forma inesperada | Uma ação editorial | `GET /api/admin/audit?subject=question-revision:<id>` mostra quem fez, quando e o request id |
| Um usuário não consegue entrar depois de uma mudança de papel | Mudar os papéis encerra as sessões da conta de propósito | Peça que entre novamente |

### Recuperando uma migração falha

A saúde mostra a falha, mas não altera o banco de dados. Identifique a migração falha pelo log da inicialização e por `flyway_schema_history`, corrija o problema de fundo (dados ou permissões), depois marque ou remova a linha falha como descreve o procedimento de reparo do Flyway e reinicie. Migrações já aplicadas nunca são editadas, porque o Flyway calcula o checksum delas; correções vão em uma nova migração.

## Backup e restauração

Todo o estado está no PostgreSQL: contas, sessões, conteúdo, tentativas, histórico e a trilha de auditoria. Os containers do backend e do web não guardam nada, então o banco é a única coisa para salvar.

```sh
# Backup do banco inteiro (formato custom, restaurável de forma seletiva e em paralelo)
docker compose -f compose.release.yaml exec -T postgres pg_dump -U certforge -d certforge -Fc > certforge-$(date +%F).dump

# Restauração em um banco novo e vazio
pg_restore -U certforge -d certforge --no-owner --exit-on-error certforge-2026-10-01.dump
```

- Faça backup antes de toda atualização e antes de qualquer coisa que reescreva dados à mão.
- **Depois de uma restauração, encerre todas as sessões**: `delete from certforge.identity_session;` (isso só desconecta as pessoas). Um backup pode conter sessões que foram revogadas depois dele, por exemplo de uma conta desabilitada ou que perdeu um papel, e restaurar as reviveria.
- Guarde os backups fora do host do banco e trate-os como sensíveis: eles têm hashes de senha e todas as respostas dos alunos.
- **Ensaie.** O `deploy/rehearse-restore.sh` faz backup de um stack em execução, restaura em um PostgreSQL novo e compara cada tabela por contagem de linhas e checksum do conteúdo, além do histórico de migrações. O CI o roda a cada mudança; rode-o no seu ambiente antes de confiar em um backup.
- Os objetivos de recuperação estão propostos na [ADR 0010](../adr/0010-first-deployment-posture.md), que aguarda decisão: 24 horas de dados e um dia útil para voltar, decorrentes de backups diários e de uma única instância. Enquanto não for aceita, esta release não promete nenhum dos dois.

## Atualizar e reverter

As migrações rodam quando o backend inicia, em ordem e só para a frente, e ficam registradas em `flyway_schema_history`. A regra de uma release é que as migrações são **aditivas**: tabelas e colunas novas com valores padrão, nunca um renome ou remoção na mesma release que deixa de usar o nome antigo. O backend nomeia suas colunas, então a versão anterior continua funcionando no esquema mais novo. A V11 (a coluna do checklist da revisão) é um exemplo.

- **Atualizar**: faça um backup, publique as novas imagens, espere a prontidão e rode `deploy/verify-release.sh`.
- **Reverter a aplicação**: publique de novo as imagens anteriores. Isso é seguro enquanto toda migração entre as duas for aditiva, que é para o que serve a regra acima. Não tente desfazer uma migração.
- **Se uma migração danificou dados ou não era aditiva**: restaure o backup feito antes da atualização e publique de novo as imagens anteriores. Tudo o que foi escrito desde o backup se perde, então avise as pessoas afetadas.
- Uma migração que falha deixa a instância sem prontidão; veja [Recuperando uma migração falha](#recuperando-uma-migração-falha).

## Reconciliar dados

Alguns dados são derivados e outros são evidência. Conserte os primeiros; nunca edite os segundos.

- **O progresso por tópico é derivado** das tentativas. `GET /api/progress/reconciliation` mostra qualquer diferença e `POST /api/progress/rebuild` a corrige.
- **Tentativas, revisões publicadas e registros de auditoria são evidência.** O banco recusa alterá-los. Se um número parece errado, a projeção está errada, não a evidência.
- **Sessões expiram na leitura**: uma sessão em andamento além do prazo é reportada como expirada e não precisa de limpeza.
- **Publicação e auditoria devem concordar.** Toda revisão publicada ou substituída tem um evento de auditoria. Para listar as que não têm:

```sql
select r.id from certforge.qb_question_revision r
where r.published_at is not null
  and not exists (select 1 from certforge.audit_event a
                  where a.action = QUESTION_REVISION_PUBLISHED
                    and a.subject = question-revision: || r.id);
```

Um resultado vazio é o esperado. Revisões publicadas antes de a trilha de auditoria existir (antes da issue #12) apareceriam; não há nenhuma em um banco que começou na v0.1.0.

## Resposta a incidentes

Em ordem, anotando o que foi feito e quando:

1. **Conter.** Se respostas ou contas podem estar expostas, pare o tráfego primeiro: pare o container `web` ou deixe a prontidão falhar. Uma indisponibilidade curta é melhor do que um vazamento que continua.
2. **Preservar evidências.** Faça um backup do banco antes de mudar qualquer coisa e guarde os logs. O `requestId` liga o relato de uma pessoa às linhas de log e aos registros de auditoria.
3. **Identificar.** Use a tabela de triagem acima, a trilha de auditoria (`GET /api/admin/audit`) e as métricas.
4. **Corrigir ou reverter.** Veja acima. Para uma questão errada, aposente-a (o Retire da mesa editorial) em vez de editar o banco; o histórico dela permanece.
5. **Verificar.** A prontidão está em pé, o `deploy/verify-release.sh` passa e o sintoma sumiu.
6. **Avisar as pessoas afetadas** sobre o que aconteceu e o que devem fazer, e registrar o incidente (o quê, por quê, o que mudou) no changelog ou em um registro de decisão.

Casos comuns:

| Caso | Primeiros passos |
|---|---|
| A resposta ou o enunciado de uma questão está errado | Aposente a revisão; comece uma nova revisão e publique-a depois da revisão por outra pessoa. As tentativas passadas dos alunos continuam mostrando o que eles viram. |
| Respostas podem ter vazado antes do envio | Contenha e então rode o `deploy/verify-privacy.mjs` e a jornada ponta a ponta de privacidade contra o stack, e leia a trilha de auditoria para ver quem publicou o quê. |
| Uma conta foi comprometida | Desabilite-a (`POST /api/admin/accounts/{id}/disable`), o que encerra as sessões dela na hora; revise o que ela fez na trilha de auditoria. |
| A senha do banco ou a do administrador inicial foi exposta | Troque-a no banco e no ambiente do backend, reinicie o backend e desconecte todos (`delete from certforge.identity_session;`). |
| Um aviso de vulnerabilidade de dependência é publicado | A varredura de imagens reprova o próximo build; suba a versão (veja o `pom.xml` para como as sobrescritas são registradas), reconstrua e publique de novo. |

## Adiado

Integração com SIEM externo, um data warehouse analítico de longo prazo, um pipeline de tracing distribuído, telemetria específica do runner e registros de auditoria para mudanças de conta e de catálogo (o módulo de auditoria depende da identidade, então isso exige antes um tipo de fato neutro).
