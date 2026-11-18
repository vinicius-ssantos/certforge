# Proposal

## Why

A question whose text uses Windows line endings can show literal fence markers to learners. The prompt parser expects a single LF after the opening fence, and the paragraph splitter also expects consecutive LF characters.

## What Changes

- Render fenced examples and paragraphs consistently for LF, CRLF and mixed question text.

## Capabilities

### New Capabilities

- `question-presentation` covers how the learner interface displays authored question text.

### Modified Capabilities

## Impact

The change affects the web prompt renderer and its component tests.

