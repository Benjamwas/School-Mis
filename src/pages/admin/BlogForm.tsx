import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import type { BlogPost } from '../../types';
import ImagePicker from '../../components/admin/ImagePicker';

const categories = [
  'Early Education', 'Parenting', 'Arts Education',
  'Health & Wellness', 'Educational Technology', 'Child Psychology'
];

const empty: Partial<BlogPost> = {
  title: '', excerpt: '', content: '', category: '', author: 'Vendramini',
  image: '', tags: '[]', status: 'draft'
};

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<BlogPost>>(empty);
  const [tagsText, setTagsText] = useState('');
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      api.get(`/blog/${id}`)
        .then((res) => {
          setForm(res.data);
          try {
            const tags = JSON.parse(res.data.tags || '[]');
            setTagsText(Array.isArray(tags) ? tags.join(', ') : '');
          } catch {
            setTagsText(res.data.tags || '');
          }
        })
        .catch(() => setError('Post not found'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const set = (key: keyof BlogPost, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const tags = tagsText.split(',').map((t) => t.trim()).filter(Boolean);
      const payload = { ...form, tags };
      if (id) {
        await api.put(`/blog/${id}`, payload);
      } else {
        await api.post('/blog', payload);
      }
      navigate('/admin/blog');
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { error?: string } } };
      setError(apiErr?.response?.data?.error || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{id ? 'Edit Post' : 'New Post'}</h1>
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {preview ? (
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-3xl">
          {form.image && <img src={form.image} alt="" className="w-full h-64 object-cover rounded mb-6" />}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{form.title}</h1>
          <div className="text-sm text-gray-500 mb-6">
            {form.category} · {form.author} · {form.status}
          </div>
          <p className="text-lg text-gray-600 mb-6 italic">{form.excerpt}</p>
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{form.content}</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 max-w-3xl space-y-5">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input required value={form.title || ''} onChange={(e) => set('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category || ''} onChange={(e) => set('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status || 'draft'} onChange={(e) => set('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input value={form.author || 'Vendramini'} onChange={(e) => set('author', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea rows={2} value={form.excerpt || ''} onChange={(e) => set('excerpt', e.target.value)}
              placeholder="Short summary shown on the blog list page"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea rows={14} value={form.content || ''} onChange={(e) => set('content', e.target.value)}
              placeholder="Write the full post content. Use blank lines between paragraphs."
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="education, parenting, tips"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <ImagePicker value={form.image || ''} onChange={(v) => set('image', v)} />

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="px-5 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50">
              {saving ? 'Saving...' : (id ? 'Update Post' : 'Create Post')}
            </button>
            <button type="button" onClick={() => navigate('/admin/blog')}
              className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BlogForm;
