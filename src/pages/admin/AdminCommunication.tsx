import React, { useState } from 'react';
import { MessageCircleIcon, SendIcon, SmartphoneIcon, BellIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, Field, PageHeader, Select, Stat, StatusBadge, Textarea } from '../../components/ui/primitives';
import { ConfirmDialog } from '../../components/ui/feedback';
import { DataTable } from '../../components/ui/data';
import { useApp } from '../../contexts/AppContext';
import { api } from '../../api/client';
import { useApiLive, useList } from '../../api/hooks';
import type { ApiAnnouncement, ApiNotification } from '../../api/types';

const CHANNELS = [
  { id: 'SMS', icon: <SmartphoneIcon size={17} />, note: 'Delivered via provider · per-message rates apply' },
  { id: 'WhatsApp', icon: <MessageCircleIcon size={17} />, note: 'Verified business sender' },
  { id: 'IN_APP', icon: <BellIcon size={17} />, note: 'Parent and staff portal notification' }
];

function fmtStamp(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function labelise(value?: string | null): string {
  if (!value) return '—';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AdminCommunication() {
  const [channel, setChannel] = useState('IN_APP');
  const [audience, setAudience] = useState('All parents');
  const [title, setTitle] = useState('Consultation Day booking opens Monday');
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState(
    'Dear parents, Consultation Day is on Saturday 26 September. Booking opens in the Parent Portal on Monday at 8:00am. — SALA'
  );
  const [busy, setBusy] = useState(false);
  const { toast } = useApp();

  const live = useApiLive();
  const announcements = useList<ApiAnnouncement>('announcements/');
  const notifications = useList<ApiNotification>('notifications/');

  const sent: any[] = live
    ? [
      ...(announcements.data ?? []).map((a) => ({
        id: a.id,
        subject: a.title,
        channel: (a.channels ?? []).join(', ') || 'In-app',
        audience: a.audience || 'All',
        recipients: '—',
        sent: fmtStamp(a.published_at ?? (a as any).created_at),
        status: a.status === 'PUBLISHED' ? 'Delivered' : labelise(a.status)
      })),
      ...(notifications.data ?? []).slice(0, 5).map((n) => ({
        id: n.id,
        subject: n.title,
        channel: 'In-app',
        audience: '—',
        recipients: '1',
        sent: fmtStamp((n as any).created_at),
        status: 'Delivered'
      }))
    ]
    : [
      { id: 'm1', subject: 'Consultation Day booking opens Monday', channel: 'SMS', audience: 'All parents', recipients: 932, sent: '18 Sep, 4:00pm', status: 'Delivered' },
      { id: 'm2', subject: 'Term 3 examination timetable', channel: 'In-app', audience: 'All parents', recipients: 932, sent: '15 Sep, 9:00am', status: 'Delivered' },
      { id: 'm3', subject: 'Grade 4 trip consent reminder', channel: 'WhatsApp', audience: 'Grade 4 parents', recipients: 78, sent: '12 Sep, 2:30pm', status: 'Delivered' }
    ];

  const sendMessage = async () => {
    if (!message.trim()) {
      toast({ tone: 'warning', title: 'Empty message', body: 'Write a message before sending.' });
      return;
    }
    setBusy(true);
    try {
      if (channel === 'IN_APP' || channel === 'In-app') {
        // In-app: create a published announcement
        await api.post('announcements/', {
          title: title || 'School announcement',
          body: message,
          audience: audience,
          channels: ['IN_APP']
        });
      } else if (channel === 'SMS') {
        await api.post('campaigns/send_sms/', { to: '', body: message });
      } else if (channel === 'WhatsApp') {
        await api.post('campaigns/send_whatsapp/', { to: '', body: message });
      } else {
        // Fallback: create announcement
        await api.post('announcements/', {
          title: title || 'School announcement',
          body: message,
          audience: audience,
          channels: [channel]
        });
      }
      toast({ tone: 'success', title: 'Message sent', body: `Delivered via ${channel} to ${audience.toLowerCase()}.` });
      setConfirm(false);
      announcements.refresh();
      notifications.refresh();
    } catch (e: any) {
      toast({ tone: 'error', title: 'Send failed', body: e?.message || 'Try again.' });
    } finally {
      setBusy(false);
    }
  };

  const smsCount = Math.max(1, Math.ceil(message.length / 160));

  return (
    <div>
      <PageHeader
        title="Communication"
        subtitle={live ? `${sent.length} messages on record` : 'Send SMS, WhatsApp and in-app messages to parents and staff.'} />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Stat label="Channels" value="3" sub="SMS · WhatsApp · In-app" tone="primary" />
        <Stat label="Announcements" value={live ? String(announcements.data?.length ?? 0) : '24'} />
        <Stat label="Portal notifications" value={live ? String(notifications.data?.length ?? 0) : '118'} tone="gold" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader title="Compose message" subtitle="In-app messages appear in the parent/staff portal" />
          <div className="p-5 space-y-4">
            <div>
              <p className="text-[13px] font-medium text-ink mb-2">Channel</p>
              <div className="grid gap-2">
                {CHANNELS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setChannel(c.id)}
                    className={cx(
                      'flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors duration-150',
                      channel === c.id
                        ? 'border-gold bg-gold/10 text-navy'
                        : 'border-surface-border bg-white hover:border-gold/50'
                    )}
                  >
                    <span className={channel === c.id ? 'text-gold' : 'text-ink-muted'}>{c.icon}</span>
                    <span>
                      <span className="block text-[13.5px] font-semibold">{c.id === 'IN_APP' ? 'In-app' : c.id}</span>
                      <span className="block text-[12px] text-ink-muted">{c.note}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Field label="Audience">
              <Select value={audience} onChange={(e) => setAudience(e.target.value)}>
                <option>All parents</option>
                <option>All staff</option>
                <option>Grade 4 parents</option>
                <option>Parents with balances</option>
                <option>ECD parents</option>
              </Select>
            </Field>

            <Field label="Title / subject">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Consultation Day booking" />
            </Field>

            <Field label="Message" required>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} />
            </Field>

            <div className="flex items-center justify-between text-[12px] text-ink-muted">
              <span>{message.length} characters · {smsCount} SMS segment{smsCount > 1 ? 's' : ''}</span>
              <span className="rounded-full bg-surface-light px-2 py-0.5">Preview: “{message.slice(0, 60)}…”</span>
            </div>

            <Button full icon={<SendIcon size={16} />} onClick={() => setConfirm(true)}>
              Send message
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Sent messages" subtitle={live ? 'From announcements & notifications' : undefined} />
          {live && announcements.error && <p className="px-5 pt-3 text-sm text-rose-600">{announcements.error}</p>}
          <DataTable
            columns={[
              { key: 'subject', header: 'Message', render: (r: any) => <span className="font-medium">{r.subject}</span> },
              { key: 'channel', header: 'Channel', hideOnMobile: true },
              { key: 'audience', header: 'Audience', hideOnMobile: true },
              { key: 'sent', header: 'Sent', hideOnMobile: true },
              { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }
            ]}
            rows={sent}
            mobileTitle={(r: any) => r.subject}
            caption="Sent messages" />
        </Card>
      </div>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={sendMessage}
        title="Send message?"
        body={`This will send via ${channel === 'IN_APP' ? 'in-app' : channel} to ${audience.toLowerCase()}.`}
        confirmLabel={busy ? 'Sending…' : 'Send now'}
      />
    </div>
  );
}

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}
