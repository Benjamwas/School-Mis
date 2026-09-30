import { useState } from 'react';
import { SendIcon } from 'lucide-react';
import { Avatar, Button, Card, CardHeader, PageHeader, Textarea, cx } from '../../components/ui/primitives';
import { useApp } from '../../contexts/AppContext';
import { useApiLive, useList } from '../../api/hooks';
import { useObject } from '../../api/hooks';
import { api } from '../../api/client';
import type { ApiNotification } from '../../api/types';

interface MessageThread {
  id: string;
  with: string;
  role: string;
  initials: string;
  last: string;
  when: string;
  unread: boolean;
  messages: {from: 'them' | 'me';text: string;when: string;}[];
}

const THREADS: MessageThread[] = [
{
  id: 'th1',
  with: 'Mr. Brian Kimani',
  role: 'Class Teacher · Grade 4 Acacia',
  initials: 'BK',
  last: 'The fractions support plan starts on Monday.',
  when: '2h',
  unread: true,
  messages: [
  { from: 'them', text: 'Good afternoon Mrs. Kamau. I wanted to flag that Wanjiru is finding fractions difficult — the method is there but accuracy drops under time pressure.', when: 'Yesterday, 3:12pm' },
  { from: 'me', text: 'Thank you for letting me know early. What should we be doing at home?', when: 'Yesterday, 6:40pm' },
  { from: 'them', text: 'Ten minutes of tables practice each evening, and I have added a Fraction Walls activity in her learning portal. The fractions support plan starts on Monday.', when: 'Today, 8:05am' }]

},
{ id: 'th2', with: 'Ms. Lydia Achieng', role: 'English · Grade 4 Acacia', initials: 'LA', last: 'She read to the class beautifully today.', when: '2d', unread: false, messages: [{ from: 'them', text: 'Just a quick note — Wanjiru read to the class today and handled the inference questions confidently. A real change from last term.', when: 'Wed, 1:20pm' }] },
{ id: 'th3', with: 'School Office', role: 'Administration', initials: 'SO', last: 'Consultation Day booking opens Monday 8am.', when: '4d', unread: false, messages: [{ from: 'them', text: 'Parent–Teacher Consultation Day is on 26 September. Booking opens Monday at 8:00am in the portal. Slots are 15 minutes per subject.', when: 'Mon, 9:00am' }] }];

const EMPTY_THREAD: MessageThread = {
  id: 'empty',
  with: 'No messages',
  role: 'School notifications',
  initials: '—',
  last: '',
  when: '—',
  unread: false,
  messages: [],
};

function notificationDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(date);
}

function notificationInitials(value: string): string {
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'SN';
}

function notificationRole(value?: string): string {
  if (!value) return 'School notification';
  return value.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function ParentMessages() {
  const live = useApiLive();
  const notifications = useList<ApiNotification>('notifications/');
  const parent = useObject<{ id: string }>('/parents/me');
  const children = useList<{ student: string }>(parent.data?.id ? `/parents/${parent.data.id}/children/` : '/parents/me/children/');
  const liveThreads: MessageThread[] = (notifications.data ?? []).map((n) => ({
    id: n.id,
    with: n.title,
    role: notificationRole(n.type),
    initials: notificationInitials(n.title),
    last: n.body ?? '',
    when: notificationDate(n.created_at),
    unread: !n.is_read,
    messages: [{ from: 'them', text: n.body ?? 'No message body provided.', when: notificationDate(n.created_at) }],
  }));
  const threads = live ? liveThreads : THREADS;
  const [active, setActive] = useState(THREADS[0].id);
  const [draft, setDraft] = useState('');
  const thread = threads.find((t) => t.id === active) ?? threads[0] ?? EMPTY_THREAD;
  const { toast } = useApp();

  const send = async () => {
    if (!draft.trim()) return;
    if (live) {
      const studentId = children.data?.[0]?.student;
      if (!studentId) {
        toast({ tone: 'warning', title: 'No linked child found' });
        return;
      }
      try {
        await api.post('/notifications/send_message/', { student_id: studentId, body: draft.trim() });
      } catch (error) {
        toast({ tone: 'warning', title: 'Message could not be sent', body: error instanceof Error ? error.message : 'Please try again.' });
        return;
      }
    }
    setDraft('');
    toast({ tone: 'success', title: 'Message sent', body: `${thread.with} usually replies within one school day.` });
  };

  return (
    <div>
      <PageHeader title="Messages" subtitle="Conversations with your children’s teachers and the school office." />

      {live && notifications.error && <p className="text-sm text-rose-600">{notifications.error}</p>}

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="overflow-hidden h-max">
          <CardHeader title="Conversations" subtitle="3 threads" />
          <ul className="divide-y divide-line">
            {threads.map((t) =>
            <li key={t.id}>
                <button
                onClick={() => { setActive(t.id); if (live) void api.post(`/notifications/${t.id}/read/`); }}
                className={cx('w-full text-left px-4 py-3.5 flex gap-3 transition-colors duration-150', active === t.id ? 'bg-forest-50/70' : 'hover:bg-cream')}>
                
                  <Avatar initials={t.initials} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[13.5px] font-semibold text-ink truncate">{t.with}</span>
                      <span className="text-[11.5px] text-ink-soft shrink-0">{t.when}</span>
                    </span>
                    <span className="block text-[12px] text-ink-muted truncate">{t.role}</span>
                    <span className="block text-[12.5px] text-ink-muted truncate mt-0.5">{t.last}</span>
                  </span>
                  {t.unread && <span className="mt-1.5 h-2 w-2 rounded-full bg-gold-400 shrink-0" aria-label="Unread" />}
                </button>
              </li>
            )}
          </ul>
        </Card>

        <Card className="flex flex-col">
          <CardHeader title={thread.with} subtitle={thread.role} />
          <ul className="flex-1 p-5 space-y-4 min-h-[340px]">
            {thread.messages.map((m, i) =>
            <li key={i} className={cx('flex', m.from === 'me' ? 'justify-end' : 'justify-start')}>
                <div className={cx('max-w-[78%] rounded-card px-4 py-3', m.from === 'me' ? 'bg-forest-700 text-white' : 'bg-cream text-ink')}>
                  <p className="text-[14px] leading-relaxed">{m.text}</p>
                  <p className={cx('mt-1.5 text-[11.5px]', m.from === 'me' ? 'text-forest-100/80' : 'text-ink-soft')}>{m.when}</p>
                </div>
              </li>
            )}
          </ul>
          <div className="border-t border-line p-4">
            <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`Reply to ${thread.with}…`} className="min-h-[88px]" />
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[12.5px] text-ink-muted">Teachers reply during school hours, Mon – Fri.</p>
              <Button size="sm" icon={<SendIcon size={15} />} onClick={send} disabled={!draft.trim()}>
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}
