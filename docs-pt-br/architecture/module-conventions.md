# Convenções de Módulos

> Tradução de [`docs/architecture/module-conventions.md`](../../docs/architecture/module-conventions.md). O inglês é a fonte canônica.

Issue: #4 — Impor as fronteiras do monolito modular. Veja a [ADR 0001](../adr/0001-modular-monolith.md) e a [ADR 0007](../adr/0007-generalize-preparation-catalog.md).

## Módulos e pacotes

Cada módulo é um subpacote direto de `dev.certforge`. Nomes de pacote Java não podem conter hífen, então os módulos `preparation-catalog` e `question-bank` são implementados como `preparationcatalog` e `questionbank`. Não existe um módulo paralelo `certification-catalog`.

| Módulo | Pacote | Dependências permitidas |
|---|---|---|
| `platform` | `dev.certforge.platform` | nenhuma |
| `identity` | `dev.certforge.identity` | `platform` |
| `preparation-catalog` | `dev.certforge.preparationcatalog` | `platform`, `identity` |
| `question-bank` | `dev.certforge.questionbank` | `platform`, `identity`, `preparationcatalog`, `audit` |
| `study` | `dev.certforge.study` | `platform`, `identity`, `preparationcatalog`, `questionbank` |
| `progress` | `dev.certforge.progress` | `platform`, `identity`, `preparationcatalog`, `study` |
| `audit` | `dev.certforge.audit` | `platform`, `identity` |

As dependências permitidas são declaradas com `@ApplicationModule(allowedDependencies = ...)` no `package-info.java` de cada módulo e seguem as regras de direção da [visão geral da arquitetura](overview.md).

## API pública e internals

- Os tipos no pacote base do módulo são a sua API pública: outros módulos podem usá-los.
- Tudo abaixo de `<módulo>.internal` (e qualquer outro subpacote) é privado ao módulo. Outros módulos não devem referenciá-lo.
- Tipos de persistência (`*Repository`, `*Entity`) devem ficar em um pacote `internal`. Um tipo que precise cruzar uma fronteira é exposto como um tipo de API separado, nunca como uma entidade de persistência.
- Os módulos trocam identificadores estáveis (por exemplo `ActorId`) e value types imutáveis (por exemplo `AuditFact`), não estado interno.

## Transações e eventos internos

- Um caso de uso roda em uma transação local, pertencente ao módulo que o expõe.
- Escritas entre módulos passam pela API pública do outro módulo, nunca pelos seus repositórios.
- Eventos de aplicação do Spring podem ser usados dentro do processo para desacoplar módulos, por exemplo para alimentar projeções ou a auditoria. São eventos simples em processo: não implicam Kafka, outbox nem consistência eventual. Introduzir qualquer um desses exige uma ADR própria.

## Imposição

O `ModularityTest` roda no CI (`mvn verify`) e falha o build quando:

- o conjunto de módulos difere da tabela acima;
- um módulo depende de outro que não está na sua lista de permitidos;
- um módulo referencia tipos internos de outro módulo;
- um tipo `*Repository` ou `*Entity` é declarado fora de um pacote `internal`.

## Exemplo mínimo de interação

`audit.AuditFact` registra uma ação auditável e referencia `identity.ActorId`. O módulo `audit` depende de `identity` apenas pela sua API pública e declara essa dependência explicitamente.

## O módulo `platform`

O `platform` guarda o que todos os módulos compartilham na fronteira web e não depende de nenhum outro módulo: `ProblemException`, o tipo base de toda falha de domínio, que o tratador de erros único transforma em um problema RFC 9457 com um `code` estável e o `requestId`; `RequestId`, o identificador de correlação; e os tipos `Page`/`PageCursor` da paginação por cursor. Os módulos levantam falhas estendendo `ProblemException` e nunca montam um corpo de erro por conta própria. Veja [operações](../engineering/operations.md).
