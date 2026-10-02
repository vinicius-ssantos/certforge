# ADR 0014: Manter um tópico em uma trilha só, e pôr os fundamentos na trilha de entrevista

> Tradução de [`docs/adr/0014-one-topic-one-track.md`](../../docs/adr/0014-one-topic-one-track.md). O inglês é a fonte canônica.

- Status: **Proposta.** Nada foi construído. Está escrita como recomendação com o raciocínio, para poder ser aceita, ou alterada e então aceita.
- Data: 2026-10-02

## Contexto

A pergunta que motivou isto: onde um aluno estuda estrutura de dados, SOLID e orientação a objetos? Não são objetivos de certificação, e também não são obviamente só de entrevista. Estudar `Queue` para uma prova, para uma entrevista e por si mesmo são três intenções sobre um mesmo assunto.

O que o modelo diz hoje, lido do esquema e não da memória:

- `catalog_topic.track_id` é `NOT NULL`, com `UNIQUE (track_id, slug)`. **Um tópico pertence a exatamente uma trilha.** Compartilhar entre trilhas não é possível sem mudar o esquema.
- `catalog_track.kind` tem `CHECK (kind IN ('CERTIFICATION'))`. A [ADR 0007](0007-generalize-preparation-catalog.md) diz que reserva `INTERVIEW`, mas o banco ainda não aceita, então **qualquer tipo novo de trilha exige uma migration**, não apenas uma linha.
- `catalog_certification_profile` é uma tabela à parte, com chave na trilha, então uma trilha sem versão de prova e sem objetivos já é estruturalmente possível.
- Os tópicos da trilha de certificação e o texto dos objetivos vêm dos objetivos publicados pela Oracle, comparados com a página dela em um navegador em 2026-10-02 (#68).

Esse último ponto já resolve metade da questão. **Acrescentar "Estrutura de dados" à trilha do Java SE 21 inventaria um objetivo que a Oracle não publica**, e o catálogo guarda um `objective_ref` por tópico justamente para cada um ser rastreável a uma fonte pública. A verificação que acabamos de fazer passaria a ser falsa.

## Decisão

**1. Um tópico continua pertencendo a exatamente uma trilha.** Tópicos não são compartilhados, e o esquema não muda para permitir isso.

O motivo é o progresso, que é a saída principal do produto. Progresso é por tópico. Se um tópico "Filas" fosse alcançável por uma trilha de certificação e por uma de entrevista, a acurácia do aluno nele significaria "para a prova" ou "para a entrevista" conforme as questões que ele por acaso recebesse. Um tópico que significa duas coisas não produz um número explicável, e o princípio 4 é que o progresso seja explicável.

**2. Estrutura de dados, algoritmos, SOLID, padrões de projeto e orientação a objetos pertencem à trilha de entrevista.** SOLID e padrões já estão na [taxonomia de entrevista](../product/interview-prep.md). Estrutura de dados e algoritmos não estão, e isso é lacuna e não exclusão deliberada: a taxonomia vai de "Collections and generics" direto para design, e a única ocorrência da palavra *queue* nela é sobre mensageria.

**3. Nenhum tipo de trilha `FOUNDATION` agora.** Uma trilha é um **alvo** de preparação: algo com uma avaliação por trás, para o qual o aluno se prepara. Um corpo de conhecimento não é um alvo, e uma trilha sem perfil, sem versão e sem objetivos seria outra forma usando o mesmo nome.

**4. A consequência é declarada, não escondida**: até existir uma trilha de entrevista, não há no CertForge onde estudar SOLID ou estrutura de dados. Isso é uma limitação real do produto, e a resposta honesta é dizer isso, não enfiar os tópicos numa trilha de certificação onde eles não cabem.

## Consequências

- A trilha de entrevista (#17, #18) vira a casa de um corpo de material maior do que o nome sugere, o que é um problema de nome a revisitar quando ela for construída. "Entrevista" descreve a ocasião, não o assunto.
- Alguns assuntos vão existir legitimamente duas vezes, uma por trilha, quando um objetivo de certificação e um tópico de entrevista cobrirem de fato o mesmo terreno — `Collections` é o caso óbvio. Dois tópicos com progressos separados é o resultado pretendido, não duplicação a eliminar: progresso rumo a uma prova e preparo para uma entrevista são afirmações diferentes.
- Questões, porém, não devem ser escritas duas vezes. Como uma questão pode ser oferecida sob mais de um tópico sem duplicar o texto nem a revisão está em aberto e pertence à #18, que já lista "definir como um tópico pode ser compartilhado entre trilhas sem compartilhar acidentalmente a posse do ciclo de vida".
- Se um dia quiserem uma trilha de fundamentos, é esta ADR que ela substitui, e o custo fica explícito: uma migration alargando o `CHECK` do `kind`, uma trilha sem perfil de certificação, e uma resposta para a ambiguidade de progresso acima.

## Alternativas rejeitadas

- **Acrescentar os tópicos à trilha de certificação do Java SE 21.** Inventaria objetivos que a Oracle não publica e falsificaria a verificação de objetivos registrada na #68. A lista de tópicos daquela trilha não é nossa para estender.
- **Compartilhar um tópico entre trilhas.** Torna o progresso por tópico ambíguo, que é justamente o número que este produto teve o cuidado de manter com significado.
- **Um terceiro tipo `FOUNDATION` agora.** Possível, e não obviamente errado, mas acrescenta uma forma de trilha sem avaliação antes de alguém ter pedido para estudar sem objetivo. A decisão pode ser tomada depois, com evidência; tomá-la agora custa uma migration e um precedente.
- **Esperar a trilha de entrevista para decidir.** A lacuna na taxonomia é real hoje e seria descoberta durante a autoria de conteúdo, que é o momento mais caro para descobri-la.
