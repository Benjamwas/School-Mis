import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, CardHeader, Checkbox, Field, Input, PageHeader, Select, Textarea } from '../../components/ui/primitives';
import { Tabs } from '../../components/ui/data';
import { SCHOOL } from '../../data/school';
import { api } from '../../api/client';
import { useApp } from '../../contexts/AppContext';
import { useApiLive, useList, useObject } from '../../api/hooks';

const TABS = ['School profile', 'Academic', 'Permissions', 'Payments', 'Notifications', 'Website'];

type SchoolProfile = {
  id?: string;
  name?: string;
  code?: string;
  email?: string;
  phone?: string;
  address?: string;
  motto?: string;
  logo_url?: string;
  status?: string;
};

type SettingRow = { id?: string; key: string; value?: string };

export function AdminSettings() {
  const [tab, setTab] = useState(TABS[0]);
  const { toast } = useApp();
  const live = useApiLive();

  const school = useObject<SchoolProfile>('schools/schools/me/');
  const settings = useList<SettingRow>('schools/settings/');

  const [profile, setProfile] = useState<SchoolProfile>({});
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState<Record<string, string>>({});
  const [academic, setAcademic] = useState({ active_year: '', active_term: '', grading_scale: 'CBC 4-band', report_release: 'End of term' });
  const [payments, setPayments] = useState({ paybill: '', bank: '', reminder_days: '7', allow_instalments: true });
  const [notifications, setNotifications] = useState({ email: true, sms: false, whatsapp: true, fee_reminders: true, event_alerts: true, result_alerts: true });
  const [website, setWebsite] = useState({ domain: '', banner: '', show_gallery: true, show_news: true, show_events: true, show_fees: false });

  // Load school profile from API
  useEffect(() => {
    if (live && school.data) {
      setProfile({
        id: school.data.id,
        name: school.data.name ?? '',
        code: school.data.code ?? '',
        email: school.data.email ?? '',
        phone: school.data.phone ?? '',
        address: (school.data as any).address ?? '',
        motto: school.data.motto ?? '',
        logo_url: (school.data as any).logo_url ?? '',
        status: school.data.status ?? 'ACTIVE'
      });
    }
  }, [live, school.data]);

  // Load settings key-value into prefs
  useEffect(() => {
    if (live && settings.data) {
      const map: Record<string, string> = {};
      settings.data.forEach((s) => { map[s.key] = s.value ?? ''; });
      setPrefs(map);
      if (map.active_year) setAcademic((a) => ({ ...a, active_year: map.active_year }));
      if (map.active_term) setAcademic((a) => ({ ...a, active_term: map.active_term }));
      if (map.grading_scale) setAcademic((a) => ({ ...a, grading_scale: map.grading_scale }));
      if (map.report_release) setAcademic((a) => ({ ...a, report_release: map.report_release }));
      if (map.paybill) setPayments((p) => ({ ...p, paybill: map.paybill }));
      if (map.bank_details) setPayments((p) => ({ ...p, bank: map.bank_details }));
      if (map.fee_reminder_days) setPayments((p) => ({ ...p, reminder_days: map.fee_reminder_days }));
      if (map.website_domain) setWebsite((w) => ({ ...w, domain: map.website_domain }));
      if (map.website_banner) setWebsite((w) => ({ ...w, banner: map.website_banner }));
    }
  }, [live, settings.data]);

  const upsertSetting = async (key: string, value: string) => {
    const existing = (settings.data ?? []).find((s) => s.key === key);
    if (existing?.id) {
      await api.patch(`schools/settings/${existing.id}/`, { value });
    } else {
      await api.post('schools/settings/', { key, value });
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      if (live && profile.id) {
        await api.patch(`schools/schools/${profile.id}/`, {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          motto: profile.motto
        });
        school.refresh();
      }
      toast({ tone: 'success', title: 'Profile saved', body: live ? 'School profile updated in the database.' : 'Saved locally (demo mode).' });
    } catch (e: any) {
      toast({ tone: 'error', title: 'Save failed', body: e?.message || 'Try again.' });
    } finally {
      setSaving(false);
    }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      // Save profile
      if (live && profile.id) {
        await api.patch(`schools/schools/${profile.id}/`, {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          motto: profile.motto
        });
      }
      // Save academic settings
      if (live) {
        await upsertSetting('active_year', academic.active_year);
        await upsertSetting('active_term', academic.active_term);
        await upsertSetting('grading_scale', academic.grading_scale);
        await upsertSetting('report_release', academic.report_release);
        await upsertSetting('paybill', payments.paybill);
        await upsertSetting('bank_details', payments.bank);
        await upsertSetting('fee_reminder_days', payments.reminder_days);
        await upsertSetting('notify_email', String(notifications.email));
        await upsertSetting('notify_sms', String(notifications.sms));
        await upsertSetting('notify_whatsapp', String(notifications.whatsapp));
        await upsertSetting('notify_fee_reminders', String(notifications.fee_reminders));
        await upsertSetting('notify_event_alerts', String(notifications.event_alerts));
        await upsertSetting('notify_result_alerts', String(notifications.result_alerts));
        await upsertSetting('website_domain', website.domain);
        await upsertSetting('website_banner', website.banner);
        await upsertSetting('website_show_gallery', String(website.show_gallery));
        await upsertSetting('website_show_news', String(website.show_news));
        await upsertSetting('website_show_events', String(website.show_events));
        settings.refresh();
        school.refresh();
      }
      toast({ tone: 'success', title: 'Settings saved', body: live ? 'All changes persisted to the database.' : 'Saved locally (demo mode).' });
    } catch (e: any) {
      toast({ tone: 'error', title: 'Save failed', body: e?.message || 'Try again.' });
    } finally {
      setSaving(false);
    }
  };

  const demoProfile = live ? profile : {
    name: SCHOOL.name, phone: SCHOOL.phone, email: SCHOOL.email, address: SCHOOL.address, motto: SCHOOL.motto, code: 'SALA'
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle={live ? 'School configuration — saved to the database' : 'School-level configuration (demo mode — connect the API to persist).'}
        actions={<Button size="sm" disabled={saving} onClick={saveAll}>{saving ? 'Saving…' : 'Save changes'}</Button>} />

      {school.error && <p className="mb-4 text-sm text-rose-600">{school.error}</p>}
      {settings.error && <p className="mb-4 text-sm text-rose-600">{settings.error}</p>}

      <div className="mb-6">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {tab === 'School profile' && (
        <Card>
          <CardHeader title="School profile" subtitle="Shown on the website, receipts and reports" />
          <div className="p-5 grid sm:grid-cols-2 gap-5">
            <Field label="School name" className="sm:col-span-2">
              <Input value={demoProfile.name ?? ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </Field>
            <Field label="School code">
              <Input value={demoProfile.code ?? ''} disabled />
            </Field>
            <Field label="Phone">
              <Input value={profile.phone ?? demoProfile.phone ?? ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </Field>
            <Field label="Email">
              <Input value={profile.email ?? demoProfile.email ?? ''} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <Input value={profile.address ?? demoProfile.address ?? ''} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
            </Field>
            <Field label="Motto" className="sm:col-span-2">
              <Input value={profile.motto ?? demoProfile.motto ?? ''} onChange={(e) => setProfile({ ...profile, motto: e.target.value })} />
            </Field>
          </div>
          <div className="px-5 pb-5">
            <Button size="sm" disabled={saving} onClick={saveProfile}>{saving ? 'Saving…' : 'Save profile'}</Button>
          </div>
        </Card>
      )}

      {tab === 'Academic' && (
        <Card>
          <CardHeader title="Academic settings" subtitle="Active year, term and grading" />
          <div className="p-5 grid sm:grid-cols-2 gap-5">
            <Field label="Active academic year">
              <Select value={academic.active_year} onChange={(e) => setAcademic({ ...academic, active_year: e.target.value })}>
                <option value="">—</option>
                <option>2026</option>
                <option>2027</option>
              </Select>
            </Field>
            <Field label="Active term">
              <Select value={academic.active_term} onChange={(e) => setAcademic({ ...academic, active_term: e.target.value })}>
                <option value="">—</option>
                <option>Term 1</option>
                <option>Term 2</option>
                <option>Term 3</option>
              </Select>
            </Field>
            <Field label="Grading scale">
              <Select value={academic.grading_scale} onChange={(e) => setAcademic({ ...academic, grading_scale: e.target.value })}>
                <option>CBC 4-band</option>
                <option>Percentage</option>
                <option>Letter grades</option>
              </Select>
            </Field>
            <Field label="Report release">
              <Select value={academic.report_release} onChange={(e) => setAcademic({ ...academic, report_release: e.target.value })}>
                <option>End of term</option>
                <option>Mid-term</option>
                <option>On request</option>
              </Select>
            </Field>
          </div>
        </Card>
      )}

      {tab === 'Permissions' && (
        <Card>
          <CardHeader title="Role permissions" subtitle="Which roles can access which modules" />
          <div className="p-5 space-y-3">
            {[
              { role: 'School Administrator', access: 'Full access' },
              { role: 'Finance', access: 'Finance · Reports' },
              { role: 'HR', access: 'HR · Staff' },
              { role: 'Teacher', access: 'Classes · Assignments · Attendance' },
              { role: 'Parent', access: 'Own children · Fees · Messages' },
              { role: 'Student', access: 'Own learning · Assignments' }
            ].map((r) => (
              <div key={r.role} className="flex items-center justify-between rounded-xl border border-surface-border bg-surface-light px-4 py-3">
                <div>
                  <p className="text-[14px] font-semibold text-ink">{r.role}</p>
                  <p className="text-[12.5px] text-ink-muted">{r.access}</p>
                </div>
                <Badge tone="success">Enabled</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'Payments' && (
        <Card>
          <CardHeader title="Payment settings" subtitle="Paybill, bank details and reminders" />
          <div className="p-5 grid sm:grid-cols-2 gap-5">
            <Field label="M-Pesa paybill / till">
              <Input value={payments.paybill} onChange={(e) => setPayments({ ...payments, paybill: e.target.value })} placeholder="e.g. 174379" />
            </Field>
            <Field label="Bank details">
              <Input value={payments.bank} onChange={(e) => setPayments({ ...payments, bank: e.target.value })} placeholder="Bank name · Account" />
            </Field>
            <Field label="Reminder before due (days)">
              <Input type="number" min="1" value={payments.reminder_days} onChange={(e) => setPayments({ ...payments, reminder_days: e.target.value })} />
            </Field>
            <div className="flex items-end pb-2">
              <Checkbox
                label="Allow instalment plans"
                checked={payments.allow_instalments}
                onChange={(e) => setPayments({ ...payments, allow_instalments: e.target.checked })}
              />
            </div>
          </div>
        </Card>
      )}

      {tab === 'Notifications' && (
        <Card>
          <CardHeader title="Notification preferences" subtitle="How the school sends alerts" />
          <div className="p-5 space-y-3">
            {([
              ['email', 'Email notifications'],
              ['sms', 'SMS notifications'],
              ['whatsapp', 'WhatsApp notifications'],
              ['fee_reminders', 'Fee balance reminders'],
              ['event_alerts', 'Event alerts'],
              ['result_alerts', 'Results released alerts']
            ] as const).map(([key, label]) => (
              <Checkbox
                key={key}
                label={label}
                checked={notifications[key]}
                onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
              />
            ))}
          </div>
        </Card>
      )}

      {tab === 'Website' && (
        <Card>
          <CardHeader title="Website settings" subtitle="Public site visibility" />
          <div className="p-5 space-y-5">
            <Field label="Custom domain">
              <Input value={website.domain} onChange={(e) => setWebsite({ ...website, domain: e.target.value })} placeholder="salaschools.ac.ke" />
            </Field>
            <Field label="Homepage banner text">
              <Textarea value={website.banner} onChange={(e) => setWebsite({ ...website, banner: e.target.value })} rows={2} />
            </Field>
            <div className="space-y-3">
              {([
                ['show_gallery', 'Show gallery'],
                ['show_news', 'Show news'],
                ['show_events', 'Show events'],
                ['show_fees', 'Show fee structure publicly']
              ] as const).map(([key, label]) => (
                <Checkbox
                  key={key}
                  label={label}
                  checked={website[key]}
                  onChange={(e) => setWebsite({ ...website, [key]: e.target.checked })}
                />
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
