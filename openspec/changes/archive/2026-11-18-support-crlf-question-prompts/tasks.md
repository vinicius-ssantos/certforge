# Tasks

## 1. Render question text consistently

- [x] 1.1 Add component regressions in web/src/ui/prompt.test.tsx comparing LF, CRLF and mixed inputs for paragraphs, highlighted Java and plain fenced code. Check keyboard focusability, indentation and interior blank lines.
- [x] 1.2 Normalize CRLF pairs in splitFences before matching and slicing question text.

## 2. Verify

- [x] 2.1 Run the prompt test suite and confirm existing LF, fallback and unclosed fence cases still pass.

