import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, FileTextIcon } from 'lucide-react';
import { Avatar, Badge, Button, Card, CardHeader, Field, Input, PageHeader, Progress, StatusBadge, Textarea, cx } from '../../components/ui/primitives';
import { ConfirmDialog } from '../../components/ui/feedback';
import { ASSIGNMENTS, SUBMISSIONS } from '../../data/academics';
import { useApp } from '../../contexts/AppContext';

export function GradingInterface() {
  const { id = 'a3' } = useParams();
  const assignment = ASSIGNMENTS.find((a) => a.id === id) ?? ASSIGNMENTS[2];
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState('16');
  const [feedback, setFeedback] = useState('Clear structure and good vocabulary. Watch your ngeli agreement in the second paragraph.');
  const [confirm, setConfirm] = useState<'return' | 'resubmit' | null>(null);
  const { toast } = useApp();

  const student = SUBMISSIONS[index];
  const graded = SUBMISSIONS.filter((s) => s.status === 'Graded').length;

  const act = () => {
    if (confirm === 'return') toast({ tone: 'success', title: 'Grade returned', body: `${student.student} and their parent can now see the feedback.` });else
    toast({ tone: 'pending', title: 'Resubmission requested', body: `${student.student} has been asked to submit again by Friday.` });
    setConfirm(null);
    setIndex((i) => Math.min(SUBMISSIONS.length - 1, i + 1));
  };

  return (
    <div>
      <nav className="mb-3 text-[13px] text-ink-muted" aria-label="Breadcrumb">
        <Link to="/teacher/assignments" className="hover:text-ink">
          Assignments
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{assignment.title}</span>
      </nav>

      <PageHeader
        title="Grading"
        subtitle={`${assignment.title} · ${assignment.className} · ${assignment.marks} marks`}
        actions={
        <span className="text-[13px] text-ink-muted">
            {graded} of {SUBMISSIONS.length} graded
          </span>
        } />
      

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Card className="h-max">
          <CardHeader title="Submissions" subtitle={`${SUBMISSIONS.length} learners`} />
          <ul className="divide-y divide-line max-h-[520px] overflow-y-auto sala-scroll">
            {SUBMISSIONS.map((s, i) =>
            <li key={s.student}>
                <button
                onClick={() => setIndex(i)}
                className={cx('w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150', i === index ? 'bg-forest-50/70' : 'hover:bg-cream')}>
                
                  <Avatar initials={s.student.split(' ').map((x) => x[0]).join('')} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-medium text-ink truncate">{s.student}</span>
                    <span className="block text-[12px] text-ink-muted">{s.submitted}</span>
                  </span>
                  {s.score != null ? <Badge tone="success">{s.score}</Badge> : <StatusBadge status={s.status} />}
                </button>
              </li>
            )}
          </ul>
          <div className="px-4 py-3 border-t border-line">
            <Progress value={graded / SUBMISSIONS.length * 100} label="Grading progress" />
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader
              title={student.student}
              subtitle={student.status === 'Not Submitted' ? 'Nothing submitted yet' : `Submitted ${student.submitted}`}
              action={
              <span className="flex gap-1">
                  <button onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} aria-label="Previous learner" className="h-8 w-8 grid place-items-center rounded-md border border-line disabled:opacity-40 hover:bg-cream transition-colors duration-150">
                    <ChevronLeftIcon size={15} />
                  </button>
                  <button onClick={() => setIndex((i) => Math.min(SUBMISSIONS.length - 1, i + 1))} disabled={index === SUBMISSIONS.length - 1} aria-label="Next learner" className="h-8 w-8 grid place-items-center rounded-md border border-line disabled:opacity-40 hover:bg-cream transition-colors duration-150">
                    <ChevronRightIcon size={15} />
                  </button>
                </span>
              } />
            
            <div className="p-5">
              {student.status === 'Not Submitted' ?
              <div className="rounded-lg border border-dashed border-line p-8 text-center">
                  <p className="text-[14px] font-medium text-ink">No submission</p>
                  <p className="mt-1 text-[13px] text-ink-muted">Send a reminder to the learner and their parent.</p>
                  <Button size="sm" variant="secondary" className="mt-3">
                    Send reminder
                  </Button>
                </div> :

              <>
                  <div className="rounded-lg border border-line bg-cream/50 p-4 text-[14px] leading-relaxed text-ink-muted">
                    <p className="font-medium text-ink mb-2">Learner’s answer</p>
                    <p>
                      Siku niliyoisahau ilikuwa Jumamosi ya mvua kubwa. Nilienda sokoni na bibi yangu, tukanunua matunda na mboga. Njiani tulikutana na rafiki
                      yangu Amina ambaye alikuwa amebeba mwavuli mkubwa…
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[13px] text-ink-muted">
                    <FileTextIcon size={15} /> insha-wanjiru.pdf · 218 KB
                  </div>
                </>
              }

              <div className="mt-6 grid sm:grid-cols-[160px_1fr] gap-5">
                <Field label={`Score (out of ${assignment.marks})`} required>
                  <Input value={score} onChange={(e) => setScore(e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" />
                </Field>
                <Field label="Feedback to the learner" hint="Visible to the learner and their parent.">
                  <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                </Field>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
                <Button size="sm" onClick={() => setConfirm('return')}>
                  Save & return grade
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setConfirm('resubmit')}>
                  Request resubmission
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIndex((i) => Math.min(SUBMISSIONS.length - 1, i + 1))}>
                  Skip for now
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">Quick feedback</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Excellent structure', 'Check your spelling', 'Show your working', 'Great improvement', 'Please redo question 3', 'Well presented'].map((f) =>
              <button
                key={f}
                onClick={() => setFeedback((c) => c ? `${c} ${f}.` : `${f}.`)}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-[12.5px] text-ink-muted hover:border-forest-300 hover:text-ink transition-colors duration-150">
                
                  {f}
                </button>
              )}
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={act}
        title={confirm === 'return' ? 'Return this grade?' : 'Request a resubmission?'}
        body={
        confirm === 'return' ?
        `${student.student} and their parent will immediately see a score of ${score}/${assignment.marks} and your feedback.` :
        `${student.student} will be asked to submit this assignment again. Their current submission stays on file.`
        }
        confirmLabel={confirm === 'return' ? 'Return grade' : 'Request resubmission'} />
      
    </div>);

}