import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import api from '../../api';
import type { Testimonial } from '../../types';
import ImagePicker from '../../components/admin/ImagePicker';

const empty: Partial<Testimonial> = { quote: '', name: '', role: '', image: '', sort_order: 0, is_active: 1 };

const TestimonialsAdmin = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/testimonials').then((res) => setItems(res.data));
  useEffect(() => { load(); }, []);

  const set = (key: keyof Testimonial, value: unknown) => setEditing((p) => p ? { ...p, [key]: value } : p);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const payload = {
        ...editing,
        is_active: editing.is_active ? 1 : 0,
        sort_order: Number(editing.sort_order) || 0
      };
      if (editing.id) await api.put(`/testimonials/${editing.id}`, payload);
      else await api.post('/testimonials', payload);
      setEditing(null);
      load();
    } catch {
      alert('Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    await api.delete(`/testimonials/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Testimonials</h1>
        <button onClick={() => setEditing(empty)}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">
          <Plus className="h-4 w-4 mr-1" /> New Testimonial
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-800">{editing.id ? 'Edit' : 'New'} Testimonial</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quote *</label>
            <textarea required rows={4} value={editing.quote || ''} onChange={(e) => set('quote', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input value={editing.name || ''} onChange={(e) => set('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input value={editing.role || ''} onChange={(e) => set('role', e.target.value)} placeholder="Parent of Primary Student"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input type="number" value={editing.sort_order ?? 0} onChange={(e) => set('sort_order', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input type="checkbox" checked={!!editing.is_active} onChange={(e) => set('is_active', e.target.checked ? 1 : 0)} />
                Active (shown on site)
              </label>
            </div>
          </div>
          <ImagePicker value={editing.image || ''} onChange={(v) => set('image', v)} label="Photo (optional)" />
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={() => setEditing(null)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="bg-white rounded-lg shadow-sm p-5 flex items-start gap-4">
            <div className="flex-1">
              <p className="text-gray-700 italic">"{t.quote}"</p>
              <div className="mt-2 text-sm">
                <span className="font-medium text-gray-900">{t.name || 'Unnamed'}</span>
                <span className="text-red-600 ml-2">{t.role}</span>
                {!t.is_active && <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded">Inactive</span>}
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              <button onClick={() => setEditing(t)} className="text-light-blue-600 hover:text-light-blue-700"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsAdmin;
