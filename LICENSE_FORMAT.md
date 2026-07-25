# Koala Organization License Record

Koala 2.0 alpha accepts a local JSON license record:

```json
{
  "format": "koala-license-v1",
  "licenseId": "ORG-2026-001",
  "organization": "Example Organization",
  "seats": 25,
  "issuedAt": "2026-07-17T00:00:00.000Z",
  "expiresAt": "2027-07-17T00:00:00.000Z"
}
```

Omit `expiresAt` for a perpetual record.

The alpha implementation validates the record structure and expiration locally. It is not cryptographically signed and is not tamper-resistant. Before commercial production, replace it with publisher-signed license files or a managed licensing service.
