import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { Badge, Button, Card, PageHeader, Progress } from '../../components/ui/primitives';
import { Alert } from '../../components/ui/feedback';
import { CLASSES } from '../../data/people';
import { useApp } from '../../contexts/AppContext';
import { useApiLive, useList } from '../../api/hooks';
import type { ApiClass, ApiTeachingAssignment } from '../../api/types';

export function TeacherClasses() {
  const { role } = useApp();
  const live = useApiLive();
  const classesRes = useList<ApiClass>('/schools/classes/');
  const assignments = useList<ApiTeachingAssignment>('/subjects/teaching-assignments/');
  const isClassTeacher = role === 'classteacher';
  const classes = isClassTeacher ? CLASSES.slice(0, 1) : CLASSES.slice(0, 3);

  const error = classesRes.error ?? assignments.error;

  const liveClasses = useMemo(() => {
    if (!classesRes.data) return null;
    const mine = assignments.data ? new Set(assignments.data.map((a) => a.school_class)) : null;
    const scoped = mine ? classesRes.data.filter((c) => mine.has(c.id)) : classesRes.data;
    const teacherByClass = new Map((assignments.data ?? []).map((a) => [a.school_class, a.teacher_name]));
    return scoped.map((c) => ({
      id: c.id,
      name: c.display_name || c.name,
      teacher: teacherByClass.get(c.id) ?? '—',
      learners: '—',
      room: c.section || '—',
      average: 0,
      attendance: 0
    }));
  }, [classesRes.data, assignments.data]);

  const rows = liveClasses ?? classes;

  return (
    <div>
      <PageHeader
        title={isClassTeacher ? 'My class' : 'My classes'}
        subtitle={isClassTeacher ? 'You are the class teacher for Grade 4 Acacia — full academic and pastoral access.' : 'You teach English to three classes. Access is limited to English data for these learners.'} />
      

      {live && error &&
      <p className="text-sm text-rose-600">{error}</p>
      }

      {!isClassTeacher &&
      <div className="mb-6">
          <Alert tone="info" title="Restricted to your subject">Other subjects’ results, fee information and HR records are not visible in this view.</Alert>
        </div>
      }

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((c) =>
        <Card key={c.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-[20px] text-ink">{c.name}</h2>
                <p className="text-[13px] text-ink-muted mt-0.5">
                  {c.room} · {c.learners} learners
                </p>
              </div>
              <Badge tone={isClassTeacher ? 'success' : 'info'}>{isClassTeacher ? 'Class teacher' : 'English'}</Badge>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-[12px] text-ink-muted">Class average</dt>
                <dd className="text-[19px] font-semibold text-ink tabular-nums">{c.average}%</dd>
              </div>
              <div>
                <dt className="text-[12px] text-ink-muted">Attendance</dt>
                <dd className="text-[19px] font-semibold text-ink tabular-nums">{c.attendance}%</dd>
              </div>
            </dl>

            <Progress className="mt-3" value={c.average} label={`${c.name} average`} />

            <div className="mt-5 flex gap-2">
              <Link to={`/teacher/class/${c.id}`} className="flex-1">
                <Button size="sm" full icon={<ArrowRightIcon size={15} />}>
                  Open class
                </Button>
              </Link>
              <Link to="/teacher/attendance">
                <Button size="sm" variant="secondary">
                  Register
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>);

}