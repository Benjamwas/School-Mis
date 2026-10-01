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
  const { status, category, limit } = req.query;
  let sql = 'SELECT * FROM blog_posts';
  const params = [];
  const where = [];
  if (status) { where.push('status = ?'); params.push(status); }
  if (category) { where.push('category = ?'); params.push(category); }
  if (where.length) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY published_at DESC, created_at DESC';
  if (limit) { sql += ' LIMIT ?'; params.push(Number(limit)); }
  res.json(db.prepare(sql).all(...params));
});

router.get('/categories', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT category FROM blog_posts WHERE category != \'\' ORDER BY category').all();
  res.json(rows.map(r => r.category));
});

router.get('/:slug', (req, res) => {
  const row = db.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Post not found' });
  res.json(row);
});

router.post('/', requireAuth, (req, res) => {
  const b = req.body || {};
  if (!b.title) return res.status(400).json({ error: 'Title is required' });
  const slug = b.slug ? uniqueSlug('blog_posts', b.slug) : uniqueSlug('blog_posts', b.title);
  const tags = Array.isArray(b.tags) ? JSON.stringify(b.tags) : (b.tags || '[]');
  const status = b.status || 'draft';
  const publishedAt = status === 'published' ? (b.published_at || new Date().toISOString()) : null;
  const result = db.prepare(`
    INSERT INTO blog_posts (title, slug, excerpt, content, category, author, image, tags, status, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    b.title, slug, b.excerpt || '', b.content || '', b.category || '',
    b.author || 'Vendramini', b.image || '', tags, status, publishedAt
  );
  res.status(201).json(db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Post not found' });
  const b = req.body || {};
  const title = b.title ?? existing.title;
  const slug = b.slug !== undefined ? uniqueSlug('blog_posts', b.slug || title, id) : existing.slug;
  const status = b.status ?? existing.status;
  let publishedAt = existing.published_at;
  if (status === 'published' && !publishedAt) publishedAt = new Date().toISOString();
  const tags = b.tags !== undefined
    ? (Array.isArray(b.tags) ? JSON.stringify(b.tags) : b.tags)
    : existing.tags;
  db.prepare(`
    UPDATE blog_posts SET title=?, slug=?, excerpt=?, content=?, category=?, author=?, image=?, tags=?, status=?, published_at=?, updated_at=datetime('now')
    WHERE id=?
  `).run(
    title, slug,
    b.excerpt ?? existing.excerpt, b.content ?? existing.content,
    b.category ?? existing.category, b.author ?? existing.author,
    b.image ?? existing.image, tags, status, publishedAt, id
  );
  res.json(db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id));
});

router.delete('/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM blog_posts WHERE id = ?').run(Number(req.params.id));
  if (!result.changes) return res.status(404).json({ error: 'Post not found' });
  res.json({ success: true });
});

export default router;
