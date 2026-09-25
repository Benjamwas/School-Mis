import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, StatusBadge } from '../../components/ui/primitives';
import { DataTable, Tabs } from '../../components/ui/data';
import { EVENTS, GALLERY, IMAGES, NEWS } from '../../data/school';

const TABS = ['Events', 'Gallery', 'News'];

export function AdminContent() {
  const { tab = 'Events' } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="School content"
        subtitle="Events, photo albums and news published to the public website and parent portal."
        actions={
        <Button size="sm" icon={<PlusIcon size={15} />}>
            New {tab.toLowerCase().replace(/s$/, '')}
          </Button>
        } />
      

      <div className="mb-6">
        <Tabs tabs={TABS} active={tab} onChange={(t) => navigate(`/admin/content/${t}`)} />
      </div>

      {tab === 'Events' &&
      <Card>
          <CardHeader title="School events" subtitle="Term 3 · 2026" />
          <DataTable
          columns={[
          { key: 'title', header: 'Event', render: (r: any) => <span className="font-medium">{r.title}</span> },
          { key: 'type', header: 'Type', render: (r: any) => <Badge tone="neutral">{r.type}</Badge> },
          { key: 'date', header: 'Date' },
          { key: 'time', header: 'Time', hideOnMobile: true },
          { key: 'location', header: 'Location', hideOnMobile: true },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
          {
            key: 'a',
            header: '',
            align: 'right',
            render: () =>
            <Button variant="ghost" size="sm">
                    Edit
                  </Button>

          }]
          }
          rows={EVENTS}
          mobileTitle={(r: any) => r.title}
          caption="School events" />
        
        </Card>
      }

      {tab === 'Gallery' &&
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((g) =>
        <Card key={g.id} className="overflow-hidden">
              <img src={(IMAGES as any)[g.image]} alt={g.title} className="h-40 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[15px] font-semibold text-ink">{g.title}</h3>
                    <p className="text-[12.5px] text-ink-muted">
                      {g.category} · {g.count} photos
                    </p>
                  </div>
                  <StatusBadge status={g.status} />
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="secondary" className="flex-1">
                    Manage
                  </Button>
                  <Button size="sm" variant="ghost">
                    {g.status === 'Published' ? 'Unpublish' : 'Publish'}
                  </Button>
                </div>
              </div>
            </Card>
        )}
        </div>
      }

      {tab === 'News' &&
      <Card>
          <CardHeader title="News, notices and announcements" subtitle="Published to the website and parent portal" />
          <DataTable
          columns={[
          { key: 'title', header: 'Title', render: (r: any) => <span className="font-medium">{r.title}</span> },
          { key: 'category', header: 'Category', render: (r: any) => <Badge tone="neutral">{r.category}</Badge> },
          { key: 'author', header: 'Author', hideOnMobile: true },
          { key: 'date', header: 'Publish date' },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
          {
            key: 'a',
            header: '',
            align: 'right',
            render: () =>
            <Button variant="ghost" size="sm">
                    Edit
                  </Button>

          }]
          }
          rows={NEWS}
          mobileTitle={(r: any) => r.title}
          caption="News articles" />
        
        </Card>
      }
    </div>);

}