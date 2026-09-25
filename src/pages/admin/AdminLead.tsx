import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarPlusIcon, MailIcon, PhoneIcon, PlusIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, Field, PageHeader, Select, StatusBadge, Textarea } from '../../components/ui/primitives';
import { Timeline } from '../../components/ui/data';
import { LEADS, LEAD_ACTIVITY, PIPELINE_STAGES } from '../../data/crm';
import { useApp } from '../../contexts/AppContext';

export function AdminLead() {
  const { id = 'L-1036' } = useParams();
  const lead = LEADS.find((l) => l.id === id) ?? LEADS[3];
  const { toast } = useApp();

  return (
    <div>
      <nav className="mb-3 text-[13px] text-ink-muted" aria-label="Breadcrumb">
        <Link to="/admin/crm" className="hover:text-ink">
          CRM
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{lead.id}</span>
      </nav>

      <PageHeader
        title={lead.parent}
        subtitle={`${lead.id} · Enquiry for ${lead.child}, ${lead.applyingClass} · source: ${lead.source}`}
        actions={
        <>
            <Button size="sm" variant="secondary" icon={<PhoneIcon size={15} />} onClick={() => toast({ tone: 'success', title: 'Call logged', body: 'Added to the communication history.' })}>
              Log call
            </Button>
            <Button size="sm" icon={<CalendarPlusIcon size={15} />}>
              Book a visit
            </Button>
          </>
        } />
      

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Pipeline stage" subtitle="Move the lead as the family progresses" />
            <div className="p-5">
              <ol className="flex flex-wrap gap-2">
                {PIPELINE_STAGES.map((s) => {
                  const idx = PIPELINE_STAGES.indexOf(lead.stage as any);
                  const here = PIPELINE_STAGES.indexOf(s);
                  const state = here < idx ? 'done' : here === idx ? 'current' : 'todo';
                  return (
                    <li
                      key={s}
                      className={
                      'rounded-full px-3 py-1.5 text-[12.5px] font-medium border ' + (
                      state === 'done' ? 'border-forest-200 bg-forest-50 text-forest-700' : state === 'current' ? 'border-gold-300 bg-gold-50 text-gold-600' : 'border-line bg-white text-ink-soft')
                      }>
                      
                      {s}
                    </li>);

                })}
              </ol>
              <div className="mt-5 grid sm:grid-cols-2 gap-4">
                <Field label="Move to stage">
                  <Select defaultValue={lead.stage}>
                    {PIPELINE_STAGES.map((s) =>
                    <option key={s}>{s}</option>
                    )}
                  </Select>
                </Field>
                <Field label="Assigned to">
                  <Select defaultValue={lead.owner}>
                    <option>Jane Njoki</option>
                    <option>Peter Mwaura</option>
                  </Select>
                </Field>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Communication history" action={<Badge tone="neutral">{LEAD_ACTIVITY.length} entries</Badge>} />
            <div className="p-5">
              <Timeline
                items={LEAD_ACTIVITY.map((a, i) => ({
                  title: a.what,
                  meta: `${a.when} · ${a.who}`,
                  state: i === 0 ? 'active' as const : 'complete' as const
                }))} />
              
            </div>
          </Card>

          <Card>
            <CardHeader title="Add a note" />
            <div className="p-5">
              <Textarea placeholder="What was discussed? Any commitments made?" />
              <div className="mt-3 flex justify-end">
                <Button size="sm" icon={<PlusIcon size={15} />} onClick={() => toast({ tone: 'success', title: 'Note added' })}>
                  Save note
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Contact details" />
            <dl className="divide-y divide-line">
              {[
              ['Parent', lead.parent],
              ['Phone', lead.phone],
              ['Email', lead.email],
              ['Learner', lead.child],
              ['Applying for', lead.applyingClass],
              ['Source', lead.source],
              ['Owner', lead.owner],
              ['Last updated', lead.updated]].
              map(([k, v]) =>
              <div key={k} className="flex justify-between gap-4 px-5 py-2.5">
                  <dt className="text-[13px] text-ink-muted">{k}</dt>
                  <dd className="text-[13.5px] font-medium text-ink text-right">{v}</dd>
                </div>
              )}
            </dl>
            <div className="px-5 py-3 border-t border-line flex gap-2">
              <Button size="sm" variant="secondary" full icon={<MailIcon size={15} />}>
                Email
              </Button>
              <Button size="sm" variant="secondary" full icon={<PhoneIcon size={15} />}>
                Call
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">Next action</h3>
            <p className="mt-1.5 text-[13.5px] text-ink-muted">{lead.nextAction}</p>
            <StatusBadge status={lead.stage} />
          </Card>

          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">Application status</h3>
            <p className="mt-1.5 text-[13.5px] text-ink-muted">
              {lead.stage === 'Application' || lead.stage === 'Admitted' || lead.stage === 'Enrolled' ?
              'APP-2026-0418 submitted 16 Sep. Assessment booked for 26 Sep.' :
              'No application submitted yet.'}
            </p>
            <Link to="/admin/admissions">
              <Button variant="secondary" size="sm" full className="mt-3">
                Open in admissions
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>);

}