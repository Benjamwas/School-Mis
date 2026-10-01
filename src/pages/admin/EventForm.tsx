import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import type { Campus, Event } from '../../types';
import ImagePicker from '../../components/admin/ImagePicker';

const empty: Partial<Event> = {
  title: '', date: '', time: '', location: '', description: '', image: '',
  status: 'draft', featured: 0, campus_id: null
};

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<Event>>(empty);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    api.get('/campuses').then((res) => setCampuses(res.data)).catch(() => {});
    if (id) {
      api.get(`/events/${id}`)
        .then((res) => setForm(res.data))
        .catch(() => setError('Event not found'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const set = (key: keyof Event, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        featured: form.featured ? 1 : 0,
        campus_id: form.campus_id || null
      };
      if (id) {
        await api.put(`/events/${id}`, payload);
      } else {
        await api.post('/events', payload);
      }
      navigate('/admin/events');
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { error?: string } } };
      setError(apiErr?.response?.data?.error || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{id ? 'Edit Event' : 'New Event'}</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 max-w-3xl space-y-5">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input required value={form.title || ''} onChange={(e) => set('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input required type="date" value={form.date || ''} onChange={(e) => set('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input value={form.time || ''} onChange={(e) => set('time', e.target.value)} placeholder="9:00 AM - 3:00 PM"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input value={form.location || ''} onChange={(e) => set('location', e.target.value)} placeholder="All Campuses"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
            <select value={form.campus_id || ''} onChange={(e) => set('campus_id', e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="">None / All campuses</option>
              {campuses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea rows={5} value={form.description || ''} onChange={(e) => set('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>

        <ImagePicker value={form.image || ''} onChange={(v) => set('image', v)} />

        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input type="checkbox" checked={!!form.featured} onChange={(e) => set('featured', e.target.checked ? 1 : 0)} />
          Feature on homepage
        </label>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="px-5 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50">
            {saving ? 'Saving...' : (id ? 'Update Event' : 'Create Event')}
          </button>
          <button type="button" onClick={() => navigate('/admin/events')}
            className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
