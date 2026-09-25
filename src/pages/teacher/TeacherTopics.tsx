import React, { useState } from 'react';
import { BookOpenIcon, FileTextIcon, PlusIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, Field, Input, PageHeader, Progress, Select, Textarea } from '../../components/ui/primitives';
import { Modal } from '../../components/ui/feedback';
import { LESSON, SUBJECT_TOPICS } from '../../data/academics';
import { useApp } from '../../contexts/AppContext';

export function TeacherTopics() {
  const { role, toast } = useApp();
  const [open, setOpen] = useState(false);
  const subjects = role === 'subjectteacher' ? SUBJECT_TOPICS.filter((s) => s.subject === 'English') : SUBJECT_TOPICS;

  return (
    <div>
      <PageHeader
        title="Learning topics"
        subtitle={role === 'subjectteacher' ? 'English topics and resources for your classes.' : 'Topics, lessons and resources you publish to learners.'}
        actions={
        <Button size="sm" icon={<PlusIcon size={15} />} onClick={() => setOpen(true)}>
            Add topic
          </Button>
        } />
      

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          {subjects.map((s) =>
          <Card key={s.subject}>
              <CardHeader
              title={s.subject}
              subtitle={`${s.topics.length} topics · learners are ${s.progress}% through on average`}
              action={
              <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
                    Add topic
                  </Button>
              } />
            
              <ul className="divide-y divide-line">
                {s.topics.map((t) =>
              <li key={t.name} className="px-5 py-3.5 flex flex-wrap items-center gap-4">
                    <span className="h-9 w-9 rounded-lg bg-forest-50 text-forest-700 grid place-items-center shrink-0">
                      <BookOpenIcon size={17} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-medium text-ink">{t.name}</p>
                      <p className="text-[12.5px] text-ink-muted">{t.lessons} lessons · lesson, practice and quiz</p>
                      <Progress className="mt-2 max-w-xs" value={t.progress} tone={t.progress < 50 ? 'gold' : 'forest'} label={t.name} />
                    </div>
                    <Badge tone={t.status === 'Completed' ? 'success' : t.status === 'Locked' ? 'neutral' : 'pending'}>{t.status === 'Locked' ? 'Not published' : t.status}</Badge>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </li>
              )}
              </ul>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Shared resources" subtitle="Visible to learners in your classes" />
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
                    Remove
                  </Button>
                </li>
              )}
            </ul>
            <div className="px-5 py-3 border-t border-line">
              <Button variant="secondary" size="sm" full>
                Upload resource
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">Topic mastery alert</h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">
              11 of 26 learners are below 50% on <span className="font-medium text-ink">Fractions</span>. Consider a reteach before moving to Measurement.
            </p>
            <Button size="sm" className="mt-3" onClick={() => toast({ tone: 'success', title: 'Support group created', body: '11 learners added to Fraction Focus Group.' })}>
              Create support group
            </Button>
          </Card>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add a learning topic"
        footer={
        <>
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
            size="sm"
            onClick={() => {
              setOpen(false);
              toast({ tone: 'success', title: 'Topic published', body: 'Learners can now see it in their subject page.' });
            }}>
            
              Publish topic
            </Button>
          </>
        }>
        
        <div className="space-y-5">
          <Field label="Topic name" required>
            <Input placeholder="e.g. Measurement — length and mass" />
          </Field>
          <Field label="Subject" required>
            <Select defaultValue="Mathematics">
              {SUBJECT_TOPICS.map((s) =>
              <option key={s.subject}>{s.subject}</option>
              )}
            </Select>
          </Field>
          <Field label="Learning objectives" required>
            <Textarea placeholder="One objective per line" />
          </Field>
          <Field label="Number of lessons">
            <Input defaultValue="5" inputMode="numeric" />
          </Field>
        </div>
      </Modal>
    </div>);

}