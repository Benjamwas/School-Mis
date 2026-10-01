import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_TYPES = new Set(['inquiry', 'tour', 'enrollment']);

router.get('/', requireAuth, (req, res) => {
  const { type, status } = req.query;
  let sql = 'SELECT * FROM form_submissions';
  const params = [];
  const where = [];
  if (type) { where.push('type = ?'); params.push(String(type)); }
  if (status) { where.push('status = ?'); params.push(String(status)); }
  if (where.length) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

router.get('/stats', requireAuth, (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as n FROM form_submissions').get().n;
  const newCount = db.prepare("SELECT COUNT(*) as n FROM form_submissions WHERE status = 'new'").get().n;
  res.json({ total, new: newCount });
});

router.post('/', (req, res) => {
  const b = req.body || {};
  const type = VALID_TYPES.has(b.type) ? b.type : 'inquiry';
  const name = String(b.name || '').trim();
  const email = String(b.email || '').trim();
  const phone = String(b.phone || '').trim();
  const campus = String(b.campus || '').trim();
  const subject = String(b.subject || '').trim();
  const message = String(b.message || '').trim();
  const age = b.age === '' || b.age === null || b.age === undefined ? null : Number(b.age);

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  if (email && !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }
  if (phone && phone.replace(/\D/g, '').length < 7) {
    return res.status(400).json({ error: 'Please enter a valid phone number' });
  }
  if (type === 'enrollment' && age !== null && (Number.isNaN(age) || age < 2 || age > 18)) {
    return res.status(400).json({ error: 'Please enter a valid child age (2-18)' });
  }

  try {
    const result = db.prepare(`
      INSERT INTO form_submissions (type, name, email, phone, campus, age, subject, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(type, name, email, phone, campus, age, subject, message);

    res.status(201).json({
      id: result.lastInsertRowid,
      success: true,
      message: 'Thank you! Your submission has been received.'
    });
  } catch (err) {
    console.error('Form submit error', err);
    res.status(500).json({ error: 'Failed to save submission. Please try again.' });
  }
});

router.put('/:id/status', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body || {};
  if (!['new', 'read', 'archived'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const result = db.prepare('UPDATE form_submissions SET status = ? WHERE id = ?').run(status, id);
  if (!result.changes) return res.status(404).json({ error: 'Submission not found' });
  res.json(db.prepare('SELECT * FROM form_submissions WHERE id = ?').get(id));
});

router.delete('/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM form_submissions WHERE id = ?').run(Number(req.params.id));
  if (!result.changes) return res.status(404).json({ error: 'Submission not found' });
  res.json({ success: true });
});

export default router;
