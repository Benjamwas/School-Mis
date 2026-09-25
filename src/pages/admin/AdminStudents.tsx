import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DownloadIcon, PlusIcon } from 'lucide-react';
import { Avatar, Badge, Button, Card, CardHeader, PageHeader, Stat, StatusBadge } from '../../components/ui/primitives';
import { DataTable, FilterSelect, Pagination, TableToolbar, useTableState } from '../../components/ui/data';
import { SkeletonTable } from '../../components/ui/feedback';
import { GUARDIANS, STUDENTS } from '../../data/people';

export function AdminStudents() {
  const navigate = useNavigate();
  const [klass, setKlass] = useState('All classes');
  const [status, setStatus] = useState('All statuses');
  const [loading, setLoading] = useState(false);

  const filtered = STUDENTS.filter((s) => (klass === 'All classes' || s.className === klass) && (status === 'All statuses' || s.status === status));
  const table = useTableState(filtered, (r, q) => r.name.toLowerCase().includes(q) || r.admissionNo.toLowerCase().includes(q), 8);

  const refresh = (fn: () => void) => {
    setLoading(true);
    fn();
    window.setTimeout(() => setLoading(false), 500);
  };

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="1,148 learners across ECD, Lower Primary and Upper Primary."
        actions={
        <>
            <Button size="sm" variant="secondary" icon={<DownloadIcon size={15} />}>
              Export
            </Button>
            <Button size="sm" icon={<PlusIcon size={15} />}>
              Add student
            </Button>
          </>
        } />
      

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total learners" value="1,148" sub="+38 this term" tone="primary" />
        <Stat label="New this term" value="38" sub="All fully enrolled" />
        <Stat label="On leave" value="6" sub="Medical or travel" tone="gold" />
        <Stat label="Alumni (2026)" value="142" sub="Moved to junior school" />
      </div>

      <Card className="mt-6">
        <CardHeader title={`${table.total} records`} subtitle="Click a learner to open their full profile" />
        <TableToolbar
          query={table.query}
          onQuery={(v) => refresh(() => table.setQuery(v))}
          placeholder="Search by name or admission number…"
          filters={
          <>
              <FilterSelect label="Class" value={klass} onChange={(v) => refresh(() => setKlass(v))} options={['All classes', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6']} />
              <FilterSelect label="Status" value={status} onChange={(v) => refresh(() => setStatus(v))} options={['All statuses', 'Active', 'On Leave', 'Alumni']} />
            </>
          } />
        
        {loading ?
        <SkeletonTable rows={6} /> :

        <DataTable
          columns={[
          {
            key: 'name',
            header: 'Learner',
            render: (r: any) =>
            <span className="flex items-center gap-2.5">
                    <Avatar initials={r.avatarInitials} size="sm" />
                    <span>
                      <span className="block font-medium">{r.name}</span>
                      <span className="block text-[12px] text-ink-muted">{r.admissionNo}</span>
                    </span>
                  </span>

          },
          { key: 'className', header: 'Class', render: (r: any) => `${r.className} ${r.stream}` },
          { key: 'age', header: 'Age', align: 'right', hideOnMobile: true },
          {
            key: 'parent',
            header: 'Parent / guardian',
            hideOnMobile: true,
            render: (r: any) => GUARDIANS.find((g) => g.id === r.parentId)?.name ?? '—'
          },
          { key: 'fees', header: 'Fees', render: (r: any) => <Badge tone={r.id === 's1' ? 'warning' : 'success'}>{r.id === 's1' ? 'Part paid' : 'Cleared'}</Badge>, hideOnMobile: true },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
          {
            key: 'a',
            header: '',
            align: 'right',
            render: (r: any) =>
            <Link to={`/admin/student/${r.id}`}>
                    <Button variant="ghost" size="sm">
                      Open
                    </Button>
                  </Link>

          }]
          }
          rows={table.slice}
          onRowClick={(r: any) => navigate(`/admin/student/${r.id}`)}
          mobileTitle={(r: any) => r.name}
          caption="Student records" />

        }
        <Pagination page={table.page} pages={table.pages} onPage={table.setPage} total={table.total} />
      </Card>
    </div>);

}