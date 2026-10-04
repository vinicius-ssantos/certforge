# ADR 0012: Traduzir a interface e manter o texto das questões em inglês

> Tradução de [`docs/adr/0012-interface-language.md`](../../docs/adr/0012-interface-language.md). O inglês é a fonte canônica.

- Status: **Aceita** em 2026-10-02, como escrita, e **executada** na #74 depois da `v0.2.0`: as strings foram extraídas para um catálogo tipado (#122) e o português do Brasil foi adicionado ao lado do inglês, com o idioma preferido do navegador como padrão e um seletor que é lembrado (#123). A redação em português foi lida por vinicius-ssantos, falante nativo, em 2026-10-04. É o autor do projeto revisando a tradução do próprio projeto, não um revisor independente — a mesma limitação que a [ADR 0011](0011-grade-content-evidence.md) registra para o pacote de questões.
- Data: 2026-10-02

## Contexto

Este repositório se documenta em inglês e em português do Brasil: quarenta documentos em cada, mantidos em paridade, com o inglês como fonte canônica. O idioma do **produto** nunca foi decidido.

O app web do aluno e a mesa editorial são só em inglês, **por deriva, não por escolha**. Não há biblioteca de internacionalização, não há catálogo de mensagens, o `<html lang="en">` é fixo no `web/index.html`, e o texto visível está escrito direto em 28 dos 43 componentes. O `web/src/ui/messages.ts` centraliza as trinta e oito mensagens de erro, e o próprio comentário dele diz que o texto mora ali *"so it can be reviewed and translated"* — intenção que nunca foi adiante. Nada em `docs/product/`, `docs/roadmap/`, nas ADRs ou nas diretrizes de interface web declara idioma algum.

O mantenedor lê e trabalha em português. O exame para o qual a primeira trilha prepara é prestado em inglês.

Duas decisões estão embaraçadas aqui, e elas puxam para lados opostos. Provavelmente é por isso que nenhuma foi tomada.

## Decisão

**1. Traduzir a interface para português do Brasil, mantendo o inglês.** O padrão segue o idioma preferido do navegador; um seletor explícito sobrepõe e a escolha é lembrada no navegador, então isso não exige mudança de esquema nem configuração de conta. "Interface" significa a moldura: navegação, botões, rótulos, dicas, mensagens de status, confirmações, erros, e a formatação de datas e números.

**2. Manter o texto das questões em inglês**: enunciado, alternativas, explicações, referências, e o texto de tópico e de objetivo do exame no catálogo. Três motivos.

- **O exame é prestado em inglês, e a precisão do enunciado é parte do que ele cobra.** Treinar em português e prestar em inglês remove exatamente o treino de leitura técnica de que o aluno precisa. (Se a Oracle oferece um 1Z0-830 localizado não foi possível verificar: a página de exame recusa clientes automatizados, o mesmo obstáculo da #68. Se existir exame localizado, esta decisão merece ser revista para aquele público.)
- **Questão traduzida é conteúdo novo, não cópia.** Precisa da própria revisão técnica, porque tradução errada é questão errada, e questão errada é a única falha que este produto não absorve. Dobraria o gargalo de revisão que a [ADR 0011](0011-grade-content-evidence.md) acabou de descrever — para as vinte questões que existem e para toda questão acrescentada depois.
- **As referências são em inglês e normativas.** Questão em português citando especificação em inglês dificulta a verificação independente que a [política de conteúdo](../product/content-policy.md) exige, em vez de facilitar. O texto de tópico e de objetivo vem dos objetivos publicados pela Oracle e fica no original pelo mesmo motivo.

**3. Nada disso acontece na `v0.1.0`.** Veja as consequências.

## Consequências

- **O custo não são os textos.** Noventa e sete asserções na suíte de navegador, e os testes unitários além delas, localizam elementos pelo nome acessível em inglês — `getByRole("button", { name: "Approve" })`. Esses nomes **são** a garantia de acessibilidade: o passeio de Tab e as checagens de árvore de acessibilidade leem deles. Traduzir a interface significa retrabalhar as suítes que são a evidência da release. Isso é trabalho do tamanho de uma release, não tarefa, e fazê-lo antes de taguear a `v0.1.0` desmontaria a prova no momento de assiná-la.
- **As telas vão misturar idiomas**: interface em português em volta de questão em inglês. Isso é deliberado e precisa ser projetado, não escondido, e vem com uma obrigação técnica: o `lang` precisa ficar dinâmico, e o elemento que contém o texto da questão precisa de `lang="en"` para que o leitor de tela pronuncie com fonética inglesa em vez de ler palavras inglesas como se fossem portuguesas. Hoje isso está implicitamente correto porque a página inteira é `lang="en"`; traduzir a interface tornaria isso silenciosamente errado, o que é uma regressão de acessibilidade real escondida dentro de uma tarefa de tradução.
- As mensagens de erro já estão centralizadas, então são a parte barata. Os 28 componentes são o trabalho.
- A decisão 2 vale para trilhas de certificação cujo exame é em inglês. Uma futura trilha de entrevistas voltada a um mercado lusófono é outro caso e não está pré-decidida aqui.

## Alternativas rejeitadas

- **Manter a interface em inglês porque o conteúdo é em inglês.** A interface não é o que está sendo examinado. Alguém tem o direito de treinar questões de Java em inglês sem navegar um app em inglês.
- **Traduzir as questões também.** Piora o produto no seu propósito declarado e dobra o único gargalo que de fato limita o tamanho do pacote.
- **Traduzir conteúdo por máquina em tempo de execução.** A correção do conteúdo é o produto. Tradução automática de uma explicação de resposta é uma afirmação não revisada apresentada como revisada, o que a [ADR 0005](0005-ai-not-source-of-truth.md) proíbe.
- **Fazer isso dentro da `v0.1.0`.** Quatro itens humanos separam a release de uma tag; isto acrescentaria trabalho do tamanho de uma release e invalidaria a evidência por trás dos portões já vencidos.
