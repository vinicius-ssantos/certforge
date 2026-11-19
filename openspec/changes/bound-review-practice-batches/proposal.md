## Why
The expanded review queue can display up to 100 questions per topic, while study sessions default to a maximum of 20. Practising the entire group is rejected instead of starting a review session (#421).

## What Changes
- Include the configured maximum session size in the review queue response.
- Start only the first permitted batch of the filtered topic group and label the button with that batch size.
- Keep remaining questions visible for subsequent sessions.

## Capabilities
### New Capabilities
### Modified Capabilities
- `study-workflows`: review actions must respect the server session limit and preserve queue priority.

## Impact
Review queue API, public study policy read contract, generated web API types, review page, and regression tests. No data migration is needed.
