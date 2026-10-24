import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { ApiError, unwrap } from "../api/problem";
import type { Blueprint, BlueprintTopic } from "../api/types";
import { English } from "../i18n/English";
import { useLocale, useText } from "../i18n/useText";
import { formatDateTime } from "../history/format";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { useFocusOnMount } from "../ui/useFocusOnMount";

/** Every blueprint the learner has read, newest first. */
export function BlueprintsPage() {
  const t = useText();
  const api = useApi();
  const { locale } = useLocale();
  useDocumentTitle(t.interview.blueprint.title);

  const blueprints = useQuery({
    queryKey: ["interview-blueprints"],
    queryFn: () => unwrap(api.GET("/api/study/interviews/blueprints")),
  });

  return (
    <>
      <h1>{t.interview.blueprintsLink}</h1>
      <p className="button-row">
        <Link className="button" to="/interviews/blueprints/new">
          {t.interview.startFromBlueprint}
        </Link>
        <Link className="button secondary" to="/interviews">
          {t.interview.session.backToInterviews}
        </Link>
      </p>

      {blueprints.isPending ? <Loading label={t.interview.blueprint.loading} /> : null}
      {blueprints.isError ? (
        <ErrorState error={blueprints.error} onRetry={() => void blueprints.refetch()} />
      ) : null}
      {blueprints.data && blueprints.data.length === 0 ? (
        <EmptyState title={t.interview.blueprint.emptyTitle}>
          <p>{t.interview.blueprint.emptyBody}</p>
        </EmptyState>
      ) : null}

      {blueprints.data && blueprints.data.length > 0 ? (
        <ul className="cards">
          {blueprints.data.map((blueprint) => (
            <li key={blueprint.id} className="card">
              <h2>
                <Link to={`/interviews/blueprints/${blueprint.id}`}>
                  {blueprint.jobTitle ?? t.interview.blueprint.untitled}
                </Link>
              </h2>
              <p className="muted">
                {t.interview.blueprint.savedAt(formatDateTime(blueprint.createdAt, locale))}
              </p>
              <p className="muted">{t.interview.topicCount(blueprint.topics.length)}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

/** Reading a description: the form, and what the dictionary found in it. */
export function NewBlueprintPage() {
  const t = useText();
  const api = useApi();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  useDocumentTitle(t.interview.blueprint.title);

  const [jobTitle, setJobTitle] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [requirements, setRequirements] = useState("");

  const tracks = useQuery({
    queryKey: ["interview-tracks"],
    queryFn: () => unwrap(api.GET("/api/catalog/interview-tracks")),
  });
  const trackSlug = tracks.data?.[0]?.slug;

  const read = useMutation({
    mutationFn: () =>
      unwrap(
        api.POST("/api/study/interviews/blueprints", {
          body: {
            trackSlug: trackSlug ?? "",
            jobTitle: jobTitle.trim() === "" ? undefined : jobTitle.trim(),
            sourceText,
            requirements: requirements
              .split("\n")
              .map((line) => line.trim())
              .filter((line) => line !== ""),
          },
        }),
      ),
    onSuccess: (blueprint) => {
      void queryClient.invalidateQueries({ queryKey: ["interview-blueprints"] });
      navigate(`/interviews/blueprints/${blueprint.id}`);
    },
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    read.mutate();
  }

  return (
    <>
      <h1>{t.interview.blueprint.title}</h1>
      <p>{t.interview.blueprint.intro}</p>
      {/* Said on the screen, not only in an ADR: the learner is about to be given weights, and
          what produced them is the first thing they should know (#22, ADR 0021). */}
      <p className="notice">{t.interview.blueprint.noAi}</p>

      {tracks.isPending ? <Loading label={t.interview.loading} /> : null}
      {tracks.data && tracks.data.length === 0 ? (
        <EmptyState title={t.interview.emptyTitle}>
          <p>{t.interview.emptyBody}</p>
        </EmptyState>
      ) : null}

      {trackSlug ? (
        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="job-title">{t.interview.blueprint.jobTitle}</label>
            <input
              id="job-title"
              type="text"
              maxLength={200}
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="source-text">{t.interview.blueprint.sourceText}</label>
            <p id="source-hint" className="muted">
              {t.interview.blueprint.sourceTextHint}
            </p>
            <textarea
              id="source-text"
              aria-describedby="source-hint"
              rows={10}
              maxLength={20000}
              value={sourceText}
              onChange={(event) => setSourceText(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="requirements">{t.interview.blueprint.requirements}</label>
            <p id="requirements-hint" className="muted">
              {t.interview.blueprint.requirementsHint}
            </p>
            <textarea
              id="requirements"
              aria-describedby="requirements-hint"
              rows={5}
              value={requirements}
              onChange={(event) => setRequirements(event.target.value)}
            />
          </div>

          {read.isError ? <ErrorState error={read.error} /> : null}

          <button type="submit" disabled={read.isPending}>
            {read.isPending ? t.interview.blueprint.building : t.interview.blueprint.build}
          </button>
        </form>
      ) : null}
    </>
  );
}

/** One blueprint: every weight, the words behind it, and what was not recognised. */
export function BlueprintPage() {
  const t = useText();
  const api = useApi();
  const navigate = useNavigate();
  const { blueprintId = "" } = useParams();
  const { locale } = useLocale();
  const heading = useFocusOnMount<HTMLHeadingElement>();
  useDocumentTitle(t.interview.blueprint.title);

  const blueprint = useQuery({
    queryKey: ["interview-blueprint", blueprintId],
    queryFn: () =>
      unwrap(
        api.GET("/api/study/interviews/blueprints/{blueprintId}", {
          params: { path: { blueprintId } },
        }),
      ),
  });

  const start = useMutation({
    mutationFn: (slug: string) =>
      unwrap(
        api.POST("/api/study/interviews", { body: { trackSlug: slug, blueprintId } }),
      ),
    onSuccess: (session) => navigate(`/interviews/${session.id}`),
    onError: (error) => {
      if (error instanceof ApiError && error.code === "active_interview_session_exists") {
        const existing = error.details["sessionId"];
        if (typeof existing === "string") {
          navigate(`/interviews/${existing}`);
        }
      }
    },
  });

  const tracks = useQuery({
    queryKey: ["interview-tracks"],
    queryFn: () => unwrap(api.GET("/api/catalog/interview-tracks")),
  });

  if (blueprint.isPending) {
    return (
      <>
        <h1>{t.interview.blueprint.title}</h1>
        <Loading label={t.interview.blueprint.loading} />
      </>
    );
  }
  if (blueprint.isError) {
    return (
      <>
        <h1>{t.interview.blueprint.title}</h1>
        <ErrorState error={blueprint.error} onRetry={() => void blueprint.refetch()} />
        <p>
          <Link to="/interviews/blueprints">{t.interview.blueprintsLink}</Link>
        </p>
      </>
    );
  }

  const data: Blueprint = blueprint.data;
  const slug = (tracks.data ?? []).find(
    (track) => track.versionId === data.trackVersionId,
  )?.slug;
  const sorted = [...data.topics].sort((a, b) => b.weight - a.weight);

  return (
    <>
      <h1 ref={heading} tabIndex={-1}>
        {data.jobTitle ?? t.interview.blueprint.untitled}
      </h1>
      <p className="muted">
        {t.interview.blueprint.savedAt(formatDateTime(data.createdAt, locale))}
      </p>
      {/* The absence is the feature: #22 defers hiring probability and forbids fabricated
          experience, and a learner is told that in as many words. */}
      <p className="notice">{t.interview.blueprint.notAVerdict}</p>

      <h2>{t.interview.blueprint.resultHeading}</h2>
      {sorted.length === 0 ? (
        <p>{t.interview.blueprint.noTopics}</p>
      ) : (
        <table className="weights">
          <thead>
            <tr>
              <th scope="col">{t.interview.browseHeading}</th>
              <th scope="col">{t.interview.blueprint.weightHeading}</th>
              <th scope="col">{t.interview.blueprint.termsHeading}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((topic) => (
              <TopicRow key={topic.topicId} topic={topic} />
            ))}
          </tbody>
        </table>
      )}

      {data.unrecognisedRequirements.length > 0 ? (
        <section aria-labelledby="unrecognised">
          <h2 id="unrecognised">{t.interview.blueprint.unrecognisedHeading}</h2>
          <p>{t.interview.blueprint.unrecognisedBody}</p>
          <ul className="interview-list">
            {data.unrecognisedRequirements.map((requirement) => (
              <li key={requirement}>
                <English>{requirement}</English>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {start.isError ? <ErrorState error={start.error} /> : null}

      <div className="button-row">
        <button
          type="button"
          disabled={!slug || sorted.length === 0 || start.isPending}
          onClick={() => slug && start.mutate(slug)}
        >
          {start.isPending ? t.interview.starting : t.interview.blueprint.startFrom}
        </button>
        <Link className="button secondary" to="/interviews/blueprints">
          {t.interview.blueprintsLink}
        </Link>
      </div>
    </>
  );
}

function TopicRow({ topic }: { topic: BlueprintTopic }) {
  const t = useText();
  return (
    <tr>
      <th scope="row">
        {/* Topic wording is reviewed content, English in every locale (ADR 0012 decision 2). */}
        <English>{topic.topicSlug}</English>
      </th>
      <td>
        {topic.weight}
        <span className="muted">
          {" "}
          ·{" "}
          {topic.source === "LEARNER"
            ? t.interview.blueprint.learnerWeight
            : t.interview.blueprint.matchedWeight}
        </span>
      </td>
      <td>
        {topic.matchedTerms.length === 0 ? (
          <span className="muted">—</span>
        ) : (
          <ul className="interview-terms">
            {topic.matchedTerms.map((match) => (
              <li key={`${match.term}-${match.foundIn}`}>
                <English>{match.term}</English>{" "}
                <span className="muted">
                  (
                  {match.foundIn === "REQUIREMENT"
                    ? t.interview.blueprint.foundInRequirement
                    : t.interview.blueprint.foundInDescription}
                  )
                </span>
              </li>
            ))}
          </ul>
        )}
      </td>
    </tr>
  );
}
