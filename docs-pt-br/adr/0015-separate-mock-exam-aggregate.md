# ADR 0015: Modelar simulados como um agregado de estudo separado

> Tradução de [`docs/adr/0015-separate-mock-exam-aggregate.md`](../../docs/adr/0015-separate-mock-exam-aggregate.md). O inglês é a fonte canônica.

- Status: **Aceita**
- Data: 2026-10-02
- Issue: #97

## Contexto

O agregado já publicado de sessão de estudo é intencionalmente focado em um tópico. Ele tira snapshot das revisões de um único tópico, devolve o material do gabarito depois de cada tentativa aceita e faz cada tentativa aceita contribuir imediatamente para o progresso do tópico.

Um simulado de certificação tem semântica diferente. Ele atravessa o exame inteiro, tem prazo fixo, precisa manter todo o material de resposta oculto até o encerramento, conta questões sem resposta como erros e precisa de um único resultado final entre tópicos.

Essas diferenças não são detalhes de apresentação. Reutilizar sessões comuns e apenas esconder o feedback no React deixaria a API atual de tentativas capaz de revelar o gabarito antes do final do simulado. Reutilizar tentativas comuns também mudaria o significado da projeção de progresso atual sem uma decisão explícita de produto.

## Decisão

**Simulados são um agregado separado dentro do módulo `study`.**

Eles compartilham revisões publicadas, identidades do catálogo, relógio do servidor, autenticação e convenções de infraestrutura com as sessões normais, mas têm persistência e contratos de resposta separados.

Um simulado ativo guarda um snapshot ordenado e imutável de ids de revisão e ids de tópico. As respostas submetidas são evidência imutável e idempotente. O servidor impõe o `expiresAt`.

Enquanto o simulado está ativo, a submissão devolve somente um recibo. Correção, alternativas corretas, explicações e referências só ficam disponíveis depois que o agregado entra em estado terminal.

O formato específico do exame vem de um blueprint explícito indexado pelo código do exame. O primeiro blueprint aceito é `1Z0-830`: 50 questões, 120 minutos, meta de prática de 68% e cinco questões de cada um dos dez tópicos atuais de primeiro nível. A alocação uniforme por tópico é uma escolha de prática do CertForge, não uma afirmação sobre a ponderação dos objetivos da Oracle.

A evidência do simulado não alimenta a projeção normal `progress_topic` na primeira implementação.

## Consequências

- Ocultar feedback passa a ser uma garantia da API em vez de depender do comportamento do navegador.
- A semântica e o histórico da prática normal permanecem estáveis.
- O resultado do simulado pode usar a quantidade total de questões como denominador, representando corretamente as não respondidas.
- Trocas futuras de conteúdo não alteram um simulado já iniciado, porque os ids das revisões ficam no snapshot.
- Cada novo exame de certificação precisa declarar um blueprint antes de ganhar modo de simulado.
- Há alguma duplicação de ciclo de vida e persistência dentro de `study`. Esse custo é aceito para manter explícitos os dois contratos de evidência.
- Se a evidência do simulado passar a contribuir para a revisão adaptativa, essa relação exigirá uma regra documentada própria.

## Alternativas rejeitadas

- **Encadear uma sessão normal por tópico.** O endpoint comum de tentativa revela a resposta imediatamente e cada sessão tem seu próprio ciclo; o pacote resultante não é uma prova cronometrada única.
- **Adicionar um modo prova somente no front-end.** Muda a apresentação, mas não impede o aluno de ler dados de resposta já devolvidos pela API.
- **Generalizar imediatamente as tabelas existentes de sessão e tentativa.** Os dois fluxos têm invariantes e semântica de progresso diferentes. Um agregado polimórfico obrigaria todas as consultas atuais a carregar ramificações de modo antes de haver evidência de que a abstração compartilhada é mais simples.
- **Contar respostas do simulado como tentativas normais desde o primeiro dia.** Isso mudaria progresso e os futuros insumos da revisão adaptativa sem uma interpretação definida para evidência de modo prova.
