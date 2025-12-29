# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **Do NOT** open a public GitHub issue for security vulnerabilities
2. Email the maintainer directly or use GitHub's private vulnerability reporting
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- Acknowledgment within 48 hours
- Regular updates on progress
- Credit in the security advisory (unless you prefer anonymity)

## Security Measures

### Data Privacy

- **Client-side storage**: All tier list data is stored locally in your browser (localStorage)
- **No tracking**: We do not track users or collect analytics
- **No accounts required**: Use the app without creating an account
- **Optional image hosting**: Images are only uploaded to imgbb when you choose to share

### Image Uploads (Optional)

When sharing tier lists via URL:

- Images are uploaded to imgbb.com (third-party service)
- You can use your own imgbb API key for full control
- Delete URLs are provided to remove uploaded images

### Security Headers

The application implements security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-XSS-Protection: 1; mode=block`
- `Permissions-Policy` (restricts sensitive APIs)

### Input Validation

- File imports validated for size (10MB max) and structure
- URL parameters sanitized and validated
- Tier list data validated before processing

## Self-Hosting Security

If self-hosting LibreTier:

1. Use HTTPS in production
2. Set your own `IMGBB_API_KEY` in environment variables
3. Review and customize CSP headers for your domain
4. Keep dependencies updated

## Known Limitations

- localStorage is not encrypted (data accessible if device is compromised)
- Shared URLs may contain tier list data visible in browser history
- imgbb uploads are not end-to-end encrypted
