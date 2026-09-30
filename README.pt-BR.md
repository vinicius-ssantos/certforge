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
- [Segurança e modelo de ameaças](docs-pt-br/architecture/threat-model.md)
- [Decisões de arquitetura](docs-pt-br/adr/README.md)

## Status do projeto

**Fase de fundação — somente documentação.**

Nenhum código de aplicação deve ser introduzido até que o escopo da `v0.1.0`, a linguagem de domínio, a política editorial e as decisões arquiteturais iniciais sejam revisados e aceitos.

## Contribuindo

O projeto está sendo estabelecido de forma incremental. Leia o [CONTRIBUTING.md](CONTRIBUTING.md) antes de propor mudanças. O conteúdo de aprendizado publicado deve seguir as regras de conteúdo autoral e revisão técnica definidas na política de conteúdo.

## Segurança

Não reporte vulnerabilidades de segurança por issues públicas. Siga o [SECURITY.md](SECURITY.md).

## Licença

Licenciado sob a Apache License 2.0.
