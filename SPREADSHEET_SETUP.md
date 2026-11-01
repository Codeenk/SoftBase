# Google Sheets setup — SoftBase forms

Two independent pipelines, two spreadsheets, one service account:

| Workflow | Form | Endpoint | Spreadsheet |
|---|---|---|---|
| A · Client inquiries | Contact form (`/#contact`) | `POST /api/inquiry` | Client Inquiries |
| B · Internship applications | Careers form (`/careers.html#apply`) | `POST /api/application` | Internship Applications |

The code is complete; nothing below can be done by the website itself. These
steps require the founders' Google account.

## 1. Google Cloud project

1. Go to <https://console.cloud.google.com/> and create a project (e.g. `softbase-site`).
2. Open **APIs & Services → Library**, search for **Google Sheets API**, and enable it.

## 2. Service account

1. **APIs & Services → Credentials → Create credentials → Service account.**
2. Name it (e.g. `softbase-sheets`), skip the optional role steps.
3. Open the service account → **Keys → Add key → Create new key → JSON.**
   A `.json` file downloads. It contains the `client_email` and `private_key`
   used below. **Treat this file as a password.**

## 3. Create the two spreadsheets

Create two spreadsheets in Google Drive:

1. `SoftBase — Client Inquiries`, with a tab named `Inquiries`.
2. `SoftBase — Internship Applications`, with a tab named `Applications`.

Suggested header rows (row 1) — the code appends values in exactly this order:

**Inquiries (tab `Inquiries`):**

```
Timestamp IST | Full name | Email | Phone | Company | Website | Requested services | Project description | Existing workflow/problem | Integration requirements | Expected timeline | Budget status | Budget INR | Project planner summary | Source/referrer | Privacy acknowledgement | Lead status
```

**Applications (tab `Applications`):**

```
Submission timestamp IST | Full name | Email | Phone | City | College | Course | Academic year | Preferred duration | Joining availability | Weekly availability | LinkedIn URL | Resume URL | Previous experience | Preferred platforms | Motivation response | Unpaid acknowledgement | Privacy acknowledgement | Application source | Application status
```

The duplicate-email check for applications reads **column C (Email)**.

## 4. Share both spreadsheets with the service account

In each spreadsheet: **Share** → paste the service account's email
(`...@...iam.gserviceaccount.com`) → give it **Editor** → done. Without this
step every append fails with 403.

## 5. Collect the identifiers

- **Spreadsheet IDs** come from each spreadsheet's URL:
  `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit`
- **Service account email** and **private key** come from the JSON key file.

## 6. Configure environment variables

Locally: copy `.env.example` to `.env` and fill the values (never commit it).
On Vercel: **Project → Settings → Environment Variables**, add all six for
Production, Preview and Development. For `GOOGLE_PRIVATE_KEY`, paste the full
key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`;
keep the `\n` escapes exactly as they appear in the JSON file.

## 7. Deploy and test

1. Redeploy (`npx vercel --prod`, or push to the connected Git branch).
2. **Client inquiries:** submit the contact form once with real values, then
   check the `Inquiries` tab for a new row. Repeat with "budget not decided".
3. **Internship applications:** submit the careers form, check the
   `Applications` tab. Submit again with the same email: you should see the
   "already have an application with this email" message instead of a new row.
4. Verify a row with a value beginning with `=` was stored safely (prefixed
   with `'`) — that is the formula-injection guard at work.

## 8. Behaviour reference

- Both endpoints accept **POST** with JSON only, and are rate-limited
  (5 requests/min/IP).
- Success responses are sent **only after** Google Sheets confirms the append.
- On failure the frontend keeps everything the user typed.
- Duplicate emails in **Applications** return HTTP 409 and are not appended.
- Inquiries are always appended (each submission is a lead); leads are never
  overwritten.
- If the environment variables are missing, the endpoints answer **503** with
  an "email us directly" message instead of silently losing the submission.

## 9. What the founders must still provide

- The real service-account credentials and spreadsheet IDs (steps 2–5).
- Confirmation of the internship terms and their legal classification.
- Confirmation of the exact working-hours line and any response-time promises
  currently phrased generically on the site.
