# Koala

Cross-platform desktop app for filling out a classroom note and exporting one PDF per date.

## Local development

Install dependencies:

```bash
npm install
```

Run the desktop app:

```bash
npm run desktop
```

Run the simple browser server:

```bash
npm start
```

## Build downloads

Build a macOS release:

```bash
npm run dist:mac
```

Build a Windows release:

```bash
npm run dist:win
```

Build all configured desktop targets:

```bash
npm run dist
```

## GitHub releases

This repo includes [release.yml](/Users/alexhungate/Desktop/daily note creator/.github/workflows/release.yml), which builds downloadable release files on GitHub Actions:

- macOS: `.dmg` and `.zip`
- Windows: `.exe` installer and portable build

Push a tag like `v1.0.0` to trigger a GitHub Release with those downloadable files attached.

## What it does

- Uses a clean printable classroom-note layout
- Includes the agency logo from the original template
- Supports classroom, absent, and agency-closed notes
- Supports exporting one PDF per entered date
- Lets the user tab through a form and see a live preview
- Saves generated PDFs with the child initials and date in the file name
