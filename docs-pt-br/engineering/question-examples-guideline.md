# Exemplos práticos em questões técnicas

## Princípio editorial

Questões sobre configuração, execução, diagnóstico, ordem de operações ou
comportamento dependente do contexto devem incluir, **quando acrescentar
clareza**, um exemplo curto próximo ao enunciado: Dockerfile, YAML, comando,
trecho de código, log, configuração ou cenário operacional concreto.

A diretriz é **condicional**, não uma obrigação de adicionar exemplos a todas
as questões. Exemplos não podem entregar diretamente o gabarito.

## Critérios de revisão

1. O exemplo ajuda a responder à pergunta certa e elimina uma ambiguidade real?
2. Está tecnicamente válido no contexto e nas versões mencionadas?
3. Tem o menor tamanho possível, sem informação irrelevante?
4. Os pressupostos necessários são explícitos (por exemplo, `pom.xml` inalterado
   para reutilizar cache de dependências)?
5. A resposta continua exigindo raciocínio, sem revelar o nome da alternativa
   correta no próprio exemplo?
6. O material é autoral, tem referência oficial e não imita itens de exames?
7. O gabarito e todas as justificativas continuam verdadeiros após a edição?

## Uso

- **Recomendado**: Dockerfile, YAML, IaC, workflows, logs, erros, comandos,
  cenários operacionais, comparação de configurações e efeitos de ordem.
- **Opcional**: conceitos diretos cuja aplicação já é inequívoca.
- **Evitar**: exemplo redundante, excessivamente longo ou que exponha a resposta.

## Governança

Editar um enunciado — inclusive acrescentar exemplo — altera o digest de
revisão. Qualquer aceite anterior do texto precisa de nova verificação humana.
Questões novas seguem DRAFT e não são aprovadas nem publicadas automaticamente.

Aplicação inicial: questões Docker/Kubernetes do lote 1, issues #166–#168.
