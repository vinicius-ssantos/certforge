# Tasks

## 1. Audit remediation

- [x] 1.1 UX-01: Dependências que falham ou vêm vazias deixam entrevistas sem saída clara. Verify: Catálogo [] termina em estado vazio orientado. Catálogo 503 termina em mensagem com tentar novamente. Nunca há loading permanente sem requisição ativa. Cobrir os dois cenários em EvidencePage e NewBlueprintPage.
- [x] 1.2 UX-02: Resposta aberta desaparece ao navegar e não acompanha a referência. Verify: A referência abre sem esconder a resposta original. Sair com texto pede decisão ou explica o descarte antes da perda. Nenhum request passa a conter o texto. A decisão sobre persistência continua explícita.
- [x] 1.3 UX-03: Seleções sem badge ficam identificadas visualmente apenas pela cor. Verify: Em escala de cinza, sem hover e após o foco sair, a seleção permanece inequívoca nas três superfícies. Conferir também forced-colors, teclado e leitor de tela; axe sozinho não prova esse requisito.
- [x] 1.4 UX-04: O simulado móvel prioriza o mapa de questões antes da pergunta. Verify: A pergunta começa na primeira janela de 390 x 844 e 320 px de largura. Abrir/fechar o mapa preserva seleção, marcação, foco e posição. A ordem visual e a leitura assistiva continuam coerentes.
- [x] 1.5 UX-05: A tela promete que o aluno pode ajustar pesos, mas não oferece esse controle. Verify: Toda promessa de ajuste tem um controle utilizável ou foi removida da cópia. Um requisito não reconhecido nunca passa a parecer coberto sem uma escolha explícita.
- [x] 1.6 UX-06: As evidências de entrevista descrevem a dificuldade sem levar à revisão correspondente. Verify: Um sinal acionável abre uma atividade com o mesmo tópico/conceito ou explica a limitação. O usuário não precisa procurar o tópico novamente numa lista geral.
- [x] 1.7 UX-07: Concluir e abandonar a entrevista usam rótulos quase iguais. Verify: Rótulos e nomes acessíveis distinguem conclusão e abandono antes do clique. Confirmar os estados resultantes em português e inglês.
- [x] 1.8 UX-08: A entrega do simulado não destaca quantas seleções ainda são rascunhos. Verify: Com pelo menos um rascunho, a confirmação diz quantos existem e oferece recuperá-los. Nenhuma seleção é descartada silenciosamente durante o retorno à edição.
- [x] 1.9 UX-09: A confirmação de uma ação irreversível recebe foco diretamente em confirmar. Verify: A abertura não deixa a ação irreversível pronta para um Enter repetido. Cancelar retorna o foco ao botão de origem. O comportamento é consistente entre simulado, entrevista e editorial.
- [x] 1.10 UX-10: Links de diagnóstico perdem o contexto do tópico que motivou o clique. Verify: Do diagnóstico até o início da prática, o tópico selecionado permanece explícito. Abrir outra trilha ou outro motivo exige uma escolha do aluno, não uma perda implícita de contexto.
- [x] 1.11 UX-11: O rótulo Firme aparece mesmo com uma única resposta correta. Verify: O caso 1/1 torna a pequena amostra evidente. Nenhum texto sugere domínio ou prontidão sem evidência; porcentagens e contagens continuam conferindo.
- [x] 1.12 UX-12: Textos explicativos carregam termos de implementação e repetem ressalvas. Verify: Cada tela permite identificar objetivo, ação e consequência na primeira leitura. A redução não elimina limites de evidência, privacidade nem distinção entre conteúdo oficial e autoral.
- [x] 1.13 UX-13: Controles de tarefa não respeitam o mínimo interno de 44 px. Verify: Botões Praticar e o campo numérico atingem o alvo interno de 44 px em desktop e celular. Nenhuma redução visual diminui a área acionável. Verificar separadamente o critério WCAG e suas exceções.
- [x] 1.14 UX-14: Tabelas no celular escondem dados e ações importantes fora do primeiro quadro. Verify: A principal ação por tópico fica visível em 390 px. Não há overflow da página inteira; a alternativa mantém associações de cabeçalho, leitura e acesso por teclado.
- [x] 1.15 UX-15: Catálogo vazio ainda recebe o convite principal para explorar trilhas. Verify: Com catálogos vazios, não há CTA que implique estudo disponível. O motivo aparece antes de grandes blocos secundários e continua claro em 320 px.
- [x] 1.16 UX-16: A evidência de execução ocupa o fluxo antes da explicação pedagógica. Verify: O aluno encontra o motivo principal antes de percorrer todos os arquivos. A evidência completa continua acessível, navegável por teclado e sem executar código na página.
- [x] 1.17 UX-17: A autoria exige percorrer um formulário longo para conferir a apresentação final. Verify: É possível conferir o texto como o aluno verá antes de salvar, sem transformar a prévia em publicação. Navegar entre seções não descarta campos e erros continuam apontando para o campo correto.
- [x] 1.18 UX-18: A ajuda de acesso não informa como contatar o administrador. Verify: A ajuda oferece um próximo passo executável por uma pessoa sem conhecimento interno da instalação. O fluxo não passa a expor dados da conta ou prometer recuperação que não existe.
- [x] 1.19 UX-19: A marca no cabeçalho não funciona como retorno ao início. Verify: A marca recebe foco e leva ao início correto. O nome acessível não se resume a um ícone.
- [x] 1.20 UX-20: A página editorial identifica a versão, mas não a questão no título. Verify: Duas questões na mesma versão podem ser distinguidas pelos títulos e pela leitura dos headings, sem expor um identificador técnico como única alternativa.
- [x] 1.21 UX-21: O catálogo depende de percorrer cartões, sem apoio quando crescer. Verify: Com o catálogo real, usuários encontram uma trilha por nome e provedor sem depender de conhecer sua posição. Com poucos itens, os filtros não sobrecarregam a entrada.
- [x] 1.22 UX-22: O resumo do resultado separa visualmente nota e interpretação. Verify: Na primeira leitura, o aluno entende resultado, significado e próximo passo sem procurar o status em outro extremo do cartão. A composição empilha de forma clara no celular.

## 2. Integration and review

- [x] 2.1 Run frontend tests, lint, typecheck, build, API drift and bundle budgets; record actual results.
- [x] 2.2 Inspect responsive browser flows with isolated fixtures and record limitations.
- [ ] 2.3 Obtain human visual acceptance of the PR; do not infer it from automated checks.

## Workflow follow-up

- Sync accepted deltas and archive only after review requirements are met.

Implementation and executable checks are recorded in `docs/ux-audit-remediation-2026-11-19.md`. Checklist completion for implementation does not substitute for the human visual/assistive-technology acceptance in 2.3.
