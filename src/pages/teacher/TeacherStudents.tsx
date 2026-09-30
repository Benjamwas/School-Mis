import React from 'react';
import { Avatar, Badge, Button, Card, CardHeader, PageHeader, StatusBadge } from '../../components/ui/primitives';
import { DataTable, FilterSelect, Pagination, TableToolbar, useTableState } from '../../components/ui/data';
import { Alert } from '../../components/ui/feedback';
import { STUDENTS } from '../../data/people';
import { useApp } from '../../contexts/AppContext';
import { api } from '../../api/client';
import { useApiLive, useList } from '../../api/hooks';
import type { ApiStudent, ApiTeachingAssignment } from '../../api/types';

interface LoadState<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
}

function describe(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'Request failed.';
}

function useClassRoster(classIds: string[]): LoadState<ApiStudent[]> {
  const live = useApiLive();
  const [state, setState] = React.useState<LoadState<ApiStudent[]>>({ loading: true, data: null, error: null });
  const key = classIds.join(',');

  React.useEffect(() => {
    let alive = true;
    if (!live || classIds.length === 0) {
      setState({ loading: false, data: null, error: null });
      return () => { alive = false; };
    }
    setState({ loading: true, data: null, error: null });
    Promise.all(classIds.map((cid) => api.get<ApiStudent[]>(`/schools/classes/${cid}/students/`)))
      .then((lists) => {
        if (!alive) return;
        setState({ loading: false, data: lists.flat(), error: null });
      })
      .catch((err) => {
        if (!alive) return;
        setState({ loading: false, data: null, error: describe(err) });
      });
    return () => { alive = false; };
  }, [key, live]);

  return state;
}

function titleCase(value: string): string {
  if (!value) return '—';
  return value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((x) => x[0]?.toUpperCase() ?? '')
    .join('');
}

export function TeacherStudents() {
  const { role } = useApp();
  const live = useApiLive();
  const assignments = useList<ApiTeachingAssignment>('/subjects/teaching-assignments/');
  const classIds = React.useMemo(
    () => Array.from(new Set((assignments.data ?? []).map((a) => a.school_class))),
    [assignments.data]
  );
  const roster = useClassRoster(classIds);
  const isClassTeacher = role === 'classteacher';
  const pool = isClassTeacher ? STUDENTS.filter((s) => s.className === 'Grade 4') : STUDENTS.filter((s) => ['Grade 4', 'Grade 5', 'Grade 6'].includes(s.className));
  const [klass, setKlass] = React.useState('All classes');

  const livePool = React.useMemo(() => {
    if (!roster.data) return null;
    return roster.data.map((s) => ({
      id: s.id,
      name: s.full_name,
      admissionNo: s.admission_number,
      className: s.current_class_name ?? '—',
      stream: '',
      age: 0,
      gender: s.gender ?? '—',
      avatarInitials: initialsOf(s.full_name),
      parentId: '',
      status: titleCase(s.status)
    }));
  }, [roster.data]);

  const source = livePool ?? pool;
  const rows = klass === 'All classes' ? source : source.filter((s) => s.className === klass);
  const table = useTableState(rows, (r, q) => r.name.toLowerCase().includes(q) || r.admissionNo.toLowerCase().includes(q));

  const classOptions = React.useMemo(
    () => ['All classes', ...Array.from(new Set(source.map((s) => s.className)))],
    [source]
  );

  const error = assignments.error ?? roster.error;

  return (
    <div>
      <PageHeader
        title={isClassTeacher ? 'My students' : 'Subject students'}
        subtitle={isClassTeacher ? 'Every learner in Grade 4 Acacia, with full academic and pastoral detail.' : 'Learners you teach English to, across Grade 4, 5 and 6.'} />
      

      {live && error &&
      <p className="text-sm text-rose-600">{error}</p>
      }

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
          filters={<FilterSelect label="Class" value={klass} onChange={setKlass} options={classOptions} />} />
        
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