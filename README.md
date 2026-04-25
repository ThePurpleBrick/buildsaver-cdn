# BuildSaver CDN Assets

Auto-published assets for BuildSaver Squarespace 7.1 footer deployment.

## Expected Files
- `footer-code-injection.js`
- `deploy-manifest.json`
- `runtime-config.json`

## Safety
- Integrity checks run in `.github/workflows/cdn-integrity-guardrails.yml`.
- Secret scanning runs in `.github/workflows/secret-scan-guardrails.yml`.
- Source sync runs in `.github/workflows/sync-buildsaver-source.yml` and reads the private source repo using a read-only deploy key.
- See `SECURITY.md` for reporting and policy.
