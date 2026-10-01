import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../../api';
import type { StaffMember } from '../../types';
import ImagePicker from '../../components/admin/ImagePicker';

const empty: Partial<StaffMember> = { name: '', role_title: '', bio: '', image: '', sort_order: 0, is_active: 1 };

const StaffAdmin = () => {
  const [items, setItems] = useState<StaffMember[]>([]);
  const [editing, setEditing] = useState<Partial<StaffMember> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/staff').then((res) => setItems(res.data));
  useEffect(() => { load(); }, []);

  const set = (key: keyof StaffMember, value: unknown) => setEditing((p) => p ? { ...p, [key]: value } : p);

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
      if (editing.id) await api.put(`/staff/${editing.id}`, payload);
      else await api.post('/staff', payload);
      setEditing(null);
      load();
    } catch {
      alert('Failed to save staff member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this staff member?')) return;
    await api.delete(`/staff/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Staff & Leadership</h1>
        <button onClick={() => setEditing(empty)}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">
          <Plus className="h-4 w-4 mr-1" /> New Staff Member
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-800">{editing.id ? 'Edit' : 'New'} Staff Member</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input required value={editing.name || ''} onChange={(e) => set('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role Title</label>
              <input value={editing.role_title || ''} onChange={(e) => set('role_title', e.target.value)} placeholder="Head of Primary School"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea rows={3} value={editing.bio || ''} onChange={(e) => set('bio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          </div>
          <ImagePicker value={editing.image || ''} onChange={(v) => set('image', v)} label="Photo" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((s) => (
          <div key={s.id} className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex gap-3">
              {s.image ? (
                <img src={s.image} alt={s.name} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-bold">
                  {s.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{s.name}</div>
                <div className="text-sm text-red-600">{s.role_title}</div>
                {!s.is_active && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Inactive</span>}
              </div>
            </div>
            {s.bio && <p className="text-sm text-gray-600 mt-3">{s.bio}</p>}
            <div className="flex gap-3 mt-3">
              <button onClick={() => setEditing(s)} className="text-light-blue-600 text-sm hover:text-light-blue-700">Edit</button>
              <button onClick={() => handleDelete(s.id)} className="text-red-600 text-sm hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffAdmin;
