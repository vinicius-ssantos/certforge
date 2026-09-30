# ADR 0007: Generalizar o catálogo de preparação sem generalizar o comportamento da v0.1

> Tradução de [`docs/adr/0007-generalize-preparation-catalog.md`](../../adr/0007-generalize-preparation-catalog.md). O inglês é a fonte canônica.

## Status

Aceita

## Contexto

O CertForge foi fundado em torno da preparação para certificações Java. Antes do início da implementação, surgiu uma segunda direção de produto plausível: a preparação para entrevistas técnicas de engenheiros de software, começando por vagas de backend Java.

As primitivas de aprendizado existentes — catálogo de tópicos, revisões de questões revisadas, sessões de estudo, tentativas, confiança, progresso e revisão adaptativa — podem plausivelmente atender aos dois casos de uso.

No entanto, preparação para certificação e preparação para entrevista não são idênticas:

- certificações têm provedores, versões de prova, objetivos e expectativas de resposta determinísticas;
- entrevistas podem envolver cargos, senioridade, descrições de vaga, raciocínio sobre trade-offs e respostas guiadas, sem uma única resposta correta binária.

Se `CertificationTrack` virar a raiz permanente do catálogo, o suporte posterior a entrevistas pode exigir nomes artificiais ou migração. Se todo o domínio for generalizado agora, a primeira release corre o risco de abstração desnecessária e de crescimento de escopo.

## Decisão

Generalizar apenas a raiz do catálogo e a identidade estável dos tópicos antes da implementação:

- usar `PreparationTrack` como alvo de preparação raiz;
- introduzir `TrackKind`, suportando inicialmente `CERTIFICATION` e reservando `INTERVIEW`;
- usar identidades estáveis de `Topic` sob uma trilha de preparação;
- manter os metadados específicos de certificação explícitos, por meio de um modelo de perfil de certificação/versão de prova;
- manter o comportamento comprometido da `v0.1.0` exclusivamente orientado a certificação;
- não implementar persistência, APIs, tipos de questão, avaliação nem UI específicos de entrevista na `v0.1.0`.

A semântica de questões e tentativas permanece objetiva na primeira release. Futuras respostas guiadas de entrevista exigem contratos explícitos, em vez de sobrecarregar a noção de correção das certificações.

## Consequências

### Positivas

- O catálogo central não equipara permanentemente toda preparação a certificação.
- Os conceitos de tópico, sessão, tentativa e progresso podem ser reutilizados onde as evidências justificarem.
- As regras específicas de certificação permanecem visíveis e aplicáveis.
- O Interview Prep pode ser adicionado depois sem renomear o conceito de catálogo de nível mais alto.
- A primeira release não ganha comportamento específico de entrevista.

### Negativas

- A terminologia inicial é um pouco mais abstrata do que a de um produto exclusivo de certificação.
- A linguagem de issues e documentação precisa distinguir conceitos genéricos do catálogo de perfis específicos de certificação.
- A implementação deve resistir a adicionar campos `INTERVIEW` sem uso só porque o valor do enum existe.

## Alternativas rejeitadas

### Manter `CertificationTrack` permanentemente

Rejeitada porque um segundo modo de preparação concreto já foi identificado antes de existir código, o que torna evitável o custo da renomeação agora.

### Generalizar todo o domínio antes da v0.1

Rejeitada porque respostas guiadas, direcionamento por vaga, metadados de senioridade e avaliação de entrevista não são necessários para provar o Study Core.

### Construir o Interview Prep como um produto separado

Rejeitada por ora porque o fluxo de aprendizado e o modelo de evidências se sobrepõem de forma substancial. A separação pode ser reconsiderada se a implementação ou o uso real mostrarem necessidades de domínio incompatíveis.

## Orientação de implementação

A issue #6 deve implementar a generalização estreita do catálogo, expondo apenas a jornada de certificação Java exigida pela `v0.1.0`.

Capacidades específicas de entrevista pertencem a um backlog futuro separado e não devem se tornar critérios de aceitação ocultos da primeira release.
