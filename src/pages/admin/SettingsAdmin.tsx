import { useEffect, useState } from 'react';
import api from '../../api';
import type { SiteSettings } from '../../types';

interface SettingField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'json-array' | 'json-chatbot';
  hint?: string;
}

const fields: SettingField[] = [
  { key: 'site_name', label: 'Site Name', type: 'text' },
  { key: 'tagline', label: 'Site Tagline', type: 'text' },
  { key: 'hero_tagline', label: 'Hero Tagline', type: 'text' },
  { key: 'footer_phone', label: 'Footer Phone', type: 'text' },
  { key: 'footer_email', label: 'Footer Email', type: 'text' },
  { key: 'footer_address', label: 'Footer Address', type: 'text' },
  { key: 'contact_phone', label: 'Contact Page Phone', type: 'text' },
  { key: 'contact_email', label: 'Contact Page Email', type: 'text' },
  { key: 'hero_images', label: 'Hero Images (one path per line)', type: 'json-array' },
  { key: 'about_mission', label: 'About — Mission', type: 'textarea' },
  { key: 'about_vision', label: 'About — Vision', type: 'textarea' },
  { key: 'about_history', label: 'About — History', type: 'textarea' },
  { key: 'core_values', label: 'Core Values (JSON array of {title, description})', type: 'textarea' },
  { key: 'chatbot', label: 'Chatbot Q&A (JSON array of {question, answer})', type: 'json-chatbot' }
];

const SettingsAdmin = () => {
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savedKey, setSavedKey] = useState('');

  useEffect(() => {
    api.get('/settings').then((res) => {
      const data: SiteSettings = res.data;
      const initial: Record<string, string> = {};
      for (const f of fields) {
        const v = data[f.key];
        if (v === undefined || v === null) initial[f.key] = '';
        else if (typeof v === 'string') initial[f.key] = v;
        else if (f.key === 'hero_images' && Array.isArray(v)) initial[f.key] = v.join('\n');
        else if (f.key === 'core_values' || f.key === 'chatbot') initial[f.key] = JSON.stringify(v, null, 2);
        else initial[f.key] = JSON.stringify(v);
      }
      setForm(initial);
    });
  }, []);

  const handleSaveField = async (field: SettingField) => {
    const raw = form[field.key] ?? '';
    setSaving(true);
    try {
      let value: unknown = raw;
      if (field.type === 'json-array' || field.type === 'json-chatbot') {
        try {
          const parsed = JSON.parse(raw || '[]');
          value = field.type === 'json-array' ? parsed : parsed;
        } catch {
          if (field.type === 'json-array') {
            value = raw.split('\n').map((s) => s.trim()).filter(Boolean);
          } else {
            alert('Invalid JSON for ' + field.label);
            setSaving(false);
            return;
          }
        }
      }
      await api.put(`/settings/${field.key}`, { value });
      setSavedKey(field.key);
      setTimeout(() => setSavedKey(''), 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to save setting');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Site Settings</h1>
      <p className="text-sm text-gray-500 mb-6">Manage footer contact info, hero content, about page blocks, and chatbot answers. Save each section individually.</p>

      <div className="space-y-4 max-w-3xl">
        {fields.map((field) => (
          <div key={field.key} className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <span className="text-xs text-gray-400">{field.key}</span>
            </div>
            {field.type === 'textarea' || field.type === 'json-chatbot' ? (
              <textarea
                rows={field.type === 'json-chatbot' ? 10 : 4}
                value={form[field.key] ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ) : (
              <input
                type="text"
                value={form[field.key] ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            )}
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {field.type === 'json-chatbot' && 'Example: [{"question": "...", "answer": "..."}]'}
              </span>
              <button
                onClick={() => handleSaveField(field)}
                disabled={saving}
                className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                {savedKey === field.key ? 'Saved!' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsAdmin;
