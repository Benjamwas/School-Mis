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

function uniqueSlug(table, base, excludeId = null) {
  let slug = slugify(base) || 'item';
  let n = 1;
  let row;
  do {
    row = excludeId
      ? db.prepare(`SELECT id FROM ${table} WHERE slug = ? AND id != ?`).get(slug, excludeId)
      : db.prepare(`SELECT id FROM ${table} WHERE slug = ?`).get(slug);
    if (row) slug = `${slugify(base)}-${n++}`;
  } while (row);
  return slug;
}

router.get('/', (req, res) => {
  const { status, featured, limit } = req.query;
  let sql = 'SELECT e.*, c.name as campus_name FROM events e LEFT JOIN campuses c ON e.campus_id = c.id';
  const params = [];
  const where = [];
  if (status) { where.push('e.status = ?'); params.push(status); }
  if (featured !== undefined && featured !== '') { where.push('e.featured = ?'); params.push(Number(featured)); }
  if (where.length) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY e.date DESC, e.id DESC';
  if (limit) { sql += ' LIMIT ?'; params.push(Number(limit)); }
  res.json(db.prepare(sql).all(...params));
});

router.get('/:slug', (req, res) => {
  const row = db.prepare(
    'SELECT e.*, c.name as campus_name FROM events e LEFT JOIN campuses c ON e.campus_id = c.id WHERE e.slug = ?'
  ).get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Event not found' });
  res.json(row);
});

router.post('/', requireAuth, (req, res) => {
  const b = req.body || {};
  if (!b.title || !b.date) return res.status(400).json({ error: 'Title and date are required' });
  const slug = b.slug ? uniqueSlug('events', b.slug) : uniqueSlug('events', b.title);
  const result = db.prepare(`
    INSERT INTO events (title, slug, date, time, location, campus_id, description, image, status, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    b.title, slug, b.date, b.time || '', b.location || '',
    b.campus_id || null, b.description || '', b.image || '',
    b.status || 'draft', b.featured ? 1 : 0
  );
  const row = db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(row);
});

router.put('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Event not found' });
  const b = req.body || {};
  const title = b.title ?? existing.title;
  const slug = b.slug !== undefined ? uniqueSlug('events', b.slug || title, id) : existing.slug;
  db.prepare(`
    UPDATE events SET title=?, slug=?, date=?, time=?, location=?, campus_id=?, description=?, image=?, status=?, featured=?, updated_at=datetime('now')
    WHERE id=?
  `).run(
    title, slug,
    b.date ?? existing.date, b.time ?? existing.time, b.location ?? existing.location,
    b.campus_id !== undefined ? b.campus_id : existing.campus_id,
    b.description ?? existing.description, b.image ?? existing.image,
    b.status ?? existing.status,
    b.featured !== undefined ? (b.featured ? 1 : 0) : existing.featured,
    id
  );
  res.json(db.prepare('SELECT * FROM events WHERE id = ?').get(id));
});

router.delete('/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM events WHERE id = ?').run(Number(req.params.id));
  if (!result.changes) return res.status(404).json({ error: 'Event not found' });
  res.json({ success: true });
});

export default router;
