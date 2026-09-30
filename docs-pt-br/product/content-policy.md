# Política de Conteúdo de Certificação

> Tradução de [`docs/product/content-policy.md`](../../docs/product/content-policy.md). O inglês é a fonte canônica.

## Propósito

A qualidade do conteúdo é uma capacidade central do produto. Uma plataforma tecnicamente polida, mas com questões pouco confiáveis, não cumpre a visão do CertForge.

## Conteúdo permitido

- Questões originais escritas para o CertForge.
- Explicações e exemplos originais.
- Pequenos trechos de código criados especificamente para ensinar uma regra da linguagem.
- Referências a especificações, documentação, JEPs e documentação de APIs públicas e autoritativas.
- Rascunhos assistidos por IA que recebam revisão técnica humana e não sejam copiados de fontes protegidas.

## Conteúdo proibido

- Dumps de provas, questões vazadas ou questões reconstruídas apresentadas como conteúdo real de prova.
- Cópias não autorizadas ou paráfrases muito próximas de bancos de questões comerciais, livros ou plataformas de treinamento.
- Afirmações não verificáveis sobre o que apareceu em uma prova.
- Questões publicadas sem resposta e explicação revisadas.
- Conteúdo Java ambíguo quanto à versão.

## Metadados obrigatórios

Toda questão publicável deve incluir:

- trilha de certificação e versão da prova;
- tópico e subtópico opcional;
- compatibilidade com a release do Java;
- tipo de questão;
- justificativa da dificuldade;
- resposta esperada;
- explicação da alternativa correta e das alternativas incorretas materialmente plausíveis;
- referências autoritativas;
- procedência de autor e revisor;
- identificador de revisão imutável.

## Ciclo de vida editorial

`DRAFT -> TECHNICAL_REVIEW -> APPROVED -> PUBLISHED -> DEPRECATED`

Regras:

- Somente revisões aprovadas podem ser publicadas.
- Uma revisão publicada é imutável.
- Correções criam uma nova revisão.
- Tentativas históricas continuam referenciando a revisão originalmente exibida.
- A depreciação impede novas seleções, mas mantém o histórico de auditoria e de tentativas.
- Publicação, substituição e depreciação são eventos administrativos auditáveis.

## Verificações de qualidade

Um revisor deve verificar:

- uma única interpretação defensável do enunciado;
- correção da resposta para a release do Java declarada;
- compilabilidade quando a compilação for relevante;
- ausência de dependência oculta de comportamento de ambiente não especificado;
- distratores plausíveis, sem pegadinhas deliberadas de redação que não tenham relação com o objetivo;
- completude da explicação;
- acessibilidade da formatação de código e de texto;
- referências suficientes para verificação independente.

## Política de IA

A IA pode ajudar a fazer brainstorming, simplificar, traduzir ou gerar variações candidatas. Ela não pode publicar conteúdo, aprovar correção, inventar citações nem se sobrepor a evidências determinísticas e à revisão humana.
