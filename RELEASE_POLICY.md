# Koala Release Policy

## Versioning

Koala uses semantic versioning:

- Major: incompatible workflow or data-contract changes
- Minor: backward-compatible features
- Patch: backward-compatible fixes and security maintenance
- Prerelease labels: alpha, beta, and release candidate

## Release checklist

1. Run JavaScript syntax checks and `npm audit`.
2. Test note creation, validation, PDF export, backup/restore, and settings.
3. Test keyboard-only navigation and modal focus behavior.
4. Build Windows and macOS artifacts in GitHub Actions.
5. Sign Windows artifacts and sign/notarize macOS artifacts.
6. Install and launch each signed artifact on a clean test device.
7. Publish release notes with fixes, known issues, and upgrade guidance.
8. Promote only validated artifacts to a stable release.

## Signing requirements

macOS releases require an Apple Developer ID Application certificate and notarization credentials. Windows releases require a trusted code-signing certificate. Secrets must be stored in GitHub Actions secrets and never committed to the repository.

Unsigned builds must be labeled for development or evaluation and should not be represented as production-ready distributions.
