import { useEffect, useState } from 'react';
import { Mail, Phone, Trash2, Filter } from 'lucide-react';
import api from '../../api';
import type { FormSubmission } from '../../types';

const LeadsAdmin = () => {
  const [leads, setLeads] = useState<FormSubmission[]>([]);
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [selected, setSelected] = useState<FormSubmission | null>(null);

  const load = () => {
    const params: Record<string, string> = {};
    if (status) params.status = status;
    if (type) params.type = type;
    api.get('/forms', { params }).then((res) => setLeads(res.data));
  };

  useEffect(() => { load(); }, [status, type]);

  const updateStatus = async (id: number, newStatus: string) => {
    await api.put(`/forms/${id}/status`, { status: newStatus });
    load();
    if (selected?.id === id) {
      setSelected((s) => (s ? { ...s, status: newStatus as FormSubmission['status'] } : s));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this lead?')) return;
    await api.delete(`/forms/${id}`);
    if (selected?.id === id) setSelected(null);
    load();
  };

  const statusColor = (s: string) => {
    if (s === 'new') return 'bg-red-50 text-red-600';
    if (s === 'read') return 'bg-light-blue-50 text-light-blue-600';
    return 'bg-gray-100 text-gray-500';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Leads & Form Submissions</h1>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <Filter className="h-4 w-4 text-gray-400" />
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="archived">Archived</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option value="">All types</option>
          <option value="inquiry">General Inquiry</option>
          <option value="tour">Tour Request</option>
          <option value="enrollment">Enrollment</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
          {leads.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No submissions yet.</div>
          ) : (
            leads.map((lead) => (
              <button key={lead.id} onClick={() => setSelected(lead)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${selected?.id === lead.id ? 'bg-red-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{lead.name}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${statusColor(lead.status)}`}>{lead.status}</span>
                </div>
                <div className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                  <span className="capitalize text-red-600">{lead.type}</span>
                  <span>·</span>
                  <span>{new Date(lead.created_at).toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-600 truncate mt-1">{lead.message}</div>
              </button>
            ))
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 max-h-[70vh] overflow-y-auto">
          {selected ? (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{selected.name}</h2>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-red-50 text-red-600 capitalize">{selected.type}</span>
                </div>
                <button onClick={() => handleDelete(selected.id)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-sm mb-6">
                {selected.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <a href={`mailto:${selected.email}`} className="hover:text-red-600">{selected.email}</a>
                  </div>
                )}
                {selected.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{selected.phone}</span>
                  </div>
                )}
                {selected.campus && <div className="text-gray-600"><strong>Campus:</strong> {selected.campus}</div>}
                {selected.age && <div className="text-gray-600"><strong>Child age:</strong> {selected.age}</div>}
                {selected.subject && <div className="text-gray-600"><strong>Subject:</strong> {selected.subject}</div>}
                <div className="text-gray-600"><strong>Received:</strong> {new Date(selected.created_at).toLocaleString()}</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm font-medium text-gray-700 mb-2">Message</div>
                <p className="text-gray-700 whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(['new', 'read', 'archived'] as const).map((s) => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    className={`px-3 py-1.5 text-sm rounded-md border ${selected.status === s ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                    Mark {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              Select a lead to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadsAdmin;
