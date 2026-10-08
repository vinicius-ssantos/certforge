# Política de Conteúdo

> Tradução de [`docs/product/content-policy.md`](../../docs/product/content-policy.md). O inglês é a fonte canônica.

## Propósito

A qualidade do conteúdo é uma capacidade central do produto. Uma plataforma tecnicamente polida, mas com questões pouco confiáveis, não cumpre a visão do CertForge.

## O que esta política governa

O conteúdo que o projeto **publica**: os pacotes em `content/`, que este repositório distribui sob a sua licença, e qualquer coisa que uma implantação sirva a alunos. Não é uma regra sobre o que um mantenedor pode ler ou guardar. Material de estudo de que alguém tem licença fica fora do repositório, em `content/private/`, que o git ignora e que o CI se recusa a deixar versionar; veja o [guia de autoria de conteúdo](../engineering/content-authoring.md).

## Conteúdo permitido

- Questões originais escritas para o CertForge.
- Explicações, critérios revisados de resposta e exemplos originais.
- Pequenos trechos de código criados especificamente para ensinar ou avaliar uma regra técnica.
- Referências a especificações, documentação, padrões, JEPs, documentação de APIs e documentação de fornecedores públicas e autoritativas.
- Rascunhos assistidos por IA que recebam revisão técnica humana e não sejam copiados de fontes protegidas.

## Conteúdo proibido

- Dumps de provas, questões vazadas ou questões reconstruídas apresentadas como conteúdo real de prova.
- Cópias não autorizadas ou paráfrases muito próximas de bancos de questões comerciais, livros ou plataformas de treinamento.
- Afirmações não verificáveis sobre o que apareceu em uma prova ou entrevista.
- Questões publicadas sem gabarito revisado ou sem critérios revisados de resposta guiada.
- Conteúdo técnico ambíguo quanto à versão quando a resposta depende da versão de produto, API ou linguagem.
- Pontuações de contratação, probabilidades de empregabilidade ou correção binária geradas automaticamente para respostas subjetivas de entrevista.

## Metadados obrigatórios

Toda questão publicável deve incluir:

- trilha de preparação e a versão/contexto da trilha em que a revisão foi aprovada;
- tópico e subtópico opcional;
- tipo de questão;
- dificuldade e justificativa da dificuldade;
- referências autoritativas suficientes para verificação independente;
- procedência de autor e revisor;
- identificador de revisão imutável.

Questões objetivas também devem incluir:

- resposta esperada determinística;
- explicação da resposta correta e das alternativas incorretas materialmente plausíveis.

Questões de certificação também devem incluir:

- perfil e versão da certificação/prova;
- mapeamento de objetivos quando o provedor publica objetivos;
- metadados de versão de linguagem/runtime/produto quando a correção depender disso, incluindo a release do Java no pacote de certificação Java.

Questões de entrevista também devem incluir:

- expectativa explícita de senioridade.

Questões de entrevista do tipo resposta guiada também devem incluir:

- resposta de referência revisada;
- conceitos esperados revisados, indicando quais são obrigatórios e quais são opcionais;
- erros comuns e perguntas de aprofundamento quando melhorarem materialmente o exercício.

Os critérios de resposta guiada são evidência para autoavaliação e futura comparação assistida. Eles **não** formam um gabarito determinístico `correct=true/false`.

## Ciclo de vida editorial

`DRAFT -> TECHNICAL_REVIEW -> APPROVED -> PUBLISHED -> DEPRECATED`

Regras:

- Somente revisões aprovadas podem ser publicadas.
- Uma revisão publicada é imutável.
- Correções criam uma nova revisão.
- Tentativas históricas continuam referenciando a revisão originalmente exibida.
- A depreciação impede novas seleções, mas mantém o histórico de auditoria e de tentativas.
- Publicação, substituição e depreciação são eventos administrativos auditáveis.
- O revisor humano deve revisar exatamente o conteúdo semântico coberto pelo digest registrado; edições semânticas invalidam o veredito anterior.

## Verificações de qualidade

Um revisor deve verificar:

- uma única interpretação defensável do enunciado;
- correção de uma resposta objetiva, ou defensabilidade e completude dos critérios de resposta guiada;
- compatibilidade com as versões declaradas sempre que a afirmação técnica for sensível à versão;
- compilabilidade ou outra evidência determinística quando relevante;
- ausência de dependência oculta de comportamento de ambiente não especificado;
- distratores plausíveis nas questões objetivas, ou conceitos obrigatórios/opcionais significativos nas respostas guiadas;
- completude da explicação/resposta de referência para a senioridade declarada;
- acessibilidade da formatação de código e de texto;
- referências suficientes para verificação independente.

Verificações determinísticas apoiam a revisão; não substituem o julgamento humano. Questões baseadas em referências devem declarar isso em vez de sugerir que o CI provou a afirmação técnica.

## Política de IA

A IA pode ajudar a fazer brainstorming, simplificar, traduzir, gerar variações candidatas ou comparar uma resposta do aluno com critérios imutáveis já revisados. Ela não pode publicar conteúdo, aprovar correção, inventar citações, substituir critérios revisados nem atribuir pontuações opacas de contratação/prontidão.
