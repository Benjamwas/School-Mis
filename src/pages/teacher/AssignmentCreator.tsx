import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, PaperclipIcon, SendIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, Field, Input, PageHeader, Select, Textarea } from '../../components/ui/primitives';
import { Alert, ConfirmDialog } from '../../components/ui/feedback';
import { useApp } from '../../contexts/AppContext';

export function AssignmentCreator() {
  const navigate = useNavigate();
  const { toast } = useApp();
  const [preview, setPreview] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [form, setForm] = useState({
    title: 'Fractions — comparing and ordering',
    subject: 'Mathematics',
    topic: 'Fractions',
    className: 'Grade 4 Acacia',
    instructions:
    'Use the fraction wall from Monday’s lesson to answer all eight questions. For each pair, write which fraction is larger and explain how you know in one sentence. Show your working.',
    due: '2026-09-24',
    marks: '20',
    type: 'Typed answer or photo upload'
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const publish = () => {
    setConfirm(false);
    toast({ tone: 'success', title: 'Assignment published', body: '26 learners and their parents have been notified.' });
    navigate('/teacher/assignments');
  };

  return (
    <div>
      <nav className="mb-3 text-[13px] text-ink-muted" aria-label="Breadcrumb">
        <Link to="/teacher/assignments" className="hover:text-ink">
          Assignments
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">New assignment</span>
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
      

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          {preview ?
          <Card>
              <CardHeader title="Learner preview" subtitle="This is what Grade 4 Acacia will see" />
              <div className="p-5">
                <Badge tone="pending">Not Started</Badge>
                <h2 className="mt-2 font-serif text-[24px] text-ink">{form.title}</h2>
                <p className="text-[13px] text-ink-muted mt-1">
                  {form.subject} · {form.topic} · due {form.due} · {form.marks} marks
                </p>
                <p className="mt-4 text-[14.5px] leading-relaxed text-ink-muted whitespace-pre-line">{form.instructions}</p>
                <div className="mt-5 rounded-lg border border-dashed border-line p-5 text-center text-[13px] text-ink-muted">Submission area — {form.type}</div>
              </div>
            </Card> :

          <Card>
              <CardHeader title="Assignment details" />
              <div className="p-5 grid sm:grid-cols-2 gap-5">
                <Field label="Assignment title" required className="sm:col-span-2">
                  <Input value={form.title} onChange={(e) => set('title', e.target.value)} />
                </Field>
                <Field label="Subject" required>
                  <Select value={form.subject} onChange={(e) => set('subject', e.target.value)}>
                    {['Mathematics', 'English', 'Kiswahili', 'Science & Technology', 'Social Studies', 'Creative Arts'].map((s) =>
                  <option key={s}>{s}</option>
                  )}
                  </Select>
                </Field>
                <Field label="Topic" required>
                  <Select value={form.topic} onChange={(e) => set('topic', e.target.value)}>
                    {['Fractions', 'Multiplication', 'Energy', 'Reading comprehension', 'Creative writing'].map((s) =>
                  <option key={s}>{s}</option>
                  )}
                  </Select>
                </Field>
                <Field label="Class" required>
                  <Select value={form.className} onChange={(e) => set('className', e.target.value)}>
                    {['Grade 4 Acacia', 'Grade 5 Acacia', 'Grade 6 Cedar'].map((s) =>
                  <option key={s}>{s}</option>
                  )}
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
          }

          <Card>
            <CardHeader title="Attachments" subtitle="Worksheets, readings or images learners will need" />
            <div className="p-5 space-y-3">
              {['Fraction wall printable.pdf', 'Lesson slides — Comparing fractions.pdf'].map((f) =>
              <div key={f} className="flex items-center gap-3 rounded-lg border border-line p-3">
                  <PaperclipIcon size={16} className="text-ink-soft" />
                  <span className="flex-1 text-[13.5px] text-ink truncate">{f}</span>
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
              )}
              <Button variant="secondary" size="sm" icon={<PaperclipIcon size={15} />}>
                Add attachment
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Alert tone="info" title="Who will receive this">26 learners in Grade 4 Acacia, plus their parents in the Parent Portal.</Alert>
          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">Publishing options</h3>
            <div className="mt-3 space-y-4">
              <Field label="Publish">
                <Select defaultValue="Immediately">
                  <option>Immediately</option>
                  <option>Schedule for tomorrow 7:00am</option>
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
            <Button full className="mt-5" onClick={() => setConfirm(true)}>
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
        body="26 learners in Grade 4 Acacia and their parents will be notified immediately."
        confirmLabel="Publish" />
      
    </div>);

}