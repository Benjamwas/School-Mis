import React from 'react';
import { Avatar, Badge, Button, Card, CardHeader, PageHeader, StatusBadge } from '../../components/ui/primitives';
import { DataTable, FilterSelect, Pagination, TableToolbar, useTableState } from '../../components/ui/data';
import { Alert } from '../../components/ui/feedback';
import { STUDENTS } from '../../data/people';
import { useApp } from '../../contexts/AppContext';

export function TeacherStudents() {
  const { role } = useApp();
  const isClassTeacher = role === 'classteacher';
  const pool = isClassTeacher ? STUDENTS.filter((s) => s.className === 'Grade 4') : STUDENTS.filter((s) => ['Grade 4', 'Grade 5', 'Grade 6'].includes(s.className));
  const [klass, setKlass] = React.useState('All classes');
  const rows = klass === 'All classes' ? pool : pool.filter((s) => s.className === klass);
  const table = useTableState(rows, (r, q) => r.name.toLowerCase().includes(q) || r.admissionNo.toLowerCase().includes(q));

  return (
    <div>
      <PageHeader
        title={isClassTeacher ? 'My students' : 'Subject students'}
        subtitle={isClassTeacher ? 'Every learner in Grade 4 Acacia, with full academic and pastoral detail.' : 'Learners you teach English to, across Grade 4, 5 and 6.'} />
      

      {!isClassTeacher &&
      <div className="mb-6">
          <Alert tone="info" title="Limited learner profile">
            You can see English performance, assignments and topic progress. Attendance, fees, medical notes and other subjects are not shown.
          </Alert>
        </div>
      }

      <Card>
        <CardHeader title={`${table.total} learners`} subtitle="Term 3 · 2026" />
        <TableToolbar
          query={table.query}
          onQuery={table.setQuery}
          placeholder="Search by name or admission number…"
          filters={<FilterSelect label="Class" value={klass} onChange={setKlass} options={['All classes', 'Grade 4', 'Grade 5', 'Grade 6']} />} />
        
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
          { key: 'score', header: isClassTeacher ? 'Average' : 'English', align: 'right', render: (r: any) => <Badge tone={r.id === 's1' ? 'warning' : 'success'}>{r.id === 's1' ? '68%' : '79%'}</Badge> },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
          {
            key: 'a',
            header: '',
            align: 'right',
            render: () =>
            <Button variant="ghost" size="sm">
                  Open
                </Button>

          }]
          }
          rows={table.slice}
          mobileTitle={(r: any) => r.name}
          caption="Students taught" />
        
        <Pagination page={table.page} pages={table.pages} onPage={table.setPage} total={table.total} />
      </Card>
    </div>);

}