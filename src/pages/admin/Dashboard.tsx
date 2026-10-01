import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, FileText, Images, Inbox, School, ArrowRight } from 'lucide-react';
import api from '../../api';
import type { Stats } from '../../types';

const Dashboard = () => {
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [recentLeads, setRecentLeads] = React.useState<Array<{ id: number; name: string; type: string; created_at: string; message: string }>>([]);

  React.useEffect(() => {
    api.get('/stats').then((res) => setStats(res.data)).catch(() => {});
    api.get('/forms?status=new').then((res) => setRecentLeads(res.data.slice(0, 5))).catch(() => {});
  }, []);

  const cards = [
    { label: 'Published Events', value: stats?.events ?? '—', icon: CalendarDays, to: '/admin/events', color: 'bg-red-50 text-red-600' },
    { label: 'Published Posts', value: stats?.blogPosts ?? '—', icon: FileText, to: '/admin/blog', color: 'bg-light-blue-50 text-light-blue-600' },
    { label: 'Gallery Images', value: stats?.galleryImages ?? '—', icon: Images, to: '/admin/gallery', color: 'bg-green-50 text-green-600' },
    { label: 'Campuses', value: stats?.campuses ?? '—', icon: School, to: '/admin/campuses', color: 'bg-yellow-50 text-yellow-700' },
    { label: 'New Leads', value: stats?.newLeads ?? '—', icon: Inbox, to: '/admin/leads', color: 'bg-purple-50 text-purple-600' }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} to={card.to} className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{card.value}</div>
            <div className="text-sm text-gray-500 mt-1">{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Recent New Leads</h2>
          <Link to="/admin/leads" className="text-sm text-red-600 hover:text-red-700">View all</Link>
        </div>
        {recentLeads.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No new leads yet. Submissions from the contact forms will appear here.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentLeads.map((lead) => (
              <li key={lead.id} className="px-5 py-4 flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium text-gray-800">{lead.name}</div>
                  <div className="text-sm text-gray-500 truncate max-w-md">{lead.message}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-red-50 text-red-600 capitalize">{lead.type}</span>
                  <div className="text-xs text-gray-400 mt-1">{new Date(lead.created_at).toLocaleDateString()}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
