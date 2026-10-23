# ADR 0019: Preparação comportamental é orientação revisada, e nada nela é pontuado

- Status: **Aceita**
- Data: 2026-10-23
- Issue: #159

## Contexto

Dois documentos deste projeto discordavam sobre conteúdo comportamental de entrevista.

A [#20](https://github.com/vinicius-ssantos/certforge/issues/20) descreve um pacote de entrevista que inclui prompts comportamentais — explicar uma trajetória, um incidente, um trade-off, algo aprendido. O `docs-pt-br/product/interview-prep.md` exclui Comunicação Comportamental da taxonomia semeada, porque a política de conteúdo exige referência autoritativa para toda afirmação e julgamento comportamental não tem nenhuma a oferecer.

As duas posições se defendem e não dá para construir as duas. A política de conteúdo é a promessa que sustenta o produto: a resposta de uma questão está correta porque uma pessoa nomeada a conferiu contra uma fonte publicada, e a [ADR 0005](0005-ai-not-source-of-truth.md) põe essa conferência nas mãos de uma pessoa. "Essa foi uma boa resposta sobre um incidente em produção?" não tem fonte publicada, e nunca vai ter.

A tentação é deixar o conteúdo comportamental entrar com uma história de evidência mais fraca e manter o mesmo maquinário em volta — os mesmos tópicos, a mesma correção, o mesmo percentual de prontidão. Isso converteria calado a opinião de um revisor no mesmo tipo de fato que `Boolean.parseBoolean("TRUE")`, no mesmo número e na mesma tela.

A tentação oposta é excluir, que é o que o documento de produto faz hoje. Isso custa uma parte real da preparação para entrevista, e não é necessário: o projeto já tem maquinário exatamente para essa forma de conteúdo. O `guided_response` (V16) carrega resposta de referência, os conceitos que um revisor esperava, os erros que as pessoas costumam cometer e perguntas de acompanhamento — e **não calcula nota**. Foi construído para respostas técnicas livres julgadas por uma pessoa. Material comportamental é a mesma forma com uma fonte mais fraca.

## Decisão

1. **Orientação editorial revisada é fonte de evidência válida, e só na forma de resposta guiada.** Conteúdo comportamental é escrito como questão de resposta guiada. Nunca como questão objetiva com alternativa correta.

2. **Ele declara o próprio tipo de evidência**, `reviewed-editorial-guidance`, distinto de `reference-backed`. O maquinário de perfis em `content/pack-manifest.mjs` recusa tipo que o perfil do pacote não admite, então uma afirmação comportamental não pode ser importada para um pacote que promete referências publicadas, e quem revisa um packet sempre sabe que tipo de afirmação está lendo.

3. **Nada de uma resposta comportamental é pontuado.** Nenhum percentual, nenhuma nota de corte, nenhuma correção e nenhuma contribuição a número de prontidão ou progresso. O aluno se autoavalia contra os conceitos que um revisor nomeou; o produto registra que ele praticou, nunca quão bem.

4. **O que pode ser avaliado** é se a resposta cobre o que um revisor escreveu: os conceitos esperados, se um trade-off foi explicitado, se um incidente tem linha do tempo, o que foi aprendido. São afirmações sobre o conteúdo de uma resposta.

5. **O que nunca pode ser inferido nem pontuado**: qualidade de comunicação, confiança, personalidade, fit cultural, senioridade, potencial de liderança, fluência no idioma. Uma máquina classificando uma pessoa em qualquer um desses seria pouco confiável e nociva, e o fato de o produto *conseguir* calcular algo a partir do texto não é motivo para fazê-lo.

6. **Preparação comportamental é um modo de prática, não um tópico canônico.** A [ADR 0014](0014-one-topic-one-track.md) prende um tópico a uma trilha, e o progresso de um tópico alimenta a prontidão daquela trilha. Um tópico comportamental dentro de uma trilha técnica colocaria material impontuável em um número que significa "quão pronto estou para esta prova". Ele vive ao lado da taxonomia, como uma lente que o aluno escolhe.

7. **Atribuição de revisor e histórico de revisões não mudam.** Orientação é escrita, revisada e versionada como qualquer questão técnica: o revisor é nomeado, o veredito fica registrado contra o texto que foi lido, e edição semântica o invalida. A fonte mais fraca muda o que a revisão *afirma*, não se ela aconteceu.

## Consequências

Conteúdo comportamental pode ser escrito, e o produto não vai fingir que o corrige. O documento de interview prep para de contradizer a #20: a exclusão estava certa sobre o modelo de evidência e errada ao concluir que o material não pode existir.

Os números de prontidão seguem significando algo, porque nada impontuável entra neles. Um aluno que praticar só prompts comportamentais verá que praticou e nenhuma mudança de prontidão, o que é honesto e vai parecer vazio — a alternativa é um número que não quer dizer nada.

O `reviewed-editorial-guidance` precisa de um perfil que o admita antes de qualquer pacote usá-lo, e nenhum pacote declara um ainda. Isso é deliberado: o tipo existe quando o primeiro pacote comportamental for escrito, não antes.

O que isto não resolve é quais prompts comportamentais vale a pena perguntar. Isso é conteúdo, e precisa da mesma pessoa nomeada que todo o resto.
