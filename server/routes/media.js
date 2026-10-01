import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const ALLOWED = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'video/mp4': '.mp4',
  'video/webm': '.webm'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = ALLOWED[file.mimetype] || path.extname(file.originalname) || '';
    const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED[file.mimetype]) cb(null, true);
    else cb(new Error('Unsupported file type'));
  }
});

const router = Router();

router.get('/', requireAuth, (req, res) => {
  res.json(db.prepare('SELECT * FROM media_uploads ORDER BY created_at DESC').all());
});

router.post('/', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const filePath = `/uploads/${req.file.filename}`;
  const result = db.prepare(
    'INSERT INTO media_uploads (filename, original_name, mime_type, size_bytes, path, alt) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(
    req.file.filename, req.file.originalname, req.file.mimetype,
    req.file.size, filePath, req.body.alt || ''
  );
  res.status(201).json(db.prepare('SELECT * FROM media_uploads WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM media_uploads WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Media not found' });
  db.prepare('UPDATE media_uploads SET alt = ? WHERE id = ?').run(req.body?.alt ?? existing.alt, id);
  res.json(db.prepare('SELECT * FROM media_uploads WHERE id = ?').get(id));
});

router.delete('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM media_uploads WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Media not found' });
  const full = path.join(uploadsDir, existing.filename);
  if (fs.existsSync(full)) fs.unlinkSync(full);
  db.prepare('DELETE FROM media_uploads WHERE id = ?').run(id);
  res.json({ success: true });
});

export default router;
