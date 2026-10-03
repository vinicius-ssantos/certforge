# Simulados

> Tradução de [`docs/architecture/mock-exams.md`](../../docs/architecture/mock-exams.md). O inglês é a fonte canônica.

Issue: #97 — construir um modo de simulado cronometrado da 1Z0-830 sem enfraquecer as garantias das sessões normais de estudo.

## Por que este é um modo separado

A prática por tópico entrega feedback depois de cada resposta aceita. Um simulado precisa manter o gabarito oculto até o encerramento, preservar um conjunto e uma ordem fixos de questões, impor um prazo pelo servidor e contar questões sem resposta como erros no resultado final.

Encadear sessões normais quebraria essa garantia: o endpoint comum de tentativa devolve correção, explicações e referências imediatamente. Por isso o simulado é um agregado de estudo separado. Ele reutiliza catálogo e revisões publicadas, mas não o contrato de resposta da tentativa comum.

## Blueprint inicial da 1Z0-830

| Propriedade | Blueprint de prática |
|---|---:|
| Código | `1Z0-830` |
| Questões | 50 |
| Limite | 120 minutos |
| Meta de aprovação de prática | 68% |
| Tópicos de primeiro nível | 10 |
| Questões por tópico | 5 |
| Acertos necessários nessa meta | 34 |

> **De onde vêm os três primeiros números não foi verificado.** A quantidade de questões, o limite de tempo e a meta de aprovação descrevem a prova da Oracle, não uma escolha do CertForge, e nada neste repositório registra uma fonte para eles nem uma data em que alguém os conferiu. Eles são apresentados ao aluno como a forma da prova real, e quem treina numa rodada de 50 questões em 120 minutos calibra o ritmo por ela — então errar aqui engana ativamente, não em silêncio.
>
> É a mesma lacuna que o texto dos objetivos tinha antes da #68, e é rastreada do mesmo jeito. Até ser conferido com a página de prova da Oracle em um navegador, trate os três como não verificados.

Os valores ficam em `MockExamBlueprintCatalog`. Uma futura versão de exame precisa aderir explicitamente; ela nunca herda duração ou distribuição de outra prova por acidente.

A distribuição uniforme de cinco questões por tópico é um blueprint de prática do CertForge. Ela dá exposição significativa a cada objetivo publicado e não é apresentada como ponderação oficial da Oracle.

## Fundação implementada nesta etapa

`MockExamPlanner` resolve a trilha ativa, exige um blueprint explícito para a versão ativa do exame e lê somente questões publicadas seguras para o aluno pelo `QuestionBank`.

Para cada tópico de primeiro nível ele:

1. exige ao menos a quantidade configurada de questões publicadas;
2. escolhe essa quantidade de questões distintas usando o `RandomGenerator` imprevisível do servidor;
3. registra o tópico junto de cada revisão selecionada;
4. rejeita uma revisão duplicada entre tópicos como falha interna de integridade;
5. embaralha o conjunto combinado para não expor blocos de tópico ao aluno.

O planner falha em vez de encurtar ou rebalancear silenciosamente o simulado. Nos testes, um gerador com seed torna seleção e ordem reproduzíveis.

O pacote autoral atual do Java SE 21 contém 15 questões por tópico, mas a maior parte das adições posteriores ainda aguarda revisão técnica. O simulado só poderá iniciar quando houver questões publicadas suficientes em todos os tópicos.

## Contrato de persistência da próxima etapa

O agregado persistido conterá ids do aluno, trilha e versão do exame; status; os valores do blueprint usados naquela execução; `createdAt`, `expiresAt` fixo e `closedAt`; snapshot ordenado e imutável de `(position, topicId, revisionId)`; e uma resposta submetida e imutável por posição.

Um simulado iniciado nunca ganha questões publicadas depois e nunca troca uma revisão depreciada. A revisão exata vista pelo aluno continua recuperável para a revisão pós-prova.

## Regra da API para feedback adiado

Enquanto o simulado estiver `IN_PROGRESS`, nenhum endpoint pode devolver correção, alternativas corretas, flags de correção, explicações ou referências. Enviar uma resposta devolve apenas um recibo confirmando a seleção armazenada. O material detalhado do gabarito só fica legível depois de `COMPLETED` ou `EXPIRED`.

Isso é regra de servidor, não convenção de front-end.

## Tempo e pontuação

O navegador mostrará a contagem regressiva, mas o servidor é dono do prazo. Depois de `expiresAt`, respostas posteriores são rejeitadas e a execução expira de forma preguiçosa, como nas sessões normais.

O denominador do resultado final é a quantidade total do blueprint, não a quantidade respondida. O resultado terá total, respondidas e acertos; percentual; se a meta de prática foi atingida; duração; detalhamento por tópico; e revisão detalhada depois do encerramento.

Um resultado de simulado descreve aquela execução. Ele não é previsão de prontidão nem probabilidade de aprovação na prova real.

## Relação com o progresso normal

As respostas do simulado ficam inicialmente separadas das tentativas da prática por tópico. Misturá-las na projeção de progresso atual mudaria silenciosamente o significado de `attempted`, `correct` e da evidência baseada em confiança.

## Entregas restantes

1. Persistir o agregado do simulado e a evidência imutável das respostas.
2. Criar endpoints de iniciar/retomar/responder/finalizar/resultado com submissão idempotente.
3. Criar o fluxo web: cronômetro, navegação, marcação para revisar e confirmação de envio.
4. Criar telas de resultado e histórico com detalhamento por tópico e explicações após o fechamento.
5. Medir o fluxo e acrescentar testes operacionais/de contrato antes da release.
