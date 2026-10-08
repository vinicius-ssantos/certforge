# Contrato de pacotes de conteúdo multitrilha (#166)

Status: **PARCIALMENTE IMPLEMENTADO**. O parser de manifesto, o leitor isolado de pacotes com manifesto e o `reviewDigestV2` já existem; despacho do importador/review packet e adaptadores de evidência continuam em aberto em #166. O legado `content/java-se-21` permanece inalterado.

## Objetivo
Aceitar questões de Docker, Kubernetes, redes, Linux, CI/CD, AWS e Terraform usando o mesmo fluxo editorial sem exigir `javaRelease` ou compilação Java. Preservar integralmente os digests, as questões e a revisão humana de Java 21.

## Manifesto de pacote
Cada pacote novo possuirá `pack.json` com `schemaVersion`, `packId`, `trackSlug`, `trackKind`, `trackVersion`, `language`, `sourcePolicy`, `evidenceProfile` e `editorialStatus`.

Pacotes de certificação exigirão também dados do exame: fornecedor, código, versão, digest dos objetivos verificados e data de verificação. Pacotes sem manifesto continuarão sendo lidos pelo adaptador legado Java SE 21.

## Schema de questão

Pacotes com manifesto reutilizam `prompt`, `type`, `difficulty`, `difficultyRationale`, `references` e `topicId`. Questões objetivas mantêm `options` e `explanation`; `objectiveKeys` existe apenas para certificação. O campo legado `javaRelease` não é reaproveitado nesses pacotes.

Questões `INTERVIEW` exigem `seniority: PLENO | SENIOR`. Elas também podem usar `GUIDED_RESPONSE`, sem opções objetivas e sem `explanation` de gabarito. Nesse caso, `guidedResponse` contém:

- `referenceAnswer`;
- `expectedConcepts[]`, com `required` explícito e explicação opcional por conceito;
- `commonMistakes[]`;
- `followUps[]`.

Uma resposta guiada só é válida em pacote `INTERVIEW` e precisa de ao menos um conceito obrigatório. Esses critérios são evidência de revisão, não um gabarito binário.

O `reviewDigestV2` vincula o veredito humano à trilha/versão, idioma, política de fontes, perfil de evidência, objetivos quando aplicáveis, senioridade e todo o conteúdo revisado da resposta guiada.

## Tipos de evidência
- `reference-backed`: fontes técnicas oficiais com escopo de versão; não é prova determinística.
- `dockerfile-static`: análise de Dockerfile sem daemon privilegiado.
- `kubernetes-schema`: verificação local de manifests com versão da API fixada.
- `github-actions-static`: validação estática de workflows YAML.
- `hcl-static`: validação de sintaxe/formatação Terraform; nunca executar `apply`.
- `java-program`: compilação e execução Java 21 existentes sem mudança.

Todo resultado de verificação deve registrar ferramenta, versão, digest, status e justificativa. Verificação automatizada **não autoriza publicação**.

## Implementação
1. Extrair adaptador legado sem alterar digests, gabaritos ou packet atual.
2. Validar manifesto e questões com schemas versionados.
3. Definir políticas de fontes oficiais específicas por tecnologia.
4. Introduzir adaptadores de evidência estática e reproduzível.
5. Permitir importação idempotente de pacote não Java como rascunho.
6. Gerar packet editorial, invalidando revisão após alterações semânticas.
7. Testar que Java 21 mantém exatamente os digests atuais.
8. Exigir revisão técnica humana por outra pessoa, aprovação e publicação explícitas.

## Critérios de aceite
- [ ] Nenhum pacote Java 21 existente muda de revisão por esta refatoração.
- [ ] Importação repetida não duplica questões.
- [ ] Conteúdo novo permanece invisível até publicação.
- [ ] Objetivos de certificação possuem versão e fonte verificáveis.
- [ ] Não há execução de shell arbitrário nem acesso a cloud paga.
- [ ] Métricas de conhecimento geral e preparação por exame são independentes.

Ver [contrato canônico em inglês](../../docs/engineering/multi-track-content-contract.md), a ADR 0017 e as issues #165, #166 e #177.
