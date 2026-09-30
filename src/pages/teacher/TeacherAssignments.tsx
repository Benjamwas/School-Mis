import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardListIcon, PlusIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Progress, Stat, StatusBadge, cx } from '../../components/ui/primitives';
import { ConfirmDialog, EmptyState } from '../../components/ui/feedback';
import { ASSIGNMENTS, SUBMISSIONS } from '../../data/academics';
import { useApp } from '../../contexts/AppContext';
import { useApiLive, useList } from '../../api/hooks';

const FILTERS = ['All', 'Published', 'Needs grading', 'Draft'];

function titleCase(value: string): string {
  if (!value) return '—';
  return value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function dayMonthYear(value?: string): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function TeacherAssignments() {
  const { role, toast } = useApp();
  const live = useApiLive();
  const assignmentsRes = useList<Record<string, unknown>>('/subjects/assignments/');
  const [filter, setFilter] = useState('All');
  const [remove, setRemove] = useState<string | null>(null);
  const list = role === 'subjectteacher' ? ASSIGNMENTS.filter((a) => a.subject === 'English') : ASSIGNMENTS;

  const liveList = useMemo(() => {
    if (!assignmentsRes.data) return null;
    return assignmentsRes.data.map((a) => {
      const status = titleCase(String(a.status ?? ''));
      return {
        id: String(a.id ?? ''),
        title: String(a.title ?? '—'),
        subject: String(a.subject ?? '—'),
        topic: '—',
        className: String(a.class_name ?? '—'),
        teacher: '—',
        due: dayMonthYear(typeof a.due_date === 'string' ? a.due_date : undefined),
        marks: Number(a.max_marks ?? 0) || 0,
        status
      };
    });
  }, [assignmentsRes.data]);

  const source = liveList ?? list;
  const rows = filter === 'Needs grading'
    ? source.filter((a) => a.status === 'Submitted' || a.status === 'In Progress')
    : filter === 'Draft' ? [] : source;
  const submitted = SUBMISSIONS.filter((s) => s.status === 'Submitted').length;
  const graded = SUBMISSIONS.filter((s) => s.status === 'Graded').length;

  return (
    <div>
      <PageHeader
        title="Assignments"
        subtitle={role === 'subjectteacher' ? 'English assignments across your three classes.' : 'Everything you have set for Grade 4 Acacia this term.'}
        actions={
        <Link to="/teacher/assignments/new">
            <Button size="sm" icon={<PlusIcon size={15} />}>
              Create assignment
            </Button>
          </Link>
        } />
      

      {live && assignmentsRes.error &&
      <p className="text-sm text-rose-600">{assignmentsRes.error}</p>
      }

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Published" value={source.length} sub="This term" />
        <Stat label="Awaiting grading" value={submitted} sub="Across 2 assignments" tone="gold" />
        <Stat label="Graded" value={graded} sub="Returned to learners" tone="primary" />
        <Stat label="Not submitted" value={SUBMISSIONS.filter((s) => s.status === 'Not Submitted').length} sub="Follow up with parents" tone="danger" />
      </div>

      <div className="mt-6 mb-5 flex flex-wrap gap-1.5">
        {FILTERS.map((f) =>
        <button
          key={f}
          onClick={() => setFilter(f)}
          aria-pressed={filter === f}
          className={cx(
            'rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors duration-150',
            filter === f ? 'border-forest-700 bg-forest-700 text-white' : 'border-line bg-white text-ink-muted hover:border-forest-300 hover:text-ink'
          )}>
          
            {f}
          </button>
        )}
      </div>

      <Card>
        <CardHeader title={`${rows.length} assignment${rows.length === 1 ? '' : 's'}`} subtitle="Term 3 · 2026" />
        {rows.length === 0 ?
        <EmptyState
          icon={<ClipboardListIcon size={22} />}
          title="No drafts saved"
          body="Assignments you start but do not publish will be kept here until you are ready."
          action={
          <Link to="/teacher/assignments/new">
                <Button size="sm">Create an assignment</Button>
              </Link>
          } /> :


        <ul className="divide-y divide-line">
            {rows.map((a) => {
            const done = Math.round(graded / SUBMISSIONS.length * 100);
            return (
              <li key={a.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium text-ink">{a.title}</p>
                      <p className="text-[12.5px] text-ink-muted mt-0.5">
                        {a.subject} · {a.topic} · {a.className} · due {a.due} · {a.marks} marks
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={a.status} />
                      <Link to={`/teacher/assignment/${a.id}/grade`}>
                        <Button size="sm">Grade</Button>
                      </Link>
                      <Button size="sm" variant="ghost" onClick={() => setRemove(a.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <Progress value={done} label={`${a.title} grading progress`} />
                    <span className="text-[12.5px] text-ink-muted whitespace-nowrap">
                      {graded}/{SUBMISSIONS.length} graded
                    </span>
                    <Badge tone="neutral">{SUBMISSIONS.filter((s) => s.status === 'Not Submitted').length} missing</Badge>
                  </div>
                </li>);

          })}
          </ul>
        }
      </Card>

      <ConfirmDialog
        open={!!remove}
        onClose={() => setRemove(null)}
        onConfirm={() => {
          setRemove(null);
          toast({ tone: 'success', title: 'Assignment deleted', body: 'Learners will no longer see it in their portal.' });
        }}
        title="Delete this assignment?"
        body="Submissions already made will be removed and learners will no longer see this assignment. This cannot be undone."
        confirmLabel="Delete assignment"
        danger />
      
    </div>);

}