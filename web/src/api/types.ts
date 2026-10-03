// Every type the application uses comes from the generated contract. Nothing is declared by hand:
// when the backend contract changes, `npm run api:generate` changes these and the compiler finds
// every place that needs attention.
import type { components } from "./schema";

type Schemas = components["schemas"];

export type Account = Schemas["AccountView"];
export type Track = Schemas["TrackView"];
export type Topic = Schemas["TopicView"];
export type ExamVersion = Schemas["ExamVersionView"];
export type Session = Schemas["SessionView"];
export type SessionQuestion = Schemas["SessionQuestionView"];
export type Question = Schemas["PublishedQuestion"];
export type QuestionOption = Schemas["PublishedOption"];
export type SessionSummary = Schemas["SessionSummary"];
export type AttemptResult = Schemas["AttemptResult"];
export type AttemptRequest = Schemas["AttemptRequest"];
export type SessionHistoryPage = Schemas["PageSessionHistoryItem"];
export type SessionHistoryItem = Schemas["SessionHistoryItem"];
export type AttemptHistoryPage = Schemas["PageAttemptHistoryItem"];
export type AttemptHistoryItem = Schemas["AttemptHistoryItem"];
export type TopicProgress = Schemas["TopicProgress"];
export type ReviewQueue = Schemas["Queue"];
export type ReviewQueueItem = Schemas["QueueItem"];
export type ReviewReason = ReviewQueueItem["reason"];
export type Misconception = Schemas["Misconception"];
export type HistoricalQuestion = Schemas["HistoricalQuestion"];
export type Confidence = AttemptRequest["confidence"];
export type QuestionSummary = Schemas["QuestionSummary"];
export type EditorialQuestion = Schemas["QuestionView"];
export type Revision = Schemas["RevisionView"];
export type RevisionRequest = Schemas["RevisionRequest"];
export type Review = Schemas["ReviewView"];
export type AdminTrack = Schemas["AdminTrackView"];
export type AdminExamVersion = Schemas["AdminExamVersionView"];
export type AdminTopic = Schemas["AdminTopicView"];
