/**
 * POST /api/inquiry — client inquiry lead capture.
 * Appends one row to the Client Inquiries spreadsheet. Never overwrites.
 */
import { appendRow, timestampIST, sanitizeCell, rateLimited } from './_sheets.js';

const env = {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
  GOOGLE_SHEETS_CLIENT_INQUIRIES_ID: process.env.GOOGLE_SHEETS_CLIENT_INQUIRIES_ID,
};
const TAB = process.env.GOOGLE_SHEETS_CLIENT_TAB || 'Inquiries';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/.+\..+/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const ip = (req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ message: 'Too many submissions. Please wait a minute.' });
  }

  let body;
  try {
    body = typeof req.body === 'object' && req.body ? req.body : JSON.parse(req.body || '{}');
  } catch {
    return res.status(400).json({ message: 'Invalid request body.' });
  }

  // honeypot: real users never fill this
  if ((body.websiteHp ?? '').trim() !== '') {
    return res.status(200).json({ message: 'Inquiry received.' });
  }

  const str = (v, max = 2000) => String(v ?? '').trim().slice(0, max);
  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const services = Array.isArray(body.services) ? body.services.map((s) => str(s, 80)).filter(Boolean) : [];
  const brief = str(body.brief, 4000);

  const errors = {};
  if (!name) errors.name = 'Full name is required.';
  if (!email || !EMAIL_RE.test(email)) errors.email = 'A valid email is required.';
  if (services.length === 0) errors.services = 'Select at least one service.';
  if (brief.length < 10) errors.brief = 'Project description is required.';
  if (body.privacy !== true) errors.privacy = 'Privacy acknowledgement is required.';
  if (body.website && !URL_RE.test(str(body.website, 300))) errors.website = 'Invalid website URL.';
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Validation failed.', errors });
  }

  const row = [
    timestampIST(),
    name,
    email,
    str(body.phone, 40),
    str(body.company, 200),
    str(body.website, 300),
    services.join(', '),
    brief,
    str(body.workflow, 2000),
    str(body.integrations, 500),
    str(body.timeline, 80),
    str(body.budgetStatus, 40),
    str(body.budget, 120),
    str(body.plannerSummary, 4000),
    str(body.source, 300),
    body.privacy === true ? 'Yes' : 'No',
    'New',
  ];

  try {
    await appendRow(env, env.GOOGLE_SHEETS_CLIENT_INQUIRIES_ID, TAB, row);
    return res.status(200).json({
      message:
        'Inquiry received. The founders review every requirement personally and will reach out to discuss scope and budget.',
    });
  } catch (err) {
    console.error('[inquiry] append failed:', err.code ?? '', err.message.slice(0, 300));
    if (err.code === 'NOT_CONFIGURED') {
      return res.status(503).json({
        message:
          'Our inquiry pipeline is not configured yet. Please email build@softbase.services directly with these details.',
      });
    }
    return res.status(500).json({
      message:
        'The submission could not be recorded on our side. Please try again, or email build@softbase.services directly.',
    });
  }
}
