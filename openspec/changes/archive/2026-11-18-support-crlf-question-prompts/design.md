# Design

## Context

The shared Prompt component uses splitFences for segmentation and then splits prose on blank lines.

## Goals / Non-Goals

Handle CRLF wherever it appears in displayed prompts. Stored author text and editorial checksums are outside the rendering change.

## Decisions

Normalize CRLF pairs to LF at the start of splitFences. Use the normalized string for both match offsets and slices so that prose and code share one coordinate system. This also gives the existing paragraph splitter normalized input.

## Risks / Trade-offs

Blank lines inside code are significant. Compare multiline example text including indentation and blank lines in regression coverage.

