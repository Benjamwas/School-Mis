import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const { active } = req.query;
  let sql = 'SELECT * FROM staff';
  if (active !== undefined && active !== '') sql += ' WHERE is_active = ?';
  sql += ' ORDER BY sort_order, name';
  const rows = active !== undefined && active !== ''
    ? db.prepare(sql).all(Number(active))
    : db.prepare(sql).all();
  res.json(rows);
});

router.post('/', requireAuth, (req, res) => {
  const b = req.body || {};
  if (!b.name) return res.status(400).json({ error: 'Name is required' });
  const result = db.prepare(
    'INSERT INTO staff (name, role_title, bio, image, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(b.name, b.role_title || '', b.bio || '', b.image || '', b.sort_order || 0, b.is_active !== false ? 1 : 0);
  res.status(201).json(db.prepare('SELECT * FROM staff WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM staff WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Staff member not found' });
  const b = req.body || {};
  db.prepare(
    'UPDATE staff SET name=?, role_title=?, bio=?, image=?, sort_order=?, is_active=? WHERE id=?'
  ).run(
    b.name ?? existing.name, b.role_title ?? existing.role_title, b.bio ?? existing.bio,
    b.image ?? existing.image, b.sort_order ?? existing.sort_order,
    b.is_active !== undefined ? (b.is_active ? 1 : 0) : existing.is_active, id
  );
  res.json(db.prepare('SELECT * FROM staff WHERE id = ?').get(id));
});

router.delete('/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM staff WHERE id = ?').run(Number(req.params.id));
  if (!result.changes) return res.status(404).json({ error: 'Staff member not found' });
  res.json({ success: true });
});

export default router;
