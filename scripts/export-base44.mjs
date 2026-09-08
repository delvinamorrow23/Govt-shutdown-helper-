// Base44 content exporter for Gleea.
//
// Run this on a machine that can reach Base44 (this project's cloud sessions
// cannot — the egress policy blocks base44.app). It dumps every entity to
// data/base44-export/<Entity>.json so the content is captured in the repo.
//
// Usage:
//   B44_KEY=your_api_key node scripts/export-base44.mjs
//
// The API key is read from the environment and is never written to disk.
// This script only READS (GET). It never creates, updates, or deletes.

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const APP_ID = process.env.B44_APP_ID || '6962f18f5ac4a5c19cf26486';
const BASE = process.env.B44_BASE ||
  'https://gleea-the-kindness-adventure-9cf26486.base44.app/api';
const KEY = process.env.B44_KEY;

if (!KEY) {
  console.error('Set B44_KEY (your Base44 api_key) in the environment first.');
  process.exit(1);
}

// All entities from the API reference. The first two are CONTENT (safe to
// commit); the rest are per-child/user records and analytics that may contain
// personal data — review before committing those.
const CONTENT = ['Mission', 'Badge'];
const DATA = [
  'CASELInsight', 'SELMilestone', 'UserProgress', 'Reflection', 'EducatorNote',
  'ParentalSettings', 'ChildBadge', 'DistrictReport', 'ActivityLog', 'School', 'User',
];
const ENTITIES = [...CONTENT, ...DATA];

const OUT = path.join(process.cwd(), 'data', 'base44-export');
const PAGE = 200;

async function listAll(entity) {
  const all = [];
  for (let skip = 0; ; skip += PAGE) {
    const url = `${BASE}/entities/${entity}?limit=${PAGE}&skip=${skip}&sort_by=-created_date`;
    const res = await fetch(url, { headers: { api_key: KEY } });
    if (!res.ok) throw new Error(`${entity}: HTTP ${res.status} ${await res.text()}`);
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < PAGE) break;
  }
  return all;
}

await mkdir(OUT, { recursive: true });
const summary = {};
for (const entity of ENTITIES) {
  try {
    const rows = await listAll(entity);
    await writeFile(path.join(OUT, `${entity}.json`), JSON.stringify(rows, null, 2));
    summary[entity] = rows.length;
    console.log(`✓ ${entity}: ${rows.length} records`);
  } catch (e) {
    summary[entity] = `ERROR: ${e.message}`;
    console.error(`✗ ${entity}: ${e.message}`);
  }
}
await writeFile(path.join(OUT, '_summary.json'), JSON.stringify(summary, null, 2));
console.log('\nDone. Content is in data/base44-export/.');
console.log('Note: Mission.json and Badge.json are content; the rest may contain');
console.log('child/personal data — review before committing.');
