import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PhoneIcon, PlusIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Stat, StatusBadge, cx } from '../../components/ui/primitives';
import { DataTable, Pagination, TableToolbar, useTableState } from '../../components/ui/data';
import { LEADS, PIPELINE_COUNTS } from '../../data/crm';

export function AdminCRM() {
  const navigate = useNavigate();
  const table = useTableState(LEADS, (r, q) => r.parent.toLowerCase().includes(q) || r.child.toLowerCase().includes(q) || r.id.toLowerCase().includes(q), 6);

  return (
    <div>
      <PageHeader
        title="Admissions CRM"
        subtitle="Enquiries, prospective families and follow-ups for the January 2027 intake."
        actions={
        <Button size="sm" icon={<PlusIcon size={15} />}>
            Add enquiry
          </Button>
        } />
      

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="New enquiries" value="38" sub="This month" tone="primary" />
        <Stat label="Contacted" value="29" sub="Average response 3.2 hours" />
        <Stat label="Visits booked" value="16" sub="6 this week" tone="gold" />
        <Stat label="Enrolled" value="9" sub="24% conversion from enquiry" />
      </div>

      {/* Pipeline */}
      <Card className="mt-6 overflow-hidden">
        <CardHeader title="Pipeline" subtitle="New → Contacted → Interested → Visit Booked → Application → Admitted → Enrolled" />
        <div className="overflow-x-auto sala-scroll">
          <ul className="flex gap-3 p-5 min-w-max">
            {PIPELINE_COUNTS.map((s, i) =>
            <li key={s.stage} className="w-44">
                <div className={cx('rounded-card border p-4', i >= 5 ? 'border-forest-200 bg-forest-50' : 'border-line bg-white')}>
                  <p className="text-[12.5px] font-medium text-ink-muted">{s.stage}</p>
                  <p className="mt-1 text-[24px] font-semibold text-ink tabular-nums">{s.count}</p>
                  <p className="mt-1 text-[12px] text-ink-soft">{i === 0 ? 'awaiting first call' : i === 3 ? 'tours scheduled' : 'in progress'}</p>
                </div>
              </li>
            )}
          </ul>
        </div>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Leads" subtitle={`${table.total} prospective families`} />
        <TableToolbar query={table.query} onQuery={table.setQuery} placeholder="Search parent, learner or reference…" />
        <DataTable
          columns={[
          { key: 'id', header: 'Ref' },
          {
            key: 'parent',
            header: 'Parent',
            render: (r: any) =>
            <span>
                  <span className="block font-medium">{r.parent}</span>
                  <span className="block text-[12px] text-ink-muted">{r.child} · {r.applyingClass}</span>
                </span>

          },
          { key: 'source', header: 'Source', hideOnMobile: true, render: (r: any) => <Badge tone="neutral">{r.source}</Badge> },
          { key: 'owner', header: 'Owner', hideOnMobile: true },
          { key: 'nextAction', header: 'Next action', hideOnMobile: true },
          { key: 'stage', header: 'Stage', render: (r: any) => <StatusBadge status={r.stage} /> },
          {
            key: 'a',
            header: '',
            align: 'right',
            render: (r: any) =>
            <Link to={`/admin/crm/${r.id}`}>
                  <Button variant="ghost" size="sm">
                    Open
                  </Button>
                </Link>

          }]
          }
          rows={table.slice}
          onRowClick={(r: any) => navigate(`/admin/crm/${r.id}`)}
          mobileTitle={(r: any) => `${r.parent} · ${r.child}`}
          caption="CRM leads" />
        
        <Pagination page={table.page} pages={table.pages} onPage={table.setPage} total={table.total} />
      </Card>

      <Card className="mt-6">
        <CardHeader title="Follow-ups due today" />
        <ul className="divide-y divide-line">
          {LEADS.slice(0, 3).map((l) =>
          <li key={l.id} className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[14px] font-medium text-ink">{l.parent}</p>
                <p className="text-[12.5px] text-ink-muted">{l.nextAction}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] text-ink-soft">{l.owner}</span>
                <Button size="sm" variant="secondary" icon={<PhoneIcon size={14} />}>
                  Log call
                </Button>
              </div>
            </li>
          )}
        </ul>
      </Card>
    </div>);

}