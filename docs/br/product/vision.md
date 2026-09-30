# Visão do Produto

> Tradução de [`docs/product/vision.md`](../../product/vision.md). O inglês é a fonte canônica.

## Declaração de visão

O CertForge é uma plataforma de aprendizado técnico adaptativa e verificável, que ajuda engenheiros de software a se prepararem para certificações profissionais e entrevistas técnicas por meio de prática deliberada, conteúdo autoral, evidências transparentes de progresso e validação técnica determinística.

## Público inicial

O primeiro usuário é um desenvolvedor Java em atividade que se prepara para a certificação Oracle Java SE 21 Developer enquanto fortalece seu conhecimento prático de Java. A primeira release comprometida atende somente a essa jornada de certificação.

Um público posterior é o engenheiro de software que se prepara para entrevistas técnicas, começando por vagas de backend Java. A preparação para entrevistas deve se apoiar em capacidades de estudo já comprovadas, em vez de criar um produto de quiz separado e desconectado.

## Problema

A preparação técnica é fragmentada entre livros, bancos de questões isolados, anotações informais, listas de entrevista, vídeos e ferramentas genéricas de quiz. Os alunos muitas vezes não conseguem distinguir domínio genuíno de memorização, acertos por sorte ou exposição repetida às mesmas questões. As áreas fracas são identificadas tarde, a qualidade das explicações varia e as métricas de progresso costumam ser superficiais.

A preparação para entrevistas introduz um problema adicional: muitas questões valiosas não são itens binários de certo ou errado. Uma boa resposta pode precisar mencionar conceitos esperados, trade-offs, raciocínio de acompanhamento e profundidade adequada à senioridade, sem fingir que respostas subjetivas têm uma única nota mágica.

## Promessa do produto

O CertForge ajudará o aluno a responder quatro perguntas:

1. O que devo estudar agora?
2. Por que minha resposta estava correta, incompleta ou incorreta?
3. Quais conceitos causam erros ou explicações fracas de forma recorrente?
4. Que evidências mostram que estou ficando pronto para o meu alvo?

Na preparação para certificação, o alvo é uma prova definida. Na preparação para entrevistas, o alvo pode ser um perfil de cargo ou uma descrição de vaga específica.

## Diferenciais

- Questões autorais com revisão técnica versionada.
- Histórico de tentativas que preserva o contexto de confiança e de tempo.
- Progresso por tópico baseado em evidências, em vez de uma única porcentagem opaca.
- Revisão espaçada e direcionada de conceitos fracos.
- Avaliações simuladas construídas a partir de blueprints controlados.
- Futuras questões de entrevista com resposta guiada, com conceitos esperados, respostas de referência, erros comuns e perguntas de acompanhamento explícitos.
- Futuras trilhas de entrevista específicas por vaga, derivadas de requisitos explícitos da vaga.
- Futura compilação e execução determinística de trechos de código Java.
- IA usada como camada de apoio, nunca como fonte inquestionável de correção.

## Princípios do produto

- Entregar uma capacidade demonstrável ao aluno por release.
- Preferir um fluxo pequeno e confiável a uma funcionalidade ampla e incompleta.
- Manter as explicações rastreáveis a fontes autoritativas.
- Tornar os cálculos de progresso interpretáveis.
- Manter a correção objetiva separada da avaliação qualitativa guiada.
- Projetar pensando em acessibilidade, privacidade e segurança desde o início.
- Deixar o uso real de estudo orientar as decisões posteriores do roadmap.

## Direção de longo prazo

O CertForge poderá oferecer suporte a outras versões do Java, a outras certificações técnicas e a trilhas de preparação para entrevistas, como Java Backend, Spring, System Design, AWS e Kubernetes.

O catálogo poderá representar diferentes tipos de trilha de preparação, mantendo metadados e regras específicos de cada perfil. A expansão não pode reduzir a qualidade da trilha inicial de certificação Java, enfraquecer a revisão de conteúdo nem introduzir abstrações sem necessidade demonstrada.
