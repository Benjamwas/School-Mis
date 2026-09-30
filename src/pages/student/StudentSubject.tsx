import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2Icon, FileTextIcon, LockIcon, PlayCircleIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Progress } from '../../components/ui/primitives';
import { LESSON, SUBJECT_TOPICS } from '../../data/academics';
import { useApiLive, useList } from '../../api/hooks';

export function StudentSubject() {
  const { slug = 'mathematics' } = useParams();
  const live = useApiLive();
  const topicsRes = useList<Record<string, unknown>>('/lms/topics/');
  const progressRes = useList<Record<string, unknown>>('/lms/progress/');
  const liveSubject = useMemo(() => {
    if (!topicsRes.data) return null;
    const rows = topicsRes.data.filter((topic) => String(topic.subject_name ?? '').toLowerCase().startsWith(slug.toLowerCase()));
    if (!rows.length) return null;
    const progress = new Map((progressRes.data ?? []).map((item) => [String(item.topic ?? ''), item]));
    const topics = rows.map((topic) => {
      const value = Number(progress.get(String(topic.id))?.progress_percentage ?? 0);
      return { name: String(topic.name ?? 'Untitled topic'), lessons: Number(topic.lesson_count ?? 0), progress: value, status: value >= 100 ? 'Completed' : value > 0 ? 'In Progress' : 'Not Started' };
    });
    return { subject: String(rows[0].subject_name), icon: 'BookOpen', progress: Math.round(topics.reduce((sum, topic) => sum + topic.progress, 0) / topics.length), topics };
  }, [progressRes.data, slug, topicsRes.data]);
  const subject = live ? liveSubject ?? SUBJECT_TOPICS[0] : SUBJECT_TOPICS.find((s) => s.subject.toLowerCase().startsWith(slug.toLowerCase())) ?? SUBJECT_TOPICS[0];
  const active = subject.topics.find((t) => t.status === 'In Progress') ?? subject.topics[0];

  return (
    <div>
      <nav className="mb-3 text-[13px] text-ink-muted" aria-label="Breadcrumb">
        <Link to="/student/learning" className="hover:text-ink">
          My learning
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{subject.subject}</span>
      </nav>

      <PageHeader title={subject.subject} subtitle={`${subject.topics.length} topics · ${subject.progress}% of the subject complete`} />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[12.5px] font-medium text-gold-600">Current topic</p>
                <h2 className="font-serif text-[22px] text-ink mt-0.5">{active.name}</h2>
                <p className="text-[13px] text-ink-muted mt-0.5">{active.lessons} lessons · {active.progress}% complete</p>
              </div>
              <Link to="/student/lesson">
                <Button icon={<PlayCircleIcon size={17} />}>Continue topic</Button>
              </Link>
            </div>
            <Progress className="mt-4" value={active.progress} tone="gold" label={active.name} />
          </Card>

          <Card>
            <CardHeader title="All topics" subtitle="Complete each topic to unlock the next one" />
            <ul className="divide-y divide-line">
              {subject.topics.map((t) =>
              <li key={t.name} className="px-5 py-4 flex items-center gap-4">
                  <span className="shrink-0">
                    {t.status === 'Completed' ?
                  <CheckCircle2Icon size={20} className="text-forest-600" /> :
                  t.status === 'Locked' ?
                  <LockIcon size={18} className="text-ink-soft" /> :

                  <span className="block h-5 w-5 rounded-full border-2 border-gold-400" />
                  }
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={'text-[14.5px] font-medium ' + (t.status === 'Locked' ? 'text-ink-soft' : 'text-ink')}>{t.name}</p>
                    <p className="text-[12.5px] text-ink-muted">{t.lessons} lessons · lesson, practice and a topic quiz</p>
                    {t.status !== 'Locked' && <Progress className="mt-2 max-w-xs" value={t.progress} label={t.name} />}
                  </div>
                  <Badge tone={t.status === 'Completed' ? 'success' : t.status === 'Locked' ? 'neutral' : 'pending'}>{t.status}</Badge>
                  {t.status !== 'Locked' &&
                <Link to="/student/lesson" className="hidden sm:block">
                      <Button variant="secondary" size="sm">
                        Open
                      </Button>
                    </Link>
                }
                </li>
              )}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Learning resources" />
            <ul className="divide-y divide-line">
              {LESSON.resources.map((r) =>
              <li key={r.name} className="px-5 py-3 flex items-center gap-3">
                  <FileTextIcon size={17} className="text-ink-soft shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium text-ink truncate">{r.name}</p>
                    <p className="text-[12px] text-ink-muted">
                      {r.type} · {r.size}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Open
                  </Button>
                </li>
              )}
            </ul>
          </Card>

          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">Practice & quizzes</h3>
            <p className="mt-1.5 text-[13.5px] text-ink-muted">Quizzes count towards your topic progress. You can retake them twice.</p>
            <Link to="/student/quiz">
              <Button full className="mt-4">
                Take the {active.name} quiz
              </Button>
            </Link>
          </Card>

          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">Your teacher</h3>
            <p className="mt-1.5 text-[13.5px] text-ink-muted">Mr. Brian Kimani · Grade 4 Acacia</p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">
              “Fractions get easier when you can see them. Use the fraction wall before you calculate.”
            </p>
          </Card>
        </div>
      </div>
    </div>);

}
