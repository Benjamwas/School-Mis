import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/categories', (req, res) => {
  res.json(db.prepare('SELECT * FROM gallery_categories ORDER BY sort_order, name').all());
});

router.get('/images', (req, res) => {
  const { category } = req.query;
  let sql = `
    SELECT g.*, c.name as category_name
    FROM gallery_images g
    LEFT JOIN gallery_categories c ON g.category_id = c.id
  `;
  const params = [];
  if (category) { sql += ' WHERE c.name = ?'; params.push(category); }
  sql += ' ORDER BY g.sort_order, g.id DESC';
  res.json(db.prepare(sql).all(...params));
});

router.post('/categories', requireAuth, (req, res) => {
  const { name, sort_order } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Name is required' });
  try {
    const result = db.prepare('INSERT INTO gallery_categories (name, sort_order) VALUES (?, ?)').run(name, sort_order || 0);
    res.status(201).json(db.prepare('SELECT * FROM gallery_categories WHERE id = ?').get(result.lastInsertRowid));
  } catch {
    res.status(400).json({ error: 'Category already exists' });
  }
});

router.put('/categories/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const { name, sort_order } = req.body || {};
  const existing = db.prepare('SELECT * FROM gallery_categories WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Category not found' });
  db.prepare('UPDATE gallery_categories SET name=?, sort_order=? WHERE id=?').run(
    name ?? existing.name, sort_order ?? existing.sort_order, id
  );
  res.json(db.prepare('SELECT * FROM gallery_categories WHERE id = ?').get(id));
});

router.delete('/categories/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM gallery_categories WHERE id = ?').run(Number(req.params.id));
  if (!result.changes) return res.status(404).json({ error: 'Category not found' });
  res.json({ success: true });
});

router.post('/images', requireAuth, (req, res) => {
  const { src, alt, category_id, sort_order } = req.body || {};
  if (!src) return res.status(400).json({ error: 'Image source is required' });
  const result = db.prepare(
    'INSERT INTO gallery_images (src, alt, category_id, sort_order) VALUES (?, ?, ?, ?)'
  ).run(src, alt || '', category_id || null, sort_order || 0);
  const row = db.prepare(`
    SELECT g.*, c.name as category_name
    FROM gallery_images g LEFT JOIN gallery_categories c ON g.category_id = c.id
    WHERE g.id = ?
  `).get(result.lastInsertRowid);
  res.status(201).json(row);
});

router.put('/images/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM gallery_images WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Image not found' });
  const { src, alt, category_id, sort_order } = req.body || {};
  db.prepare('UPDATE gallery_images SET src=?, alt=?, category_id=?, sort_order=? WHERE id=?').run(
    src ?? existing.src, alt ?? existing.alt,
    category_id !== undefined ? category_id : existing.category_id,
    sort_order ?? existing.sort_order, id
  );
  const row = db.prepare(`
    SELECT g.*, c.name as category_name
    FROM gallery_images g LEFT JOIN gallery_categories c ON g.category_id = c.id
    WHERE g.id = ?
  `).get(id);
  res.json(row);
});

router.delete('/images/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM gallery_images WHERE id = ?').run(Number(req.params.id));
  if (!result.changes) return res.status(404).json({ error: 'Image not found' });
  res.json({ success: true });
});

export default router;
