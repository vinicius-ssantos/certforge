# ADR 0020: Modelar sessões de entrevista como um terceiro agregado de estudo

- Status: **Aceita**
- Data: 2026-10-23
- Issue: #21

## Contexto

Uma sessão de estudo é focada em tópico e corrigida objetivamente. Ela congela as revisões de um tópico, entrega o material da resposta depois de cada tentativa aceita e contribui com cada tentativa para o progresso do tópico na hora. Um simulado é um agregado separado, pelos motivos que a [ADR 0015](0015-separate-mock-exam-aggregate.md) estabeleceu: outro alcance, um prazo, nenhum material de resposta até a execução fechar, e um resultado que atravessa tópicos.

Uma sessão de entrevista é um terceiro conjunto de semânticas, e as diferenças não são de apresentação:

- ela cobre um **subconjunto de tópicos** escolhido pelo aluno ou por um blueprint, não um tópico e não uma prova inteira;
- ela mistura itens **objetivos e de resposta guiada** numa mesma sentada, e os dois não podem ser avaliados do mesmo jeito. Item objetivo está certo ou errado. Item guiado tem resposta de referência e os conceitos que um revisor esperava, e pela [ADR 0019](0019-behavioural-preparation-is-guidance-not-grading.md) **nada nele é pontuado**;
- ela expõe **perguntas de acompanhamento** depois da resposta principal, o que nenhum outro fluxo tem;
- ela não pode mover prontidão de certificação, porque se preparar para entrevista não é se preparar para prova.

O `QuestionBankReadService` já filtrava revisões de resposta guiada de todo fluxo de aluno, com um comentário citando esta issue: os fluxos atuais "só conhecem semântica de resposta objetiva", e deixar um conjunto vazio de alternativas cair na correção objetiva marcaria uma resposta livre como errada.

Havia três opções. Sobrecarregar a sessão de estudo com uma coluna de tipo e um subconjunto de tópicos nulável: isso põe três modelos de avaliação em um agregado e em uma projeção de progresso, que é o que a ADR 0015 já recusou uma vez. Reusar simulado: errado na direção oposta — simulado esconde tudo até fechar, e sessão de entrevista é o contrário, ela existe para conversar sobre a resposta na hora. Ou um terceiro agregado.

## Decisão

**Sessões de entrevista são um terceiro agregado dentro do módulo `study`**, ao lado das sessões comuns e das execuções de simulado. Elas compartilham revisões publicadas, identidades do catálogo, o relógio do servidor, autenticação e as convenções do módulo; têm persistência e contrato de resposta próprios.

1. **A sessão congela um conjunto ordenado de ids de revisão**, cada um com seu tópico e **com o tipo do item**, quando começa. Publicação, substituição ou depreciação posteriores nunca mudam uma sessão em andamento, e sessão concluída não pode ser reescrita por edição de conteúdo. O tipo faz parte do congelado justamente para que responder depois não dependa de ler a questão de novo.
2. **Um item é objetivo ou guiado, e o contrato diz qual.** Item objetivo é respondido e corrigido exatamente como numa sessão de estudo. Item guiado registra que foi respondido, com o texto do aluno ficando no navegador dele e nunca sendo enviado, e devolve o material revisado: resposta de referência, conceitos esperados, erros comuns. Não carrega **correção, nota nem contribuição a progresso**.
3. **As perguntas de acompanhamento pertencem à revisão** e só são devolvidas depois que a resposta principal daquele item é registrada. São conteúdo revisado, não gerado.
4. **Prática de entrevista não move prontidão de certificação.** Ela tem histórico próprio, e a projeção de progresso que responde "quão pronto estou para esta prova" não a lê.
5. **A privacidade do item objetivo não muda**: nada sobre a resposta de um item objetivo está disponível antes de a tentativa ser aceita, igual numa sessão de estudo.

## Consequências

A leitura segura-para-aluno de itens guiados teve de existir, o que é novo: até aqui todo fluxo de aluno os filtrava. O filtro continua para estudo, revisão e simulado, e a leitura de entrevista é o único lugar onde ele não se aplica.

Um terceiro agregado é um terceiro conjunto de tabelas, estados e testes, e o módulo cresce. A alternativa era um agregado cujo comportamento dependia de uma coluna de tipo, que é a forma que tornou a ADR 0015 necessária.

Nada aqui pontua resposta guiada, então sessão de entrevista não consegue dizer ao aluno como ele foi. Consegue dizer o que um revisor esperava, que é a versão honesta da mesma ajuda, e é o que a ADR 0019 decidiu.

Construir isto também encontrou dois primitivos onde cabia nulo: o `PublishedQuestion.javaRelease` estourava ao montar a view de uma questão de entrevista, que não tem release, e o `TrackView` do aluno não consegue representar trilha de entrevista nenhuma — ele nomeia uma prova, por construção. O primeiro virou nulável; o segundo ganhou uma leitura própria, `activeInterviewTrack`.
