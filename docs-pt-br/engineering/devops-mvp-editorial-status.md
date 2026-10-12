# Infrastructure & DevOps Foundations — MVP editorial (PR #181)

Estado: **DRAFT**. Este relatório não constitui aprovação pela API editorial, publicação ou autorização de merge.

## Escopo e aceites

- 25 questões autorais: **10 Docker** e **15 Kubernetes**.
- 25 aceites humanos expressos, em `content/infrastructure-devops-foundations/review.json`, amarrados ao Git blob SHA de cada `question.json`.
- O verificador `content/review-integrity.mjs` falha se conteúdo/gabarito/hash divergir.
- Importação via staging apenas cria/encaminha questões ao fluxo editorial; não aprova nem publica.
- Evidência de todas as questões atuais: `reference-backed`. Referência oficial não é sinônimo de exemplo executado ou de YAML validado offline.

## Cobertura de Docker

| Tema | Questões atuais |
|---|---|
| Cache de build | t01-docker-build-cache |
| Multi-stage | t01-docker-multistage |
| Imagem e contêiner | t01-image-vs-container |
| Contexto do build | t04-docker-build-context |
| ENTRYPOINT e CMD | t04-docker-entrypoint-cmd |
| Volumes | t04-docker-volumes |
| Port publishing | t05-docker-publish-port |
| DNS do Compose | t05-compose-service-dns |
| .dockerignore | t05-dockerignore |
| Digest de imagem | t06-docker-image-digest |

Ainda não cobertos no MVP de dez questões: namespaces/cgroups em detalhe, rootless, segurança de build com secrets, bind mounts, e comparação explícita de registries.

## Cobertura de Kubernetes

| Tema | Questões atuais |
|---|---|
| Deployment e réplicas | t02-k8s-deployment-replicas |
| Service e descoberta | t02-k8s-service-discovery |
| Readiness | t03-k8s-readiness |
| Secrets e ConfigMaps | t03-k8s-configmap-secret |
| Selectors de Services | t04-k8s-service-selector |
| Startup probe | t04-k8s-startup-probe |
| DNS entre namespaces | t04-k8s-namespace-dns |
| RBAC | t05-k8s-rbac |
| Requests e limits | t05-k8s-requests-limits |
| OOMKilled | t05-k8s-oomkilled |
| RollingUpdate | t05-k8s-rollout |
| Job | t06-k8s-job |
| Atualização de ConfigMap | t06-k8s-configmap-updates |
| PodDisruptionBudget | t06-k8s-pdb |
| NetworkPolicy | t06-k8s-network-policy |

Ainda não cobertos ou insuficientemente exercitados: ServiceAccount, CronJob, HPA, StatefulSet, PV/PVC, affinity/taints, Gateway API e troubleshooting aprofundado.

## Gates para dar o trabalho por encerrado

1. Confirmar CI verde **no último commit**.
2. Adicionar validação offline dos exemplos Dockerfile/Compose/YAML em ambiente/versões fixadas quando aplicável. Não converter `reference-backed` em evidência executada sem realizar a verificação.
3. Avaliar exigência de **8 cenários Kubernetes YAML/troubleshooting** e matriz de dificuldade (básico/intermediário/avançado) nas issues #167 e #168.
4. Preservar regressão Java 21, idempotência de reimportação e ausência de publicação no CI.
5. Somente uma decisão humana separada deve autorizar eventual aprovação editorial pela API e publicação; estes aceites em arquivo não bastam.

## Operação segura

```bash
node --test content/pack-manifest.test.mjs content/manifest-pack.test.mjs content/editorial-pack.test.mjs content/review-integrity.test.mjs
```

Nunca alterar um `question.json` já aceito sem solicitar novo aceite do proprietário. A auditoria de integridade considera o arquivo completo, não apenas o gabarito.
