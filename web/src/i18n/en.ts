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
  },

  layout: {
    skipToMain: "Skip to main content",
    brand: "CertForge",
    mainNavigation: "Main",
    tracks: "Tracks",
    interviews: "Interviews",
    review: "Review",
    progress: "Progress",
    history: "History",
    editorial: "Editorial",
    signOut: "Sign out",
    signingOut: "Signing out…",
    /*
     * It says they are still signed in, because that is the fact and the reason it matters: on
     * a shared machine someone who believes they signed out walks away from an open account.
     * Clearing the session locally instead would show the sign-in page while the cookie stayed
     * valid, which is the same lie told more convincingly.
     */
    signOutFailed: "Signing out did not work, and you are still signed in. Try again — and if it keeps failing, close this browser.",
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
    /*
     * It names the mock rather than the question, because the question is not the problem and
     * there is nothing wrong with it: the learner is being examined on it right now, and saying
     * so is also the only honest explanation for why practice refused.
     */
    questionUnderExamination:
      "This question is in a mock exam you have open. Finish or leave the mock, and you can practise it again.",
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
    /**
     * The same rule, counted down while the person types. It replaces the hint rather than joining
     * it, so the field never carries two sentences about the same requirement.
     */
    passwordRemaining: (remaining: number) =>
      `${remaining} more ${plural(TAG, remaining, { one: "character", other: "characters" })} to go.`,
    /** Said once the rule is met, so the person knows they can send without counting. */
    passwordLongEnough: "Long enough.",
    newHere: "New here?",
    createOne: "Create an account",
    alreadyHaveAccount: "Already have an account?",
    checkingSession: "Checking your session",
  },
  tracks: {
    title: "Tracks",
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
    mockAvailabilityLoading: "Checking whether this mock can start",
    mockUnavailable: (missing: number, topics: number, perTopic: number) =>
      `Not available yet. ${missing} reviewed ${plural(TAG, missing, { one: "question is", other: "questions are" })} still missing across ${topics} ${plural(TAG, topics, { one: "topic", other: "topics" })}. A full mock requires ${perTopic} published questions in every topic.`,
    /** The work list behind the sentence above: which topics are short, and by how much. */
    mockMissingCaption: "Reviewed questions still needed, by topic",
    mockPublished: "Published",
    mockShortfall: "Short by",
    continueMock: "Continue mock exam",
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
    aiReviewedNotice:
      "Reviewed by an AI reviewer, not yet independently confirmed by a person (ADR 0022).",
  },

  feedback: {
    correct: "Correct",
    notQuite: "Not quite",
    yourAnswer: "Your answer. ",
    correctAnswer: "Correct answer.",
    incorrectAnswer: "Incorrect answer.",
    explanation: "Explanation",
    /**
     * The evidence behind the answer. Headed as what it is — a recording the build made — rather
     * than as something happening now, because a learner shown code and output could reasonably
     * assume the one produced the other on this screen.
     */
    verifiedHeading: "What the build ran, and what it printed",
    verifiedNote:
      "This programme is compiled and run when the question pack is built, and its output is recorded. Nothing runs here.",
    verifiedOutput: "Output",
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
    /**
     * The figures of a finished session, as labels over numbers. "Not seen" is stated rather than
     * left out: ending early is a legitimate way to stop, and how much was left is part of what
     * happened.
     */
    statAnswered: "Answered",
    statCorrect: "Correct",
    statNotSeen: "Not seen",
    endedMeta: (topic: string, closedAt: string | null) =>
      `Topic: ${topic}${closedAt ? ` · Ended ${closedAt}` : ""}`,
    notSeenOf: (notSeen: number) =>
      `${notSeen} ${plural(TAG, notSeen, { one: "question was", other: "questions were" })} left unseen.`,
    /** The two ways on from a finished session, instead of dropping the learner at the menu. */
    practiseAgain: "Practise this topic again",
    seeReview: "See the session review",
  },
  /**
   * Counts are written as functions of the count rather than as a string plus a plural suffix, so
   * a locale whose plural rules differ from English can decide the whole sentence for itself.
   */
  review: {
    title: "Review",
    unknownReason: "Review needed",
    unknownReasonExplanation: "This question is due for another look.",
    /**
     * Said once, under the page title. It is the same limit the progress and mock screens state:
     * this is evidence of where to look, never a forecast.
     */
    caveat:
      "These are questions worth revisiting, chosen from how you answered. It is evidence of where to look, not a prediction about the exam.",
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
    /** What the button shows. Its full name, with the topic, stays in `practise` above. */
    practiseShort: (count: number) =>
      `Practise ${count} ${plural(TAG, count, { one: "question", other: "questions" })}`,
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
    /**
     * A topic with no attempts has no accuracy, and a dash says only that the cell is empty. This
     * names the state instead, because "you have not started this" is a different thing from "we
     * have nothing to show".
     */
    notStarted: "Not started",
    /** The column that names where a topic stands, rather than leaving the reader to infer it. */
    situation: "Situation",
    /** At or above the practice target. */
    solid: "Solid",
    /** Below the practice target. The word is an instruction, not a verdict on the learner. */
    needsReview: "Review",
    /**
     * The threshold, said out loud under the table that applies it. A learner should be able to
     * see the line they are being measured against, and see where it came from.
     */
    targetNote: (percent: number) =>
      `“Solid” means ${percent}% or better, the mock exam's pass mark. It describes your practice so far, not a prediction about the exam.`,
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
    /**
     * An empty state that explains itself. A mock needs five reviewed questions in every
     * topic (see issue #138), and saying so turns "nothing here" into something the reader can
     * act on or at least understand.
     */
    noMocks: "No mock exams yet. A mock exam needs five reviewed questions in every topic.",
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
    yourAnswerLine: (options: string, confidence: string, elapsedSeconds: number) =>
      `Your answer: ${options}. Confidence: ${confidence}. ${elapsedSeconds} ${plural(TAG, elapsedSeconds, { one: "second", other: "seconds" })} to answer. Answered `,
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
    legend: "Question navigation legend",
    legendAnswered: "Answered",
    legendFlagged: "Flagged",
    legendCurrent: "Current",
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
    /** The label over the figure, so the number itself can be the loudest thing. */
    scoreLabel: "Result",
    /** Unanswered questions count as misses; the screen should not let that be a surprise. */
    unanswered: (count: number) =>
      `${count} ${plural(TAG, count, { one: "question was", other: "questions were" })} left unanswered and ${plural(TAG, count, { one: "counts", other: "count" })} as incorrect.`,
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
  interview: {
    title: "Interview prep",
    loading: "Loading interview preparation",
    emptyTitle: "No interview preparation is open yet",
    emptyBody:
      "An interview taxonomy becomes available once it is published. Certification tracks are on the home page.",
    topicCount: (count: number) =>
      `${count} ${plural(TAG, count, { one: "topic", other: "topics" })}`,
    browseHeading: "Topics in this taxonomy",
    weightLabel: (weight: number) => `Asked in interviews: ${weight} of 5`,
    startHeading: "Start a session",
    startFromTopics: "Choose topics yourself",
    startFromBlueprint: "Start from a job description",
    chooseTopics: "Topics to practise",
    questionCount: "Questions",
    start: "Start session",
    starting: "Starting…",
    resumeHeading: "You have a session open",
    resume: "Continue session",
    openedAt: (when: string) => `Opened ${when}`,
    evidenceLink: "What practice has shown",
    blueprintsLink: "Job descriptions you have read",
    pastHeading: "Earlier sessions",
    pastItem: (count: number, when: string) =>
      `${count} ${plural(TAG, count, { one: "item", other: "items" })} · ${when}`,
    noneYet: "Nothing practised yet.",
    countRange: (min: number, max: number) =>
      `Ask for between ${min} and ${max} questions.`,

    session: {
      title: "Interview session",
      loading: "Loading session",
      itemHeading: (number: number, total: number) => `Item ${number} of ${total}`,
      answeredCount: (answered: number, total: number) => `${answered} of ${total} answered`,
      objectiveKind: "Objective question",
      guidedKind: "Guided answer",
      guidedKindExplain:
        "Nothing grades this answer. Say it out loud or write it here for yourself, then read what a reviewer expected.",
      yourAnswer: "Your answer (kept in this browser, never sent)",
      yourAnswerHint:
        "This stays on your device. It is not uploaded, not stored and not read by anything.",
      reveal: "Show what a reviewer expected",
      revealing: "Opening…",
      referenceAnswer: "Reference answer",
      expectedConcepts: "Concepts a reviewer expected",
      conceptRequired: "Expected",
      conceptOptional: "Worth mentioning",
      markCovered: "I covered this",
      markedCovered: "You said you covered this",
      markedMissed: "You said you did not cover this",
      marksExplain:
        "Your own marks, recorded as yours. Nothing checks them and nothing scores this answer.",
      commonMistakes: "Common mistakes",
      followUps: "Follow-up prompts",
      next: "Next item",
      finish: "Finish session",
      allAnswered: "Every item answered",
      allAnsweredBody: "Close the session to keep it in your history.",
      ended: "This session is closed.",
      endedBody: "What it recorded is in your interview evidence.",
      endTrigger: "End session",
      endTitle: "End this session?",
      endExplain: "Items you have answered stay recorded. The rest are not kept.",
      endConfirm: "End session",
      endCancel: "Keep going",
      backToInterviews: "Back to interview prep",
      correct: "Correct",
      incorrect: "Not correct",
      yourChoice: "You chose",
      answerKey: "Correct answer",
    },

    blueprint: {
      title: "From a job description",
      loading: "Loading blueprint",
      intro:
        "Paste the advert. Each topic it talks about is weighed by the words it used, and every weight shows the words behind it.",
      noAi:
        "No model reads this and no model decides the weights. The terms come from a reviewed dictionary, so you can see exactly why a topic is weighted and disagree with it.",
      jobTitle: "Role (optional)",
      sourceText: "The job description",
      sourceTextHint: "Pasted as it is. Nothing is inferred about you from it.",
      requirements: "Requirements, one per line (optional)",
      requirementsHint: "What the advert listed, or what you were told in a call.",
      build: "Read it",
      building: "Reading…",
      resultHeading: "What the description asked for",
      weightHeading: "Weight",
      termsHeading: "Because it said",
      foundInDescription: "in the description",
      foundInRequirement: "in a requirement",
      learnerWeight: "Your own weight",
      matchedWeight: "From the description",
      changeWeight: (topic: string) => `Weight for ${topic}`,
      unrecognisedHeading: "Not recognised",
      unrecognisedBody:
        "These were not in the dictionary, so nothing was guessed from them. Weigh them yourself if they matter.",
      notAVerdict:
        "This weighs topics. It says nothing about you: no fit, no readiness for the role, no chance of an offer.",
      startFrom: "Practise from this",
      emptyTitle: "No job descriptions yet",
      emptyBody: "Read one and it will be kept here, with the words behind every weight.",
      savedAt: (when: string) => `Read ${when}`,
      noTopics: "Nothing in the dictionary matched this description.",
      untitled: "Untitled role",
    },

    evidence: {
      title: "What practice has shown",
      loading: "Loading evidence",
      intro:
        "Counts of what you answered, and the two things an accuracy figure hides. Nothing here is a score and nothing here is a verdict on you.",
      notAVerdict:
        "Guided answers are not graded by anything, so they are counted separately and never added to the objective ones.",
      emptyTitle: "Nothing practised yet",
      emptyBody: "Answer an interview item and what it showed will be here.",
      objectiveHeading: "Objective questions",
      guidedHeading: "Guided answers",
      answered: "Answered",
      correct: "Correct",
      practised: "Practised",
      lastAt: (when: string) => `Last ${when}`,
      signalSureAndWrong: (count: number) =>
        `Confident and wrong on ${count} ${plural(TAG, count, { one: "question", other: "questions" })}: worth re-reading rather than re-practising.`,
      signalUnsureAndRight: (count: number) =>
        `Right but unsure on ${count} ${plural(TAG, count, { one: "question", other: "questions" })}: the knowledge may be there without the confidence.`,
      signalConceptMarkedMissed: (count: number, concept: string) =>
        `You marked “${concept}” as not covered ${count} ${plural(TAG, count, { one: "time", other: "times" })}.`,
      signalGuidedPractisedWithNoMisses: (count: number) =>
        `Practised ${count} guided ${plural(TAG, count, { one: "answer", other: "answers" })} and marked no concept as missed. Nothing scores those answers, so this says what you said and no more.`,
      signalPractisedNothingToSingleOut: (count: number) =>
        `Practised ${count} ${plural(TAG, count, { one: "item", other: "items" })}, with nothing in the evidence to single out.`,
    },
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
      guidedResponse: "Guided response",
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
      javaReleaseNotApplicable: "An interview question states no Java release. Clear it.",
      seniorityMissing: "Say which level this is asked at.",
      seniorityNotApplicable: "A certification question states no level. Clear it.",
      difficultyMissing: "Choose a difficulty.",
      difficultyRationaleMissing: "Explain why this difficulty fits.",
      explanationMissing: "Write the explanation.",
      optionsTooFew: "Add at least two answer options.",
      optionKeyDuplicate: "Two options share a letter.",
      optionTextMissing: "Every option needs text.",
      optionExplanationMissing: "Every option needs a reason, including the wrong ones.",
      exactlyOneCorrect: "Mark exactly one option as correct.",
      atLeastOneCorrect: "Mark at least one option as correct.",
      guidedRequiresInterview: "Guided responses belong to an interview track.",
      guidedExplanationNotApplicable: "A guided response uses reviewed criteria instead of an objective explanation.",
      guidedOptionsNotApplicable: "A guided response does not have answer options.",
      guidedCriteriaNotApplicable: "Objective questions cannot carry guided-response criteria.",
      guidedCriteriaMissing: "Add the reviewed guided-response criteria.",
      guidedReferenceAnswerMissing: "Write the reviewed reference answer.",
      guidedExpectedConceptsMissing: "Add at least one expected concept.",
      guidedRequiredConceptMissing: "Mark at least one expected concept as required.",
      guidedConceptTextMissing: "Every expected concept needs text.",
      guidedCommonMistakeInvalid: "Remove the blank common-mistake entry.",
      guidedFollowUpInvalid: "Remove the blank follow-up entry.",
      referencesMissing: "Add at least one official reference.",
      referenceInvalid: "Every reference needs a title and a link that starts with https.",
    },

    catalogPage: {
      note: "What learners can be given, and what content can be published against. This is a read-only view: in this release the catalog is created by database migration.",
      loading: "Loading the catalog",
      emptyTitle: "There are no tracks",
      emptyBody: "A track is seeded by migration. An empty catalog means none has been applied.",
      tableCaption: "Preparation tracks",
      certificationKind: "Certification track",
      interviewKind: "Interview track",
      topicCount: (count: number) => `${count} ${plural(TAG, count, { one: "topic", other: "topics" })}`,
      track: "Track",
      status: "Status",
      provider: "Provider",
      examVersions: "Exam versions",
      topics: "Topics",
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
      searchLabel: "Search the prompts",
      searchSubmit: "Search",
      searchClear: "Clear",
      pagerLabel: "Pages of the question queue",
      previousPage: "Previous",
      nextPage: "Next",
      showing: (first: number, last: number, total: number) => `${first}–${last} of ${total}`,
      emptyWithStatus: "No questions with this status",
      emptyWithSearch: (query: string) => `No question's prompt contains "${query}"`,
      emptyBodySearch: "Try fewer words, or clear the search to see the whole queue.",
      emptyPastEnd: "There is no page that far into the queue",
      emptyBodyPastEnd:
        "The queue is shorter than the page this address asks for, which happens to a link kept after the queue changed.",
      backToFirstPage: "Go to the first page",
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

    reviewQueue: {
      title: "Review one by one",
      loading: "Loading the worklist",
      loadingQuestion: "Loading the question",
      progress: (at: number, total: number) => `${at} of ${total}`,
      inTopic: (topic: string, count: number, published: number) =>
        `${topic} — ${published} published, ${count} ${plural(TAG, count, { one: "question waits", other: "questions wait" })} here`,
      inTopicOutsideCatalog: (topic: string, count: number) =>
        `${topic} — outside the learner catalogue, so publishing here reaches nobody yet; ${count} ${plural(TAG, count, { one: "question waits", other: "questions wait" })} here`,
      previous: "Previous question",
      stageLabel: (at: number, total: number) => `Question ${at} of ${total} under review`,
      youWroteThisSelfReview:
        "This revision is yours. Approving it is a self-review, and it is recorded as one: the decision carries your name as both author and reviewer, and nothing in the product calls it an independent review.",
      youWroteThis:
        "You wrote this revision, so approving it will be refused: the reviewer has to be someone other than the author. The question that imported a pack is authored by the account that imported it.",
      publishWhenApproved: "Publish as soon as I approve",
      publishWhenApprovedHint:
        "For working through a backlog: it turns the two presses into one, and the button then says \"Approve and publish\" so what you are about to do is on the button rather than in a dialog.",
      skip: "Skip for now",
      openOnItsOwn: "Open this question on its own page",
      shortcuts:
        "Press a for Approve, p for Request changes, s to skip. The keys move focus to a button; deciding is still a press, because nothing takes an approval back.",
      emptyTitle: "Nothing is waiting for review",
      emptyBody: "A question arrives here when its author sends the draft for review.",
      doneTitle: "That is the end of the worklist",
      doneBody: (total: number) =>
        `You went through ${total} ${plural(TAG, total, { one: "question", other: "questions" })}. Anything you skipped is still waiting in the queue.`,
      skippedBody: (count: number) =>
        `${count} ${plural(TAG, count, { one: "question", other: "questions" })} you passed over ${plural(TAG, count, { one: "is", other: "are" })} still undecided.`,
      reviewSkipped: (count: number) =>
        `Go through the ${count} you skipped`,
      backToQueue: "Back to the queue",
      notAReviewer: "You do not review questions",
      notAReviewerBody: "This worklist is for the reviewer who decides whether a question is technically right.",
      fallbackTopic: "Topic",
      noTopic: "No topic yet",
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
      /*
       * One sentence per status rather than a status label dropped into a sentence. That
       * composes in English and not in Portuguese, where "está rascunho" needs "em rascunho"
       * while "está inativa" does not -- a grammar the label cannot carry.
       */
      notActiveDraft: "This track is still a draft, so no learner is given its questions.",
      notActiveInactive: "This track is inactive, so no learner is given its questions.",
      notActiveOther: (status: string) =>
        `This track is "${status}", so no learner is given its questions.`,
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
      guidedCriteriaHeading: "Reviewed response criteria",
      guidedCriteriaNote:
        "These are reviewed concepts for self-review and future guided evaluation. They are not a binary correctness or hiring score.",
      referenceAnswer: "Reference answer",
      expectedConcepts: "Expected concepts",
      requiredConcept: "Required",
      optionalConcept: "Optional",
      commonMistakes: "Common mistakes",
      followUps: "Reviewed follow-up prompts",
      explanation: "Explanation",
      whyThisDifficulty: "Why this difficulty",
      references: "References",
      notesHeading: "Review notes",
      checked: "Checked: ",
      decisionLabel: "Review decision",
      selfReview: " (self-review: the reviewer wrote it)",
      decisionApproved: "Approved",
      decisionChangesRequested: "Asked for changes",
      decisionAiApproved: "Approved by the AI reviewer (provisional)",
      decisionAiReviewConfirmed: "Confirmed by an independent reviewer",
      decidedBy: (reviewer: string) => ` by ${reviewer}`,
      aiReviewPendingConfirmation: (confirmBy: string) =>
        `Approved by the AI reviewer, not yet independently confirmed by a person. Unless a reviewer confirms it, it stops being offered for new study after ${confirmBy}.`,
    },

    /**
     * Where an objective was read, beside a question's own claim (#177). A revision's own
     * `references` are evidence for the *answer*; these strings are for the separate, often
     * missing evidence that the *objective* it claims is a real line on the exam's own page.
     */
    objectiveSources: {
      heading: "Where the claimed objective was read",
      loading: "Loading the objective source",
      notACertification: "This topic belongs to a taxonomy that cites no exam.",
      statusVerified: "Verified against the provider's page",
      statusUnverified: "Nobody has read the provider's page yet",
      statusStale: "The provider has published something newer",
      statusRetired: "The exam is retired",
      sourcePage: "Provider's page",
      verifiedOn: (date: string) => `read ${date}`,
      keyNotOnCurrentPage: "not on the current reading of the page",
    },

    reviewPanel: {
      policyLegend: "Content policy",
      checklistCount: (checked: number, total: number) => `${checked} of ${total} checked`,
      policyHint:
        "Tick only what you checked yourself. The items you tick are recorded with your decision.",
      comment: "Comment",
      commentHint: "Needed when you ask for changes. The author sees it.",
      approve: "Approve",
      approveAndPublish: "Approve and publish",
      approveAndPublishHint:
        "One press does both. Publishing is final: a published revision reaches learners and cannot be edited, only replaced by a new revision.",
      requestChanges: "Request changes",
      requestChangesHint: "Requesting changes returns the revision to its author as a draft.",
      sayWhatToChange: "Say what needs to change before sending it back.",
      publishHeading: "Publish",
      publishNote:
        "Only approved revisions can be published. A published revision cannot be edited; a correction becomes a new revision.",
      confirmPublishTitle: (revision: number) => `Confirm publishing revision ${revision}`,
      selfReviewedBy: (name: string) => `${name}, reviewing their own work`,
      unknownReviewer: "Reviewer not recorded",
      unknownApprovalDate: "approval date not recorded",
      confirmPublishExplain: (revision: number, topic: string, reviewer: string, date: string) =>
        `Publish revision ${revision} in ${topic}? Approved by ${reviewer} on ${date}. Learners can receive this question. Publishing is final: it cannot be undone or edited; corrections require a new revision.`,
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
      aiApproveHeading: "AI-reviewer fast lane",
      aiApproveNote:
        "Approves and publishes in one step, provisionally (ADR 0022, ADR 0024). Tick what you actually checked; a reviewer must confirm it within the window or it stops being offered for new study.",
      aiApprove: "Approve and publish as the AI reviewer",
      confirmAiReviewHeading: "Confirm the AI reviewer's approval",
      confirmAiReviewNote:
        "This revision is already published on the AI reviewer's approval alone. Confirming it as an independent reviewer makes it permanent.",
      confirmAiReview: "Confirm this AI-reviewed publication",
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
      guidedLegend: "Guided-response criteria",
      guidedHint:
        "These criteria are reviewed content. They are shown only after a learner commits a response in the future interview flow.",
      referenceAnswer: "Reference answer",
      referenceAnswerHint: "The reviewed answer a learner can compare against after responding.",
      expectedConcepts: "Expected concepts",
      expectedConceptsHint: "At least one concept must be required. Optional concepts can still strengthen an answer.",
      expectedConcept: (number: number) => `Expected concept ${number}`,
      conceptRequired: "This concept is required",
      conceptExplanation: (number: number) => `Why concept ${number} matters`,
      removeConcept: (number: number) => `Remove expected concept ${number}`,
      addConcept: "Add another expected concept",
      commonMistakes: "Common mistakes",
      commonMistake: (number: number) => `Common mistake ${number}`,
      removeCommonMistake: (number: number) => `Remove common mistake ${number}`,
      addCommonMistake: "Add another common mistake",
      followUps: "Reviewed follow-up prompts",
      followUp: (number: number) => `Follow-up prompt ${number}`,
      removeFollowUp: (number: number) => `Remove follow-up prompt ${number}`,
      addFollowUp: "Add another follow-up prompt",
      topic: "Topic",
      chooseTopic: "Choose a topic",
      difficulty: "Difficulty",
      chooseDifficulty: "Choose a difficulty",
      javaRelease: "Java release",
      seniority: "Asked at",
      chooseSeniority: "Choose a level",
      seniorityPleno: "Pleno",
      senioritySenior: "Sênior",
      seniorityHint: "The level a candidate is expected to answer this at. Not the same as difficulty: a question can be hard for anyone and still fairly asked of a Pleno.",
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
        confirmed: "Confirmed. This AI-reviewed publication is now permanent.",
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
      seniority: "Asked at",
      whyThisDifficulty: "Why this difficulty",
      explanation: "Explanation",
      guidedReferenceAnswer: "Reference answer",
      guidedExpectedConcepts: "Expected concepts",
      guidedCommonMistakes: "Common mistakes",
      guidedFollowUps: "Follow-up prompts",
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
