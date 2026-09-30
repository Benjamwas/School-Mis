import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2Icon, CircleIcon, FileTextIcon, PlayIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Progress, cx } from '../../components/ui/primitives';
import { LESSON } from '../../data/academics';
import { useApp } from '../../contexts/AppContext';
import { api } from '../../api/client';
import { useApiLive, useList } from '../../api/hooks';

export function StudentLesson() {
  const [done, setDone] = useState<string[]>(LESSON.steps.filter((s) => s.done).map((s) => s.title));
  const { toast } = useApp();
  const live = useApiLive();
  const progressRes = useList<Record<string, unknown>>('/lms/progress/');
  const topicProgress = progressRes.data?.find((item) => String(item.topic_name ?? '').toLowerCase() === LESSON.topic.toLowerCase());
  const progress = Math.round(done.length / LESSON.steps.length * 100);

  const complete = async (title: string) => {
    if (done.includes(title)) return;
    const nextDone = [...done, title];
    if (live && topicProgress?.id) {
      try {
        await api.post(`/lms/progress/${topicProgress.id}/update_progress/`, { progress_percentage: Math.round(nextDone.length / LESSON.steps.length * 100) });
      } catch (error) {
        toast({ tone: 'warning', title: 'Progress was not saved', body: error instanceof Error ? error.message : 'Please try again.' });
        return;
      }
    }
    setDone(nextDone);
    toast({ tone: 'success', title: 'Step complete', body: `${title} marked as done.` });
  };

  return (
    <div>
      <nav className="mb-3 text-[13px] text-ink-muted" aria-label="Breadcrumb">
        <Link to="/student/learning" className="hover:text-ink">
          My learning
        </Link>
        <span className="mx-1.5">/</span>
        <Link to="/student/subject/mathematics" className="hover:text-ink">
          {LESSON.subject}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{LESSON.topic}</span>
      </nav>

      <PageHeader title={LESSON.title} subtitle={`${LESSON.subject} · ${LESSON.topic} · about ${LESSON.duration}`} />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-forest-900 grid place-items-center">
              <button className="h-16 w-16 rounded-full bg-white/95 grid place-items-center text-forest-800 hover:bg-white transition-colors duration-150" aria-label="Play lesson video">
                <PlayIcon size={26} className="ml-1" />
              </button>
              <span className="absolute bottom-3 left-3 rounded bg-black/50 px-2 py-1 text-[12px] text-white">6:12 · Mr. Brian Kimani</span>
            </div>
            <div className="p-5">
              <h2 className="text-[15px] font-semibold text-ink">What you will learn</h2>
              <ul className="mt-3 space-y-2">
                {LESSON.objectives.map((o) =>
                <li key={o} className="flex gap-2.5 text-[14px] text-ink-muted">
                    <CheckCircle2Icon size={16} className="mt-0.5 shrink-0 text-forest-600" />
                    {o}
                  </li>
                )}
              </ul>
            </div>
          </Card>

          <Card>
            <CardHeader title="Lesson steps" subtitle={`${done.length} of ${LESSON.steps.length} complete`} />
            <ul className="divide-y divide-line">
              {LESSON.steps.map((s) => {
                const isDone = done.includes(s.title);
                return (
                  <li key={s.title} className="px-5 py-4 flex items-start gap-4">
                    <button onClick={() => complete(s.title)} aria-label={`Mark ${s.title} complete`} className="mt-0.5 shrink-0">
                      {isDone ? <CheckCircle2Icon size={20} className="text-forest-600" /> : <CircleIcon size={20} className="text-line" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={cx('text-[14.5px] font-medium', isDone ? 'text-ink-muted line-through' : 'text-ink')}>{s.title}</p>
                      <p className="text-[13px] text-ink-muted mt-0.5">{s.body}</p>
                    </div>
                    <Badge tone="neutral">{s.type}</Badge>
                    {s.type === 'Quiz' ?
                    <Link to="/student/quiz">
                        <Button size="sm">Start</Button>
                      </Link> :

                    <Button size="sm" variant="secondary" onClick={() => complete(s.title)}>
                        {isDone ? 'Review' : 'Start'}
                      </Button>
                    }
                  </li>);

              })}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">Topic progress</h3>
            <Progress className="mt-3" value={progress} tone={progress === 100 ? 'forest' : 'gold'} label="Lesson progress" />
            <p className="mt-2 text-[13px] text-ink-muted">{progress}% of this lesson complete</p>
            <Link to="/student/quiz">
              <Button full className="mt-4">
                Go to topic quiz
              </Button>
            </Link>
          </Card>

          <Card>
            <CardHeader title="Resources" />
            <ul className="divide-y divide-line">
              {LESSON.resources.map((r) =>
              <li key={r.name} className="px-5 py-3 flex items-center gap-3">
                  <FileTextIcon size={17} className="text-ink-soft shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium text-ink truncate">{r.name}</p>
                    <p className="text-[12px] text-ink-muted">{r.size}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>);

}
