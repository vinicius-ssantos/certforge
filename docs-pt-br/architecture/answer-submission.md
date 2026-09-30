# Submissão de Respostas

> Tradução de [`docs/architecture/answer-submission.md`](../../docs/architecture/answer-submission.md). O inglês é a fonte canônica.

Issue: #10 — Implementar a submissão idempotente de tentativas e a privacidade do gabarito. Baseia-se nas [sessões de estudo](study-sessions.md) e no [banco de questões](question-bank.md). A ameaça que ela trata é a divulgação prematura de respostas do [modelo de ameaças](threat-model.md).

## Submetendo uma resposta

```
POST /api/study/sessions/{sessionId}/questions/{position}/attempt
Idempotency-Key: 7f3c2c9a-5d3e-4d57-9a1c-0d0c4a2b1e11
Content-Type: application/json

{"selectedOptions": ["A", "C"], "confidence": "HIGH", "elapsedMillis": 4200}
```

- `selectedOptions`: chaves das alternativas da questão. Escolha única aceita exatamente uma; múltipla escolha aceita uma ou mais. Repetir uma chave é rejeitado.
- `confidence`: `LOW`, `MEDIUM` ou `HIGH`, a certeza declarada pelo próprio aluno.
- `elapsedMillis`: tempo que o aluno informa ter gasto, de 0 a 24 horas. É uma evidência informativa e não é usada como confiável para a correção.
- Não existe campo `correct`. A correção é calculada no servidor, e qualquer campo desse tipo enviado por um cliente é ignorado.

A resposta é `201 Created` com o resultado abaixo. A posição é o índice da questão na sessão, como devolvido quando a sessão foi iniciada.

## Correção

O servidor compara o conjunto marcado com o conjunto correto da revisão guardada no snapshot da sessão. Eles precisam ser iguais: não há crédito parcial, então marcar só algumas das alternativas corretas, ou alternativas a mais, é incorreto. A revisão usada é exatamente a que o aluno viu, mesmo que a questão tenha sido substituída ou depreciada depois, e a tentativa guarda o id dessa revisão.

## O que é divulgado, e quando

Nada sobre a resposta é enviado antes de uma resposta ser aceita. Até lá, o payload da sessão, as respostas de erro e o endpoint de leitura da tentativa não contêm indicador de correção, explicação nem referência.

Depois da aceitação, o resultado inclui a resposta:

```json
{
  "position": 1,
  "revisionId": "…",
  "selectedOptions": ["A", "C"],
  "correct": true,
  "confidence": "HIGH",
  "elapsedMillis": 4200,
  "submittedAt": "…",
  "answer": {
    "correctOptions": ["A", "C"],
    "explanation": "explicação geral",
    "options": [{"key": "A", "text": "…", "correct": true, "explanation": "por quê"}],
    "references": [{"title": "…", "url": "https://…"}]
  }
}
```

`GET /api/study/sessions/{sessionId}/questions/{position}/attempt` devolve o mesmo resultado depois, e `404 attempt_not_found` (sem detalhes) até que uma resposta seja aceita. As duas respostas têm `Cache-Control: no-store`. A visão da sessão mostra apenas se cada questão foi `answered`, e a lista de sessões mostra `answeredCount`; nenhuma das duas revela a correção.

## Contrato de idempotência

Toda submissão deve trazer um header `Idempotency-Key` de 8 a 64 letras, dígitos, hífens ou sublinhados (`400 idempotency_key_required` ou `idempotency_key_invalid` caso contrário). As chaves são do escopo do aluno. Um cliente gera uma chave por resposta e a reutiliza quando tenta de novo.

| Situação | Resultado |
|---|---|
| Primeira requisição com uma chave | `201`, a tentativa é registrada |
| Mesma chave, mesma requisição (sessão, posição, alternativas, confiança, tempo) | `200` com `Idempotency-Replayed: true` e o resultado original; nenhuma nova tentativa |
| Mesma chave, qualquer diferença na requisição | `409 idempotency_key_reused`; nada muda |
| Chave nova para uma questão que já tem resposta | `409 already_answered`; a primeira resposta é mantida |

Uma nova tentativa é reconhecida antes de qualquer outra coisa, então é respondida com o resultado original mesmo que a sessão tenha sido concluída, abandonada ou expirada depois. O resultado idêntico inclui o timestamp, que é guardado com precisão de microssegundos para que uma repetição seja igual, byte a byte, à resposta original.

Existe exatamente uma tentativa aceita por questão da sessão. Isso vale sob concorrência: requisições simultâneas com a mesma chave produzem uma tentativa e o resto são repetições; requisições simultâneas com chaves diferentes produzem uma tentativa e o resto `already_answered`. Ambos são garantidos por constraints únicas no PostgreSQL, e não apenas por verificações da aplicação.

## Erros

| Status | `code` | Significado |
|---|---|---|
| 400 | `idempotency_key_required`, `idempotency_key_invalid` | Chave ausente ou malformada |
| 400 | `invalid_option` | Uma chave de alternativa não pertence à questão |
| 400 | `duplicate_option` | A mesma chave foi marcada duas vezes |
| 400 | `single_choice_requires_one_option` | Uma questão de escolha única exige exatamente uma alternativa |
| 400 | `validation_failed` | Campos ausentes ou fora do intervalo (`fields` lista só os nomes) |
| 404 | `session_not_found` | Não é sessão do aluno, ou a sessão não existe |
| 404 | `question_not_found` | A posição não está na sessão |
| 404 | `attempt_not_found` | Ainda não há resposta aceita (apenas na leitura da tentativa) |
| 409 | `already_answered` | A questão já tem uma resposta aceita |
| 409 | `idempotency_key_reused` | A chave foi usada para uma requisição diferente |
| 409 | `session_not_in_progress`, `session_expired` | A sessão não aceita mais respostas |

Os corpos de erro nunca contêm material de resposta. Uma sessão de outro aluno se comporta exatamente como uma que não existe.

## A evidência é imutável

Uma tentativa guarda o aluno, a sessão, a posição, a revisão exata, as alternativas marcadas, a correção calculada, a confiança, o tempo gasto, o momento da submissão, a chave de idempotência e uma impressão digital da requisição. Triggers do PostgreSQL garantem que tentativas nunca são atualizadas nem apagadas, que uma tentativa só pode ser inserida para uma sessão que pertence ao aluno e está em andamento e, por meio de um lock de linha, que encerrar uma sessão espera por uma resposta que está sendo gravada. Nenhuma resposta pode, portanto, ser registrada em uma sessão encerrada, mesmo quando uma submissão e um encerramento disputam.

## Logs e telemetria

Nenhum caminho de código registra em log corpos de requisição, alternativas marcadas, gabaritos nem chaves de idempotência. Isso é coberto por um teste que exercita submissões aceitas, repetidas, rejeitadas e inválidas e verifica que a saída de log capturada não contém nenhum material de resposta nem chaves. Telemetria estruturada, métricas e traces são definidos na #12 e devem seguir a mesma regra.

## Adiado

Modo de nova tentativa, crédito parcial, respostas livres, pontuação adaptativa, simulados, execução arbitrária de código, visões de histórico e progresso (#11) e métricas de submissões (#12).
