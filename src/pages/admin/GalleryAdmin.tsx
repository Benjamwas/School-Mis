import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import api, { resolveMedia } from '../../api';
import type { GalleryCategory, GalleryImage } from '../../types';
import ImagePicker from '../../components/admin/ImagePicker';

const GalleryAdmin = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [editing, setEditing] = useState<Partial<GalleryImage> | null>(null);
  const [newCat, setNewCat] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get('/gallery/images').then((res) => setImages(res.data));
    api.get('/gallery/categories').then((res) => setCategories(res.data));
  };

  useEffect(() => { load(); }, []);

  const filtered = catFilter
    ? images.filter((i) => i.category_name === catFilter)
    : images;

  const handleAddImage = () => {
    setEditing({ src: '', alt: '', category_id: null, sort_order: 0 });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await api.put(`/gallery/images/${editing.id}`, editing);
      } else {
        await api.post('/gallery/images', editing);
      }
      setEditing(null);
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to save image');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this image from the gallery?')) return;
    await api.delete(`/gallery/images/${id}`);
    load();
  };

  const handleAddCategory = async () => {
    const name = newCat.trim();
    if (!name) return;
    try {
      await api.post('/gallery/categories', { name });
      setNewCat('');
      load();
    } catch {
      alert('Category may already exist');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gallery</h1>
        <button onClick={handleAddImage}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">
          <Plus className="h-4 w-4 mr-1" /> Add Image
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center gap-3">
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <div className="flex gap-2 ml-auto">
          <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="New category"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
          <button onClick={handleAddCategory}
            className="px-3 py-2 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700">Add</button>
        </div>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-800">{editing.id ? 'Edit Image' : 'Add Image'}</h2>
          <ImagePicker value={editing.src || ''} onChange={(v) => setEditing((p) => p ? { ...p, src: v } : p)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alt text</label>
              <input value={editing.alt || ''} onChange={(e) => setEditing((p) => p ? { ...p, alt: e.target.value } : p)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={editing.category_id || ''} onChange={(e) => setEditing((p) => p ? { ...p, category_id: e.target.value ? Number(e.target.value) : null } : p)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="">None</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving || !editing.src}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={() => setEditing(null)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-full bg-white rounded-lg p-8 text-center text-gray-500 text-sm">
            No images in the gallery yet.
          </div>
        )}
        {filtered.map((img) => (
          <div key={img.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
            <div className="h-40 bg-gray-100">
              <img src={resolveMedia(img.src)} alt={img.alt} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <div className="text-sm text-gray-800 truncate">{img.alt || 'Untitled'}</div>
              <div className="text-xs text-gray-500 mb-2">{img.category_name || 'Uncategorized'}</div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditing(img)} className="text-light-blue-600 hover:text-light-blue-700">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(img.id)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryAdmin;
