import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from './db.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import blogRoutes from './routes/blog.js';
import galleryRoutes from './routes/gallery.js';
import campusRoutes from './routes/campuses.js';
import testimonialRoutes from './routes/testimonials.js';
import staffRoutes from './routes/staff.js';
import settingsRoutes from './routes/settings.js';
import leadRoutes from './routes/leads.js';
import mediaRoutes from './routes/media.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5001;
const distDir = path.join(__dirname, '..', 'dist');
const publicDir = path.join(__dirname, '..', 'public');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Static media
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(publicDir, 'images')));

// API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/stats', (req, res) => {
  const count = (sql) => db.prepare(sql).get().n;
  res.json({
    events: count("SELECT COUNT(*) as n FROM events WHERE status='published'"),
    eventsUpcoming: count("SELECT COUNT(*) as n FROM events WHERE status='published' AND date >= date('now')"),
    blogPosts: count("SELECT COUNT(*) as n FROM blog_posts WHERE status='published'"),
    galleryImages: count('SELECT COUNT(*) as n FROM gallery_images'),
    campuses: count('SELECT COUNT(*) as n FROM campuses'),
    newLeads: count("SELECT COUNT(*) as n FROM form_submissions WHERE status='new'")
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/campuses', campusRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/forms', leadRoutes);
app.use('/api/admin/media', mediaRoutes);

// Unknown API routes -> JSON 404 (not HTML)
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Production frontend (built Vite app)
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  // SPA fallback for client-side routes (/admin, /events/:slug, etc.)
  app.get('*', (req, res) => {
    if (req.method !== 'GET') {
      return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
  console.log(`Serving frontend from ${distDir}`);
} else {
  app.get('/', (req, res) => {
    res.status(200).send('Vendramini API is running. Build the frontend with `npm run build` to serve it here.');
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Vendramini server listening on http://localhost:${PORT}`);
});
