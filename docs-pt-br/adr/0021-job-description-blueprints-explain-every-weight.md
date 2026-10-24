# ADR 0021: Pesar uma descrição de vaga com um dicionário revisado, e explicar cada peso

- Status: **Aceita**
- Data: 2026-10-24
- Issue: #22

## Contexto

Quem se prepara para uma vaga específica não quer a taxonomia inteira de forma uniforme. O anúncio na tela cita Kafka quatro vezes e nunca menciona concorrência, e a preparação deveria acompanhar isso. A #22 pede que uma descrição de vaga se torne preparação ponderada.

A implementação óbvia é entregar o anúncio a um modelo e deixar que ele devolva os pesos. A #22 descarta isso em uma linha — ponderação opaca só por IA fica adiada — e as [ADR 0005](0005-ai-assisted-authoring-human-verified.md) e [ADR 0011](0011-grade-content-evidence.md) dizem por quê de forma geral: neste produto uma IA nunca é a fonte da correção técnica, e uma afirmação que ninguém consegue checar não é evidência. Um peso é uma afirmação. "Estude concorrência mais do que persistência" é um conselho sobre onde alguém vai gastar uma semana da própria vida, e se a única resposta para *por quê* é que um modelo disse, o aluno não tem como discordar, porque não há nada de que discordar.

Há uma segunda armadilha. A taxonomia já carrega pesos — a `V14` os semeia numa escala de 1 a 5, como julgamento editorial sobre o que uma triagem Pleno/Sênior cobra. Um blueprint que escrevesse nessas linhas deixaria o anúncio de um aluno reescrever a taxonomia de todos, e o próximo aluno herdaria um julgamento que nunca foi editorial.

## Decisão

**Um blueprint é a leitura que um aluno faz de uma vaga, pesando a taxonomia canônica sem alterá-la, e cada peso que ele carrega pode ser explicado por uma palavra da descrição.**

1. **O mapeamento é um dicionário revisado**, `interview/job-description-terms.json`: termos por tópico, casados sem distinção de caixa e em limite de palavra. É conteúdo, revisado como conteúdo. Acrescentar "WebFlux" a Spring é uma mudança editorial com diff, não a opinião de um modelo.
2. **O peso é uma contagem**: um ponto por termo distinto daquele tópico encontrado na descrição, limitado a 5, a escala que a própria taxonomia usa. Deliberadamente a regra mais sem graça que funcionaria. Qualquer coisa mais esperta — pesar por ênfase, por posição, por quão sênior o anúncio soa — seria um julgamento que o aluno não consegue checar.
3. **Os termos ficam guardados com o blueprint**, e com o lugar onde cada um foi lido: a descrição ou um requisito que o aluno listou. "Por que Mensageria está com peso três?" se responde com três palavras.
4. **Um requisito que ninguém reconhece é devolvido nomeado, não adivinhado.** O dicionário nunca ouviu falar de um framework interno da empresa, e dizer isso é mais útil do que descartá-lo em silêncio ou mapeá-lo para o tópico de nome mais parecido.
5. **O aluno pode sobrepor qualquer peso, e o registro diz que foi ele.** Um tópico sobreposto é gravado como `LEARNER`, nunca como algo que a descrição disse, e mantém os termos que foram de fato encontrados — o que mudou é o peso, não os fatos.
6. **Um blueprint nunca escreve na taxonomia.** Ele referencia ids de tópico e carrega os próprios pesos, e é recusado de saída se aplicado a uma taxonomia diferente daquela para a qual foi construído.
7. **Um blueprint não diz nada sobre o aluno.** Nenhum fit, nenhuma prontidão para a vaga, nenhuma probabilidade de proposta, nenhuma experiência inferida. Ele pesa tópicos; não avalia pessoas.

## Consequências

O dicionário passa a ser um ativo mantido: uma vaga que usa vocabulário que ele não contém recebe um blueprint mais magro, de forma visível, com os requisitos não casados listados. Esse é o modo de falha que queremos — ele é legível, e diz ao mantenedor exatamente qual termo acrescentar.

A ponderação é mais grosseira do que a de um modelo seria. Ela não distingue "domínio profundo de Kafka é essencial" de "Kafka é um diferencial", e nunca vai notar uma habilidade para a qual o dicionário não tem palavra. A troca é deliberada: o aluno consegue ler a regra inteira em uma frase, discordar dela e sobrepô-la.

Manter os pesos do blueprint fora de `catalog_track_version_topic` obriga a sessão a combinar duas fontes — os tópicos da taxonomia e os pesos do blueprint — no momento em que sorteia suas perguntas. É aonde o peso tem de chegar, e um teste sorteia cinco sessões seguidas para provar que chega: um único sorteio de duas perguntas num conjunto de quatro sairia certo uma vez em seis só por acaso.

Esta ADR não fecha a porta para um modelo. Ela fixa onde um modelo pode estar: propondo termos para o dicionário, que então um humano revisa, exatamente como a [ADR 0005](0005-ai-assisted-authoring-human-verified.md) trata a autoria de conteúdo. O que ela proíbe é um modelo entregar ao aluno um número sem nada por trás.

## Alternativas rejeitadas

**Deixar um modelo pesar a descrição direto.** Adiado pela #22, e é justamente o que as ADR 0005 e 0011 existem para evitar. Também seria irreprodutível: o mesmo anúncio duas vezes daria dois planos, e o aluno não saberia qual estava errado.

**Escrever os pesos na versão da taxonomia.** O anúncio de um aluno viraria o currículo de todos, e a escala editorial da `V14` deixaria de significar algo.

**Casar por embeddings em vez de termos.** Melhor cobertura, nenhuma explicação. "Por que isso está com peso quatro" seria respondido com uma distância de cosseno, que é a ponderação opaca com outro nome.

**Dispensar pesos e só incluir ou excluir tópicos.** Mais simples, e perde o que o aluno pediu: um anúncio que cita Kafka quatro vezes e Spring uma quer mais Kafka, não os dois igualmente.
