import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheckIcon, CheckIcon, XIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Stat, StatusBadge } from '../../components/ui/primitives';
import { ConfirmDialog } from '../../components/ui/feedback';
import { DataTable, FilterSelect, Tabs, Timeline } from '../../components/ui/data';
import { APPLICATIONS, APPLICATION_TIMELINE, BOOKED_VISITS } from '../../data/crm';
import { useApp } from '../../contexts/AppContext';
import { useApiLive, useList, useObject } from '../../api/hooks';

const TABS = ['Applications', 'Assessment schedule', 'School visits'];

const STAGE_FILTERS = ['All stages', 'Under Review', 'Interview', 'Decision', 'Accepted', 'Enrolled'];

const STAGE_LABEL: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW: 'Interview',
  DECISION_PENDING: 'Decision',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  WAITLISTED: 'Waitlisted',
  ENROLLED: 'Enrolled',
  WITHDRAWN: 'Withdrawn'
};

function stageOf(status?: string): string {
  if (!status) return 'Draft';
  return STAGE_LABEL[status] ?? status;
}

function fmtDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function AdminAdmissions() {
  const [tab, setTab] = useState(TABS[0]);
  const [stage, setStage] = useState('All stages');
  const [reject, setReject] = useState<string | null>(null);
  const { toast } = useApp();

  const live = useApiLive();
  const applications = useList<Record<string, any>>('admissions/applications/');
  const summary = useObject<{ status_counts?: Record<string, number> }>('admissions/applications/summary/');

  const source: any[] = live
    ? (applications.data ?? []).map((a) => ({
      id: a.application_number || a.id,
      child: a.applicant_name || '—',
      parent: a.applicant_name || '—',
      applyingClass: a.grade_level_name || '—',
      submitted: fmtDate(a.submitted_at),
      stage: stageOf(a.status),
      status: stageOf(a.status)
    }))
    : APPLICATIONS;

  const rows = stage === 'All stages' ? source : source.filter((a) => a.stage === stage);

  const counts = summary.data?.status_counts ?? {};
  const total = counts.TOTAL ?? 0;
  const awaiting = (counts.SUBMITTED ?? 0) + (counts.UNDER_REVIEW ?? 0) + (counts.SHORTLISTED ?? 0)
    + (counts.INTERVIEW ?? 0) + (counts.DECISION_PENDING ?? 0);
  const accepted = (counts.ACCEPTED ?? 0) + (counts.ENROLLED ?? 0);

  return (
    <div>
      <PageHeader
        title="Admissions"
        subtitle="January 2027 intake · applications, assessments and school visits"
        actions={
        <Link to="/admin/crm">
            <Button size="sm" variant="secondary">
              Open CRM pipeline
            </Button>
          </Link>
        } />
      

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Applications received" value={live ? total : '24'} sub="This intake" tone="primary" />
        <Stat label="Awaiting decision" value={live ? awaiting : '5'} sub="2 past the 10-day window" tone="gold" />
        <Stat label="Offers accepted" value={live ? accepted : '11'} sub="9 fully enrolled" />
        <Stat label="Visits booked" value={BOOKED_VISITS.length} sub="Next: 24 Sep, 10:00am" icon={<CalendarCheckIcon size={16} />} />
      </div>

      <div className="mt-6 mb-6">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {live && (applications.error ?? summary.error) &&
      <p className="mb-4 text-sm text-rose-600">{applications.error ?? summary.error}</p>
      }

      {tab === 'Applications' &&
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <Card>
            <CardHeader
            title={`${rows.length} applications`}
            subtitle="January 2027 intake"
            action={<FilterSelect label="Stage" value={stage} onChange={setStage} options={STAGE_FILTERS} />} />
          
            <DataTable
            columns={[
            { key: 'id', header: 'Reference' },
            { key: 'child', header: 'Learner', render: (r: any) => <span className="font-medium">{r.child}</span> },
            { key: 'applyingClass', header: 'Class' },
            { key: 'parent', header: 'Parent', hideOnMobile: true },
            { key: 'submitted', header: 'Submitted', hideOnMobile: true },
            { key: 'stage', header: 'Stage', render: (r: any) => <StatusBadge status={r.stage} /> },
            {
              key: 'a',
              header: '',
              align: 'right',
              render: (r: any) =>
              <span className="flex justify-end gap-1.5">
                      <Button size="sm" variant="secondary" icon={<CheckIcon size={14} />} onClick={() => toast({ tone: 'success', title: `Offer sent to ${r.parent}`, body: `${r.child} · ${r.applyingClass}` })}>
                        Offer
                      </Button>
                      <Button size="sm" variant="ghost" icon={<XIcon size={14} />} onClick={() => setReject(r.id)}>
                        Reject
                      </Button>
                    </span>

            }]
            }
            rows={rows}
            mobileTitle={(r: any) => `${r.child} · ${r.applyingClass}`}
            caption="Applications" />
          
          </Card>

          <Card>
            <CardHeader title="APP-2026-0418" subtitle="Mark Otieno · Grade 4" />
            <div className="p-5">
              <Timeline items={APPLICATION_TIMELINE.map((t) => ({ title: t.stage, meta: t.date, body: t.desc, state: t.state as any }))} />
            </div>
            <div className="px-5 py-4 border-t border-line flex gap-2">
              <Button size="sm" className="flex-1">
                Send offer
              </Button>
              <Button size="sm" variant="secondary" className="flex-1">
                Request documents
              </Button>
            </div>
          </Card>
        </div>
      }

      {tab === 'Assessment schedule' &&
      <Card>
          <CardHeader title="Upcoming assessments" subtitle="Thursdays, 9:00am · Acacia Wing" />
          <DataTable
          columns={[
          { key: 'date', header: 'Date', render: (r: any) => <span className="font-medium">{r.date}</span> },
          { key: 'time', header: 'Time' },
          { key: 'child', header: 'Learner' },
          { key: 'cls', header: 'Class', hideOnMobile: true },
          { key: 'assessor', header: 'Assessor', hideOnMobile: true },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
          }
          rows={[
          { date: '26 Sep 2026', time: '9:00 am', child: 'Mark Otieno', cls: 'Grade 4', assessor: 'Mrs. Faith Wambui', status: 'Scheduled' },
          { date: '26 Sep 2026', time: '10:00 am', child: 'Layla Ali', cls: 'Grade 1', assessor: 'Ms. Nancy Chebet', status: 'Scheduled' },
          { date: '03 Oct 2026', time: '9:00 am', child: 'Ivy Chelimo', cls: 'PP1', assessor: 'Ms. Lydia Achieng', status: 'Pending' },
          { date: '19 Sep 2026', time: '9:00 am', child: 'Ethan Barasa', cls: 'Grade 2', assessor: 'Mrs. Faith Wambui', status: 'Complete' }]
          }
          caption="Assessment schedule" />
        
        </Card>
      }

      {tab === 'School visits' &&
      <Card>
          <CardHeader title="Booked visits" subtitle="Campus tours and consultations" />
          <DataTable
          columns={[
          { key: 'id', header: 'Ref' },
          { key: 'parent', header: 'Parent', render: (r: any) => <span className="font-medium">{r.parent}</span> },
          { key: 'date', header: 'Date' },
          { key: 'time', header: 'Time' },
          { key: 'visitors', header: 'Visitors', align: 'right', hideOnMobile: true },
          { key: 'reason', header: 'Reason', hideOnMobile: true },
          { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
          }
          rows={BOOKED_VISITS}
          caption="Booked school visits" />
        
          <div className="px-5 py-4 border-t border-line flex items-center justify-between gap-3">
            <p className="text-[13px] text-ink-muted">Tour slots: 9:00, 10:00, 2:00 and 3:00 on school days.</p>
            <Badge tone="neutral">2 slots free this week</Badge>
          </div>
        </Card>
      }

      <ConfirmDialog
        open={!!reject}
        onClose={() => setReject(null)}
        onConfirm={() => {
          setReject(null);
          toast({ tone: 'warning', title: 'Application rejected', body: 'The parent will receive a decision letter by email.' });
        }}
        title="Reject this application?"
        body="The family will be notified by email with the standard decision letter. This cannot be undone from the portal."
        confirmLabel="Reject application"
        danger />
      
    </div>);

}