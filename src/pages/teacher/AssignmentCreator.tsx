import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, PaperclipIcon, SendIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, Field, Input, PageHeader, Select, Textarea } from '../../components/ui/primitives';
import { Alert, ConfirmDialog } from '../../components/ui/feedback';
import { useApp } from '../../contexts/AppContext';
import { api } from '../../api/client';
import { useApiLive, useList } from '../../api/hooks';
import type { ApiTeachingAssignment } from '../../api/types';

export function AssignmentCreator() {
  const navigate = useNavigate();
  const { toast } = useApp();
  const live = useApiLive();
  const teachingAssignments = useList<ApiTeachingAssignment>('subjects/teaching-assignments/');
  const [preview, setPreview] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [form, setForm] = useState({
    teachingId: '',
    title: 'Fractions — comparing and ordering',
    topic: 'Fractions',
    instructions:
      'Use the fraction wall from Monday’s lesson to answer all eight questions. For each pair, write which fraction is larger and explain how you know in one sentence. Show your working.',
    due: '2026-09-24',
    marks: '20',
    type: 'Typed answer or photo upload'
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const assignments = useMemo(() => teachingAssignments.data ?? [], [teachingAssignments.data]);
  const selected = assignments.find((a) => a.id === form.teachingId);

  useEffect(() => {
    if (assignments.length && !form.teachingId) {
      setForm((f) => ({ ...f, teachingId: assignments[0].id }));
    }
  }, [assignments, form.teachingId]);

  const publish = async () => {
    setConfirm(false);
    if (live) {
      if (!form.teachingId) {
        toast({ tone: 'warning', title: 'Teaching assignment not found', body: 'No class/subject is assigned to your account. Ask an administrator to assign you.' });
        return;
      }
      try {
        const assignment = await api.post<Record<string, unknown>>('subjects/assignments/', {
          teaching_assignment: form.teachingId,
          title: form.title,
          instructions: form.instructions,
          max_marks: Number(form.marks),
          due_date: form.due ? `${form.due}T23:59:00` : null,
          submission_type: form.type === 'Online quiz' ? 'QUIZ' : form.type === 'File upload only' ? 'FILE' : form.type === 'In class — no upload' ? 'IN_CLASS' : 'BOTH'
        });
        await api.post(`subjects/assignments/${assignment.id}/publish/`);
      } catch (error) {
        toast({ tone: 'error', title: 'Assignment could not be published', body: error instanceof Error ? error.message : 'Please try again.' });
        return;
      }
    }
    toast({ tone: 'success', title: 'Assignment published', body: 'Learners and their parents have been notified.' });
    navigate('/teacher/assignments');
  };

  return (
    <div>
      <nav className="mb-3 text-[13px] text-ink-muted" aria-label="Breadcrumb">
        <Link to="/teacher/assignments" className="hover:text-ink dark:hover:text-white">
          Assignments
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink dark:text-white">New assignment</span>
      </nav>

      <PageHeader
        title="Create an assignment"
        subtitle="Learners and parents are notified as soon as you publish."
        actions={
          <>
            <Button variant="secondary" size="sm" icon={<EyeIcon size={15} />} onClick={() => setPreview((p) => !p)}>
              {preview ? 'Edit' : 'Preview'}
            </Button>
            <Button size="sm" icon={<SendIcon size={15} />} onClick={() => setConfirm(true)}>
              Publish
            </Button>
          </>
        } />

      {live && teachingAssignments.error && (
        <Alert tone="warning" title="Could not load teaching assignments">{teachingAssignments.error}</Alert>
      )}
      {live && !teachingAssignments.loading && assignments.length === 0 && (
        <Alert tone="warning" title="No teaching assignments">
          No class and subject is assigned to your account yet. Ask a school administrator to assign you a teaching allocation, then return here.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          {preview ? (
            <Card>
              <CardHeader title="Learner preview" subtitle={selected ? `This is what ${selected.class_name} will see` : undefined} />
              <div className="p-5">
                <Badge tone="pending">Not Started</Badge>
                <h2 className="mt-2 font-serif text-[24px] text-ink dark:text-white">{form.title}</h2>
                <p className="text-[13px] text-ink-muted dark:text-gray-400 mt-1">
                  {selected?.subject_name ?? '—'} · {form.topic} · due {form.due} · {form.marks} marks
                </p>
                <p className="mt-4 text-[14.5px] leading-relaxed text-ink-muted dark:text-gray-400 whitespace-pre-line">{form.instructions}</p>
                <div className="mt-5 rounded-lg border border-dashed border-line dark:border-white/20 p-5 text-center text-[13px] text-ink-muted dark:text-gray-400">
                  Submission area — {form.type}
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <CardHeader title="Assignment details" />
              <div className="p-5 grid sm:grid-cols-2 gap-5">
                <Field label="Class & subject" required className="sm:col-span-2" hint="Only your assigned classes and subjects appear here.">
                  <Select value={form.teachingId} onChange={(e) => set('teachingId', e.target.value)} disabled={assignments.length === 0}>
                    {assignments.length === 0 ? (
                      <option value="">— no assignments yet —</option>
                    ) : (
                      assignments.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.class_name} · {a.subject_name}
                        </option>
                      ))
                    )}
                  </Select>
                </Field>
                <Field label="Assignment title" required className="sm:col-span-2">
                  <Input value={form.title} onChange={(e) => set('title', e.target.value)} />
                </Field>
                <Field label="Topic" required>
                  <Select value={form.topic} onChange={(e) => set('topic', e.target.value)}>
                    {['Fractions', 'Multiplication', 'Energy', 'Reading comprehension', 'Creative writing'].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Submission type" required>
                  <Select value={form.type} onChange={(e) => set('type', e.target.value)}>
                    <option>Typed answer or photo upload</option>
                    <option>File upload only</option>
                    <option>In class — no upload</option>
                    <option>Online quiz</option>
                  </Select>
                </Field>
                <Field label="Instructions" required className="sm:col-span-2" hint="Learners see this exactly as written.">
                  <Textarea value={form.instructions} onChange={(e) => set('instructions', e.target.value)} className="min-h-[150px]" />
                </Field>
                <Field label="Due date" required>
                  <Input type="date" value={form.due} onChange={(e) => set('due', e.target.value)} />
                </Field>
                <Field label="Total marks" required>
                  <Input value={form.marks} onChange={(e) => set('marks', e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" />
                </Field>
              </div>
            </Card>
          )}

          <Card>
            <CardHeader title="Attachments" subtitle="Worksheets, readings or images learners will need" />
            <div className="p-5">
              <p className="text-[13px] text-ink-muted dark:text-gray-400">Attachments can be added after the assignment is created from the assignment detail page.</p>
              <Button variant="secondary" size="sm" icon={<PaperclipIcon size={15} />} className="mt-3" disabled>
                Add attachment
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Alert tone="info" title="Who will receive this">
            {selected
              ? `Learners in ${selected.class_name}, plus their parents in the Parent Portal.`
              : 'Select a class and subject assigned to you to continue.'}
          </Alert>
          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink dark:text-white">Publishing options</h3>
            <div className="mt-3 space-y-4">
              <Field label="Publish">
                <Select defaultValue="Immediately">
                  <option>Immediately</option>
                  <option>Save as draft</option>
                </Select>
              </Field>
              <Field label="Late submissions">
                <Select defaultValue="Allow, marked late">
                  <option>Allow, marked late</option>
                  <option>Allow up to 3 days</option>
                  <option>Do not allow</option>
                </Select>
              </Field>
            </div>
            <Button full className="mt-5" onClick={() => setConfirm(true)} disabled={live && assignments.length === 0}>
              Publish assignment
            </Button>
            <Button variant="ghost" full className="mt-2" onClick={() => navigate('/teacher/assignments')}>
              Cancel
            </Button>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={publish}
        title="Publish this assignment?"
        body={selected ? `Learners in ${selected.class_name} (${selected.subject_name}) and their parents will be notified immediately.` : 'This assignment will be published to your class.'}
        confirmLabel="Publish" />
    </div>
  );
}
