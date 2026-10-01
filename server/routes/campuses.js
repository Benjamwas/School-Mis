import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM campuses ORDER BY sort_order, name').all());
});

router.get('/:slug', (req, res) => {
  const row = db.prepare('SELECT * FROM campuses WHERE slug = ?').get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Campus not found' });
  res.json(row);
});

router.post('/', requireAuth, (req, res) => {
  const b = req.body || {};
  if (!b.name) return res.status(400).json({ error: 'Name is required' });
  const slug = b.slug ? slugify(b.slug) : slugify(b.name);
  const features = Array.isArray(b.features) ? JSON.stringify(b.features) : (b.features || '[]');
  const result = db.prepare(`
    INSERT INTO campuses (name, slug, tagline, description, long_description, image, features, address, hours, age_range, contact_phone, contact_email, latitude, longitude, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    b.name, slug, b.tagline || '', b.description || '', b.long_description || '',
    b.image || '', features, b.address || '', b.hours || '', b.age_range || '',
    b.contact_phone || '', b.contact_email || '',
    b.latitude ?? null, b.longitude ?? null, b.sort_order || 0
  );
  res.status(201).json(db.prepare('SELECT * FROM campuses WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM campuses WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Campus not found' });
  const b = req.body || {};
  const features = b.features !== undefined
    ? (Array.isArray(b.features) ? JSON.stringify(b.features) : b.features)
    : existing.features;
  db.prepare(`
    UPDATE campuses SET name=?, slug=?, tagline=?, description=?, long_description=?, image=?, features=?, address=?, hours=?, age_range=?, contact_phone=?, contact_email=?, latitude=?, longitude=?, sort_order=?, updated_at=datetime('now')
    WHERE id=?
  `).run(
    b.name ?? existing.name,
    b.slug ? slugify(b.slug) : existing.slug,
    b.tagline ?? existing.tagline, b.description ?? existing.description,
    b.long_description ?? existing.long_description, b.image ?? existing.image,
    features, b.address ?? existing.address, b.hours ?? existing.hours,
    b.age_range ?? existing.age_range, b.contact_phone ?? existing.contact_phone,
    b.contact_email ?? existing.contact_email,
    b.latitude !== undefined ? b.latitude : existing.latitude,
    b.longitude !== undefined ? b.longitude : existing.longitude,
    b.sort_order ?? existing.sort_order, id
  );
  res.json(db.prepare('SELECT * FROM campuses WHERE id = ?').get(id));
});

router.delete('/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM campuses WHERE id = ?').run(Number(req.params.id));
  if (!result.changes) return res.status(404).json({ error: 'Campus not found' });
  res.json({ success: true });
});

export default router;
