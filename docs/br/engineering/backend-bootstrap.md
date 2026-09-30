# Bootstrap do Backend

> Tradução de [`docs/engineering/backend-bootstrap.md`](../../engineering/backend-bootstrap.md). O inglês é a fonte canônica. As versões e os comandos abaixo refletem o commit `71ccf99` e podem ficar desatualizados; consulte o original.

Issue: #3 — Bootstrap da plataforma de backend e dos quality gates de CI

## Baseline selecionado

O bootstrap prefere as versões estáveis mais recentes com um runtime Java LTS e delega as versões de dependências transitivas ao Spring Boot sempre que possível.

| Componente | Baseline selecionado | Política |
|---|---:|---|
| Java | 25 LTS | Baseline de compilação/runtime do projeto |
| Spring Boot | 4.1.1 | Plataforma de aplicação estável |
| Spring Modulith | 2.1.1 | Versão selecionada agora; a implementação dos módulos pertence à #4 |
| Maven | 3.9.16 recomendado | Os builds exigem Maven 3.9.x |
| Servidor PostgreSQL | 18.6 | Imagem de banco de dados local/Testcontainers |
| Flyway | 12.4.0 | Gerenciado pelo Spring Boot 4.1.1 |
| JDBC do PostgreSQL | 42.7.13 | Gerenciado pelo Spring Boot 4.1.1 |
| Testcontainers | 2.0.5 | Gerenciado pelo Spring Boot 4.1.1 |

O Spring Boot 4.1.1 suporta versões do Java até o Java 26, então o Java 25 oferece um baseline LTS atual sem adotar um JDK de preview.

O Spring Modulith tem a versão gerenciada por dependência, mas nenhum módulo de aplicação é introduzido na #3. Os módulos arquiteturais e sua verificação pertencem à #4.

O Flyway 12.x modulariza o suporte a bancos de dados. Por isso, o PostgreSQL exige o módulo `org.flywaydb:flyway-database-postgresql`, gerenciado pelo Boot, além do `spring-boot-starter-flyway`. Ambos permanecem no baseline do Flyway 12.4.0 gerenciado pelo Spring Boot 4.1.1.

## Pré-requisitos locais

- JDK 25
- Maven 3.9.x (3.9.16 recomendado)
- Docker com suporte a Compose

Nenhuma credencial de produção é necessária para o desenvolvimento local.

## Build

Um checkout limpo é verificado com:

```bash
mvn verify
```

O ciclo de vida `verify` executa:

- verificações de consistência de toolchain/dependências do Maven Enforcer;
- testes unitários;
- testes de integração por meio do Maven Failsafe;
- integração com PostgreSQL por meio de infraestrutura descartável do Testcontainers;
- validação das migrações do Flyway por meio da inicialização da aplicação;
- verificações de formatação do Spotless;
- análise estática do PMD.

Para aplicar a formatação Java antes da verificação:

```bash
mvn spotless:apply
```

## Executar localmente

Inicie o PostgreSQL:

```bash
docker compose up -d postgres
```

Inicie o CertForge:

```bash
mvn spring-boot:run
```

A conexão padrão com o banco de dados local é:

- banco: `certforge`
- usuário: `certforge`
- senha: `certforge`
- porta: `5432`

Esses padrões servem apenas para uso local e podem ser sobrescritos com `DB_URL`, `DB_USER` e `DB_PASSWORD`.

A saúde da aplicação é exposta em:

```text
GET /actuator/health
```

Somente os endpoints `health` e `info` do actuator são expostos via HTTP.

## Bootstrap do banco de dados

O Flyway é dono da evolução do schema desde o primeiro commit. A migração inicial cria apenas o schema técnico `certforge`. Ela deliberadamente não introduz nenhuma tabela de produto/domínio.

Os testes de integração iniciam o PostgreSQL 18.6 usando Testcontainers e verificam que o Flyway registra a migração com sucesso a partir de um banco de dados vazio.

## Política de dependências

- O Spring Boot gerencia as versões suportadas do seu ecossistema de dependências.
- O Spring Modulith usa o seu BOM.
- O Dependabot verifica semanalmente as dependências do Maven e do GitHub Actions.
- Dependências snapshot não fazem parte do bootstrap.
- Atualizações de versão que alterem a compatibilidade da plataforma exigem uma revisão documentada.
- Os módulos do Flyway específicos de banco de dados devem permanecer alinhados com a versão do Flyway gerenciada pelo Boot.
- Atualizações de versão maior do banco de dados devem ser validadas contra a stack de migração gerenciada antes de serem adotadas.

## Adiado da #3

- módulos de domínio e imposição da arquitetura (#4);
- autenticação (#5);
- catálogo de preparação/tabelas de domínio (#6);
- frontend;
- Kafka ou outra mensageria externa;
- Redis;
- Kubernetes;
- deploy em produção;
- runner de código Java.

## Fontes de referência verificadas no bootstrap

- Referência e gerenciamento de dependências do Spring Boot 4.1.1
- Referência/release train do Spring Modulith 2.1.1
- Anúncio do Oracle Java 25 LTS
- Histórico de releases do Apache Maven 3.9.16
- Linha de releases suportadas do PostgreSQL
