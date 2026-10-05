import { plural } from "./plural";

/**
 * Every string the interface shows, in English, which is the canonical catalog: the shape of this
 * object is the contract every other locale has to satisfy, and `Catalog` is derived from it so
 * the type checker is what guarantees a complete translation.
 *
 * A missing key, a key that exists here and not in another locale, a key spelt wrongly at a call
 * site, and a value with the wrong number of arguments are all compile errors. That is the whole
 * "no untranslated string ships" problem, solved at build time with no dependency (ADR 0012, #74).
 *
 * What does *not* belong here: question text. Prompts, options, explanations, references and the
 * topic and objective wording stay in English in every locale, by ADR 0012 decision 2, because the
 * exam is sat in English and a translated question is new content needing its own review.
 *
 * Strings that take a value are written as functions rather than as templates with placeholders,
 * so the argument list is part of the type and a locale cannot quietly drop one.
 */
/** This locale's own tag, which is what its plural rules are resolved against. */
const TAG = "en";

export const en = {
  language: {
    label: "Language",
    /** Each language is named in itself, which is what a reader scanning the list looks for. */
    change: "Change language",
  },

  layout: {
    skipToMain: "Skip to main content",
    brand: "CertForge",
    mainNavigation: "Main",
    tracks: "Tracks",
    review: "Review",
    progress: "Progress",
    history: "History",
    editorial: "Editorial",
    signOut: "Sign out",
  },

  states: {
    loading: "Loading",
    errorTitle: "That did not work",
    reference: "Reference:",
    tryAgain: "Try again",
  },

  form: {
    problemTitle: "There is a problem",
    errorPrefix: "Error: ",
  },

  confirm: {
    cancel: "Cancel",
  },

  prompt: {
    codeExample: "Code example",
  },

  /**
   * What a learner reads for each stable error code. The backend never sends text meant for
   * display; it sends a code, and the wording lives here so it can be reviewed and translated.
   */
  errors: {
    unknown: "Something went wrong. Please try again.",
    network: "The server cannot be reached. Check your connection and try again.",
    unauthenticated: "Your session has ended. Please sign in again.",
    invalidCredentials: "The email or password is incorrect.",
    tooManyAttemptsIn: (seconds: number) =>
      `Too many attempts. Wait ${seconds} seconds and try again.`,
    tooManyAttempts: "Too many attempts. Wait a little and try again.",
    emailAlreadyRegistered: "An account with this email already exists. Try signing in instead.",
    passwordTooShort: "The password must have at least 12 characters.",
    passwordTooLong: "The password is too long. Use at most 72 bytes.",
    passwordEqualsEmail: "The password must not be the same as your email.",
    validationFailed: "Some of the information is not valid. Check the form and try again.",
    csrfInvalid: "The page's security token expired. Try again.",
    trackNotFound: "This track does not exist or is not available.",
    topicNotFound: "This topic does not exist or is not available.",
    insufficientContent:
      "There are not enough published questions on this topic yet. Try another topic.",
    activeSessionExists: "You already have a practice session in progress for this topic.",
    sessionNotFound: "This practice session does not exist.",
    sessionExpired: "This practice session expired. Answers you already gave were kept.",
    sessionNotInProgress: "This practice session is already finished.",
    alreadyAnswered: "You already answered this question.",
    concurrentSubmission: "Your answer is still being saved. Wait a moment and try again.",
    idempotency: "Your answer could not be saved safely. Reload the page and try again.",
    chooseOne: "Choose one answer from the list.",
    questionCountOutOfRange: "That number of questions is not allowed.",
    questionNotFound: "This question or revision does not exist.",
    revisionIncomplete:
      "The revision is not complete yet. The list beside the form says what is missing.",
    revisionNotEditable: "Only a draft can be edited. Create a new revision to change this question.",
    notRevisionAuthor: "Only the author of a revision can change or send it.",
    revisionNotInReview: "This revision is not waiting for review any more.",
    revisionNotApproved: "Only an approved revision can be published.",
    reviewerMustDiffer: "A revision cannot be reviewed by the person who wrote it.",
    openRevisionExists: "This question already has a revision in progress.",
    topicNotActive: "That topic is not active. Choose another one.",
    forbidden: "You do not have permission to do that.",
    serverSide: "Something went wrong on our side. Please try again.",
    requestFailed: "The request could not be completed.",
  },
  documentTitle: {
    /** Each page names itself; this is the suffix the tab and screen readers read after it. */
    suffix: (page: string) => `${page} · CertForge`,
  },

  auth: {
    signIn: "Sign in",
    signingIn: "Signing in…",
    createAccount: "Create account",
    createAnAccount: "Create an account",
    creatingAccount: "Creating account…",
    email: "Email",
    password: "Password",
    enterEmail: "Enter your email address.",
    enterPassword: "Enter your password.",
    passwordTooShort: (minimum: number) => `The password must have at least ${minimum} characters.`,
    passwordHint: (minimum: number) =>
      `Use at least ${minimum} characters. There are no other rules; a long phrase works well.`,
    newHere: "New here?",
    createOne: "Create an account",
    alreadyHaveAccount: "Already have an account?",
    checkingSession: "Checking your session",
  },
  tracks: {
    title: "Certification tracks",
    loading: "Loading tracks",
    emptyTitle: "No tracks are available yet",
    emptyBody: "Check back soon. Tracks appear here once they are published.",
    javaRelease: (release: number) => `Java ${release}`,
    topicCount: (count: number) =>
      `${count} ${plural(TAG, count, { one: "topic", other: "topics" })}`,
  },

  track: {
    fallbackName: "Track",
    loading: "Loading track",
    backToAll: "Back to all tracks",
    allTracks: "All tracks",
    javaRelease: (release: number) => `Java ${release}`,
    objectives: "Official exam objectives (opens in a new tab)",
    practice: "Practice",
    practiceTopic: (topic: string) => `Practice ${topic}`,
    topics: "Topics",
    mockHeading: "Full mock exam",
    mockBody:
      "Run a timed full mock with a server-enforced deadline, delayed feedback and a final topic breakdown. The current CertForge blueprint controls the question count, duration and practice target.",
    mockCaveat: "The practice target is for study guidance and is not an Oracle score prediction.",
    startingMock: "Starting…",
    startMock: (examCode: string) => `Start ${examCode} mock`,
  },
  question: {
    heading: (number: number, total: number) => `Question ${number} of ${total}`,
    chooseAtLeastOne: "Choose at least one answer.",
    chooseOne: "Choose an answer.",
    sayConfidence: "Say how confident you are.",
    chooseAllCorrect: "Choose all the correct answers",
    chooseOneAnswer: "Choose one answer",
    optionPrefix: (key: string) => `Option ${key}: `,
    confidenceLegend: "How confident are you?",
    confidenceLow: "Low – I am guessing",
    confidenceMedium: "Medium – I am fairly sure",
    confidenceHigh: "High – I am certain",
    submitting: "Submitting…",
    submit: "Submit answer",
  },

  feedback: {
    correct: "Correct",
    notQuite: "Not quite",
    yourAnswer: "Your answer. ",
    correctAnswer: "Correct answer.",
    incorrectAnswer: "Incorrect answer.",
    explanation: "Explanation",
    readMore: "Read more",
    referenceLink: (title: string) => `${title} (opens in a new tab)`,
  },
  session: {
    title: "Practice session",
    loading: "Loading session",
    backToAll: "Back to all tracks",
    resumed: "You already had a session in progress for this topic, so you are continuing it.",
    answeredCount: (answered: number, total: number) =>
      `${answered} of ${total} ${plural(TAG, total, { one: "question", other: "questions" })} answered`,
    finish: "Finish session",
    next: "Next question",
    allAnswered: "All questions answered",
    allAnsweredBody: "Finish the session to see how it went.",
    endTitle: "Confirm ending the session",
    endExplain: "End this session now? The answers you already gave are kept.",
    endConfirm: "Yes, end the session",
    endCancel: "Keep practising",
    endTrigger: "End session without finishing",
    completedTitle: "Session finished",
    completedText: "Well done. Here is how it went.",
    abandonedTitle: "Session ended",
    abandonedText: "You ended this session early. Your answers were kept.",
    expiredTitle: "This session expired",
    expiredText:
      "Sessions close after a period without activity. Answers you already gave were kept; start a new session to continue practising.",
    answeredOf: (answered: number, total: number) =>
      `You answered ${answered} of ${total} ${plural(TAG, total, { one: "question", other: "questions" })}.`,
    countingCorrect: "Counting your correct answers",
    correctOf: (correct: number, answered: number) =>
      `${correct} of ${answered} ${plural(TAG, answered, { one: "answer was", other: "answers were" })} correct.`,
  },
  /**
   * Counts are written as functions of the count rather than as a string plus a plural suffix, so
   * a locale whose plural rules differ from English can decide the whole sentence for itself.
   */
  review: {
    title: "Review",
    loading: "Loading your review queue",
    nothingDueTitle: "Nothing is due yet",
    nothingToReviewTitle: "Nothing to review yet",
    nothingHereTitle: "Nothing here yet",
    resting: (waiting: number) =>
      `You have answered ${waiting} ${plural(TAG, waiting, { one: "question", other: "questions" })} correctly and confidently, and ${plural(TAG, waiting, { one: "it is resting", other: "they are resting" })}. Each comes back after a gap that grows every time you get it right.`,
    neverAttempted: (count: number) =>
      `${count} ${plural(TAG, count, { one: "question", other: "questions" })} in the topics you have studied ${plural(TAG, count, { one: "has", other: "have" })} never been attempted. Review is for revisiting, so start from the `,
    startFromTracks: "Answer some questions and the ones worth revisiting appear here, with the reason. Start from the ",
    tracksPageLink: "tracks page",
    dueNow: (dueNow: number) =>
      `${dueNow} ${plural(TAG, dueNow, { one: "question is", other: "questions are" })} worth revisiting`,
    showingFirst: (shown: number) => `, showing the first ${shown}`,
    restingMore: (waiting: number) =>
      ` ${waiting} more ${plural(TAG, waiting, { one: "is", other: "are" })} resting until their next recall.`,
    practise: (count: number, topic: string) =>
      `Practise ${count} ${plural(TAG, count, { one: "question", other: "questions" })} in ${topic}`,
    attemptSummary: (attempts: number, wrong: number) =>
      `Answered ${attempts} ${plural(TAG, attempts, { one: "time", other: "times" })}, ${wrong} wrong. Last answered `,
    fallbackTopic: "Topic",
    reasons: {
      wrongWhileConfident: {
        label: "Wrong, and you were sure",
        explanation:
          "You answered this incorrectly while saying you were confident. That is worth more of your attention than a question you knew you were guessing at, because nothing has told you to look again.",
      },
      wrong: {
        label: "Wrong",
        explanation: "You answered this incorrectly.",
      },
      rightButUnsure: {
        label: "Right, but unsure",
        explanation:
          "You answered this correctly while saying you were not confident. Your accuracy counts it as a success; getting it right twice would mean more.",
      },
      dueForRecall: {
        label: "Due for recall",
        explanation:
          "You answered this correctly and confidently a while ago. It is here to prove it stuck, and the gap before it returns grows each time you get it right.",
      },
    },
  },

  sessionStatus: {
    inProgress: "In progress",
    completed: "Completed",
    abandoned: "Ended early",
    expired: "Expired",
  },
  progress: {
    title: "Progress",
    loading: "Loading your progress",
    emptyTitle: "No progress yet",
    emptyBody: "Answer some questions and your progress by topic appears here. Start from the ",
    tracksPageLink: "tracks page",
    tableCaption: "Your progress by topic",
    topic: "Topic",
    attempted: "Attempted",
    correct: "Correct",
    incorrect: "Incorrect",
    accuracy: "Accuracy",
    lastActivity: "Last activity",
    /** Shown where there is no number to show, so it is punctuation rather than a word. */
    noValue: "–",
    fallbackTopic: "Topic",
    misconceptionsHeading: "Where you were sure and wrong",
    misconceptionsBodyStart:
      "These are answers you got wrong while saying you were confident. That is worth more than a wrong answer you knew was a guess, because nothing told you to look again. It is evidence of where to look, ",
    misconceptionsBodyNot: "not",
    misconceptionsBodyEnd: " a prediction about an exam.",
    misconceptionsCaption: "Confidently wrong answers by topic, with how many questions they span",
    wrongWhileSure: "Wrong while sure",
    acrossQuestions: "Across questions",
    mostRecent: "Most recent",
    reviewThese: "Review these questions",
  },
  history: {
    title: "History",
    loading: "Loading your sessions",
    emptyTitle: "No study history yet",
    emptyBodyStart: "Start a topic practice session or a mock exam from the ",
    tracksPageLink: "tracks page",
    mockHeading: "Mock exams",
    mockLoading: "Loading your mock exams",
    noMocks: "No mock exams yet.",
    mockTableCaption: "Your mock exams, newest first",
    track: "Track",
    score: "Score",
    topicsToReview: "Topics to review",
    fallbackTrack: "Certification track",
    continueMockHint: " (continue mock)",
    mockResultHint: " (view mock result)",
    noValue: "–",
    none: "None",
    mockScore: (correct: number, total: number, percentage: number) =>
      `${correct} of ${total} (${percentage}%)`,
    loadMoreMocks: "Load more mock exams",
    practiceHeading: "Topic practice",
    noPractice: "No topic practice sessions yet.",
    tableCaption: "Your practice sessions, newest first",
    topic: "Topic",
    started: "Started",
    status: "Status",
    answered: "Answered",
    correct: "Correct",
    fallbackTopic: "Topic",
    continueHint: " (continue)",
    reviewHint: " (review answers)",
    answeredOf: (answered: number, requested: number) => `${answered} of ${requested}`,
    loadingMore: "Loading…",
    loadMore: "Load more sessions",
  },

  sessionReview: {
    title: "Session review",
    backToHistory: "Back to history",
    loading: "Loading your answers",
    emptyTitle: "No answers in this session",
    emptyBody: "Nothing was answered before the session closed.",
    questionHeading: (number: number, correct: boolean) =>
      `Question ${number}: ${correct ? "correct" : "incorrect"}`,
    yourAnswerLine: (options: string, confidence: string) =>
      `Your answer: ${options}. Confidence: ${confidence}. Answered `,
    /**
     * The confidence the learner reported, named for reading inside a sentence. An unrecognised
     * value falls back to the code in lower case, which is what this showed before the wording
     * moved here, so a level added to the API appears as itself rather than as nothing.
     */
    confidenceName: (confidence: string) =>
      ({ LOW: "low", MEDIUM: "medium", HIGH: "high" })[confidence] ?? confidence.toLowerCase(),
    showAnswer: "Show the correct answer and explanation",
  },
  mock: {
    title: "Mock exam",
    loading: "Loading mock exam",
    closed: "This mock is closed. The answer key is now available in the result.",
    viewResult: "View result and review",
    noQuestions: "No questions were found.",
    resumed: "You already had this mock in progress, so you are continuing it.",
    answeredAndTarget: (answered: number, total: number, target: number) =>
      `${answered} of ${total} answered · Practice target ${target}%`,
    timeRemainingLabel: (remaining: string) => `Time remaining ${remaining}`,
    timeRemaining: "Time remaining",
    navigationLabel: "Question navigation",
    questions: "Questions",
    questionButtonLabel: (number: number, answered: boolean, flagged: boolean) =>
      `Question ${number}${answered ? ", answered" : ""}${flagged ? ", flagged for review" : ""}`,
    legend: "Answered · Flagged · Current",
    questionHeading: (number: number, total: number) => `Question ${number} of ${total}`,
    removeFlag: "Remove review flag",
    addFlag: "Flag for review",
    previous: "Previous",
    next: "Next",
    submitTitle: "Submit mock exam",
    submitExplain: (unanswered: number) =>
      `Submit now? ${unanswered} unanswered ${plural(TAG, unanswered, { one: "question will", other: "questions will" })} count as incorrect. You cannot change answers after submitting.`,
    submitConfirm: "Submit mock exam",
    submitCancel: "Keep working",
    submitTrigger: "Finish and score mock",
    answerSubmitted: "Answer submitted. Feedback stays hidden until the mock is finished.",
    chooseAllThatApply: "Choose all that apply",
    chooseOneAnswer: "Choose one answer",
    saving: "Saving…",
    saveAnswer: "Save answer",
  },
  mockResult: {
    title: "Mock exam result",
    loading: "Loading result",
    reached: "Practice target reached",
    notReached: "Practice target not reached",
    percentage: (percentage: number) => `${percentage}%`,
    correctOf: (correct: number, total: number, answered: number) =>
      `${correct} correct of ${total} ${plural(TAG, total, { one: "question", other: "questions" })}; ${answered} answered.`,
    target: (percentage: number, correct: number) =>
      `Practice target: ${percentage}% (${correct} correct).`,
    elapsed: (elapsed: string) => `Elapsed time: ${elapsed}.`,
    elapsedWithHours: (hours: number, minutes: number, seconds: number) =>
      `${hours}h ${minutes}m ${seconds}s`,
    elapsedShort: (minutes: number, seconds: number) => `${minutes}m ${seconds}s`,
    caveat:
      "This score describes this CertForge practice run; it is not a forecast of the real exam.",
    breakdown: "Topic breakdown",
    topic: "Topic",
    correct: "Correct",
    answered: "Answered",
    score: "Score",
    fallbackTopic: "Topic",
    outOf: (value: number, total: number) => `${value} / ${total}`,
    questionReview: "Question review",
    questionSummary: (number: number, correct: boolean, answered: boolean) =>
      `Question ${number}: ${correct ? "Correct" : answered ? "Incorrect" : "Unanswered"}`,
    backToTracks: "Back to tracks",
  },
  notFound: {
    title: "Page not found",
    emptyTitle: "There is nothing at this address",
    bodyStart: "Go back to the ",
    tracksLink: "list of tracks",
  },
  editorial: {
    deskTitle: "Editorial desk",
    noDeskAccess: "You do not have access to the editorial desk",
    noDeskAccessBody: "Ask an administrator for the editor or reviewer role.",
    catalogTitle: "Catalog",
    noCatalogAccess: "You do not have access to the catalog",
    noCatalogAccessBody:
      "Managing the catalog is an administrator's job. Ask one if something there looks wrong.",
    newQuestion: "New question",
    backToQuestions: "Back to questions",
    cannotAuthor: "You cannot write questions",
    cannotAuthorBody: "Ask an administrator for the editor role.",

    /** Every status is a word and a symbol; colour only reinforces it. */
    status: {
      draft: "Draft",
      inReview: "In review",
      approved: "Approved",
      published: "Published",
      replaced: "Replaced",
    },
    statusRailLabel: "Revision status",
    stepDone: " (done)",

    catalogStatus: {
      active: "Active",
      draft: "Draft",
      inactive: "Inactive",
    },

    type: {
      singleChoice: "Single choice",
      multipleChoice: "Multiple choice",
    },

    difficulty: {
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
    },

    /** The content-policy checks a reviewer can attest to. */
    checklist: {
      technicalAccuracy: "The correct answer is technically right for the stated Java release",
      codeVerified: "The code compiles and prints what the question says",
      noAmbiguity: "Nothing in the wording is ambiguous",
      reasonsAccurate: "Every reason is accurate, including for the wrong options",
      officialReferences: "The references are official documentation",
    },

    /**
     * What the server's incompleteness codes mean to an editor. The server decides what is
     * complete; this only words it.
     */
    violations: {
      promptMissing: "Write the question.",
      topicMissing: "Choose a topic.",
      javaReleaseMissing: "Enter the Java release.",
      difficultyMissing: "Choose a difficulty.",
      difficultyRationaleMissing: "Explain why this difficulty fits.",
      explanationMissing: "Write the explanation.",
      optionsTooFew: "Add at least two answer options.",
      optionKeyDuplicate: "Two options share a letter.",
      optionTextMissing: "Every option needs text.",
      optionExplanationMissing: "Every option needs a reason, including the wrong ones.",
      exactlyOneCorrect: "Mark exactly one option as correct.",
      atLeastOneCorrect: "Mark at least one option as correct.",
      referencesMissing: "Add at least one official reference.",
      referenceInvalid: "Every reference needs a title and a link that starts with https.",
    },

    catalogPage: {
      note: "What learners can be given, and what content can be published against. This is a read-only view: in this release the catalog is created by database migration.",
      loading: "Loading the catalog",
      emptyTitle: "There are no tracks",
      emptyBody: "A track is seeded by migration. An empty catalog means none has been applied.",
      tableCaption: "Preparation tracks",
      track: "Track",
      status: "Status",
      provider: "Provider",
      examVersions: "Exam versions",
      topics: "Topics",
      versionCount: (total: number, active: number) => `${total} (${active} active)`,
    },

    queue: {
      title: "Questions",
      filterAll: "All",
      filterDrafts: "Drafts",
      filterWaiting: "Waiting for review",
      filterApproved: "Approved",
      filterPublished: "Published",
      filterLabel: "Filter by status",
      loading: "Loading questions",
      emptyWithStatus: "No questions with this status",
      emptyTitle: "No questions yet",
      emptyBodyAuthor: "Write the first one with New question, or import a content pack.",
      emptyBodyReader: "Questions appear here once an editor writes them.",
      tableCaption: (filter: string) => `${filter} questions`,
      question: "Question",
      topic: "Topic",
      status: "Status",
      revision: "Revision",
      untitled: "Untitled draft",
      fallbackTopic: "Topic",
      noTopicYet: "No topic yet",
    },

    catalogTrack: {
      fallbackName: "Track",
      backToCatalog: "Back to the catalog",
      loading: "Loading the track",
      javaRelease: (release: number) => `Java ${release}`,
      examNameAndCode: (name: string, code: string) => `${name} (${code})`,
      objectives: "Official exam objectives (opens in a new tab)",
      noExam: "A taxonomy version, with no exam behind it.",
      publishableNoRelease: ". Those questions state no Java release, because there is no exam to target.",
      noTopicMapped: "No topic is mapped to this exam version.",
      mappedCaption: (label: string) => `Topics mapped to ${label}, in order`,
      number: "#",
      topic: "Topic",
      objectiveWording: "Objective wording for this exam",
      topicOutsideTrack: "Topic outside this track",
      publishingHeading: "Where content can be published",
      notActive: (status: string) =>
        `This track is ${status}, so no learner is given its questions.`,
      publishableStart: (topics: number) => `Questions can be published on the ${topics} topics mapped to `,
      publishableRelease: ", and they must be written for ",
      publishableEnd: ". A revision for another release is refused when it is published.",
      noActiveVersion:
        "No exam version is active, so nothing can be published on this track at all: publishing binds a revision to the topic's active exam version.",
      unmapped: (count: number) =>
        `${count} ${plural(TAG, count, { one: "topic is", other: "topics are" })} not mapped to the active exam version. A question on ${plural(TAG, count, { one: "it", other: "them" })} can be written and approved, but publishing it is refused.`,
      versionsHeading: "Exam versions",
      noVersions: "This track has no exam version.",
    },

    revisionView: {
      javaRelease: (release: number) => `Java ${release}`,
      writtenBy: (author: string) => `Written by ${author}`,
      authorUnknown: "Author unknown",
      publishedBy: (publisher: string) => ` · Published by ${publisher}`,
      learnerViewHeading: "As the learner will see it",
      learnerViewNote: "No answers are shown here, exactly as in a study session.",
      answerKeyHeading: "Answer key and reasons",
      optionVerdict: (key: string, correct: boolean) =>
        `${key} is ${correct ? "correct" : "incorrect"}`,
      explanation: "Explanation",
      whyThisDifficulty: "Why this difficulty",
      references: "References",
      notesHeading: "Review notes",
      checked: "Checked: ",
      decisionLabel: "Review decision",
      decisionApproved: "Approved",
      decisionChangesRequested: "Asked for changes",
      decidedBy: (reviewer: string) => ` by ${reviewer}`,
    },

    reviewPanel: {
      policyLegend: "Content policy",
      policyHint:
        "Tick only what you checked yourself. The items you tick are recorded with your decision.",
      comment: "Comment",
      commentHint: "Needed when you ask for changes. The author sees it.",
      approve: "Approve",
      requestChanges: "Request changes",
      requestChangesHint: "Requesting changes returns the revision to its author as a draft.",
      sayWhatToChange: "Say what needs to change before sending it back.",
      publishHeading: "Publish",
      publishNote:
        "Only approved revisions can be published. A published revision cannot be edited; a correction becomes a new revision.",
      confirmPublishTitle: (revision: number) => `Confirm publishing revision ${revision}`,
      confirmPublishExplain: (revision: number) =>
        `Publish revision ${revision}? Learners will get this question in their sessions, and the revision it replaces is retired.`,
      confirmPublishLabel: (revision: number) => `Yes, publish revision ${revision}`,
      publishRevision: (revision: number) => `Publish revision ${revision}`,
      approveFirst: "Approve it first.",
      retireHeading: "Retire",
      retireNote:
        "A retired revision stays in history and in learners' past answers, and no new session will use it.",
      confirmRetireTitle: (revision: number) => `Confirm retiring revision ${revision}`,
      confirmRetireExplain: (revision: number) =>
        `Retire revision ${revision}? New sessions will no longer include this question unless a newer revision is published.`,
      confirmRetireLabel: (revision: number) => `Yes, retire revision ${revision}`,
      retireRevision: (revision: number) => `Retire revision ${revision}`,
      reviseHeading: "Correct this question",
      reviseNote:
        "Starting a revision copies this one into a new draft. The published text stays as it is until the new one is published.",
      startRevision: "Start a new revision",
    },

    editor: {
      unsavedLabel: "Unsaved changes",
      unsavedWarning: "You have changes that are not saved. If you leave now they are lost.",
      keepEditing: "Keep editing",
      leaveWithoutSaving: "Leave without saving",
      reviewerAskedForChanges: (reviewer: string) => `${reviewer} asked for changes`,
      someoneAskedForChanges: "A reviewer asked for changes",
      trackGroup: (track: string, kind: string) => `${track} (${kind})`,
    kindCertification: "certification",
    kindInterview: "interview",
    typeLegend: "Type",
      topic: "Topic",
      chooseTopic: "Choose a topic",
      difficulty: "Difficulty",
      chooseDifficulty: "Choose a difficulty",
      javaRelease: "Java release",
      whyThisDifficulty: "Why this difficulty",
      whyThisDifficultyHint: "What makes a candidate likely to get it wrong?",
      question: "Question",
      questionHint:
        "Put code in a fenced block (three backticks). The learner sees it exactly as written.",
      optionsLegend: "Answer options",
      optionsHint: (multiple: boolean) =>
        `${multiple ? "Mark every correct option." : "Mark the one correct option."} Each option needs a reason, shown to the learner after they answer, wrong options included.`,
      optionLabel: (key: string) => `Option ${key}`,
      optionIsCorrect: (key: string) => `Option ${key} is correct`,
      reasonFor: (key: string) => `Reason for ${key}`,
      removeOption: (key: string) => `Remove option ${key}`,
      addOption: "Add another option",
      explanation: "Explanation",
      explanationHint: "Shown after the learner answers.",
      referencesLegend: "References",
      referencesHint: "Official documentation only. Links must start with https://",
      referenceTitle: (number: number) => `Title of reference ${number}`,
      referenceUrl: (number: number) => `Link of reference ${number}`,
      removeReference: (number: number) => `Remove reference ${number}`,
      addReference: "Add another reference",
      saveDraft: "Save draft",
      sendForReview: "Send for review",
      saving: "Saving…",
      savedAt: (time: string) => `Saved at ${time}`,
      checksHeading: "Before you can send this",
      checksHint:
        "Sending checks the whole revision. Anything missing is listed here, and each item takes you to its field.",
      nothingMissing: "Nothing is missing.",
      needsAnotherReviewer:
        "A reviewer other than you has to approve it before it can be published.",
    },

    questionPage: {
      fallbackTitle: "Question",
      revisionTitle: (number: number) => `Revision ${number}`,
      loading: "Loading question",
      currentStatus: "Current status: ",
      revisionsLabel: "Revisions",
      revisionTab: (number: number) => `Revision ${number}`,
      notices: {
        sent: "Sent for review. A reviewer other than you will pick it up from the queue.",
        saved: "Draft saved.",
        approved: "Approved. An administrator can now publish it.",
        changes: "Sent back to the author with your comment. It is a draft again.",
        published: "Published. Learners can now get this question in their sessions.",
        retired: "Retired. It stays in history and no new session will use it.",
        started: "New revision started as a draft, copied from the previous one.",
      },
    },

    diff: {
      heading: (revision: number) => `What changed since revision ${revision}`,
      nothingDiffers: (revision: number) => `Nothing differs from revision ${revision}.`,
      added: "[added: ",
      removed: "[removed: ",
      closeBracket: "]",
      question: "Question",
      type: "Type",
      topic: "Topic",
      anotherTopic: "Another topic",
      difficulty: "Difficulty",
      javaRelease: "Java release",
      whyThisDifficulty: "Why this difficulty",
      explanation: "Explanation",
      optionAdded: (key: string) => `Option ${key} added`,
      optionRemoved: (key: string) => `Option ${key} removed`,
      option: (key: string) => `Option ${key}`,
      optionCorrectness: (key: string) => `Option ${key} correctness`,
      reasonFor: (key: string) => `Reason for ${key}`,
      correct: "correct",
      incorrect: "incorrect",
      referenceRemoved: "Reference removed",
      referenceAdded: "Reference added",
    },
  },
};

/**
 * The shape every locale must have. Derived from the English catalog rather than written out, so
 * adding a string here is what obliges every other locale to carry it.
 */
export type Catalog = typeof en;
