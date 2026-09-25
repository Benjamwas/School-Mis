import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, ClipboardListIcon, ClockIcon, PlusIcon, SchoolIcon, UsersIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Progress, Stat, StatusBadge } from '../../components/ui/primitives';
import { BarChartBlock, ChartFrame } from '../../components/ui/data';
import { Alert } from '../../components/ui/feedback';
import { ASSIGNMENTS, CLASS_SUBJECT_AVERAGES, SUBMISSIONS } from '../../data/academics';
import { CLASSES, TEACHERS } from '../../data/people';
import { DUTY_ROSTER, MY_ATTENDANCE } from '../../data/hr';
import { ROLE_USERS } from '../../data/navigation';
import { useApp } from '../../contexts/AppContext';

export function TeacherDashboard() {
  const { role } = useApp();
  const isClassTeacher = role === 'classteacher';
  const teacher = isClassTeacher ? TEACHERS[0] : TEACHERS[1];
  const user = ROLE_USERS[role];
  const classes = isClassTeacher ? CLASSES.slice(0, 1) : CLASSES.slice(0, 3);
  const pendingGrading = SUBMISSIONS.filter((s) => s.status === 'Submitted').length;

  return (
    <div>
      <PageHeader
        title={`Good morning, ${teacher.name.split(' ')[1]}`}
        subtitle={
        isClassTeacher ?
        'Class Teacher · Grade 4 Acacia · Friday 20 September, Term 3' :
        'Subject Teacher · English across Grade 4 – 6 · Friday 20 September, Term 3'
        }
        actions={
        <>
            <Link to="/teacher/attendance">
              <Button variant="secondary" size="sm" icon={<ClockIcon size={15} />}>
                Take register
              </Button>
            </Link>
            <Link to="/teacher/assignments/new">
              <Button size="sm" icon={<PlusIcon size={15} />}>
                New assignment
              </Button>
            </Link>
          </>
        } />
      

      {!isClassTeacher &&
      <div className="mb-6">
          <Alert tone="info" title="Subject teacher view">
            You can see English data for your three assigned classes only. Fees, payroll, HR records and other subjects’ results are not part of your access.
          </Alert>
        </div>
      }

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label={isClassTeacher ? 'My class' : 'My classes'} value={isClassTeacher ? 'Grade 4 Acacia' : '3 classes'} sub={isClassTeacher ? '26 learners' : 'Grade 4, 5 and 6'} icon={<SchoolIcon size={16} />} tone="primary" />
        <Stat label="Learners taught" value={isClassTeacher ? 26 : 75} sub={isClassTeacher ? 'All subjects' : 'English only'} icon={<UsersIcon size={16} />} />
        <Stat label="Awaiting grading" value={pendingGrading} sub="Insha · submitted this week" icon={<ClipboardListIcon size={16} />} tone="gold" />
        <Stat label="Clocked in" value={MY_ATTENDANCE.clockIn} sub={`${MY_ATTENDANCE.hoursToday} today`} icon={<ClockIcon size={16} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Today’s lessons"
              subtitle="Friday · 5 periods"
              action={
              <Link to="/teacher/calendar">
                  <Button variant="secondary" size="sm">
                    Full timetable
                  </Button>
                </Link>
              } />
            
            <ul className="divide-y divide-line">
              {(isClassTeacher ?
              [
              ['8:00', 'Mathematics', 'Grade 4 Acacia', 'Fractions — comparing'],
              ['9:20', 'Science & Tech', 'Grade 4 Acacia', 'Sources of energy'],
              ['11:10', 'Mathematics', 'Grade 4 Acacia', 'Practice and correction'],
              ['12:00', 'Pastoral', 'Grade 4 Acacia', 'Class meeting'],
              ['2:00', 'Games', 'Grade 4 Acacia', 'Athletics preparation']] :

              [
              ['8:00', 'English', 'Grade 5 Acacia', 'Comprehension — inference'],
              ['9:20', 'English', 'Grade 4 Acacia', 'Inference in short stories'],
              ['11:10', 'English', 'Grade 6 Cedar', 'Persuasive writing'],
              ['12:00', 'Reading club', 'Mixed', 'Library session'],
              ['2:00', 'English', 'Grade 6 Cedar', 'Marking conference']]).

              map(([time, subject, cls, topic]) =>
              <li key={time + cls} className="px-5 py-3.5 flex items-center gap-4">
                  <span className="w-14 shrink-0 text-[13px] font-semibold text-forest-700 tabular-nums">{time}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-ink truncate">
                      {subject} · {cls}
                    </p>
                    <p className="text-[12.5px] text-ink-muted truncate">{topic}</p>
                  </div>
                  <Badge tone="neutral">40 min</Badge>
                </li>
              )}
            </ul>
          </Card>

          <ChartFrame title="Class performance" subtitle={isClassTeacher ? 'Grade 4 Acacia average by subject' : 'English average by class'}>
            <BarChartBlock
              data={isClassTeacher ? CLASS_SUBJECT_AVERAGES : [{ subject: 'Grade 4', classAvg: 74 }, { subject: 'Grade 5', classAvg: 71 }, { subject: 'Grade 6', classAvg: 78 }]}
              xKey="subject"
              bars={[{ key: 'classAvg', name: 'Class average', color: '#1F5E43' }]} />
            
          </ChartFrame>

          <Card>
            <CardHeader
              title="Assignments needing attention"
              action={
              <Link to="/teacher/assignments">
                  <Button variant="secondary" size="sm">
                    All assignments
                  </Button>
                </Link>
              } />
            
            <ul className="divide-y divide-line">
              {ASSIGNMENTS.slice(0, 4).map((a) =>
              <li key={a.id} className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-ink">{a.title}</p>
                    <p className="text-[12.5px] text-ink-muted">
                      {a.className} · due {a.due}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={a.status} />
                    <Link to={`/teacher/assignment/${a.id}/grade`}>
                      <Button size="sm" variant="secondary">
                        Grade
                      </Button>
                    </Link>
                  </div>
                </li>
              )}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title={isClassTeacher ? 'My class' : 'My classes'} />
            <ul className="divide-y divide-line">
              {classes.map((c) =>
              <li key={c.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <Link to={`/teacher/class/${c.id}`} className="text-[14px] font-medium text-ink hover:text-forest-700 transition-colors duration-150">
                      {c.name}
                    </Link>
                    <span className="text-[13px] text-ink-muted">{c.learners} learners</span>
                  </div>
                  <Progress className="mt-2" value={c.average} label={`${c.name} average`} />
                  <p className="mt-1 text-[12.5px] text-ink-muted">
                    Average {c.average}% · attendance {c.attendance}%
                  </p>
                </li>
              )}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Attendance today" subtitle="Grade 4 Acacia register" />
            <div className="p-5">
              <div className="flex gap-4 text-center">
                {[
                ['Present', 24, 'text-forest-700'],
                ['Absent', 1, 'text-red-600'],
                ['Late', 1, 'text-gold-600']].
                map(([l, v, c]) =>
                <div key={l as string} className="flex-1 rounded-lg bg-cream py-3">
                    <p className={`text-[20px] font-semibold tabular-nums ${c}`}>{v as number}</p>
                    <p className="text-[12px] text-ink-muted">{l}</p>
                  </div>
                )}
              </div>
              <Link to="/teacher/attendance">
                <Button variant="secondary" full size="sm" className="mt-4">
                  Open register
                </Button>
              </Link>
            </div>
          </Card>

          <Card>
            <CardHeader title="My duties this week" />
            <ul className="divide-y divide-line">
              {DUTY_ROSTER.filter((d) => d.teacher === teacher.name).map((d) =>
              <li key={d.day + d.time} className="px-5 py-3">
                  <p className="text-[13.5px] font-medium text-ink">{d.duty}</p>
                  <p className="text-[12.5px] text-ink-muted">
                    {d.day} · {d.time} · {d.location}
                  </p>
                </li>
              )}
            </ul>
            <div className="px-5 py-3 border-t border-line">
              <Link to="/teacher/hr/Duty roster" className="text-[13px] font-medium text-forest-700 hover:underline">
                Full duty roster
              </Link>
            </div>
          </Card>

          <Card className="p-5">
            <p className="flex items-center gap-2 text-[14px] font-semibold text-ink">
              <BookOpenIcon size={17} className="text-forest-700" /> {user.context}
            </p>
            <p className="mt-1.5 text-[13px] text-ink-muted">
              {isClassTeacher ?
              'As class teacher you can see all subjects, attendance, groups and parent communication for your class.' :
              'Your access is limited to English in Grades 4 – 6.'}
            </p>
          </Card>
        </div>
      </div>
    </div>);

}