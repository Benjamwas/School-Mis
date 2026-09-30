import React, { useState } from 'react';
import { MessageCircleIcon, SendIcon, SmartphoneIcon, BellIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, Field, PageHeader, Select, Stat, StatusBadge, Textarea, cx } from '../../components/ui/primitives';
import { ConfirmDialog } from '../../components/ui/feedback';
import { DataTable } from '../../components/ui/data';
import { useApp } from '../../contexts/AppContext';
import { useApiLive, useList } from '../../api/hooks';
import type { ApiAnnouncement, ApiNotification } from '../../api/types';

const CHANNELS = [
  { id: 'SMS', icon: <SmartphoneIcon size={17} />, note: 'Delivered via Africa’s Talking · KES 0.80 per message' },
  { id: 'WhatsApp', icon: <MessageCircleIcon size={17} />, note: 'Verified business sender · SALA Schools' },
  { id: 'In-app', icon: <BellIcon size={17} />, note: 'Parent and staff portal notification' }];

const MOCK_MESSAGES = [
  { subject: 'Consultation Day booking opens Monday', channel: 'SMS', audience: 'All parents', recipients: 932, sent: '18 Sep, 4:00pm', status: 'Delivered' },
  { subject: 'Term 3 examination timetable', channel: 'In-app', audience: 'All parents', recipients: 932, sent: '15 Sep, 9:00am', status: 'Delivered' },
  { subject: 'Grade 4 trip consent reminder', channel: 'WhatsApp', audience: 'Grade 4 parents', recipients: 78, sent: '12 Sep, 2:30pm', status: 'Delivered' },
  { subject: 'Staff briefing moved to 3:30pm', channel: 'SMS', audience: 'All staff', recipients: 86, sent: '10 Sep, 11:10am', status: 'Delivered' },
  { subject: 'Fee balance reminder — Term 3', channel: 'SMS', audience: 'Parents with balances', recipients: 214, sent: '08 Sep, 8:00am', status: 'Scheduled' }];

function fmtStamp(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function labelise(value?: string | null): string {
  if (!value) return '—';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AdminCommunication() {
  const [channel, setChannel] = useState('SMS');
  const [audience, setAudience] = useState('All parents');
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState(
    'Dear parents, Consultation Day is on Saturday 26 September. Booking opens in the Parent Portal on Monday at 8:00am. — SALA'
  );
  const { toast } = useApp();

  const live = useApiLive();
  const announcements = useList<ApiAnnouncement>('announcements/');
  const notifications = useList<ApiNotification>('notifications/');

  const sent: any[] = live
    ? [
      ...(announcements.data ?? []).map((a) => ({
        id: a.id,
        subject: a.title,
        channel: a.channels?.[0] ?? 'In-app',
        audience: labelise(a.audience),
        recipients: 0,
        sent: fmtStamp(a.published_at),
        status: labelise(a.status)
      })),
      ...(notifications.data ?? []).map((n) => ({
        id: n.id,
        subject: n.title,
        channel: 'In-app',
        audience: labelise(n.type),
        recipients: 0,
        sent: fmtStamp(n.created_at),
        status: n.is_read ? 'Delivered' : 'Pending'
      }))
    ]
    : MOCK_MESSAGES;

  const recipients = audience === 'All parents' ? 932 : audience === 'Teachers' ? 86 : audience === 'Grade 4 Acacia parents' ? 26 : 1148;

  const messageError = announcements.error ?? notifications.error;

  return (
    <div>
      <PageHeader title="Communication centre" subtitle="Announcements, SMS, WhatsApp and in-app notifications to families and staff." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Messages this term" value="18,402" sub="SMS, WhatsApp and in-app" tone="primary" />
        <Stat label="Delivery rate" value="98.4%" sub="Last 30 days" />
        <Stat label="Scheduled" value="3" sub="Next: Monday 8:00am" tone="gold" />
        <Stat label="SMS credit" value="KES 42,800" sub="Approx. 53,000 messages" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader title="Compose a message" subtitle="Preview before sending — messages cannot be recalled" />
          <div className="p-5 space-y-5">
            <div>
              <p className="text-[13px] font-medium text-ink mb-2">Channel</p>
              <div className="grid sm:grid-cols-3 gap-2.5">
                {CHANNELS.map((c) =>
                <button
                  key={c.id}
                  onClick={() => setChannel(c.id)}
                  aria-pressed={channel === c.id}
                  className={cx(
                    'rounded-lg border p-3 text-left transition-colors duration-150',
                    channel === c.id ? 'border-forest-600 bg-forest-50/60' : 'border-line hover:border-forest-300'
                  )}>
                  
                    <span className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
                      {c.icon} {c.id}
                    </span>
                    <span className="mt-1 block text-[11.5px] text-ink-muted leading-snug">{c.note}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Audience" required>
                <Select value={audience} onChange={(e) => setAudience(e.target.value)}>
                  {['All parents', 'Grade 4 Acacia parents', 'Specific learners', 'Teachers', 'All staff', 'School-wide'].map((a) =>
                  <option key={a}>{a}</option>
                  )}
                </Select>
              </Field>
              <Field label="Send">
                <Select defaultValue="Immediately">
                  <option>Immediately</option>
                  <option>Monday 8:00am</option>
                  <option>Save as draft</option>
                </Select>
              </Field>
            </div>

            <Field label="Message" required hint={`${message.length} characters · ${Math.ceil(message.length / 160)} SMS per recipient`}>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} />
            </Field>

            <div className="rounded-lg border border-line bg-cream/60 p-4">
              <p className="text-[12px] uppercase tracking-wide text-ink-soft mb-1.5">Preview</p>
              <p className="text-[13.5px] leading-relaxed text-ink">{message}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] text-ink-muted">
                Sending to <span className="font-medium text-ink">{recipients.toLocaleString()}</span> recipients via {channel}.
              </p>
              <Button icon={<SendIcon size={15} />} onClick={() => setConfirm(true)}>
                Send message
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Templates" />
            <ul className="divide-y divide-line">
              {['Fee reminder', 'Absence notification', 'Event invitation', 'Results published', 'Emergency closure'].map((t) =>
              <li key={t} className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="text-[13.5px] text-ink">{t}</span>
                  <Button variant="ghost" size="sm" onClick={() => setMessage(`[${t}] Dear parents, …`)}>
                    Use
                  </Button>
                </li>
              )}
            </ul>
          </Card>
          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">Audience sizes</h3>
            <ul className="mt-3 space-y-2 text-[13.5px]">
              {[
              ['All parents', '932'],
              ['All staff', '86'],
              ['Upper Primary parents', '421'],
              ['Grade 4 Acacia parents', '26']].
              map(([k, v]) =>
              <li key={k} className="flex justify-between">
                  <span className="text-ink-muted">{k}</span>
                  <span className="font-medium text-ink tabular-nums">{v}</span>
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader title="Sent messages" subtitle="Last 30 days" />
        {live && messageError &&
        <p className="px-5 pt-3 text-sm text-rose-600">{messageError}</p>
        }
        <DataTable
          columns={[
          { key: 'subject', header: 'Message', render: (r: any) => <span className="font-medium">{r.subject}</span> },
          { key: 'channel', header: 'Channel', render: (r: any) => <Badge tone="neutral">{r.channel}</Badge> },
          { key: 'audience', header: 'Audience', hideOnMobile: true },
          { key: 'recipients', header: 'Recipients', align: 'right' },
          { key: 'sent', header: 'Sent', hideOnMobile: true },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
          }
          rows={sent}
          mobileTitle={(r: any) => r.subject}
          caption="Sent messages" />
        
      </Card>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          toast({ tone: 'success', title: `Message sent to ${recipients.toLocaleString()} recipients`, body: `Delivered via ${channel}. Receipts will appear in sent messages.` });
        }}
        title="Send this message?"
        body={`${recipients.toLocaleString()} recipients will receive this ${channel} message immediately. Messages cannot be recalled once sent.`}
        confirmLabel="Send now" />
      
    </div>);

}