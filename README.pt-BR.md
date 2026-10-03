# CertForge

[English](README.md) | **Português (Brasil)**

> Preparação adaptativa e verificável para certificações Java e entrevistas técnicas.

> Esta é uma tradução do [README em inglês](README.md), que é a fonte canônica. Em caso de divergência, vale a versão em inglês. Baseada no commit `c070ea6`.

O CertForge é uma plataforma de aprendizado open-source para engenheiros de software que buscam prática deliberada, conteúdo técnico revisado, progresso explicável e preparação baseada em evidências.

O primeiro escopo de produto comprometido continua sendo a preparação para certificações Java, começando pelo conteúdo do Oracle Java SE 21 Developer. A direção do produto agora também inclui preparação para entrevistas técnicas, mas esses recursos ficam explicitamente adiados até que o Study Core seja validado.

## Por que o CertForge existe

Aplicativos de quiz tradicionais geralmente medem apenas se o aluno selecionou a alternativa esperada. O CertForge pretende ir além: registrar o contexto de raciocínio em cada tentativa, identificar fraquezas recorrentes, agendar revisões direcionadas, oferecer questões técnicas mais ricas e, no futuro, validar trechos de código Java em um ambiente de execução isolado.

O produto é guiado por cinco princípios:

1. **Valor de aprendizado antes da quantidade de funcionalidades.** Toda release deve entregar uma capacidade de estudo utilizável.
2. **Conteúdo autoral e revisável.** Dumps de provas, questões vazadas e bancos de entrevista copiados não são aceitos.
3. **Correção determinística primeiro.** Compilação, execução, testes, respostas revisadas e critérios de avaliação explícitos têm precedência sobre julgamento gerado por IA.
4. **O progresso deve ser explicável.** Indicadores de prontidão devem derivar de evidências visíveis.
5. **Segurança é arquitetural.** A futura execução de código será isolada da aplicação principal e de seus dados.

## Estratégia de releases

| Release | Nome | Resultado para o usuário |
|---|---|---|
| `v0.1.0` | Study Core | Estudar questões curadas e acompanhar o progresso por tópico |
| `v0.2.0` | Adaptive Review | Revisitar erros por meio de uma fila de revisão que considera a confiança |
| `v0.3.0` | Mock Exams | Fazer simulados cronometrados e receber relatórios de pontos fracos |
| `v0.4.0` | Code Analysis | Praticar questões de compilação, execução e raciocínio sobre saída |
| `v0.5.0` | Secure Java Runner | Compilar e executar trechos de código em um serviço isolado |
| `v0.6.0` | Study Planner | Receber planos de estudo e previsões de prontidão baseados em evidências |
| `v0.7.0` | AI Study Assistant | Usar IA para explicações complementares e geração de prática |

Apenas a `v0.1.0` é escopo comprometido. As releases seguintes expressam direção de produto e podem mudar conforme evidências forem coletadas.

O Interview Prep é uma direção de produto futura e paralela. Não faz parte da `v0.1.0` e não está automaticamente atribuído a uma das releases numeradas acima. Seu desenho deve reaproveitar primitivas de estudo já comprovadas, sem enfraquecer a correção específica das certificações nem a disciplina de escopo.

## Direção inicial da arquitetura

O CertForge começa como um monolito modular com fronteiras de domínio claras:

- identidade e acesso;
- catálogo de preparação;
- banco de questões;
- sessões de estudo;
- tentativas e progresso;
- administração e fluxo editorial.

O primeiro perfil de catálogo é o de certificação Java. Futuras trilhas de entrevista poderão reutilizar as mesmas bases de tópicos e estudo, mantendo regras de avaliação próprias de entrevista.

A fonte da verdade inicial será o PostgreSQL. Um futuro runner Java será implantado como um serviço separado e restrito, sem receber credenciais diretas do banco de dados.

## Documentação

A documentação completa está disponível em português em [`docs-pt-br/`](docs-pt-br/README.md) e em inglês em [`docs/`](docs/product/vision.md), que é a fonte canônica:

- [Visão do produto](docs-pt-br/product/vision.md)
- [Escopo e não-objetivos](docs-pt-br/product/scope-and-non-goals.md)
- [Política de conteúdo](docs-pt-br/product/content-policy.md)
- [Direção do Interview Prep](docs-pt-br/product/interview-prep.md)
- [Roadmap de releases](docs-pt-br/roadmap/releases.md)
- [`v0.1.0` Study Core](docs-pt-br/roadmap/v0.1-study-core.md)
- [Visão geral da arquitetura](docs-pt-br/architecture/overview.md)
- [Modelo de domínio inicial](docs-pt-br/architecture/domain-model.md)
- [Identidade e acesso](docs-pt-br/architecture/identity-and-access.md)
- [Catálogo de preparação](docs-pt-br/architecture/preparation-catalog.md)
- [Banco de questões](docs-pt-br/architecture/question-bank.md)
- [Sessões de estudo](docs-pt-br/architecture/study-sessions.md)
- [Submissão de respostas](docs-pt-br/architecture/answer-submission.md)
- [Histórico e progresso](docs-pt-br/architecture/history-and-progress.md)
- [Criação e importação de conteúdo](docs-pt-br/engineering/content-authoring.md)
- [Operações e triagem de incidentes](docs-pt-br/engineering/operations.md)
- [Ambiente de release](docs-pt-br/engineering/release-environment.md)
- [Diretrizes da interface web](docs-pt-br/engineering/web-ui-guidelines.md)
- [Roteiros de demonstração da `v0.1.0`](docs-pt-br/release/demo-scripts.md)
- [Notas de release da `v0.1.0` (rascunho)](docs-pt-br/release/v0.1.0-release-notes.md)
- [Revisão de prontidão da `v0.1.0`](docs-pt-br/release/v0.1.0-readiness.md)
- [Segurança e modelo de ameaças](docs-pt-br/architecture/threat-model.md)
- [Decisões de arquitetura](docs-pt-br/adr/README.md)

## Status do projeto

**A `v0.2.0` Adaptive Review está lançada**, sobre a `v0.1.0` Study Core. O aluno agora é informado do que vale revisitar e por quê, não só do que já fez. O backend (Java 25, Spring Boot, PostgreSQL), o app web do aluno, a mesa editorial e o ambiente de release são testados de ponta a ponta no CI, o pacote inicial de questões passou pela [revisão técnica](content/java-se-21/review.json), e as passadas que uma máquina não faz — julgamento de acessibilidade, um passeio pelo produto, o texto dos objetivos do exame contra a página da Oracle — foram feitas em 2026-10-02. A [revisão de prontidão](docs-pt-br/release/v0.1.0-readiness.md) registra cada barreira, o que uma pessoa conferiu à mão, e a que isso não equivale: um revisor, que também é o autor. As [notas de release](docs-pt-br/release/v0.1.0-release-notes.md) listam as limitações conhecidas.

### Experimente

Você precisa do Docker e, para a forma curta, do [just](https://github.com/casey/just).

```sh
just demo          # constrói, sobe e publica dez questões de demonstração claramente identificadas
```

Ele fica em `http://localhost:8081`; entre como `admin@example.com` com `a long local password`. O `just` sozinho lista o resto: `just down`, `just logs app`, `just check`, `just verify`. No Windows as receitas rodam sob o Git Bash, que o `justfile` nomeia explicitamente porque o `bash` do PATH ali costuma ser o lançador do WSL, e uma distribuição WSL não tem Docker a menos que a integração esteja ligada.

Sem o `just`, a mesma coisa:

```sh
export DB_PASSWORD=local-only-password BOOTSTRAP_ADMIN_EMAIL=admin@example.com BOOTSTRAP_ADMIN_PASSWORD='a long local password'
docker compose -f compose.release.yaml up --build -d       # http://localhost:8081
node deploy/seed-demo.mjs                                   # as questões de demonstração
```

Essas questões de demonstração dizem no próprio texto que são dados de demonstração. Para o pacote real — vinte questões revisadas de Java SE 21 — dois comandos a mais o levam pelo fluxo editorial de verdade:

```sh
just reviewer reviewer@example.com 'uma senha longa'   # uma vez: a aprovação exige uma segunda conta
just publish-content reviewer@example.com 'uma senha longa'
```

Isso publica só o que a [revisão técnica](content/java-se-21/review.json) registrada ainda cobre, e segura o que foi editado depois; nunca inventa o revisor que registra. Os [roteiros de demonstração](docs-pt-br/release/demo-scripts.md) percorrem o produto inteiro. Para desenvolvimento, em vez de uma execução parecida com a de release, veja o [bootstrap do backend](docs-pt-br/engineering/backend-bootstrap.md) e o `web/README.md`; o build usa o wrapper do Maven (`./mvnw`), então não é preciso instalar o Maven.

## Contribuindo

O projeto está sendo estabelecido de forma incremental. Leia o [CONTRIBUTING.md](CONTRIBUTING.md) antes de propor mudanças. O conteúdo de aprendizado publicado deve seguir as regras de conteúdo autoral e revisão técnica definidas na política de conteúdo.

## Segurança

Não reporte vulnerabilidades de segurança por issues públicas. Siga o [SECURITY.md](SECURITY.md).

## Licença

Licenciado sob a Apache License 2.0.
