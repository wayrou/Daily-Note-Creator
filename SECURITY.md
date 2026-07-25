# Koala Security

## Architecture

Koala is a local-first Electron desktop application. Notes and preferences are stored on the device in Electron/Chromium application storage. PDF files are written only when a user exports them or when an authorized local Mobile Session submission is received.

The renderer runs with Electron sandboxing and context isolation enabled, Node integration disabled, a restrictive Content Security Policy, blocked in-app navigation, denied browser permissions, and a narrow preload API. PDF save requests are validated in the main process before filesystem access.

## Sensitive data

Koala may process student initials, classroom information, therapy notes, and care information. Deploying organizations are responsible for device access controls, operating-system encryption, backups, retention requirements, and staff authorization.

Koala does not claim HIPAA, FERPA, SOC 2, or other compliance certification solely by virtue of these controls. An organization should complete its own legal, privacy, and security assessment before production deployment.

## Mobile Session

Mobile Session starts a temporary HTTP service on the local network and protects submissions with a random session token. Use it only on a trusted network. Stop the session when finished. Mobile Session is not intended for use across the public internet.

## Vulnerability reporting

Report suspected vulnerabilities privately to the software publisher. Include the Koala version, operating system, reproduction steps, and impact. Do not include real student or client data.

## Update policy

Supported installed macOS and Windows builds check published GitHub Releases for updates. Portable Windows builds must be updated manually. Security updates should be deployed promptly after validation.
