/**
 * POST /api/application — internship application capture.
 * Appends one row to the Internship Applications spreadsheet (independent of
 * client inquiries). Duplicate email addresses are rejected explicitly.
 */
import { appendRow, readColumn, timestampIST, rateLimited } from './_sheets.js';

const env = {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
  GOOGLE_SHEETS_INTERNSHIP_APPLICATIONS_ID: process.env.GOOGLE_SHEETS_INTERNSHIP_APPLICATIONS_ID,
};
const TAB = process.env.GOOGLE_SHEETS_INTERNS_TAB || 'Applications';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/.+\..+/;
const DURATIONS = ['1 month', '2 months', '3 months'];

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

  if ((body.websiteHp ?? '').trim() !== '') {
    return res.status(200).json({ message: 'Application received.' });
  }

  const str = (v, max = 2000) => String(v ?? '').trim().slice(0, max);
  const name = str(body.name, 120);
  const email = str(body.email, 200).toLowerCase();
  const college = str(body.college, 200);
  const course = str(body.course, 120);
  const why = str(body.why, 4000);

  const errors = {};
  if (!name) errors.name = 'Full name is required.';
  if (!email || !EMAIL_RE.test(email)) errors.email = 'A valid email is required.';
  if (!college) errors.college = 'College or university is required.';
  if (!course) errors.course = 'Course or major is required.';
  if (!DURATIONS.includes(str(body.duration, 20))) errors.duration = 'Choose 1, 2 or 3 months.';
  if (!str(body.year, 40)) errors.year = 'Academic year is required.';
  if (!str(body.joining, 60)) errors.joining = 'Joining availability is required.';
  if (!str(body.weekly, 60)) errors.weekly = 'Weekly availability is required.';
  if (why.length < 20) errors.why = 'Please answer the motivation question in a few sentences.';
  if (body.acknowledgement !== true) errors.ack = 'The internship terms acknowledgement is required.';
  if (body.privacy !== true) errors.privacy = 'Privacy acknowledgement is required.';
  if (body.linkedin && !URL_RE.test(str(body.linkedin, 300))) errors.linkedin = 'Invalid LinkedIn URL.';
  if (body.resume && !URL_RE.test(str(body.resume, 300))) errors.resume = 'Invalid resume URL.';
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Validation failed.', errors });
  }

  try {
    // explicit duplicate handling: one open application per email
    const existing = await readColumn(env, env.GOOGLE_SHEETS_INTERNSHIP_APPLICATIONS_ID, TAB, 'C');
    if (existing.includes(email)) {
      return res.status(409).json({
        message:
          'We already have an application with this email address. If you need to update it, email careers@softbase.services.',
      });
    }

    const row = [
      timestampIST(),
      name,
      email,
      str(body.phone, 40),
      str(body.city, 120),
      college,
      course,
      str(body.year, 40),
      str(body.duration, 20),
      str(body.joining, 60),
      str(body.weekly, 60),
      str(body.linkedin, 300),
      str(body.resume, 300),
      str(body.experience, 2000),
      (Array.isArray(body.platforms) ? body.platforms.map((p) => str(p, 40)) : [])
        .filter(Boolean)
        .join(', '),
      why,
      body.acknowledgement === true ? 'Yes' : 'No',
      body.privacy === true ? 'Yes' : 'No',
      str(body.source, 300),
      'New',
    ];

    await appendRow(env, env.GOOGLE_SHEETS_INTERNSHIP_APPLICATIONS_ID, TAB, row);
    return res.status(200).json({
      message:
        'Application received. We read every one and reply to each applicant; shortlisted candidates hear from us for a further conversation.',
    });
  } catch (err) {
    console.error('[application] failed:', err.code ?? '', err.message.slice(0, 300));
    if (err.code === 'NOT_CONFIGURED') {
      return res.status(503).json({
        message:
          'Our application pipeline is not configured yet. Please email careers@softbase.services directly with these details.',
      });
    }
    return res.status(500).json({
      message:
        'The application could not be recorded on our side. Your entries are kept below; try again, or email careers@softbase.services directly.',
    });
  }
}
