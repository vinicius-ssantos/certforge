# A fronteira que um futuro entrevistador de IA não pode cruzar

- Status: **Definida, deliberadamente não implementada**
- Issue: #24
- Decidido por: [ADR 0005](../adr/0005-ai-assisted-authoring-human-verified.md),
  [ADR 0011](../adr/0011-grade-content-evidence.md),
  [ADR 0019](../adr/0019-behavioural-preparation-is-guidance-not-grading.md),
  [ADR 0021](../adr/0021-job-description-blueprints-explain-every-weight.md)

## Por que este documento existe antes da funcionalidade

A #24 pede o contrato que um futuro entrevistador conversacional consumiria, e pede isso **agora**,
enquanto nada o consome. O motivo é que o momento mais barato para decidir o que um modelo não pode
fazer é antes de qualquer coisa depender de ele fazer. Toda interface abaixo já existe e já é usada
pelas telas; o que este documento acrescenta é a afirmação do que um entrevistador pode ler, do que
pode dizer, e do que nunca pode produzir.

Para quem quer a versão curta: **o modelo recebe o material revisado e as afirmações que o próprio
aluno fez, e pode reformular e perguntar. Não pode julgar.**

## O que ele pode ler

Exatamente o que um aluno vê, e no mesmo momento em que vê:

| Fonte | O que carrega |
|---|---|
| `GET /api/study/interviews/{id}` | os itens de uma sessão, enunciados e alternativas, nenhum material de resposta |
| `POST .../items/{position}/answer` | depois que o aluno confirma: a resposta de referência, os conceitos esperados, os erros comuns, os acompanhamentos revisados |
| `POST .../items/{position}/concepts` | as marcações do próprio aluno, feitas depois de ler os conceitos |
| `GET /api/study/interviews/evidence` | contagens por tópico, os dois casos que um índice de acerto esconde, e sinais como tipos com suas contagens |
| `GET /api/study/interviews/blueprints/{id}` | os pesos de uma vaga e as palavras por trás de cada um |

Três dessas fontes já estão fechadas para ele antes de existir uma resposta. Nada no payload de um
item não respondido contém corretude, gabarito, marcação de alternativa, explicação, referência ou
saída de verificação — a mesma regra que a prática e os simulados seguem, e os mesmos testes que a
garantem.

## O que ele pode fazer

- **Perguntar um acompanhamento revisado.** `followUps` é conteúdo da revisão, escrito por uma
  pessoa. Um entrevistador pode perguntá-lo, na língua do aluno, e pode reformulá-lo.
- **Pedir mais profundidade nas próprias palavras do aluno**, sem registrar a resposta. O produto
  nunca recebe uma resposta guiada, e isso não muda porque um modelo está na conversa: se o texto
  chega a um servidor, é uma decisão nova com revisão própria, não um detalhe de implementação
  desta.
- **Reafirmar o material revisado.** A resposta de referência e os conceitos esperados podem ser
  explicados, comparados ou divididos em passos.
- **Apontar o que o aluno disse.** "Você marcou *detecção durável de duplicidade* como não
  coberto, duas vezes" é a reafirmação de uma evidência registrada, e as respostas por trás dela
  estão no payload.
- **Propor termos para o dicionário de descrições de vaga**, que um humano então revisa, exatamente
  como a ADR 0005 permite que um modelo proponha conteúdo.

## O que ele nunca pode produzir

- **Um julgamento sobre se uma resposta estava certa.** Uma resposta guiada não é corrigida por
  nada (ADR 0019). Um modelo dizendo "isso estava correto" seria exatamente a correção que essa ADR
  proíbe, sem nenhum revisor por trás e sem forma de o aluno checar.
- **Um conceito, erro comum, acompanhamento ou resposta canônica novos.** Se não está na revisão,
  não foi revisado, e material não revisado apresentado como o que um entrevistador espera é
  exatamente a falha que a ADR 0005 existe para evitar.
- **Um número de prontidão, fit ou contratação de qualquer tipo.** Nenhuma probabilidade de
  proposta, nenhum percentual, nenhum nível, nenhum "você está pronto". A #22 adia isso, a #24 adia
  isso, e as telas de blueprint e de evidência já dizem isso ao aluno em palavras explícitas.
- **Uma afirmação sobre a pessoa.** Nem sobre sua comunicação, sua confiança, sua senioridade ou sua
  adequação. A evidência carrega contagens do que foi respondido e afirmações que o próprio aluno
  fez; uma frase sobre quem a pessoa é não é derivável de nenhuma das duas.
- **Um peso sem nada por trás.** Se o entrevistador sugerir o que estudar, ele cita os termos,
  contagens ou marcações que leu. A regra da ADR 0021 é que o aluno pode discordar do conselho, e só
  pode discordar de algo que lhe foi mostrado.
- **Qualquer coisa escrita no registro.** O entrevistador não tem caminho de escrita. Respostas,
  marcações, evidência e blueprints são escritos pelas próprias ações do aluno, pelos endpoints
  acima, e um gatilho de imutabilidade recusa a reescrita de qualquer um deles.

## A fronteira em uma frase, para quem implementar isto depois

> Ele consome conteúdo revisado e as afirmações do próprio aluno, e produz perguntas e
> reafirmações — nunca um veredito, nunca um número sobre uma pessoa, e nunca uma resposta
> canônica.

## Adiado junto com isso

Voz em tempo real, análise de webcam, inferência de emoção ou personalidade, decisões automáticas
de contratação, e entrevista sem limite com nenhum material revisado por trás. São os não-objetivos
explícitos da #24, e nenhum deles se torna aceitável por ser bem implementado.
