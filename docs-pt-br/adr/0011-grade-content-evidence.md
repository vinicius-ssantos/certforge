# ADR 0011: Graduar a evidência do conteúdo e verificar referências mecanicamente

> Tradução de [`docs/adr/0011-grade-content-evidence.md`](../../docs/adr/0011-grade-content-evidence.md). O inglês é a fonte canônica.

- Status: **Proposta.** Ela emenda a [ADR 0005](0005-ai-not-source-of-truth.md) em vez de substituí-la. Nada no código depende dos níveis até que isto seja aceito. A verificação de referências da decisão 2 entra antes da aceitação, porque apenas faz cumprir uma exigência que a [política de conteúdo](../product/content-policy.md) já faz.
- Data: 2026-10-02

## Contexto

A ADR 0005 diz que a IA não pode determinar a correção final "quando a validação determinística é possível", e que conteúdo publicado exige revisão técnica humana. Ela exige a mesma coisa de toda questão. Dois fatos ficaram concretos o bastante para agir.

**A evidência por trás de uma questão varia enormemente.** Dezesseis das vinte questões do pacote inicial carregam um programa que o build compila para Java 21, executa e confere que imprime exatamente o que a questão afirma; desde a #60, a alternativa que carrega essa saída também precisa ser a marcada como correta. Quatro não carregam nada mecânico — `t01-integer-boxing-guarantee`, `t06-stream-facts`, `t07-exports-and-opens`, `t07-requires-transitive`. A ADR 0005 pede uma única revisão humana indiferenciada para os dois tipos, o que exagera o que as dezesseis precisam e subestima o que as quatro precisam.

**Revisão humana não escala, e isso é uma restrição de produto, não uma reclamação.** Vinte questões consumiram uma sessão de revisão. Um banco grande o bastante para ser útil precisa de centenas. Se cada questão exigir revisão técnica completa de alguém que conhece o exame, o pacote para de crescer — e o roadmap de releases depende de ele crescer.

A resposta tentadora é deixar uma referência oficial substituir a revisão. Não funciona. Uma referência prova que o link existe, não que a afirmação decorre dele: "`Integer a = 1000, b = 1000;` faz `a == b` ser sempre `false`", citando a JLS 5.1.7, é uma citação impecável de uma afirmação falsa, e nenhuma checagem automática perceberia. Pior: a regra liberaria justamente as quatro questões com menos evidência por trás, porque são exatamente as que **só** têm prosa e referências.

As próprias referências também são mal checadas. O `ContentPackTest` exige que a URL comece com `https://`. A política de conteúdo exige referências autoritativas "suficientes para verificação independente" e a ADR 0005 proíbe fabricá-las; nada fazia cumprir nenhuma das duas.

## Decisão

**1. Graduar cada questão pela evidência por trás dela, e pedir de uma pessoa só o que a máquina não fornece.**

- **Verificada.** A questão carrega um programa. O build compila para a release declarada, executa, e a alternativa que carrega a saída é a marcada como correta, então o gabarito está estabelecido mecanicamente. O que uma pessoa ainda precisa julgar é o que a máquina não julga: que há uma interpretação defensável, que as alternativas erradas são plausíveis e não pegadinhas, que cada explicação está completa, e que código e prosa se leem bem com tecnologia assistiva. Esse julgamento é registrado como itens de checklist, não como veredito sobre correção.
- **Afirmada.** A questão repousa em prosa e referências. Nada mecânico sustenta o gabarito. Exige a revisão técnica completa que a política de conteúdo descreve, por alguém que conhece o assunto, e um segundo revisor é fortemente preferível.
- Uma questão sai de Afirmada para Verificada quando alguém escreve um programa para ela. **Esse é o jeito preferido de reduzir a carga de revisão**, e a maioria das afirmações que parecem conceituais admite um: `requires transitive` com uma compilação multi-módulo que falha sem ele, `exports` e `opens` com reflexão que estoura sem eles, o cache do `Integer` e os fatos de stream com um programa que imprime o comportamento.

**2. Verificar referências mecanicamente.** Toda URL de referência precisa estar num allowlist de fontes oficiais e, quando a fonte é versionada, ser escopada à release de Java declarada pela questão. Isso é guarda, não portão: pega citação fabricada, morta ou de versão errada. Não diz nada sobre a referência sustentar a afirmação, e não é evidência de correção.

**3. O que não muda.** Referência oficial nunca substitui revisão humana. Material licenciado de simulado nunca é fonte de correção, nem de texto de questão, nem de ideia de questão ([ADR 0004](0004-authorial-content-only.md)).

## Consequências

- O pacote pode crescer mais rápido onde o compilador faz o trabalho, e não mais rápido onde ele não faz. Essa é a forma honesta da restrição, e põe o incentivo em escrever questões verificáveis.
- O registro de revisão ganha um nível por questão, então "revisada" para de significar duas coisas diferentes no mesmo arquivo.
- As quatro questões Afirmadas do pacote inicial ficam rotuladas como tal e são as primeiras candidatas à conversão.
- Referência a página não versionada ou desatualizada quebra o build. Algumas fontes legítimas não são versionadas — um JEP descreve uma release por definição —, então a regra é por fonte, não global.
- Os níveis são política de revisão, não permissão de publicação. Nada se publica sozinho em nenhum nível; o `deploy/publish-pack.mjs` continua recusando o que uma revisão humana registrada não cubra agora.
- Graduar cria um jeito de ser desonesto que não existia: chamar de Verificada uma questão cujo programa não estabelece o gabarito. O build decide o nível a partir de existir um programa que concorda com a chave, então o rótulo é derivado, nunca afirmado à mão.

## Alternativas rejeitadas

- **Deixar referência oficial substituir revisão humana.** Citação não é prova, e a regra isentaria exatamente as questões com menos evidência.
- **Usar material licenciado de simulado como gabarito.** Juridicamente não é nosso para derivar. Tecnicamente é fonte secundária: a especificação é normativa e o compilador executa, então isso seria evidência mais fraca apresentada como mais forte.
- **Exigir um programa para toda questão.** Algumas afirmações sobre a linguagem são genuinamente afirmações sobre o texto da especificação. Um programa forçado testaria o programa em vez da afirmação, e convidaria a escrever questão por ser testável em vez de por valer a pena.
- **Abrir mão da revisão humana nas Verificadas.** O compilador prova a resposta. Não mostra que a questão tem uma leitura defensável nem que as explicações estão certas.
- **Checar automaticamente se a referência sustenta a afirmação.** Esse é o passo semântico, e nada disponível faz isso de forma confiável. Fingir o contrário seria o mesmo erro que a decisão 3 proíbe.
