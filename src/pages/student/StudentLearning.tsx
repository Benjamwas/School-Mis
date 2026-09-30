import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CheckCircle2Icon, LockIcon } from 'lucide-react';
import { Badge, Button, Card, PageHeader, Progress } from '../../components/ui/primitives';
import { Icon } from '../../components/ui/icons';
import { SUBJECT_TOPICS } from '../../data/academics';
import { useApiLive, useList } from '../../api/hooks';

export function StudentLearning() {
  const live = useApiLive();
  const topicsRes = useList<Record<string, unknown>>('/lms/topics/');
  const progressRes = useList<Record<string, unknown>>('/lms/progress/');
  const liveSubjects = useMemo(() => {
    if (!topicsRes.data) return null;
    const progress = new Map((progressRes.data ?? []).map((p) => [String(p.topic ?? ''), p]));
    const groups = new Map<string, { subject: string; icon: string; progress: number; topics: { name: string; status: string; progress: number; lessons: number }[] }>();
    topicsRes.data.forEach((topic) => {
      const subject = String(topic.subject_name ?? 'General');
      const record = progress.get(String(topic.id));
      const percentage = Number(record?.progress_percentage ?? 0);
      const status = percentage >= 100 ? 'Completed' : percentage > 0 ? 'In Progress' : 'Not Started';
      const group = groups.get(subject) ?? { subject, icon: 'BookOpen', progress: 0, topics: [] };
      group.topics.push({ name: String(topic.name ?? 'Untitled topic'), status, progress: percentage, lessons: Number(topic.lesson_count ?? 0) });
      group.progress = Math.round(group.topics.reduce((sum, item) => sum + item.progress, 0) / group.topics.length);
      groups.set(subject, group);
    });
    return Array.from(groups.values());
  }, [progressRes.data, topicsRes.data]);
  const subjects = live ? liveSubjects ?? [] : SUBJECT_TOPICS;

  return (
    <div>
      <PageHeader title="My learning" subtitle="Four subjects with lessons in the portal. Keep going where you left off." />

      <div className="grid gap-5 md:grid-cols-2">
        {subjects.map((s) =>
        <Card key={s.subject} className="p-5">
            <div className="flex items-start gap-3.5">
              <span className="h-11 w-11 rounded-lg bg-forest-50 text-forest-700 grid place-items-center shrink-0">
                <Icon name={s.icon} size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-[20px] text-ink">{s.subject}</h2>
                <p className="text-[13px] text-ink-muted">{s.topics.length} topics · {s.topics.filter((t) => t.status === 'Completed').length} completed</p>
              </div>
              <span className="text-[15px] font-semibold text-ink tabular-nums">{s.progress}%</span>
            </div>

            <Progress className="mt-4" value={s.progress} label={s.subject} />

            <ul className="mt-4 space-y-2">
              {s.topics.map((t) =>
            <li key={t.name} className="flex items-center gap-3">
                  {t.status === 'Completed' ?
              <CheckCircle2Icon size={16} className="text-forest-600 shrink-0" /> :
              t.status === 'Locked' ?
              <LockIcon size={15} className="text-ink-soft shrink-0" /> :

              <span className="h-4 w-4 rounded-full border-2 border-gold-400 shrink-0" />
              }
                  <span className={'flex-1 text-[13.5px] ' + (t.status === 'Locked' ? 'text-ink-soft' : 'text-ink')}>{t.name}</span>
                  <Badge tone={t.status === 'Completed' ? 'success' : t.status === 'Locked' ? 'neutral' : 'pending'}>{t.progress}%</Badge>
                </li>
            )}
            </ul>

            <Link to={`/student/subject/${s.subject.toLowerCase().split(' ')[0]}`} className="block mt-5">
              <Button variant="secondary" full size="sm" icon={<ArrowRightIcon size={15} />}>
                Open {s.subject}
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>);

}
