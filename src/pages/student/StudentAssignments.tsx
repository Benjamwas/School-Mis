import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardListIcon } from 'lucide-react';
import { Button, Card, CardHeader, PageHeader, StatusBadge, cx } from '../../components/ui/primitives';
import { EmptyState } from '../../components/ui/feedback';
import { ASSIGNMENTS } from '../../data/academics';
import { useApiLive, useList } from '../../api/hooks';

const FILTERS = ['All', 'To do', 'Submitted', 'Graded', 'Late'];

export function StudentAssignments() {
  const [filter, setFilter] = useState('All');
  const live = useApiLive();
  const assignmentsRes = useList<Record<string, unknown>>('/subjects/assignments/');
  const liveRows = (assignmentsRes.data ?? []).map((a) => ({
    id: String(a.id),
    title: String(a.title ?? 'Untitled assignment'),
    subject: String(a.subject ?? '—'),
    topic: String(a.topic_name ?? a.topic ?? '—'),
    teacher: String(a.teacher_name ?? 'Your teacher'),
    due: a.due_date ? new Date(String(a.due_date)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'No due date',
    marks: Number(a.max_marks ?? 0),
    status: String(a.my_submission_status ?? 'Not Started').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    feedback: String(a.my_submission_feedback ?? ''),
    score: a.my_submission_marks ? Number(a.my_submission_marks) : null
  }));
  const source = live ? liveRows : ASSIGNMENTS;
  const rows = source.filter((a) => {
    if (filter === 'All') return true;
    if (filter === 'To do') return a.status === 'Not Started' || a.status === 'In Progress';
    if (filter === 'Late') return a.status === 'Late';
    return a.status === filter;
  });

  return (
    <div>
      <PageHeader title="My assignments" subtitle="Everything set by your teachers this term, with feedback once it is marked." />

      <div className="mb-5 flex flex-wrap gap-1.5">
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
        <EmptyState icon={<ClipboardListIcon size={22} />} title="Nothing here right now" body="When your teachers set work in this category it will appear here." /> :

        <ul className="divide-y divide-line">
            {rows.map((a) =>
          <li key={a.id} className="px-5 py-4 flex flex-wrap items-center gap-4">
                <div className="min-w-0 flex-1">
                  <Link to={`/student/assignment/${a.id}`} className="text-[15px] font-medium text-ink hover:text-forest-700 transition-colors duration-150">
                    {a.title}
                  </Link>
                  <p className="text-[12.5px] text-ink-muted mt-0.5">
                    {a.subject} · {a.topic} · {a.teacher}
                  </p>
                  {a.feedback && <p className="mt-1.5 text-[13px] text-ink-muted italic">“{a.feedback}”</p>}
                </div>
                <div className="text-right">
                  <p className="text-[13px] text-ink-muted">Due {a.due}</p>
                  <p className="text-[13.5px] font-semibold text-ink tabular-nums">{a.score != null ? `${a.score}/${a.marks}` : `${a.marks} marks`}</p>
                </div>
                <StatusBadge status={a.status} />
                <Link to={`/student/assignment/${a.id}`}>
                  <Button size="sm" variant={a.status === 'Graded' ? 'secondary' : 'primary'}>
                    {a.status === 'Graded' ? 'View feedback' : 'Open'}
                  </Button>
                </Link>
              </li>
          )}
          </ul>
        }
      </Card>
    </div>);

}
