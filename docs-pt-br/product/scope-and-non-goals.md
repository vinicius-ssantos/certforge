# Escopo e Não-objetivos

> Tradução de [`docs/product/scope-and-non-goals.md`](../../docs/product/scope-and-non-goals.md). O inglês é a fonte canônica.

## Escopo comprometido: `v0.1.0` Study Core

A primeira release deve permitir que um aluno:

- se autentique e mantenha um perfil de estudo individual;
- navegue pela trilha inicial de certificação Java e seus tópicos;
- inicie uma sessão de estudo focada em um tópico;
- responda questões autorais de escolha única e de múltipla escolha;
- veja a resposta revisada e a explicação após a submissão;
- registre o resultado da tentativa, as alternativas selecionadas, o tempo decorrido e a confiança declarada;
- consulte o histórico de sessões;
- veja o progresso básico por tópico;
- permita que um editor de conteúdo autorizado gerencie questões em rascunho e publicadas;
- preserve a revisão exata da questão publicada usada por uma tentativa.

A implementação pode usar a terminologia de trilha de preparação no catálogo quando isso não for mais complexo do que a terminologia específica de certificação, mas nenhum comportamento de entrevista é exigido pela `v0.1.0`.

## Escopo operacional obrigatório

- As migrações do PostgreSQL são versionadas e repetíveis em ambientes de teste.
- As operações administrativas são autorizadas e auditáveis.
- Os erros de API usam respostas de problema estáveis e sem dados sensíveis.
- Existem logs, health checks, métricas e traces relevantes.
- Testes automatizados cobrem as regras críticas de domínio e as fronteiras de persistência.
- Os principais fluxos do aluno atendem aos requisitos básicos de acessibilidade.

## Não-objetivos explícitos da `v0.1.0`

- Fluxos de preparação para entrevistas técnicas.
- Ingestão de descrições de vaga ou planos de estudo específicos para uma vaga.
- Avaliação de entrevistas com resposta livre ou guiada.
- Respostas geradas ou corrigidas por IA.
- Compilação ou execução de código Java submetido.
- Simulados completos cronometrados.
- Agendamento de repetição espaçada.
- Planos de estudo personalizados ou previsões de prontidão.
- Aplicativos móveis.
- Login social.
- Pagamentos, assinaturas, anúncios ou monetização.
- Publicação de questões pela comunidade.
- Rankings, leaderboards competitivos, pressão por streaks ou gamificação avançada.
- Trilhas de certificação além da trilha Java inicial.
- Microsserviços, Kafka, Kubernetes ou caches distribuídos sem necessidade demonstrada.

## Fronteira compatível com o futuro

O Interview Prep é uma direção futura documentada. A arquitetura inicial pode preservar conceitos reutilizáveis, como trilha de preparação, tópico, revisão de questão, sessão de estudo, evidência de tentativa e projeção de progresso, mas não deve implementar prematuramente comportamento exclusivo de entrevista.

Conceitos específicos de certificação, como versão da prova, provedor, mapeamento de objetivos e correção exata da resposta, permanecem explícitos e não devem ser diluídos em campos genéricos.

## Regra de controle de escopo

Uma funcionalidade que não seja necessária para completar a jornada do aluno documentada para a `v0.1.0` fica adiada, a menos que resolva um bloqueio de segurança, legal, de acessibilidade, de integridade de dados ou operacional.
