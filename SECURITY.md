# Security Policy

## Scope
This repository hosts public CDN assets for BuildSaver website runtime delivery.

## Do Not Store Here
- API keys, tokens, passwords, private keys
- Internal-only endpoints or credentials
- PII or customer-export data

## Reporting
If you identify a security issue, report privately to:
- `security@buildsaver.ca`

Please include impacted file(s), reproducible steps, and impact details.

## Guardrails
- `cdn-integrity-guardrails` workflow validates runtime config schema and asset integrity hash.
- `validate` runs on every PR/push to `main` to avoid path-filter bypass of required checks.
- `secret-scan-guardrails` workflow scans every push/PR for leaked credentials.
- `sync-buildsaver-source` reads source from `ThePurpleBrick/buildsaver` using `BUILDSAVER_SOURCE_DEPLOY_KEY` (read-only deploy key, no cross-repo PAT).
- `main` should be branch-protected with required checks: `validate` and `secret-scan`.
- Force pushes and deletions on `main` should be disabled.
