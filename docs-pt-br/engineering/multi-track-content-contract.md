# Contrato de pacotes de conteúdo multitrilha (#166)

Status: PARCIALMENTE IMPLEMENTADO. O legado `content/java-se-21` permanece inalterado, e cada seção abaixo diz o que já é código e o que segue sendo proposta. O manifesto, o schema das questões, a política de fontes, o registro de revisão, as verificações offline dos artefatos embutidos e os perfis de evidência existem, em `content/pack-manifest.mjs`, `content/manifest-pack.mjs`, `content/review-integrity.mjs`, `content/embedded-artifacts.mjs` e `content/evidence.mjs`; os adaptadores de Terraform, GitHub Actions e ferramentas de container, não.

## Objetivo
Aceitar questões de Docker, Kubernetes, redes, Linux, CI/CD, AWS e Terraform usando o mesmo fluxo editorial sem exigir `javaRelease` ou compilação Java. Preservar integralmente os digests, as questões e a revisão humana de Java 21.

## Manifesto de pacote
Cada pacote novo possuirá `pack.json` com `schemaVersion`, `packId`, `trackSlug`, `trackKind`, `trackVersion`, `language`, `sourcePolicy`, `evidenceProfile` e `editorialStatus`.

Pacotes de certificação exigirão também dados do exame: fornecedor, código, versão, digest dos objetivos verificados e data de verificação. Pacotes sem manifesto continuarão sendo lidos pelo adaptador legado Java SE 21.

## Perfis e tipos de evidência — implementados
Toda questão declara um `evidence`. Não existe ausência silenciosa: a questão que nenhuma máquina
verifica declara `reference-backed`, e `content/evidence.mjs` conta essas como as não verificadas do
pacote — é o que `node content/stage-editorial-pack.mjs` imprime antes de uma importação.

O `evidenceProfile` do pacote diz quais tipos suas questões podem declarar. Só estes perfis existem,
e um pacote que declare outro nome falha no manifesto em vez de passar sem ser lido:

| Perfil | Admite |
| --- | --- |
| `reference-backed-v1` | `reference-backed` |
| `static-check-v1` | `reference-backed`, `shell-static-check`, `yaml-static-check`, `manifest-schema-check` |

Declarar que uma *máquina* olhou exige apontar para algo que uma máquina daqui lê, e
`content/evidence.mjs` recusa o que não aponta:

- `reference-backed`: páginas oficiais, dentro da política de fontes do pacote, em HTTPS. O mais
  fraco e o rótulo honesto — a leitura do revisor é a única verificação. Não é prova determinística.
- `shell-static-check`: um bloco `dockerfile`, analisado instrução por instrução. Um `bash` **não**
  sustenta a declaração, porque nada aqui analisa shell.
- `yaml-static-check`: um bloco `yaml`, verificado na forma — tabs, degraus de indentação, chaves
  irmãs repetidas. Não é um parser YAML e não diz nada sobre o significado.
- `manifest-schema-check`: um bloco `yaml` que declara `apiVersion` e `kind`, conferido contra a
  versão do Kubernetes registrada no pacote, de modo que uma API removida falha.
- `runnable-isolated-test`: citado pela #166 e admitido por nenhum perfil, porque nada neste
  repositório executa um teste assim para pacote com manifesto. O pacote Java compila e executa o
  programa de cada questão, e não é um pacote com manifesto.

Nenhuma verificação daqui aprova ou publica, e verificação que passa não é revisão.

## Adaptadores de evidência — ainda propostos
- `github-actions-static`: validação estática de workflows YAML, sem executar nada.
- `hcl-static`: validação de sintaxe/formatação Terraform; nunca executar `apply`.
- Um adaptador de ferramenta de container para Dockerfiles e manifests, com versão fixada, sem
  daemon privilegiado, socket do host ou rede — mais forte que as verificações acima, que não
  precisam de ferramenta alguma.
- `java-program`: compilação e execução Java 21 existentes sem mudança.

Cada um registraria ferramenta, versão, digest da fixture, status e justificativa, e cada um precisa
de um perfil que o admita antes de uma questão poder declará-lo.

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
