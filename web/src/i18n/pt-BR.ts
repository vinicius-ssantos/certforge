import type { Catalog } from "./en";
import { plural } from "./plural";

/**
 * The interface in Brazilian Portuguese. Typed as `Catalog`, so the type checker refuses this file
 * if a key is missing, if a key does not exist in the English catalog, or if a function here takes
 * a different argument list from the English one.
 *
 * Question text is **not** here and never will be: prompts, options, explanations, references and
 * the topic and objective wording stay in English in every locale (ADR 0012 decision 2), because
 * the exam is sat in English and a translated question is new content needing its own review.
 *
 * Two naming choices a reader should know about, both of them arguable:
 *
 * - A question's `revision` is "versão", not "revisão". Portuguese uses "revisão" for the act of
 *   reviewing, and the editorial desk talks about both in the same sentence, so reusing the word
 *   would make "Notas da revisão" ambiguous between the notes a reviewer left and the notes on a
 *   version. "Versão do exame" is a different concept but the context always disambiguates it.
 * - An answer `option` is "alternativa", which is what a Brazilian exam calls it, rather than the
 *   literal "opção".
 */
/** This locale's own tag, which is what its plural rules are resolved against. */
const TAG = "pt-BR";

export const ptBR: Catalog = {
  language: {
    label: "Idioma",
    change: "Mudar o idioma",
  },

  layout: {
    skipToMain: "Ir para o conteúdo principal",
    brand: "CertForge",
    mainNavigation: "Principal",
    tracks: "Trilhas",
    review: "Revisão",
    progress: "Progresso",
    history: "Histórico",
    editorial: "Editorial",
    signOut: "Sair",
  },

  states: {
    loading: "Carregando",
    errorTitle: "Não funcionou",
    reference: "Referência:",
    tryAgain: "Tentar de novo",
  },

  form: {
    problemTitle: "Há um problema",
    errorPrefix: "Erro: ",
  },

  confirm: {
    cancel: "Cancelar",
  },

  prompt: {
    codeExample: "Exemplo de código",
  },

  errors: {
    unknown: "Algo deu errado. Tente de novo.",
    network: "Não foi possível alcançar o servidor. Verifique sua conexão e tente de novo.",
    unauthenticated: "Sua sessão terminou. Entre novamente.",
    invalidCredentials: "O e-mail ou a senha está incorreto.",
    tooManyAttemptsIn: (seconds: number) =>
      `Tentativas demais. Espere ${seconds} segundos e tente de novo.`,
    tooManyAttempts: "Tentativas demais. Espere um pouco e tente de novo.",
    emailAlreadyRegistered: "Já existe uma conta com este e-mail. Tente entrar em vez de criar.",
    passwordTooShort: "A senha precisa ter pelo menos 12 caracteres.",
    passwordTooLong: "A senha é longa demais. Use no máximo 72 bytes.",
    passwordEqualsEmail: "A senha não pode ser igual ao seu e-mail.",
    validationFailed: "Parte das informações não é válida. Confira o formulário e tente de novo.",
    csrfInvalid: "O token de segurança da página expirou. Tente de novo.",
    trackNotFound: "Esta trilha não existe ou não está disponível.",
    topicNotFound: "Este tópico não existe ou não está disponível.",
    insufficientContent:
      "Ainda não há questões publicadas suficientes neste tópico. Escolha outro tópico.",
    activeSessionExists: "Você já tem uma sessão de prática em andamento neste tópico.",
    sessionNotFound: "Esta sessão de prática não existe.",
    sessionExpired: "Esta sessão de prática expirou. As respostas que você já deu foram guardadas.",
    sessionNotInProgress: "Esta sessão de prática já terminou.",
    alreadyAnswered: "Você já respondeu esta questão.",
    concurrentSubmission: "Sua resposta ainda está sendo salva. Espere um instante e tente de novo.",
    idempotency: "Não foi possível salvar sua resposta com segurança. Recarregue a página e tente de novo.",
    chooseOne: "Escolha uma resposta da lista.",
    questionCountOutOfRange: "Essa quantidade de questões não é permitida.",
    questionNotFound: "Esta questão ou versão não existe.",
    revisionIncomplete:
      "A versão ainda não está completa. A lista ao lado do formulário diz o que falta.",
    revisionNotEditable: "Só um rascunho pode ser editado. Crie uma nova versão para alterar esta questão.",
    notRevisionAuthor: "Só quem escreveu uma versão pode alterá-la ou enviá-la.",
    revisionNotInReview: "Esta versão não está mais esperando revisão.",
    revisionNotApproved: "Só uma versão aprovada pode ser publicada.",
    reviewerMustDiffer: "Uma versão não pode ser revisada por quem a escreveu.",
    openRevisionExists: "Esta questão já tem uma versão em andamento.",
    topicNotActive: "Esse tópico não está ativo. Escolha outro.",
    forbidden: "Você não tem permissão para fazer isso.",
    serverSide: "Algo deu errado do nosso lado. Tente de novo.",
    requestFailed: "Não foi possível concluir a solicitação.",
  },

  documentTitle: {
    suffix: (page: string) => `${page} · CertForge`,
  },

  auth: {
    signIn: "Entrar",
    signingIn: "Entrando…",
    createAccount: "Criar conta",
    createAnAccount: "Criar uma conta",
    creatingAccount: "Criando a conta…",
    email: "E-mail",
    password: "Senha",
    enterEmail: "Informe seu e-mail.",
    enterPassword: "Informe sua senha.",
    passwordTooShort: (minimum: number) => `A senha precisa ter pelo menos ${minimum} caracteres.`,
    passwordRemaining: (remaining: number) =>
      `${plural(TAG, remaining, { one: "Falta", other: "Faltam" })} ${remaining} ${plural(TAG, remaining, { one: "caractere", other: "caracteres" })}.`,
    passwordLongEnough: "Já tem o tamanho mínimo.",
    passwordHint: (minimum: number) =>
      `Use pelo menos ${minimum} caracteres. Não há outras regras; uma frase longa funciona bem.`,
    newHere: "É novo por aqui?",
    createOne: "Criar uma conta",
    alreadyHaveAccount: "Já tem uma conta?",
    checkingSession: "Verificando sua sessão",
  },

  tracks: {
    title: "Trilhas de certificação",
    loading: "Carregando as trilhas",
    emptyTitle: "Nenhuma trilha disponível ainda",
    emptyBody: "Volte em breve. As trilhas aparecem aqui quando são publicadas.",
    javaRelease: (release: number) => `Java ${release}`,
    topicCount: (count: number) =>
      `${count} ${plural(TAG, count, { one: "tópico", other: "tópicos" })}`,
  },

  track: {
    fallbackName: "Trilha",
    loading: "Carregando a trilha",
    backToAll: "Voltar para todas as trilhas",
    allTracks: "Todas as trilhas",
    javaRelease: (release: number) => `Java ${release}`,
    objectives: "Objetivos oficiais do exame (abre em uma nova aba)",
    practice: "Praticar",
    practiceTopic: (topic: string) => `Praticar ${topic}`,
    topics: "Tópicos",
    mockHeading: "Simulado completo",
    mockBody:
      "Faça um simulado completo cronometrado, com prazo imposto pelo servidor, feedback adiado e um balanço final por tópico. O blueprint atual do CertForge define a quantidade de questões, a duração e a meta de prática.",
    mockCaveat: "A meta de prática serve de orientação para o estudo e não é uma previsão de nota da Oracle.",
    mockAvailabilityLoading: "Verificando se este simulado pode começar",
    mockUnavailable: (missing: number, topics: number, perTopic: number) =>
      `Ainda não está disponível. ${plural(TAG, missing, { one: "Falta", other: "Faltam" })} ${missing} ${plural(TAG, missing, { one: "questão revisada", other: "questões revisadas" })} em ${topics} ${plural(TAG, topics, { one: "tópico", other: "tópicos" })}. Um simulado completo exige ${perTopic} questões publicadas em cada tópico.`,
    mockMissingCaption: "Questões revisadas que ainda faltam, por tópico",
    mockPublished: "Publicadas",
    mockShortfall: "Faltam",
    continueMock: "Continuar simulado",
    startingMock: "Começando…",
    startMock: (examCode: string) => `Começar simulado ${examCode}`,
  },

  question: {
    heading: (number: number, total: number) => `Questão ${number} de ${total}`,
    chooseAtLeastOne: "Escolha pelo menos uma alternativa.",
    chooseOne: "Escolha uma alternativa.",
    sayConfidence: "Diga o quanto você está confiante.",
    chooseAllCorrect: "Escolha todas as alternativas corretas",
    chooseOneAnswer: "Escolha uma alternativa",
    optionPrefix: (key: string) => `Alternativa ${key}: `,
    confidenceLegend: "Qual sua confiança na resposta?",
    confidenceLow: "Baixa – estou adivinhando",
    confidenceMedium: "Média – estou razoavelmente seguro",
    confidenceHigh: "Alta – tenho certeza",
    submitting: "Enviando…",
    submit: "Enviar resposta",
  },

  feedback: {
    correct: "Correto",
    notQuite: "Quase",
    yourAnswer: "Sua resposta. ",
    correctAnswer: "Alternativa correta.",
    incorrectAnswer: "Alternativa incorreta.",
    explanation: "Explicação",
    readMore: "Saiba mais",
    referenceLink: (title: string) => `${title} (abre em uma nova aba)`,
  },

  session: {
    title: "Sessão de prática",
    loading: "Carregando a sessão",
    backToAll: "Voltar para todas as trilhas",
    resumed: "Você já tinha uma sessão em andamento neste tópico, então está continuando ela.",
    answeredCount: (answered: number, total: number) =>
      `${answered} de ${total} ${plural(TAG, total, { one: "questão respondida", other: "questões respondidas" })}`,
    finish: "Encerrar a sessão",
    next: "Próxima questão",
    allAnswered: "Todas as questões foram respondidas",
    allAnsweredBody: "Encerre a sessão para ver como foi.",
    endTitle: "Confirmar o encerramento da sessão",
    endExplain: "Encerrar esta sessão agora? As respostas que você já deu ficam guardadas.",
    endConfirm: "Sim, encerrar a sessão",
    endCancel: "Continuar praticando",
    endTrigger: "Encerrar a sessão sem terminar",
    completedTitle: "Sessão concluída",
    completedText: "Muito bem. Veja como foi.",
    abandonedTitle: "Sessão encerrada",
    abandonedText: "Você encerrou esta sessão antes do fim. Suas respostas foram guardadas.",
    expiredTitle: "Esta sessão expirou",
    expiredText:
      "As sessões fecham depois de um período sem atividade. As respostas que você já deu foram guardadas; comece uma nova sessão para continuar praticando.",
    answeredOf: (answered: number, total: number) =>
      `Você respondeu ${answered} de ${total} ${plural(TAG, total, { one: "questão", other: "questões" })}.`,
    countingCorrect: "Contando suas respostas corretas",
    correctOf: (correct: number, answered: number) =>
      `${correct} de ${answered} ${plural(TAG, answered, { one: "resposta estava correta", other: "respostas estavam corretas" })}.`,
    statAnswered: "Respondidas",
    statCorrect: "Corretas",
    statNotSeen: "Não vistas",
    endedMeta: (topic: string, closedAt: string | null) =>
      `Tópico: ${topic}${closedAt ? ` · Encerrada em ${closedAt}` : ""}`,
    notSeenOf: (notSeen: number) =>
      `${plural(TAG, notSeen, { one: "Ficou", other: "Ficaram" })} ${notSeen} ${plural(TAG, notSeen, { one: "questão sem ver", other: "questões sem ver" })}.`,
    practiseAgain: "Praticar este tópico de novo",
    seeReview: "Ver a revisão da sessão",
  },

  review: {
    title: "Revisão",
    unknownReason: "Revisão necessária",
    unknownReasonExplanation: "Esta questão precisa ser revisitada.",
    caveat:
      "Estas são questões que valem revisitar, escolhidas pelo que você respondeu. É evidência de onde olhar, não uma previsão sobre o exame.",
    loading: "Carregando sua fila de revisão",
    nothingDueTitle: "Nada previsto ainda",
    nothingToReviewTitle: "Nada para revisar ainda",
    nothingHereTitle: "Nada aqui ainda",
    resting: (waiting: number) =>
      `Você respondeu ${waiting} ${plural(TAG, waiting, { one: "questão", other: "questões" })} corretamente e com confiança, e ${plural(TAG, waiting, { one: "ela está descansando", other: "elas estão descansando" })}. Cada uma volta depois de um intervalo que cresce a cada vez que você acerta.`,
    neverAttempted: (count: number) =>
      `${count} ${plural(TAG, count, { one: "questão", other: "questões" })} dos tópicos que você estudou nunca ${plural(TAG, count, { one: "foi tentada", other: "foram tentadas" })}. A revisão serve para revisitar, então comece pela `,
    startFromTracks:
      "Responda algumas questões e as que valem revisitar aparecem aqui, com o motivo. Comece pela ",
    tracksPageLink: "página de trilhas",
    dueNow: (dueNow: number) =>
      `${dueNow} ${plural(TAG, dueNow, { one: "questão vale", other: "questões valem" })} revisitar`,
    showingFirst: (shown: number) =>
      `, mostrando ${plural(TAG, shown, { one: "a primeira", other: `as primeiras ${shown}` })}`,
    restingMore: (waiting: number) =>
      ` ${plural(TAG, waiting, { one: "Outra", other: "Outras" })} ${waiting} ${plural(TAG, waiting, { one: "está descansando", other: "estão descansando" })} até a próxima recordação.`,
    practise: (count: number, topic: string) =>
      `Praticar ${count} ${plural(TAG, count, { one: "questão", other: "questões" })} em ${topic}`,
    practiseShort: (count: number) =>
      `Praticar ${count} ${plural(TAG, count, { one: "questão", other: "questões" })}`,
    attemptSummary: (attempts: number, wrong: number) =>
      `Respondida ${attempts} ${plural(TAG, attempts, { one: "vez", other: "vezes" })}, ${wrong} ${plural(TAG, wrong, { one: "errada", other: "erradas" })}. Respondida pela última vez em `,
    fallbackTopic: "Tópico",
    reasons: {
      wrongWhileConfident: {
        label: "Errou, e estava confiante",
        explanation:
          "Você respondeu errado dizendo que estava confiante. Isso merece mais da sua atenção do que uma questão em que você sabia que estava adivinhando, porque nada te avisou para olhar de novo.",
      },
      wrong: {
        label: "Errou",
        explanation: "Você respondeu errado.",
      },
      rightButUnsure: {
        label: "Acertou, mas sem confiança",
        explanation:
          "Você respondeu certo dizendo que não estava confiante. Sua precisão conta isso como acerto; acertar duas vezes diria mais.",
      },
      dueForRecall: {
        label: "Hora de recordar",
        explanation:
          "Você respondeu certo e com confiança há algum tempo. Ela está aqui para provar que ficou, e o intervalo até ela voltar cresce a cada vez que você acerta.",
      },
    },
  },

  sessionStatus: {
    inProgress: "Em andamento",
    completed: "Concluída",
    abandoned: "Encerrada antes do fim",
    expired: "Expirada",
  },

  progress: {
    title: "Progresso",
    loading: "Carregando seu progresso",
    emptyTitle: "Nenhum progresso ainda",
    emptyBody: "Responda algumas questões e seu progresso por tópico aparece aqui. Comece pela ",
    tracksPageLink: "página de trilhas",
    tableCaption: "Seu progresso por tópico",
    topic: "Tópico",
    attempted: "Tentadas",
    correct: "Corretas",
    incorrect: "Incorretas",
    accuracy: "Precisão",
    lastActivity: "Última atividade",
    noValue: "–",
    notStarted: "Não começou",
    situation: "Situação",
    solid: "Firme",
    needsReview: "Revisar",
    targetNote: (percent: number) =>
      `“Firme” significa ${percent}% ou mais, a nota de corte do simulado. Descreve sua prática até aqui, não uma previsão sobre o exame.`,
    fallbackTopic: "Tópico",
    misconceptionsHeading: "Onde você estava confiante e errou",
    misconceptionsBodyStart:
      "Estas são respostas que você errou dizendo que estava confiante. Isso vale mais do que um erro que você sabia ser um chute, porque nada te avisou para olhar de novo. É evidência de onde olhar, ",
    misconceptionsBodyNot: "não",
    misconceptionsBodyEnd: " uma previsão sobre o exame.",
    misconceptionsCaption:
      "Respostas erradas com confiança por tópico, com quantas questões elas abrangem",
    wrongWhileSure: "Erros com confiança",
    acrossQuestions: "Em quantas questões",
    mostRecent: "Mais recente",
    reviewThese: "Revisar estas questões",
  },

  history: {
    title: "Histórico",
    loading: "Carregando suas sessões",
    emptyTitle: "Nenhum histórico de estudo ainda",
    emptyBodyStart: "Comece uma sessão de prática em um tópico, ou um simulado, na ",
    tracksPageLink: "página de trilhas",
    mockHeading: "Simulados",
    mockLoading: "Carregando seus simulados",
    noMocks:
      "Nenhum simulado ainda. Um simulado precisa de cinco questões revisadas em cada tópico.",
    mockTableCaption: "Seus simulados, do mais recente para o mais antigo",
    track: "Trilha",
    score: "Nota",
    topicsToReview: "Tópicos para revisar",
    fallbackTrack: "Trilha de certificação",
    continueMockHint: " (continuar o simulado)",
    mockResultHint: " (ver o resultado do simulado)",
    noValue: "–",
    none: "Nenhum",
    mockScore: (correct: number, total: number, percentage: number) =>
      `${correct} de ${total} (${percentage}%)`,
    loadMoreMocks: "Carregar mais simulados",
    practiceHeading: "Prática por tópico",
    noPractice: "Nenhuma sessão de prática por tópico ainda.",
    tableCaption: "Suas sessões de prática, da mais recente para a mais antiga",
    topic: "Tópico",
    started: "Início",
    status: "Situação",
    answered: "Respondidas",
    correct: "Corretas",
    fallbackTopic: "Tópico",
    continueHint: " (continuar)",
    reviewHint: " (ver as respostas)",
    answeredOf: (answered: number, requested: number) => `${answered} de ${requested}`,
    loadingMore: "Carregando…",
    loadMore: "Carregar mais sessões",
  },

  sessionReview: {
    title: "Respostas da sessão",
    backToHistory: "Voltar para o histórico",
    loading: "Carregando suas respostas",
    emptyTitle: "Nenhuma resposta nesta sessão",
    emptyBody: "Nada foi respondido antes de a sessão fechar.",
    questionHeading: (number: number, correct: boolean) =>
      `Questão ${number}: ${correct ? "correta" : "incorreta"}`,
    yourAnswerLine: (options: string, confidence: string, elapsedSeconds: number) =>
      `Sua resposta: ${options}. Confiança: ${confidence}. ${elapsedSeconds} ${plural(TAG, elapsedSeconds, { one: "segundo", other: "segundos" })} para responder. Respondida em `,
    confidenceName: (confidence: string) =>
      ({ LOW: "baixa", MEDIUM: "média", HIGH: "alta" })[confidence] ?? confidence.toLowerCase(),
    showAnswer: "Mostrar a alternativa correta e a explicação",
  },

  mock: {
    title: "Simulado",
    loading: "Carregando o simulado",
    closed: "Este simulado está fechado. O gabarito já está disponível no resultado.",
    viewResult: "Ver o resultado e as respostas",
    noQuestions: "Nenhuma questão foi encontrada.",
    resumed: "Você já tinha este simulado em andamento, então está continuando ele.",
    answeredAndTarget: (answered: number, total: number, target: number) =>
      `${answered} de ${total} ${plural(TAG, total, { one: "respondida", other: "respondidas" })} · Meta de prática ${target}%`,
    timeRemainingLabel: (remaining: string) => `Tempo restante ${remaining}`,
    timeRemaining: "Tempo restante",
    navigationLabel: "Navegação pelas questões",
    questions: "Questões",
    questionButtonLabel: (number: number, answered: boolean, flagged: boolean) =>
      `Questão ${number}${answered ? ", respondida" : ""}${flagged ? ", marcada para revisar" : ""}`,
    legend: "Legenda da navegação pelas questões",
    legendAnswered: "Respondida",
    legendFlagged: "Marcada",
    legendCurrent: "Atual",
    questionHeading: (number: number, total: number) => `Questão ${number} de ${total}`,
    removeFlag: "Desmarcar para revisar",
    addFlag: "Marcar para revisar",
    previous: "Anterior",
    next: "Próxima",
    submitTitle: "Entregar o simulado",
    submitExplain: (unanswered: number) =>
      `Entregar agora? ${unanswered} ${plural(TAG, unanswered, { one: "questão não respondida vai contar como incorreta", other: "questões não respondidas vão contar como incorretas" })}. Você não pode mudar as respostas depois de entregar.`,
    submitConfirm: "Entregar o simulado",
    submitCancel: "Continuar respondendo",
    submitTrigger: "Encerrar e corrigir o simulado",
    answerSubmitted: "Resposta enviada. O feedback fica oculto até o simulado terminar.",
    chooseAllThatApply: "Escolha todas as que se aplicam",
    chooseOneAnswer: "Escolha uma alternativa",
    saving: "Salvando…",
    saveAnswer: "Salvar resposta",
  },

  mockResult: {
    title: "Resultado do simulado",
    loading: "Carregando o resultado",
    reached: "Meta de prática alcançada",
    notReached: "Meta de prática não alcançada",
    percentage: (percentage: number) => `${percentage}%`,
    correctOf: (correct: number, total: number, answered: number) =>
      `${correct} ${plural(TAG, correct, { one: "correta", other: "corretas" })} de ${total} ${plural(TAG, total, { one: "questão", other: "questões" })}; ${answered} ${plural(TAG, answered, { one: "respondida", other: "respondidas" })}.`,
    target: (percentage: number, correct: number) =>
      `Meta de prática: ${percentage}% (${correct} ${plural(TAG, correct, { one: "correta", other: "corretas" })}).`,
    elapsed: (elapsed: string) => `Tempo gasto: ${elapsed}.`,
    elapsedWithHours: (hours: number, minutes: number, seconds: number) =>
      `${hours}h ${minutes}min ${seconds}s`,
    elapsedShort: (minutes: number, seconds: number) => `${minutes}min ${seconds}s`,
    caveat:
      "Esta nota descreve esta rodada de prática no CertForge; não é uma previsão do exame real.",
    breakdown: "Balanço por tópico",
    topic: "Tópico",
    correct: "Corretas",
    answered: "Respondidas",
    score: "Nota",
    fallbackTopic: "Tópico",
    outOf: (value: number, total: number) => `${value} / ${total}`,
    scoreLabel: "Resultado",
    unanswered: (count: number) =>
      `${plural(TAG, count, { one: "Ficou", other: "Ficaram" })} ${count} ${plural(TAG, count, { one: "questão sem resposta", other: "questões sem resposta" })} e ${plural(TAG, count, { one: "conta", other: "contam" })} como erradas.`,
    questionReview: "Revisão das questões",
    questionSummary: (number: number, correct: boolean, answered: boolean) =>
      `Questão ${number}: ${correct ? "Correta" : answered ? "Incorreta" : "Não respondida"}`,
    backToTracks: "Voltar para as trilhas",
  },

  notFound: {
    title: "Página não encontrada",
    emptyTitle: "Não há nada neste endereço",
    bodyStart: "Volte para a ",
    tracksLink: "lista de trilhas",
  },

  editorial: {
    deskTitle: "Mesa editorial",
    noDeskAccess: "Você não tem acesso à mesa editorial",
    noDeskAccessBody: "Peça o papel de editor ou revisor a um administrador.",
    catalogTitle: "Catálogo",
    noCatalogAccess: "Você não tem acesso ao catálogo",
    noCatalogAccessBody:
      "Cuidar do catálogo é trabalho de administrador. Fale com um se algo ali parecer errado.",
    newQuestion: "Nova questão",
    backToQuestions: "Voltar para as questões",
    cannotAuthor: "Você não pode escrever questões",
    cannotAuthorBody: "Peça o papel de editor a um administrador.",

    status: {
      draft: "Rascunho",
      inReview: "Em revisão",
      approved: "Aprovada",
      published: "Publicada",
      replaced: "Substituída",
    },
    statusRailLabel: "Situação da versão",
    stepDone: " (concluído)",

    catalogStatus: {
      active: "Ativa",
      draft: "Rascunho",
      inactive: "Inativa",
    },

    type: {
      singleChoice: "Escolha única",
      multipleChoice: "Escolha múltipla",
      guidedResponse: "Resposta guiada",
    },

    difficulty: {
      easy: "Fácil",
      medium: "Média",
      hard: "Difícil",
    },

    checklist: {
      technicalAccuracy: "A alternativa correta está tecnicamente certa para a versão do Java indicada",
      codeVerified: "O código compila e imprime o que a questão diz",
      noAmbiguity: "Nada no enunciado é ambíguo",
      reasonsAccurate: "Todo motivo está correto, inclusive os das alternativas erradas",
      officialReferences: "As referências são documentação oficial",
    },

    violations: {
      promptMissing: "Escreva o enunciado.",
      topicMissing: "Escolha um tópico.",
      javaReleaseMissing: "Informe a versão do Java.",
      javaReleaseNotApplicable: "Uma questão de entrevista não declara versão do Java. Limpe o campo.",
      seniorityMissing: "Diga em que nível isto é perguntado.",
      seniorityNotApplicable: "Uma questão de certificação não declara nível. Limpe o campo.",
      difficultyMissing: "Escolha uma dificuldade.",
      difficultyRationaleMissing: "Explique por que essa dificuldade se aplica.",
      explanationMissing: "Escreva a explicação.",
      optionsTooFew: "Adicione pelo menos duas alternativas.",
      optionKeyDuplicate: "Duas alternativas têm a mesma letra.",
      optionTextMissing: "Toda alternativa precisa de texto.",
      optionExplanationMissing: "Toda alternativa precisa de um motivo, inclusive as erradas.",
      exactlyOneCorrect: "Marque exatamente uma alternativa como correta.",
      atLeastOneCorrect: "Marque pelo menos uma alternativa como correta.",
      guidedRequiresInterview: "Respostas guiadas pertencem a uma trilha de entrevista.",
      guidedExplanationNotApplicable: "Uma resposta guiada usa critérios revisados no lugar da explicação objetiva.",
      guidedOptionsNotApplicable: "Uma resposta guiada não tem alternativas.",
      guidedCriteriaNotApplicable: "Questões objetivas não podem carregar critérios de resposta guiada.",
      guidedCriteriaMissing: "Adicione os critérios revisados da resposta guiada.",
      guidedReferenceAnswerMissing: "Escreva a resposta de referência revisada.",
      guidedExpectedConceptsMissing: "Adicione pelo menos um conceito esperado.",
      guidedRequiredConceptMissing: "Marque pelo menos um conceito esperado como obrigatório.",
      guidedConceptTextMissing: "Todo conceito esperado precisa de texto.",
      guidedCommonMistakeInvalid: "Remova a entrada vazia de erro comum.",
      guidedFollowUpInvalid: "Remova a entrada vazia de follow-up.",
      referencesMissing: "Adicione pelo menos uma referência oficial.",
      referenceInvalid: "Toda referência precisa de um título e de um link que comece com https.",
    },

    catalogPage: {
      note: "O que pode ser oferecido a quem estuda, e contra o que o conteúdo pode ser publicado. Esta visão é somente de leitura: nesta versão o catálogo é criado por migração de banco.",
      loading: "Carregando o catálogo",
      emptyTitle: "Não há trilhas",
      emptyBody: "Uma trilha vem de uma migração. Um catálogo vazio significa que nenhuma foi aplicada.",
      tableCaption: "Trilhas de preparação",
      certificationKind: "Trilha de certificação",
      interviewKind: "Trilha de entrevistas",
      topicCount: (count: number) => `${count} ${plural(TAG, count, { one: "tópico", other: "tópicos" })}`,
      track: "Trilha",
      status: "Situação",
      provider: "Fornecedor",
      examVersions: "Versões do exame",
      topics: "Tópicos",
      versionCount: (total: number, active: number) =>
        `${total} (${active} ${plural(TAG, active, { one: "ativa", other: "ativas" })})`,
    },

    queue: {
      title: "Questões",
      filterAll: "Todas",
      filterDrafts: "Rascunhos",
      filterWaiting: "Esperando revisão",
      filterApproved: "Aprovadas",
      filterPublished: "Publicadas",
      filterLabel: "Filtrar por situação",
      loading: "Carregando as questões",
      emptyWithStatus: "Nenhuma questão com esta situação",
      emptyTitle: "Nenhuma questão ainda",
      emptyBodyAuthor: "Escreva a primeira em Nova questão, ou importe um pacote de conteúdo.",
      emptyBodyReader: "As questões aparecem aqui quando um editor as escreve.",
      tableCaption: (filter: string) => `Questões: ${filter.toLowerCase()}`,
      question: "Questão",
      topic: "Tópico",
      status: "Situação",
      revision: "Versão",
      untitled: "Rascunho sem título",
      fallbackTopic: "Tópico",
      noTopicYet: "Sem tópico ainda",
    },

    catalogTrack: {
      fallbackName: "Trilha",
      backToCatalog: "Voltar para o catálogo",
      loading: "Carregando a trilha",
      javaRelease: (release: number) => `Java ${release}`,
      examNameAndCode: (name: string, code: string) => `${name} (${code})`,
      objectives: "Objetivos oficiais do exame (abre em uma nova aba)",
      noExam: "Uma versão de taxonomia, sem exame por trás.",
      publishableNoRelease: ". Essas questões não declaram versão do Java, porque não há exame a mirar.",
      noTopicMapped: "Nenhum tópico está mapeado para esta versão do exame.",
      mappedCaption: (label: string) => `Tópicos mapeados para ${label}, em ordem`,
      number: "#",
      topic: "Tópico",
      objectiveWording: "Texto do objetivo para este exame",
      topicOutsideTrack: "Tópico fora desta trilha",
      publishingHeading: "Onde o conteúdo pode ser publicado",
      notActive: (status: string) =>
        `Esta trilha está ${status}, então nenhuma questão dela é oferecida a quem estuda.`,
      publishableStart: (topics: number) =>
        `Questões podem ser publicadas nos ${topics} tópicos mapeados para `,
      publishableRelease: ", e precisam ser escritas para o ",
      publishableEnd: ". Uma versão escrita para outro release é recusada na publicação.",
      noActiveVersion:
        "Nenhuma versão do exame está ativa, então nada pode ser publicado nesta trilha: a publicação vincula a versão da questão à versão ativa do exame no tópico.",
      unmapped: (count: number) =>
        `${count} ${plural(TAG, count, { one: "tópico não está mapeado", other: "tópicos não estão mapeados" })} para a versão ativa do exame. Uma questão ${plural(TAG, count, { one: "nele", other: "neles" })} pode ser escrita e aprovada, mas publicá-la é recusado.`,
      versionsHeading: "Versões do exame",
      noVersions: "Esta trilha não tem versão de exame.",
    },

    revisionView: {
      javaRelease: (release: number) => `Java ${release}`,
      writtenBy: (author: string) => `Escrita por ${author}`,
      authorUnknown: "Autoria desconhecida",
      publishedBy: (publisher: string) => ` · Publicada por ${publisher}`,
      learnerViewHeading: "Como quem estuda vai ver",
      learnerViewNote: "Nenhuma resposta aparece aqui, exatamente como em uma sessão de estudo.",
      answerKeyHeading: "Gabarito e motivos",
      optionVerdict: (key: string, correct: boolean) =>
        `${key} está ${correct ? "correta" : "incorreta"}`,
      guidedCriteriaHeading: "Critérios revisados da resposta",
      guidedCriteriaNote:
        "Estes são conceitos revisados para autoavaliação e futura avaliação guiada. Eles não representam acerto binário nem nota de contratação.",
      referenceAnswer: "Resposta de referência",
      expectedConcepts: "Conceitos esperados",
      requiredConcept: "Obrigatório",
      optionalConcept: "Opcional",
      commonMistakes: "Erros comuns",
      followUps: "Follow-ups revisados",
      explanation: "Explicação",
      whyThisDifficulty: "Por que esta dificuldade",
      references: "Referências",
      notesHeading: "Notas da revisão",
      checked: "Verificado: ",
      decisionLabel: "Decisão da revisão",
      decisionApproved: "Aprovada",
      decisionChangesRequested: "Pediu mudanças",
      decidedBy: (reviewer: string) => ` por ${reviewer}`,
    },

    reviewPanel: {
      policyLegend: "Política de conteúdo",
      checklistCount: (checked: number, total: number) => `${checked} de ${total} verificados`,
      policyHint:
        "Marque só o que você mesmo verificou. Os itens que você marcar ficam registrados com sua decisão.",
      comment: "Comentário",
      commentHint: "Obrigatório quando você pede mudanças. Quem escreveu vai ler.",
      approve: "Aprovar",
      requestChanges: "Pedir mudanças",
      requestChangesHint: "Pedir mudanças devolve a versão a quem a escreveu, como rascunho.",
      sayWhatToChange: "Diga o que precisa mudar antes de devolver.",
      publishHeading: "Publicar",
      publishNote:
        "Só versões aprovadas podem ser publicadas. Uma versão publicada não pode ser editada; uma correção vira uma nova versão.",
      confirmPublishTitle: (revision: number) => `Confirmar a publicação da versão ${revision}`,
      unknownReviewer: "Revisor não registrado",
      unknownApprovalDate: "data da aprovação não registrada",
      confirmPublishExplain: (revision: number, topic: string, reviewer: string, date: string) =>
        `Publicar a versão ${revision} no tópico ${topic}? Aprovada por ${reviewer} em ${date}. Esta questão ficará disponível para estudantes. A publicação é definitiva: não pode ser desfeita nem editada; correções exigem uma nova versão.`,
      confirmPublishLabel: (revision: number) => `Sim, publicar a versão ${revision}`,
      publishRevision: (revision: number) => `Publicar a versão ${revision}`,
      approveFirst: "Aprove antes.",
      retireHeading: "Retirar",
      retireNote:
        "Uma versão retirada continua no histórico e nas respostas passadas de quem estuda, e nenhuma sessão nova vai usá-la.",
      confirmRetireTitle: (revision: number) => `Confirmar a retirada da versão ${revision}`,
      confirmRetireExplain: (revision: number) =>
        `Retirar a versão ${revision}? Sessões novas não vão mais incluir esta questão, a menos que uma versão mais nova seja publicada.`,
      confirmRetireLabel: (revision: number) => `Sim, retirar a versão ${revision}`,
      retireRevision: (revision: number) => `Retirar a versão ${revision}`,
      reviseHeading: "Corrigir esta questão",
      reviseNote:
        "Começar uma versão copia esta para um novo rascunho. O texto publicado continua como está até a nova ser publicada.",
      startRevision: "Começar uma nova versão",
    },

    editor: {
      unsavedLabel: "Mudanças não salvas",
      unsavedWarning: "Você tem mudanças que não foram salvas. Se sair agora, elas são perdidas.",
      keepEditing: "Continuar editando",
      leaveWithoutSaving: "Sair sem salvar",
      reviewerAskedForChanges: (reviewer: string) => `${reviewer} pediu mudanças`,
      someoneAskedForChanges: "Um revisor pediu mudanças",
      trackGroup: (track: string, kind: string) => `${track} (${kind})`,
    kindCertification: "certificação",
    kindInterview: "entrevista",
    typeLegend: "Tipo",
      guidedLegend: "Critérios da resposta guiada",
      guidedHint:
        "Estes critérios são conteúdo revisado. Eles só aparecem depois que quem estuda envia uma resposta no futuro fluxo de entrevista.",
      referenceAnswer: "Resposta de referência",
      referenceAnswerHint: "A resposta revisada com a qual quem estuda poderá comparar a própria resposta depois de enviá-la.",
      expectedConcepts: "Conceitos esperados",
      expectedConceptsHint: "Pelo menos um conceito deve ser obrigatório. Conceitos opcionais ainda podem fortalecer a resposta.",
      expectedConcept: (number: number) => `Conceito esperado ${number}`,
      conceptRequired: "Este conceito é obrigatório",
      conceptExplanation: (number: number) => `Por que o conceito ${number} importa`,
      removeConcept: (number: number) => `Remover conceito esperado ${number}`,
      addConcept: "Adicionar outro conceito esperado",
      commonMistakes: "Erros comuns",
      commonMistake: (number: number) => `Erro comum ${number}`,
      removeCommonMistake: (number: number) => `Remover erro comum ${number}`,
      addCommonMistake: "Adicionar outro erro comum",
      followUps: "Follow-ups revisados",
      followUp: (number: number) => `Follow-up ${number}`,
      removeFollowUp: (number: number) => `Remover follow-up ${number}`,
      addFollowUp: "Adicionar outro follow-up",
      topic: "Tópico",
      chooseTopic: "Escolha um tópico",
      difficulty: "Dificuldade",
      chooseDifficulty: "Escolha uma dificuldade",
      javaRelease: "Versão do Java",
      seniority: "Perguntada a",
      chooseSeniority: "Escolha um nível",
      seniorityPleno: "Pleno",
      senioritySenior: "Sênior",
      seniorityHint: "O nível em que se espera que a pessoa responda. Não é o mesmo que dificuldade: uma questão pode ser difícil para qualquer um e ainda assim ser justa para um Pleno.",
      whyThisDifficulty: "Por que esta dificuldade",
      whyThisDifficultyHint: "O que faz um candidato ter chance de errar?",
      question: "Enunciado",
      questionHint:
        "Coloque código em um bloco cercado (três acentos graves). Quem estuda vê exatamente como foi escrito.",
      optionsLegend: "Alternativas",
      optionsHint: (multiple: boolean) =>
        `${multiple ? "Marque todas as alternativas corretas." : "Marque a única alternativa correta."} Toda alternativa precisa de um motivo, mostrado a quem estuda depois de responder, inclusive as erradas.`,
      optionLabel: (key: string) => `Alternativa ${key}`,
      optionIsCorrect: (key: string) => `A alternativa ${key} está correta`,
      reasonFor: (key: string) => `Motivo de ${key}`,
      removeOption: (key: string) => `Remover a alternativa ${key}`,
      addOption: "Adicionar outra alternativa",
      explanation: "Explicação",
      explanationHint: "Mostrada depois de quem estuda responder.",
      referencesLegend: "Referências",
      referencesHint: "Somente documentação oficial. Os links precisam começar com https://",
      referenceTitle: (number: number) => `Título da referência ${number}`,
      referenceUrl: (number: number) => `Link da referência ${number}`,
      removeReference: (number: number) => `Remover a referência ${number}`,
      addReference: "Adicionar outra referência",
      saveDraft: "Salvar rascunho",
      sendForReview: "Enviar para revisão",
      saving: "Salvando…",
      savedAt: (time: string) => `Salvo às ${time}`,
      checksHeading: "Antes de poder enviar",
      checksHint:
        "O envio verifica a versão inteira. O que estiver faltando aparece aqui, e cada item leva você até o campo dele.",
      nothingMissing: "Não falta nada.",
      needsAnotherReviewer:
        "Um revisor diferente de você precisa aprovar antes de a questão poder ser publicada.",
    },

    questionPage: {
      fallbackTitle: "Questão",
      revisionTitle: (number: number) => `Versão ${number}`,
      loading: "Carregando a questão",
      currentStatus: "Situação atual: ",
      revisionsLabel: "Versões",
      revisionTab: (number: number) => `Versão ${number}`,
      notices: {
        sent: "Enviada para revisão. Um revisor diferente de você vai pegá-la na fila.",
        saved: "Rascunho salvo.",
        approved: "Aprovada. Um administrador já pode publicá-la.",
        changes: "Devolvida a quem escreveu, com seu comentário. Voltou a ser rascunho.",
        published: "Publicada. Quem estuda já pode receber esta questão nas sessões.",
        retired: "Retirada. Continua no histórico e nenhuma sessão nova vai usá-la.",
        started: "Nova versão começada como rascunho, copiada da anterior.",
      },
    },

    diff: {
      heading: (revision: number) => `O que mudou desde a versão ${revision}`,
      nothingDiffers: (revision: number) => `Nada difere da versão ${revision}.`,
      added: "[adicionado: ",
      removed: "[removido: ",
      closeBracket: "]",
      question: "Enunciado",
      type: "Tipo",
      topic: "Tópico",
      anotherTopic: "Outro tópico",
      difficulty: "Dificuldade",
      javaRelease: "Versão do Java",
      seniority: "Perguntada a",
      whyThisDifficulty: "Por que esta dificuldade",
      explanation: "Explicação",
      guidedReferenceAnswer: "Resposta de referência",
      guidedExpectedConcepts: "Conceitos esperados",
      guidedCommonMistakes: "Erros comuns",
      guidedFollowUps: "Follow-ups",
      optionAdded: (key: string) => `Alternativa ${key} adicionada`,
      optionRemoved: (key: string) => `Alternativa ${key} removida`,
      option: (key: string) => `Alternativa ${key}`,
      optionCorrectness: (key: string) => `Correção da alternativa ${key}`,
      reasonFor: (key: string) => `Motivo de ${key}`,
      correct: "correta",
      incorrect: "incorreta",
      referenceRemoved: "Referência removida",
      referenceAdded: "Referência adicionada",
    },
  },
};
