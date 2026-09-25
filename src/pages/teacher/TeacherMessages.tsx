import React, { useState } from 'react';
import { SendIcon, UsersIcon } from 'lucide-react';
import { Avatar, Badge, Button, Card, CardHeader, Field, PageHeader, Select, Textarea, cx } from '../../components/ui/primitives';
import { Modal } from '../../components/ui/feedback';
import { useApp } from '../../contexts/AppContext';

const THREADS = [
{
  id: 't1',
  with: 'Grace Wanjiku Kamau',
  about: 'Parent of Wanjiru Kamau · Grade 4 Acacia',
  initials: 'GK',
  when: '2h',
  unread: true,
  messages: [
  { from: 'me', text: 'Good afternoon Mrs. Kamau. Wanjiru is finding fractions difficult — the method is there but accuracy drops under time pressure.', when: 'Yesterday, 3:12pm' },
  { from: 'them', text: 'Thank you for letting me know early. What should we be doing at home?', when: 'Yesterday, 6:40pm' },
  { from: 'me', text: 'Ten minutes of tables practice each evening, and I have added a Fraction Walls activity in her portal.', when: 'Today, 8:05am' }]

},
{ id: 't2', with: 'Millicent Ochieng', about: 'Parent of Brian Ochieng · Grade 4 Acacia', initials: 'MO', when: '1d', unread: false, messages: [{ from: 'them', text: 'Brian has the science fair materials ready. What time should he arrive on Saturday?', when: 'Yesterday, 11:02am' }] },
{ id: 't3', with: 'Ruth Kiptoo', about: 'Parent of Samuel Kiptoo · Grade 4 Acacia', initials: 'RK', when: '3d', unread: true, messages: [{ from: 'me', text: 'Samuel has missed three days this fortnight without a note. Is everything alright at home?', when: '17 Sep, 4:20pm' }] }];


export function TeacherMessages() {
  const [active, setActive] = useState(THREADS[0].id);
  const [draft, setDraft] = useState('');
  const [broadcast, setBroadcast] = useState(false);
  const thread = THREADS.find((t) => t.id === active)!;
  const { toast } = useApp();

  return (
    <div>
      <PageHeader
        title="Parent messages"
        subtitle="Conversations with parents of learners in your class. Messages are logged and visible to the school office."
        actions={
        <Button size="sm" icon={<UsersIcon size={15} />} onClick={() => setBroadcast(true)}>
            Message whole class
          </Button>
        } />
      

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-max overflow-hidden">
          <CardHeader title="Conversations" subtitle={`${THREADS.filter((t) => t.unread).length} unread`} />
          <ul className="divide-y divide-line">
            {THREADS.map((t) =>
            <li key={t.id}>
                <button onClick={() => setActive(t.id)} className={cx('w-full text-left px-4 py-3.5 flex gap-3 transition-colors duration-150', active === t.id ? 'bg-forest-50/70' : 'hover:bg-cream')}>
                  <Avatar initials={t.initials} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[13.5px] font-semibold text-ink truncate">{t.with}</span>
                      <span className="text-[11.5px] text-ink-soft shrink-0">{t.when}</span>
                    </span>
                    <span className="block text-[12px] text-ink-muted truncate">{t.about}</span>
                  </span>
                  {t.unread && <span className="mt-1.5 h-2 w-2 rounded-full bg-gold-400 shrink-0" aria-label="Unread" />}
                </button>
              </li>
            )}
          </ul>
        </Card>

        <Card className="flex flex-col">
          <CardHeader title={thread.with} subtitle={thread.about} action={<Badge tone="neutral">SMS + in-app</Badge>} />
          <ul className="flex-1 p-5 space-y-4 min-h-[320px]">
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
            <div className="mt-3 flex justify-end">
              <Button
                size="sm"
                icon={<SendIcon size={15} />}
                disabled={!draft.trim()}
                onClick={() => {
                  setDraft('');
                  toast({ tone: 'success', title: 'Message sent', body: `Delivered to ${thread.with} by in-app notification and SMS.` });
                }}>
                
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Modal
        open={broadcast}
        onClose={() => setBroadcast(false)}
        title="Message all Grade 4 Acacia parents"
        description="26 parents will receive this by in-app notification and SMS."
        footer={
        <>
            <Button variant="secondary" size="sm" onClick={() => setBroadcast(false)}>
              Cancel
            </Button>
            <Button
            size="sm"
            onClick={() => {
              setBroadcast(false);
              toast({ tone: 'success', title: 'Message sent to 26 parents', body: 'Delivery receipts will appear in your sent items.' });
            }}>
            
              Send to 26 parents
            </Button>
          </>
        }>
        
        <div className="space-y-5">
          <Field label="Channel">
            <Select defaultValue="In-app + SMS">
              <option>In-app + SMS</option>
              <option>In-app only</option>
              <option>WhatsApp</option>
            </Select>
          </Field>
          <Field label="Message" required>
            <Textarea defaultValue="Dear parents, please send your child with an old newspaper on Monday for our fractions practical. Thank you. Mr. Kimani." />
          </Field>
        </div>
      </Modal>
    </div>);

}