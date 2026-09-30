import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FileTextIcon, PaperclipIcon, UploadCloudIcon } from 'lucide-react';
import { Button, Card, CardHeader, PageHeader, StatusBadge, Textarea } from '../../components/ui/primitives';
import { Alert, ConfirmDialog } from '../../components/ui/feedback';
import { ASSIGNMENTS, LESSON } from '../../data/academics';
import { useApp } from '../../contexts/AppContext';
import { api } from '../../api/client';
import { useApiLive, useDetail } from '../../api/hooks';

export function StudentAssignment() {
  const { id = 'a1' } = useParams();
  const live = useApiLive();
  const assignmentRes = useDetail<Record<string, unknown>>('/subjects/assignments/', id);
  const apiAssignment = assignmentRes.data;
  const assignment = live && apiAssignment ? {
    id,
    title: String(apiAssignment.title ?? 'Assignment'),
    subject: String(apiAssignment.subject ?? '—'),
    topic: String(apiAssignment.topic_name ?? apiAssignment.topic ?? '—'),
    teacher: 'Your teacher',
    marks: Number(apiAssignment.max_marks ?? 0),
    due: apiAssignment.due_date ? new Date(String(apiAssignment.due_date)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No due date',
    className: String(apiAssignment.class_name ?? '—'),
    status: String(apiAssignment.my_submission_status ?? 'Not Started').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    feedback: String(apiAssignment.my_submission_feedback ?? ''),
    score: apiAssignment.my_submission_marks ? Number(apiAssignment.my_submission_marks) : null,
    instructions: String(apiAssignment.instructions ?? '')
  } : ASSIGNMENTS.find((a) => a.id === id) ?? ASSIGNMENTS[0];
  const [status, setStatus] = useState(assignment.status);
  const [confirm, setConfirm] = useState(false);
  const [answer, setAnswer] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useApp();

  useEffect(() => setStatus(assignment.status), [assignment.status]);

  const submit = async () => {
    setConfirm(false);
    if (live) {
      setBusy(true);
      try {
        const submission = await api.post<{ id: string }>(`/subjects/assignments/${id}/submit/`, { submission_content: answer });
        if (file) {
          const upload = new FormData();
          upload.append('file', file);
          upload.append('category', 'ASSIGNMENT_ATTACHMENT');
          upload.append('linked_type', 'AssignmentSubmission');
          upload.append('linked_id', submission.id);
          await api.post('/files/uploads/', upload);
        }
      } catch (error) {
        toast({ tone: 'warning', title: 'Could not submit assignment', body: error instanceof Error ? error.message : 'Please try again.' });
        setBusy(false);
        return;
      }
      setBusy(false);
    }
    setStatus('Submitted');
    toast({ tone: 'success', title: 'Assignment submitted', body: `${assignment.title} sent to ${assignment.teacher}.` });
  };

  return (
    <div>
      <nav className="mb-3 text-[13px] text-ink-muted" aria-label="Breadcrumb">
        <Link to="/student/assignments" className="hover:text-ink">
          Assignments
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{assignment.title}</span>
      </nav>

      <PageHeader
        title={assignment.title}
        subtitle={`${assignment.subject} · ${assignment.topic} · ${assignment.teacher} · ${assignment.marks} marks`}
        actions={<StatusBadge status={status} />} />
      

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          {status === 'Graded' && assignment.feedback &&
          <Alert tone="success" title={`Marked: ${assignment.score}/${assignment.marks}`}>{assignment.feedback}</Alert>
          }
          {status === 'Late' && <Alert tone="error" title="This assignment is overdue">Submit as soon as you can and let your teacher know why it is late.</Alert>}

          <Card>
            <CardHeader title="Instructions" />
            <div className="p-5 text-[14.5px] leading-relaxed text-ink-muted space-y-3">
              <p>
                {('instructions' in assignment && assignment.instructions) || 'Use the lesson materials to answer the questions and explain your working.'} For each pair of fractions, write which is larger and explain how you
                know in one sentence.
              </p>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>Compare 3/4 and 2/3</li>
                <li>Compare 5/6 and 7/8</li>
                <li>Order 1/2, 2/5 and 3/10 from smallest to largest</li>
                <li>Write two fractions equivalent to 3/6</li>
                <li>Explain, in your own words, what happens to a fraction when the denominator gets bigger</li>
              </ol>
              <p>Show your working. Neat, clear reasoning earns more marks than a correct answer on its own.</p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Your submission" subtitle={status === 'Graded' ? 'Submitted 15 Sep, 7:40pm' : 'Type your answers or upload a photograph of your work'} />
            <div className="p-5 space-y-4">
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answers here…"
                disabled={status === 'Graded' || status === 'Submitted'}
                className="min-h-[160px]" />
              
              <div className="rounded-lg border border-dashed border-line p-5 text-center">
                <UploadCloudIcon size={22} className="mx-auto text-ink-soft" />
                <p className="mt-2 text-[13.5px] text-ink">Drag a photo of your work here, or</p>
                 <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink hover:border-forest-300">
                   <PaperclipIcon size={15} />
                   {file ? file.name : 'Choose a file'}
                   <input type="file" className="sr-only" onChange={(event) => setFile(event.target.files?.[0] ?? null)} disabled={status === 'Submitted' || status === 'Graded'} />
                 </label>
                 {/* File metadata is uploaded after the submission is created. */}
                 <Button variant="secondary" size="sm" className="hidden" icon={<PaperclipIcon size={15} />} disabled={status === 'Submitted' || status === 'Graded'}>
                   Choose a file
                 </Button>
                <p className="mt-2 text-[12px] text-ink-muted">JPG, PNG or PDF up to 10MB</p>
              </div>
              {status !== 'Submitted' && status !== 'Graded' &&
              <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[12.5px] text-ink-muted">Saved automatically as you type.</p>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">
                      Save draft
                    </Button>
                     <Button size="sm" onClick={() => setConfirm(true)} disabled={busy}>
                      Submit assignment
                    </Button>
                  </div>
                </div>
              }
              {status === 'Submitted' && <Alert tone="pending" title="Submitted — waiting to be marked">Your teacher usually returns work within three school days.</Alert>}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">Details</h3>
            <dl className="mt-3 divide-y divide-line text-[13.5px]">
              {[
              ['Due date', assignment.due],
              ['Marks', `${assignment.marks}`],
              ['Submission type', 'Typed answer or photo upload'],
              ['Teacher', assignment.teacher],
              ['Class', assignment.className]].
              map(([k, v]) =>
              <div key={k} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-ink-muted">{k}</dt>
                  <dd className="font-medium text-ink text-right">{v}</dd>
                </div>
              )}
            </dl>
          </Card>

          <Card>
            <CardHeader title="Helpful resources" />
            <ul className="divide-y divide-line">
              {LESSON.resources.map((r) =>
              <li key={r.name} className="px-5 py-3 flex items-center gap-3">
                  <FileTextIcon size={17} className="text-ink-soft shrink-0" />
                  <span className="flex-1 min-w-0 text-[13.5px] text-ink truncate">{r.name}</span>
                  <Button variant="ghost" size="sm">
                    Open
                  </Button>
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={submit}
        title="Submit this assignment?"
        body="Once you submit, you cannot change your answers unless your teacher asks you to resubmit."
        confirmLabel="Yes, submit" />
      
    </div>);

}
