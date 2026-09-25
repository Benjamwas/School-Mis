import React, { useState } from 'react';
import { PlusIcon, UsersRoundIcon } from 'lucide-react';
import { Avatar, Badge, Button, Card, CardHeader, Checkbox, Field, Input, PageHeader, Progress, Select, Textarea } from '../../components/ui/primitives';
import { Modal } from '../../components/ui/feedback';
import { GROUPS } from '../../data/academics';
import { STUDENTS } from '../../data/people';
import { useApp } from '../../contexts/AppContext';

export function TeacherGroups() {
  const [open, setOpen] = useState(false);
  const { toast } = useApp();
  const learners = STUDENTS.filter((s) => s.className === 'Grade 4');

  return (
    <div>
      <PageHeader
        title="Student groups"
        subtitle="Small groups for targeted support, projects and peer learning."
        actions={
        <Button size="sm" icon={<PlusIcon size={15} />} onClick={() => setOpen(true)}>
            Create group
          </Button>
        } />
      

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {GROUPS.map((g) =>
        <Card key={g.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-semibold text-ink">{g.name}</h2>
                <p className="text-[12.5px] text-ink-muted mt-0.5">{g.subject}</p>
              </div>
              <Badge tone="neutral">{g.members} members</Badge>
            </div>

            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-muted">
              <span className="font-medium text-ink">Task: </span>
              {g.task}
            </p>

            <div className="mt-3">
              <div className="flex items-center justify-between text-[12.5px] text-ink-muted mb-1.5">
                <span>Group progress</span>
                <span className="tabular-nums">{g.progress}%</span>
              </div>
              <Progress value={g.progress} tone={g.progress < 50 ? 'gold' : 'forest'} label={g.name} />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex -space-x-2">
                {learners.slice(0, 4).map((s) =>
              <span key={s.id} className="ring-2 ring-white rounded-full">
                    <Avatar initials={s.avatarInitials} size="sm" />
                  </span>
              )}
              </div>
              <span className="text-[12.5px] text-ink-muted">Leader: {g.leader}</span>
            </div>

            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="secondary" className="flex-1">
                Manage members
              </Button>
              <Button size="sm" variant="ghost">
                Assign task
              </Button>
            </div>
          </Card>
        )}

        <button
          onClick={() => setOpen(true)}
          className="rounded-card border border-dashed border-line bg-white/60 p-5 text-center hover:border-forest-300 transition-colors duration-150 min-h-[220px] grid place-items-center">
          
          <span>
            <UsersRoundIcon size={24} className="mx-auto text-ink-soft" />
            <span className="mt-2 block text-[14px] font-medium text-ink">Create a new group</span>
            <span className="mt-1 block text-[12.5px] text-ink-muted">Group learners by need, project or reading level</span>
          </span>
        </button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create a student group"
        size="lg"
        footer={
        <>
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
            size="sm"
            onClick={() => {
              setOpen(false);
              toast({ tone: 'success', title: 'Group created', body: 'Multiplication Club · 5 learners added.' });
            }}>
            
              Create group
            </Button>
          </>
        }>
        
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Group name" required className="sm:col-span-2">
            <Input placeholder="e.g. Multiplication Club" />
          </Field>
          <Field label="Subject" required>
            <Select defaultValue="Mathematics">
              {['Mathematics', 'English', 'Kiswahili', 'Science & Technology'].map((s) =>
              <option key={s}>{s}</option>
              )}
            </Select>
          </Field>
          <Field label="Group leader">
            <Select defaultValue="Joy Mutiso">
              {learners.map((s) =>
              <option key={s.id}>{s.name}</option>
              )}
            </Select>
          </Field>
          <Field label="Description / task" className="sm:col-span-2">
            <Textarea placeholder="Daily 10-minute tables drill, reviewed every Friday." />
          </Field>
        </div>
        <div className="mt-5">
          <p className="text-[13px] font-medium text-ink mb-2">Add learners</p>
          <ul className="grid sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto sala-scroll rounded-lg border border-line p-3">
            {learners.map((s, i) =>
            <li key={s.id}>
                <Checkbox label={`${s.name} · ${s.className}`} defaultChecked={i < 5} />
              </li>
            )}
          </ul>
        </div>
      </Modal>
    </div>);

}