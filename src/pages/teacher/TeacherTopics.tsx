import { useMemo, useState } from 'react';
import { BookOpenIcon, FileTextIcon, PlusIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, Field, Input, PageHeader, Progress, Select, Textarea } from '../../components/ui/primitives';
import { Modal } from '../../components/ui/feedback';
import { LESSON, SUBJECT_TOPICS } from '../../data/academics';
import { useApp } from '../../contexts/AppContext';
import { useApiLive, useList } from '../../api/hooks';
import { api } from '../../api/client';

const TOPIC_STATUS: Record<string, { status: string; progress: number }> = {
  published: { status: 'In Progress', progress: 50 },
  draft: { status: 'Locked', progress: 0 },
  archived: { status: 'Completed', progress: 100 },
  completed: { status: 'Completed', progress: 100 }
};

function titleCase(value: string): string {
  if (!value) return '—';
  return value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function TeacherTopics() {
  const { role, toast } = useApp();
  const live = useApiLive();
  const topicsRes = useList<Record<string, unknown>>('/lms/topics/');
  const subjectsRes = useList<Record<string, unknown>>('/subjects/subjects/');
  const lessonsRes = useList<Record<string, unknown>>('/lms/lessons/');
  const resourcesRes = useList<Record<string, unknown>>('/lms/resources/');
  const [open, setOpen] = useState(false);
  const [topicName, setTopicName] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [topicSubject, setTopicSubject] = useState('');
  const [saving, setSaving] = useState(false);
  const subjects = role === 'subjectteacher' ? SUBJECT_TOPICS.filter((s) => s.subject === 'English') : SUBJECT_TOPICS;

  const liveSubjects = useMemo(() => {
    if (!topicsRes.data) return null;
    const grouped = new Map<string, { subject: string; icon: string; progress: number; topics: { name: string; progress: number; lessons: number; status: string }[] }>();
    for (const t of topicsRes.data) {
      const subjectName = titleCase(String(t.subject_name ?? t.subject ?? 'General'));
      if (!grouped.has(subjectName)) {
        grouped.set(subjectName, { subject: subjectName, icon: 'BookOpen', progress: 0, topics: [] });
      }
      const key = String(t.status ?? '').toLowerCase();
      const mapped = TOPIC_STATUS[key] ?? { status: titleCase(key), progress: 0 };
      grouped.get(subjectName)!.topics.push({
        name: String(t.name ?? '—'),
        progress: mapped.progress,
        lessons: Number(t.lesson_count ?? 0) || 0,
        status: mapped.status
      });
    }
    return Array.from(grouped.values());
  }, [topicsRes.data]);

  const groups = liveSubjects ?? subjects;
  const resources = live
    ? (resourcesRes.data ?? []).map((resource) => ({
      id: String(resource.id ?? ''),
      name: String(resource.title ?? 'Resource'),
      type: String(resource.resource_type ?? 'FILE'),
      size: 'Stored resource'
    }))
    : LESSON.resources.map((resource) => ({ name: resource.name, type: resource.type, size: resource.size, id: '' }));
  const subjectOptions = live
    ? (subjectsRes.data ?? []).map((subject) => ({ id: String(subject.id ?? ''), name: String(subject.name ?? 'Subject') }))
    : SUBJECT_TOPICS.map((subject) => ({ id: subject.subject, name: subject.subject }));

  const publishTopic = async () => {
    if (!live) {
      setOpen(false);
      toast({ tone: 'success', title: 'Topic published', body: 'Learners can now see it in their subject page.' });
      return;
    }
    const subjectId = topicSubject || String(subjectsRes.data?.[0]?.id ?? '');
    if (!topicName.trim() || !subjectId) {
      toast({ tone: 'warning', title: 'Topic details required', body: 'Choose a subject and enter a topic name.' });
      return;
    }
    setSaving(true);
    try {
      const topic = await api.post<Record<string, unknown>>('/lms/topics/', {
        subject: subjectId,
        name: topicName.trim(),
        description: topicDescription.trim(),
        status: 'DRAFT'
      });
      await api.post(`/lms/topics/${topic.id}/publish/`);
      setOpen(false);
      setTopicName('');
      setTopicDescription('');
      toast({ tone: 'success', title: 'Topic published', body: 'Learners can now see it in their subject page.' });
      window.location.reload();
    } catch (error) {
      toast({ tone: 'warning', title: 'Topic could not be published', body: error instanceof Error ? error.message : 'Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const uploadResource = async (file: File | undefined) => {
    if (!file || !live) return;
    const lessonId = String(lessonsRes.data?.[0]?.id ?? '');
    if (!lessonId) {
      toast({ tone: 'warning', title: 'No lesson available', body: 'Create a lesson before uploading a resource.' });
      return;
    }
    setSaving(true);
    try {
      const upload = new FormData();
      upload.append('file', file);
      upload.append('category', 'LEARNING_RESOURCE');
      const stored = await api.post<Record<string, unknown>>('/files/uploads/', upload);
      await api.post('/lms/resources/', {
        lesson: lessonId,
        title: file.name,
        resource_type: file.type.startsWith('video/') ? 'VIDEO' : file.type === 'application/pdf' ? 'PDF' : 'DOCUMENT',
        file_url: String(stored.url ?? ''),
        description: 'Uploaded learning resource'
      });
      toast({ tone: 'success', title: 'Resource uploaded' });
      window.location.reload();
    } catch (error) {
      toast({ tone: 'warning', title: 'Resource upload failed', body: error instanceof Error ? error.message : 'Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const removeResource = async (id: string) => {
    if (!live || !id) return;
    try {
      await api.delete(`/lms/resources/${id}/`);
      window.location.reload();
    } catch (error) {
      toast({ tone: 'warning', title: 'Resource could not be removed', body: error instanceof Error ? error.message : 'Please try again.' });
    }
  };

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
      

      {live && topicsRes.error &&
      <p className="text-sm text-rose-600">{topicsRes.error}</p>
      }

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          {groups.map((s) =>
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
              {resources.map((r) =>
              <li key={r.id || r.name} className="px-5 py-3 flex items-center gap-3">
                  <FileTextIcon size={17} className="text-ink-soft shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium text-ink truncate">{r.name}</p>
                    <p className="text-[12px] text-ink-muted">
                      {r.type} · {r.size}
                    </p>
                  </div>
                   <Button variant="ghost" size="sm" onClick={() => void removeResource(r.id)} disabled={saving || !r.id}>
                     Remove
                   </Button>
                </li>
              )}
            </ul>
            <div className="px-5 py-3 border-t border-line">
              <label className="block w-full cursor-pointer rounded-lg border border-line bg-white px-3 py-2 text-center text-sm font-medium text-ink hover:border-forest-300">
                Upload resource
                <input type="file" className="sr-only" onChange={(event) => void uploadResource(event.target.files?.[0])} disabled={saving || !live} />
              </label>
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
            onClick={() => void publishTopic()}
            disabled={saving}>
            
              Publish topic
            </Button>
          </>
        }>
        
        <div className="space-y-5">
          <Field label="Topic name" required>
            <Input value={topicName} onChange={(e) => setTopicName(e.target.value)} placeholder="e.g. Measurement — length and mass" />
          </Field>
          <Field label="Subject" required>
            <Select value={topicSubject} onChange={(e) => setTopicSubject(e.target.value)}>
              {subjectOptions.map((s) =>
              <option key={s.id} value={s.id}>{s.name}</option>
              )}
            </Select>
          </Field>
          <Field label="Learning objectives" required>
            <Textarea value={topicDescription} onChange={(e) => setTopicDescription(e.target.value)} placeholder="One objective per line" />
          </Field>
          <Field label="Number of lessons">
            <Input defaultValue="5" inputMode="numeric" />
          </Field>
        </div>
      </Modal>
    </div>);

}
