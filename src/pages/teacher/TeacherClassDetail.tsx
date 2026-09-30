import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MessageSquareIcon, PlusIcon } from 'lucide-react';
import { Avatar, Badge, Button, Card, CardHeader, PageHeader, Progress, StatusBadge } from '../../components/ui/primitives';
import { BarChartBlock, ChartFrame, DataTable, Tabs } from '../../components/ui/data';
import { Alert } from '../../components/ui/feedback';
import { ASSIGNMENTS, CLASS_ATTENDANCE_TREND, CLASS_SUBJECT_AVERAGES, GROUPS } from '../../data/academics';
import { CLASSES, STUDENTS } from '../../data/people';
import { useApp } from '../../contexts/AppContext';
import { useApiLive, useDetail, useList } from '../../api/hooks';
import type { ApiClass, ApiStudent } from '../../api/types';

const CLASS_TEACHER_TABS = ['Overview', 'Students', 'Attendance', 'Performance', 'Assignments', 'Groups', 'Parent communication'];
const SUBJECT_TEACHER_TABS = ['Overview', 'Students', 'Performance', 'Assignments', 'Groups'];

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

export function TeacherClassDetail() {
  const { id = 'c1' } = useParams();
  const { role } = useApp();
  const live = useApiLive();
  const klassRes = useDetail<ApiClass>('/schools/classes/', id);
  const roster = useList<ApiStudent>(`/schools/classes/${id}/students/`);
  const isClassTeacher = role === 'classteacher';
  const tabs = isClassTeacher ? CLASS_TEACHER_TABS : SUBJECT_TEACHER_TABS;
  const [tab, setTab] = useState(tabs[0]);
  const klass = CLASSES.find((c) => c.id === id) ?? CLASSES[0];
  const mockLearners = STUDENTS.filter((s) => s.className === 'Grade 4');

  const error = klassRes.error ?? roster.error;

  const liveKlass = useMemo(() => {
    if (!klassRes.data) return null;
    return {
      name: klassRes.data.display_name || klassRes.data.name,
      learners: '—',
      room: klassRes.data.section || '—',
      average: 0,
      attendance: 0
    };
  }, [klassRes.data]);

  const liveLearners = useMemo(() => {
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

  const head = liveKlass ?? klass;
  const learners = liveLearners ?? mockLearners;

  return (
    <div>
      <nav className="mb-3 text-[13px] text-ink-muted" aria-label="Breadcrumb">
        <Link to="/teacher/classes" className="hover:text-ink">
          {isClassTeacher ? 'My class' : 'My classes'}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{head.name}</span>
      </nav>

      <PageHeader
        title={head.name}
        subtitle={`${head.learners} learners · ${head.room} · average ${head.average}% · attendance ${head.attendance}%`}
        actions={
        <>
            <Link to="/teacher/assignments/new">
              <Button size="sm" icon={<PlusIcon size={15} />}>
                New assignment
              </Button>
            </Link>
            {isClassTeacher &&
          <Link to="/teacher/messages">
                <Button size="sm" variant="secondary" icon={<MessageSquareIcon size={15} />}>
                  Message parents
                </Button>
              </Link>
          }
          </>
        } />
      

      {live && error &&
      <p className="text-sm text-rose-600">{error}</p>
      }

      <div className="mb-6">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
      </div>

      {tab === 'Overview' &&
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <ChartFrame title="Subject averages" subtitle={isClassTeacher ? 'All subjects' : 'English only'}>
              <BarChartBlock
              data={isClassTeacher ? CLASS_SUBJECT_AVERAGES : CLASS_SUBJECT_AVERAGES.slice(0, 1)}
              xKey="subject"
              bars={[{ key: 'classAvg', name: 'Class average', color: '#1F5E43' }]} />
            
            </ChartFrame>
            {isClassTeacher &&
          <ChartFrame title="Attendance trend" subtitle="Monthly attendance rate">
                <BarChartBlock data={CLASS_ATTENDANCE_TREND} xKey="month" bars={[{ key: 'rate', name: 'Attendance %', color: '#D4A23A' }]} />
              </ChartFrame>
          }
          </div>
          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="text-[15px] font-semibold text-ink">Learners needing attention</h3>
              <ul className="mt-3 space-y-3">
                {[
              ['Wanjiru Kamau', 'Mathematics 55% — fractions support plan'],
              ['Samuel Kiptoo', '2 missed assignments, 3 absences'],
              ['Aisha Hassan', 'No submissions this week']].
              map(([n, r]) =>
              <li key={n} className="flex items-start gap-3">
                    <Avatar initials={n.split(' ').map((x) => x[0]).join('')} size="sm" tone="gold" />
                    <div>
                      <p className="text-[13.5px] font-medium text-ink">{n}</p>
                      <p className="text-[12.5px] text-ink-muted">{r}</p>
                    </div>
                  </li>
              )}
              </ul>
            </Card>
            {isClassTeacher &&
          <Card className="p-5">
                <h3 className="text-[15px] font-semibold text-ink">Fee status (class teacher view)</h3>
                <p className="mt-1.5 text-[13px] text-ink-muted">Summary only — amounts and payment details stay with the finance office.</p>
                <ul className="mt-3 space-y-2 text-[13.5px]">
                  <li className="flex justify-between">
                    <span className="text-ink-muted">Cleared</span>
                    <span className="font-medium text-ink">18 learners</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-ink-muted">Part paid</span>
                    <span className="font-medium text-ink">6 learners</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-ink-muted">Overdue</span>
                    <span className="font-medium text-red-600">2 learners</span>
                  </li>
                </ul>
              </Card>
          }
          </div>
        </div>
      }

      {tab === 'Students' &&
      <Card>
          <CardHeader title={`${learners.length} learners`} subtitle={isClassTeacher ? 'Full class list' : 'Learners you teach English to'} />
          <DataTable
          columns={[
          {
            key: 'name',
            header: 'Learner',
            render: (r: any) =>
            <span className="flex items-center gap-2.5">
                    <Avatar initials={r.avatarInitials} size="sm" />
                    <span className="font-medium">{r.name}</span>
                  </span>

          },
          { key: 'admissionNo', header: 'Admission no.', hideOnMobile: true },
          { key: 'age', header: 'Age', hideOnMobile: true },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
          {
            key: 'actions',
            header: '',
            align: 'right',
            render: () =>
            <Button variant="ghost" size="sm">
                    View
                  </Button>

          }]
          }
          rows={learners}
          mobileTitle={(r: any) => r.name}
          caption="Class list" />
        
        </Card>
      }

      {tab === 'Attendance' &&
      <div className="space-y-6">
          <Alert tone="pending" title="Today’s register is not yet submitted">Registers close at 9:30am. 24 present, 1 absent, 1 late so far.</Alert>
          <Card>
            <CardHeader title="Attendance by learner" subtitle="September 2026" />
            <DataTable
            columns={[
            { key: 'name', header: 'Learner', render: (r: any) => <span className="font-medium">{r.name}</span> },
            { key: 'present', header: 'Present', align: 'right', render: () => '51' },
            { key: 'absent', header: 'Absent', align: 'right', render: (r: any) => r.id === 's10' ? '3' : '2' },
            { key: 'late', header: 'Late', align: 'right', render: () => '3' },
            { key: 'rate', header: 'Rate', align: 'right', render: (r: any) => <Badge tone={r.id === 's10' ? 'warning' : 'success'}>{r.id === 's10' ? '91%' : '96%'}</Badge> }]
            }
            rows={learners}
            caption="Attendance by learner" />
          
          </Card>
        </div>
      }

      {tab === 'Performance' &&
      <div className="space-y-6">
          <ChartFrame title="Class performance by subject" subtitle="Term 3 averages">
            <BarChartBlock
            data={isClassTeacher ? CLASS_SUBJECT_AVERAGES : CLASS_SUBJECT_AVERAGES.slice(0, 1)}
            xKey="subject"
            bars={[
            { key: 'classAvg', name: 'Class', color: '#1F5E43' },
            { key: 'average', name: 'Top quartile', color: '#D4A23A' }]
            } />
          
          </ChartFrame>
          <Card>
            <CardHeader title="Learner performance" />
            <ul className="divide-y divide-line">
              {learners.map((s, i) => {
              const score = [55, 78, 91, 67, 72, 84, 60, 88][i % 8];
              return (
                <li key={s.id} className="px-5 py-3 flex items-center gap-4">
                    <Avatar initials={s.avatarInitials} size="sm" />
                    <span className="flex-1 min-w-0 text-[13.5px] text-ink truncate">{s.name}</span>
                    <div className="w-32 hidden sm:block">
                      <Progress value={score} tone={score < 60 ? 'gold' : 'forest'} label={s.name} />
                    </div>
                    <span className="w-12 text-right text-[13.5px] font-medium text-ink tabular-nums">{score}%</span>
                  </li>);

            })}
            </ul>
          </Card>
        </div>
      }

      {tab === 'Assignments' &&
      <Card>
          <CardHeader
          title="Class assignments"
          action={
          <Link to="/teacher/assignments/new">
                <Button size="sm" icon={<PlusIcon size={15} />}>
                  Create
                </Button>
              </Link>
          } />
        
          <DataTable
          columns={[
          { key: 'title', header: 'Assignment', render: (r: any) => <span className="font-medium">{r.title}</span> },
          { key: 'subject', header: 'Subject', hideOnMobile: true },
          { key: 'due', header: 'Due' },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
          {
            key: 'a',
            header: '',
            align: 'right',
            render: (r: any) =>
            <Link to={`/teacher/assignment/${r.id}/grade`}>
                    <Button variant="ghost" size="sm">
                      Grade
                    </Button>
                  </Link>

          }]
          }
          rows={isClassTeacher ? ASSIGNMENTS : ASSIGNMENTS.filter((a) => a.subject === 'English')}
          caption="Class assignments" />
        
        </Card>
      }

      {tab === 'Groups' &&
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {GROUPS.map((g) =>
        <Card key={g.id} className="p-5">
              <h3 className="text-[15px] font-semibold text-ink">{g.name}</h3>
              <p className="text-[12.5px] text-ink-muted mt-0.5">
                {g.subject} · {g.members} learners · led by {g.leader}
              </p>
              <p className="mt-3 text-[13.5px] text-ink-muted">{g.task}</p>
              <Progress className="mt-3" value={g.progress} label={g.name} />
              <Link to="/teacher/groups">
                <Button variant="secondary" size="sm" full className="mt-4">
                  Manage group
                </Button>
              </Link>
            </Card>
        )}
        </div>
      }

      {tab === 'Parent communication' &&
      <Card>
          <CardHeader title="Recent parent contact" subtitle="Class teacher access only" />
          <ul className="divide-y divide-line">
            {[
          ['Grace Wanjiku Kamau', 'Wanjiru Kamau', 'Discussed fractions support plan', 'Today, 8:05am'],
          ['Millicent Ochieng', 'Brian Ochieng', 'Science fair materials confirmed', 'Yesterday'],
          ['Ruth Kiptoo', 'Samuel Kiptoo', 'Absence follow-up — awaiting reply', '17 Sep']].
          map(([p, c, note, when]) =>
          <li key={p} className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[14px] font-medium text-ink">{p}</p>
                  <p className="text-[12.5px] text-ink-muted">
                    Parent of {c} · {note}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12.5px] text-ink-soft">{when}</span>
                  <Link to="/teacher/messages">
                    <Button variant="secondary" size="sm">
                      Open
                    </Button>
                  </Link>
                </div>
              </li>
          )}
          </ul>
        </Card>
      }
    </div>);

}