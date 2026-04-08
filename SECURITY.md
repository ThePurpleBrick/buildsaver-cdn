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
- `main` should be branch-protected with required status checks.
