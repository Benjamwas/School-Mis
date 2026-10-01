import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const PUBLIC_KEYS = [
  'site_name', 'tagline', 'footer_phone', 'footer_email', 'footer_address',
  'hero_tagline', 'hero_images', 'about_mission', 'about_vision', 'about_history',
  'core_values', 'chatbot', 'contact_phone', 'contact_email'
];

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM site_settings').all();
  const settings = {};
  for (const r of rows) {
    try { settings[r.key] = JSON.parse(r.value); }
    catch { settings[r.key] = r.value; }
  }
  res.json(settings);
});

router.get('/public', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM site_settings').all();
  const settings = {};
  for (const r of rows) {
    if (!PUBLIC_KEYS.includes(r.key)) continue;
    try { settings[r.key] = JSON.parse(r.value); }
    catch { settings[r.key] = r.value; }
  }
  res.json(settings);
});

router.put('/:key', requireAuth, (req, res) => {
  const key = req.params.key;
  const value = req.body?.value;
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);
  db.prepare(`
    INSERT INTO site_settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(key, serialized);
  res.json({ key, value });
});

export default router;
