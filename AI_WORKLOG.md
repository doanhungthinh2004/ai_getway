# AI Worklog

## AI Tools

- GitHub Copilot
- VS Code code generation assistance
- Testing and build validation via terminal

## AI Used For

- scaffolding project structure
- generating Express + TypeScript backend bootstrapping
- designing auth and route layout
- drafting AI provider abstraction
- planning usage metrics and error handling
- documenting the project
- creating test cases

## Incorrect AI Outputs

Some early suggestions proposed retrying all HTTP failures universally. That was corrected after analysis because only transient failures should be retried. Permanent issues such as invalid API keys, validation problems, and authorization failures should fail fast.

Another early idea was to put provider logic directly in the controller. That was revised to a provider abstraction and AI service layer to keep the controller clean and the provider swap-out manageable.

## Human Decisions

The project intentionally uses in-memory rate limiting for the prototype instead of Redis. This is the right trade-off for a small demo and was explicitly documented as a limitation.

The gateway defaults to a demo fallback response when `OPENAI_API_KEY` is missing. This keeps the app runnable in local development without breaking the architecture.

Authentication is enforced for chat, analyze, conversation, and usage routes. Conversation ownership is also enforced through userId checks during retrieval and deletion.

## Verification

- TypeScript build confirmed with `npm run build`
- Vitest suite executed with `npm run test`
- Basic runtime startup checked by launching the compiled server and verifying the boot path
- API structure and models reviewed against the challenge requirements
- Usage cost estimates verified with configurable per-model input/output pricing

## Future Improvements

- add Redis-backed rate limiting
- build richer provider fallback logic
- replace manual model pricing configuration with a maintained, versioned pricing catalog
- add real MongoDB integration tests with seeded data
- expand Swagger schema details for each endpoint
