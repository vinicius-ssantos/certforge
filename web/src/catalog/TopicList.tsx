import { useEffect } from "react";
import type { Topic } from "../api/types";
import { useText } from "../i18n/useText";

type Props = {
  topics: Topic[];
  onStart: (topic: Topic) => void;
  busy: boolean;
  availableByTopic?: Map<string, number>;
};

/** One accessible topic list for both certification and general taxonomies. */
export function TopicList({ topics, onStart, busy, availableByTopic }: Props) {
  const t = useText();
  const hasAvailable = availableByTopic && [...availableByTopic.values()].some((count) => count > 0);
  useEffect(() => {
    if (window.location.hash.startsWith("#topic-")) {
      document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.focus();
    }
  }, [topics]);
  return (
    <ol className="topics">
      {topics.map((topic) => (
        <li key={topic.id} id={`topic-${topic.id}`} tabIndex={-1}>
          <div className="topic-row">
            <div className="topic-copy">
              <strong>{topic.name}</strong>
              {topic.objectiveRef ? <span className="muted">{topic.objectiveRef}</span> : null}
              {availableByTopic?.get(topic.id) === 0 && hasAvailable ? (
                <span className="muted">{t.track.noPublishedQuestions}</span>
              ) : null}
            </div>
            <button type="button" className="small secondary"
              aria-label={t.track.practiceTopic(topic.name)}
              disabled={busy || availableByTopic?.get(topic.id) === 0}
              onClick={() => onStart(topic)}>
              {t.track.practice}
            </button>
          </div>
          {topic.subtopics.length > 0 ? (
            <TopicList topics={topic.subtopics} onStart={onStart} busy={busy}
              availableByTopic={availableByTopic} />
          ) : null}
        </li>
      ))}
    </ol>
  );
}
