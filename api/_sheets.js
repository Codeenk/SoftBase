/**
 * SoftBase — Google Sheets append helper (server-side only).
 *
 * Uses the Sheets REST API with a service-account JWT signed by node:crypto,
 * so no external dependency is required. All credentials stay in environment
 * variables; nothing here is ever shipped to the browser.
 *
 * Required environment variables (see SPREADSHEET_SETUP.md):
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_PRIVATE_KEY          (service account key, \n escapes allowed)
 *   GOOGLE_SHEETS_CLIENT_INQUIRIES_ID
 *   GOOGLE_SHEETS_INTERNSHIP_APPLICATIONS_ID
 */
import crypto from 'node:crypto';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

let cachedToken = null; // { token, expiresAt }

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

function assertConfigured(env) {
  const missing = Object.entries(env)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    const err = new Error(`Sheets integration is not configured. Missing: ${missing.join(', ')}`);
    err.code = 'NOT_CONFIGURED';
    throw err;
  }
}

async function getAccessToken(serviceAccountEmail, privateKey) {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(
    JSON.stringify({
      iss: serviceAccountEmail,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    })
  );
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(`${header}.${claim}`);
  const signature = signer.sign(privateKey.replace(/\\n/g, '\n'));
  const assertion = `${header}.${claim}.${signature.toString('base64url')}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    const err = new Error(`Google token exchange failed: ${res.status} ${detail.slice(0, 200)}`);
    err.code = 'GOOGLE_AUTH_FAILED';
    throw err;
  }
  const data = await res.json();
  cachedToken = { token: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return cachedToken.token;
}

/**
 * Protect against spreadsheet formula injection: a cell that starts with
 * =, +, -, @ or a tab/CR is prefixed with an apostrophe by USER_ENTERED.
 */
export function sanitizeCell(value) {
  if (value === null || value === undefined) return '';
  let v = String(value).replace(/[\r\n]+/g, ' ').trim();
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  return v.slice(0, 2000);
}

/** Timestamp formatted for the IST column. */
export function timestampIST() {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());
}

/** Append one row (array of already-ordered values) to the given tab. */
export async function appendRow(env, spreadsheetId, tab, values) {
  assertConfigured(env);
  const token = await getAccessToken(env.GOOGLE_SERVICE_ACCOUNT_EMAIL, env.GOOGLE_PRIVATE_KEY);
  const range = encodeURIComponent(`${tab}!A1`);
  const res = await fetch(
    `${SHEETS_API}/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [values.map(sanitizeCell)] }),
    }
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    const err = new Error(`Sheets append failed: ${res.status} ${detail.slice(0, 300)}`);
    err.code = 'SHEETS_APPEND_FAILED';
    throw err;
  }
  return res.json();
}

/** Read a single column of raw values (used for duplicate-email checks). */
export async function readColumn(env, spreadsheetId, tab, column) {
  assertConfigured(env);
  const token = await getAccessToken(env.GOOGLE_SERVICE_ACCOUNT_EMAIL, env.GOOGLE_PRIVATE_KEY);
  const range = encodeURIComponent(`${tab}!${column}2:${column}`);
  const res = await fetch(`${SHEETS_API}/${spreadsheetId}/values/${range}?majorDimension=COLUMNS`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = new Error(`Sheets read failed: ${res.status}`);
    err.code = 'SHEETS_READ_FAILED';
    throw err;
  }
  const data = await res.json();
  return (data.values?.[0] ?? []).map((v) => String(v).toLowerCase());
}

/** Naive per-instance rate limit: enough to blunt obvious abuse. */
const hits = new Map();
export function rateLimited(ip, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear(); // keep the map bounded
  return list.length > limit;
}
