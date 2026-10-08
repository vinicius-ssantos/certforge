# ADR 0017 — Infraestrutura, conhecimentos gerais e versões de exames

Status: Proposta (#165, #166)

## Fundamentos existentes
A ADR 0007, as migrations V13–V15 e a taxonomia de entrevistas Java já generalizam o catálogo. A evolução deve preservar os IDs de Java SE 21 e o histórico editorial.

## Decisões
1. Adicionar `GENERAL` como terceiro tipo de trilha, independente de `CERTIFICATION` e `INTERVIEW`. Nenhuma UI de ativação será habilitada nesta etapa.
2. Permitir `java_release` nulo em exames não Java, preservando Java 21 nos registros existentes.
3. Registrar snapshots **explicitamente verificados** de objetivos oficiais por versão de exame, incluindo fonte HTTPS, data, versão e digest. Registros antigos não serão marcados como verificados automaticamente.
4. Separar objetivo e tópico com associação muitos-para-muitos, preservando o campo legado `objective_ref` enquanto consumidores migram.
5. Nunca inferir prontidão para certificação só pela existência de tópicos. Evidência de questões, cobertura e exercícios práticos exigem trabalho adicional.
6. Preservar revisão humana, status DRAFT, proveniência e digests do pacote Java 21.

## Etapas
- #165: migração compatível, enum e testes.
- #166: manifesto multitrilha, fontes, evidências e validação editorial.
- #167–#173: questões autorais e perfis de certificações.
- #176: interface, cobertura e métricas de progresso.

## Restrições
Não publicar automaticamente. Não usar dumps oficiais, não fabricar equivalência com exames. Manter históricos e identidades existentes.
