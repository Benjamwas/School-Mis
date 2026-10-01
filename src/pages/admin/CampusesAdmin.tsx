import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../../api';
import type { Campus } from '../../types';
import ImagePicker from '../../components/admin/ImagePicker';

const empty: Partial<Campus> = {
  name: '', slug: '', tagline: '', description: '', long_description: '', image: '',
  features: '[]', address: '', hours: '', age_range: '', contact_phone: '', contact_email: '',
  latitude: null, longitude: null, sort_order: 0
};

const CampusesAdmin = () => {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [editing, setEditing] = useState<Partial<Campus> | null>(null);
  const [featuresText, setFeaturesText] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/campuses').then((res) => setCampuses(res.data));
  useEffect(() => { load(); }, []);

  const openEdit = (c?: Campus) => {
    if (c) {
      setEditing(c);
      try {
        const f = JSON.parse(c.features || '[]');
        setFeaturesText(Array.isArray(f) ? f.join('\n') : '');
      } catch { setFeaturesText(c.features || ''); }
    } else {
      setEditing(empty);
      setFeaturesText('');
    }
  };

  const set = (key: keyof Campus, value: unknown) => setEditing((prev) => prev ? { ...prev, [key]: value } : prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const payload = {
        ...editing,
        features: featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
        latitude: editing.latitude === null || editing.latitude === undefined || editing.latitude === ('' as unknown)
          ? null
          : Number(editing.latitude),
        longitude: editing.longitude === null || editing.longitude === undefined || editing.longitude === ('' as unknown)
          ? null
          : Number(editing.longitude),
        sort_order: Number(editing.sort_order) || 0
      };
      if (editing.id) {
        await api.put(`/campuses/${editing.id}`, payload);
      } else {
        await api.post('/campuses', payload);
      }
      setEditing(null);
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to save campus');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this campus?')) return;
    await api.delete(`/campuses/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Campuses</h1>
        <button onClick={() => openEdit()}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">
          <Plus className="h-4 w-4 mr-1" /> New Campus
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-800">{editing.id ? 'Edit Campus' : 'New Campus'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input required value={editing.name || ''} onChange={(e) => set('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input value={editing.slug || ''} onChange={(e) => set('slug', e.target.value)} placeholder="auto from name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input value={editing.tagline || ''} onChange={(e) => set('tagline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
              <input value={editing.age_range || ''} onChange={(e) => set('age_range', e.target.value)} placeholder="Ages 3-5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
              <input value={editing.hours || ''} onChange={(e) => set('hours', e.target.value)} placeholder="7:30 AM - 4:30 PM"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input type="number" value={editing.sort_order ?? 0} onChange={(e) => set('sort_order', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input value={editing.contact_phone || ''} onChange={(e) => set('contact_phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={editing.contact_email || ''} onChange={(e) => set('contact_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input type="number" step="any" value={editing.latitude ?? ''} onChange={(e) => set('latitude', e.target.value)}
                placeholder="-1.1735" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input type="number" step="any" value={editing.longitude ?? ''} onChange={(e) => set('longitude', e.target.value)}
                placeholder="36.9532" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input value={editing.address || ''} onChange={(e) => set('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <textarea rows={2} value={editing.description || ''} onChange={(e) => set('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
            <textarea rows={4} value={editing.long_description || ''} onChange={(e) => set('long_description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
            <textarea rows={4} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          </div>
          <ImagePicker value={editing.image || ''} onChange={(v) => set('image', v)} />
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Campus'}
            </button>
            <button type="button" onClick={() => setEditing(null)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campuses.map((c) => (
          <div key={c.id} className="bg-white rounded-lg shadow-sm p-5 flex gap-4">
            {c.image && <img src={c.image} alt={c.name} className="w-24 h-24 object-cover rounded" />}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800">{c.name}</div>
              <div className="text-sm text-red-600">{c.tagline}</div>
              <div className="text-xs text-gray-500 mt-1">{c.age_range} · {c.address}</div>
              <div className="text-xs text-gray-400">{c.latitude != null ? `${c.latitude}, ${c.longitude}` : 'No coordinates'}</div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => openEdit(c)} className="text-light-blue-600 text-sm hover:text-light-blue-700">Edit</button>
                <button onClick={() => handleDelete(c.id)} className="text-red-600 text-sm hover:text-red-700">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampusesAdmin;
