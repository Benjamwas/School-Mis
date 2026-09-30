import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, FlameIcon, PlayCircleIcon, SparklesIcon, TrophyIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Progress, StatusBadge } from '../../components/ui/primitives';
import { Icon } from '../../components/ui/icons';
import { ACHIEVEMENTS, ASSIGNMENTS, LESSON, SUBJECT_SCORES, SUBJECT_TOPICS } from '../../data/academics';
import { useApiLive, useDashboard } from '../../api/hooks';
import type { DashboardStudent } from '../../api/types';

export function StudentDashboard() {
  const live = useApiLive();
  const dashboard = useDashboard<DashboardStudent>('student');
  const due = live
    ? (dashboard.data?.assignments ?? []).map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      subject: assignment.subject,
      topic: assignment.topic ?? 'Current topic',
      teacher: 'Your teacher',
      due: assignment.due_date ?? 'No due date',
      marks: assignment.max_marks ?? 0,
      status: assignment.status === 'PUBLISHED' ? 'Not Started' : assignment.status,
      score: null,
      feedback: null
    }))
    : ASSIGNMENTS.filter((a) => ['Not Started', 'In Progress', 'Late'].includes(a.status));
  const earned = ACHIEVEMENTS.filter((a) => a.earned);
  const studentName = dashboard.data?.student?.name?.split(' ')[0] ?? 'Wanjiru';

  return (
    <div>
      <PageHeader title={`Habari, ${studentName}! 👋`} subtitle={`Grade 4 Acacia · Friday 20 September. You have ${due.length} things to finish this week.`} />

      {/* Continue learning */}
      <Card className="overflow-hidden bg-forest-800 border-forest-800 text-white">
        <div className="p-6 grid md:grid-cols-[1.4fr_0.6fr] gap-6 items-center">
          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.1em] text-gold-300">Continue learning</p>
            <h2 className="mt-2 font-serif text-[26px] leading-tight">{LESSON.title}</h2>
            <p className="mt-1.5 text-[14px] text-forest-100/90">
              {LESSON.subject} · {LESSON.topic} · {LESSON.duration} left
            </p>
            <div className="mt-4 max-w-sm">
              <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
                <div className="h-full rounded-full bg-gold-400" style={{ width: '50%' }} />
              </div>
              <p className="mt-1.5 text-[12.5px] text-forest-100/80">2 of 4 steps complete</p>
            </div>
          </div>
          <Link to="/student/lesson">
            <Button variant="gold" size="lg" full icon={<PlayCircleIcon size={18} />}>
              Resume lesson
            </Button>
          </Link>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Today’s learning"
              subtitle="Friday · 4 lessons"
              action={
              <Link to="/student/learning">
                  <Button variant="secondary" size="sm">
                    My subjects
                  </Button>
                </Link>
              } />
            
            <ul className="divide-y divide-line">
              {[
              ['8:00', 'Mathematics', 'Fractions — comparing and ordering', 'Mr. Brian Kimani'],
              ['9:20', 'English', 'Inference in short stories', 'Ms. Lydia Achieng'],
              ['11:10', 'Science & Technology', 'Sources of energy', 'Mr. Brian Kimani'],
              ['2:00', 'Creative Arts', 'Pattern and print', 'Ms. Nancy Chebet']].
              map(([time, subject, topic, teacher]) =>
              <li key={time} className="px-5 py-3.5 flex items-center gap-4">
                  <span className="w-14 shrink-0 text-[13px] font-semibold text-forest-700 tabular-nums">{time}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-ink truncate">{subject}</p>
                    <p className="text-[12.5px] text-ink-muted truncate">
                      {topic} · {teacher}
                    </p>
                  </div>
                </li>
              )}
            </ul>
          </Card>

          <Card>
            <CardHeader
              title="To do"
              subtitle="Assignments due soon"
              action={
              <Link to="/student/assignments">
                  <Button variant="secondary" size="sm">
                    All assignments
                  </Button>
                </Link>
              } />
            
            <ul className="divide-y divide-line">
              {due.map((a) =>
              <li key={a.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <Link to={`/student/assignment/${a.id}`} className="text-[14px] font-medium text-ink hover:text-forest-700 transition-colors duration-150">
                      {a.title}
                    </Link>
                    <p className="text-[12.5px] text-ink-muted mt-0.5">
                      {a.subject} · due {a.due} · {a.marks} marks
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              )}
            </ul>
          </Card>

          <Card>
            <CardHeader title="My progress by subject" />
            <ul className="divide-y divide-line">
              {SUBJECT_TOPICS.map((s) =>
              <li key={s.subject} className="px-5 py-3.5 flex items-center gap-4">
                  <span className="h-9 w-9 rounded-lg bg-forest-50 text-forest-700 grid place-items-center shrink-0">
                    <Icon name={s.icon} size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-ink">{s.subject}</p>
                    <Progress className="mt-1.5" value={s.progress} label={s.subject} />
                  </div>
                  <span className="text-[13px] font-medium text-ink tabular-nums w-10 text-right">{s.progress}%</span>
                </li>
              )}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center gap-2 text-gold-600">
              <FlameIcon size={18} />
              <p className="text-[14px] font-semibold text-ink">9-day submission streak</p>
            </div>
            <p className="mt-1.5 text-[13.5px] text-ink-muted">Hand in Thursday’s maths assignment to keep it going.</p>
          </Card>

          <Card>
            <CardHeader title="Recent results" />
            <ul className="divide-y divide-line">
              {SUBJECT_SCORES.slice(0, 4).map((s) =>
              <li key={s.subject} className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="text-[13.5px] text-ink truncate">{s.subject}</span>
                  <Badge tone={s.score < 60 ? 'warning' : 'success'}>{s.score}%</Badge>
                </li>
              )}
            </ul>
            <div className="px-5 py-3 border-t border-line">
              <Link to="/student/progress" className="text-[13px] font-medium text-forest-700 hover:underline inline-flex items-center gap-1.5">
                See all results <ArrowRightIcon size={14} />
              </Link>
            </div>
          </Card>

          <Card>
            <CardHeader title="Badges earned" subtitle={`${earned.length} of ${ACHIEVEMENTS.length}`} />
            <ul className="p-5 grid grid-cols-3 gap-3">
              {ACHIEVEMENTS.slice(0, 6).map((a) =>
              <li key={a.name} className="text-center">
                  <span
                  className={
                  'mx-auto h-12 w-12 rounded-full grid place-items-center ' + (a.earned ? 'bg-gold-100 text-gold-600' : 'bg-cream text-ink-soft')
                  }>
                  
                    <Icon name={a.icon} size={20} />
                  </span>
                  <p className="mt-1.5 text-[11.5px] leading-tight text-ink-muted">{a.name}</p>
                </li>
              )}
            </ul>
            <div className="px-5 py-3 border-t border-line">
              <Link to="/student/achievements" className="text-[13px] font-medium text-forest-700 hover:underline inline-flex items-center gap-1.5">
                <TrophyIcon size={14} /> All achievements
              </Link>
            </div>
          </Card>

          <Card className="p-5 bg-gold-50 border-gold-200">
            <p className="flex items-center gap-2 text-[14px] font-semibold text-ink">
              <SparklesIcon size={17} className="text-gold-600" /> Message from Mr. Kimani
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">
              “Great effort in the science practical this week, Wanjiru. Bring your fraction wall to Monday’s lesson.”
            </p>
          </Card>
        </div>
      </div>
    </div>);

}
