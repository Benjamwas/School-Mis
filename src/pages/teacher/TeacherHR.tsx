import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DownloadIcon, LogInIcon, LogOutIcon, PlusIcon, PrinterIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, Field, Input, PageHeader, Select, Stat, StatusBadge, Textarea } from '../../components/ui/primitives';
import { Alert, Modal } from '../../components/ui/feedback';
import { DataTable, Tabs } from '../../components/ui/data';
import { ATTENDANCE_LOG, DUTY_ROSTER, HR_TICKETS, LEAVE_BALANCES, LEAVE_REQUESTS, MY_ATTENDANCE, PAYSLIP, PAYSLIP_HISTORY } from '../../data/hr';
import { formatKES } from '../../data/finance';
import { useApp } from '../../contexts/AppContext';

const TABS = ['My attendance', 'Leave', 'Payslips', 'Duty roster', 'HR tickets'];

export function TeacherHR() {
  const { tab = 'My attendance' } = useParams();
  const navigate = useNavigate();
  const { role, toast } = useApp();
  const [clockedIn, setClockedIn] = useState(true);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);

  const tabs = role === 'subjectteacher' ? TABS.slice(0, 3) : TABS;

  return (
    <div>
      <PageHeader title="My HR" subtitle="Your attendance, leave, pay and support requests. Only your own records are visible here." />

      <div className="mb-6">
        <Tabs tabs={tabs} active={tab} onChange={(t) => navigate(`/teacher/hr/${t}`)} />
      </div>

      {tab === 'My attendance' &&
      <div className="space-y-6">
          <Card className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[13px] text-ink-muted">Today · Friday 20 September 2026</p>
                <p className="mt-1 font-serif text-[24px] text-ink">{clockedIn ? 'Clocked in' : 'Clocked out'}</p>
                <p className="text-[13px] text-ink-muted mt-0.5">
                  In {MY_ATTENDANCE.clockIn} · Out {clockedIn ? '—' : '4:36 pm'} · {MY_ATTENDANCE.hoursToday} worked
                </p>
              </div>
              <Button
              variant={clockedIn ? 'secondary' : 'primary'}
              icon={clockedIn ? <LogOutIcon size={16} /> : <LogInIcon size={16} />}
              onClick={() => {
                setClockedIn((c) => !c);
                toast({ tone: 'success', title: clockedIn ? 'Clocked out at 4:36pm' : 'Clocked in at 7:12am', body: 'Recorded on the staff attendance register.' });
              }}>
              
                {clockedIn ? 'Clock out' : 'Clock in'}
              </Button>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-4">
            <Stat label="Month attendance" value={`${MY_ATTENDANCE.monthRate}%`} sub="September" tone="primary" />
            <Stat label="Days present" value={MY_ATTENDANCE.daysPresent} sub="Of 19 school days" />
            <Stat label="Late arrivals" value={MY_ATTENDANCE.daysLate} sub="16 September" tone="gold" />
            <Stat label="Absences" value={MY_ATTENDANCE.daysAbsent} sub="None this month" />
          </div>

          <Card>
            <CardHeader title="Attendance history" subtitle="Last 5 school days" />
            <DataTable
            columns={[
            { key: 'date', header: 'Date', render: (r: any) => <span className="font-medium">{r.date}</span> },
            { key: 'in', header: 'Clock in' },
            { key: 'out', header: 'Clock out' },
            { key: 'hours', header: 'Hours', align: 'right', hideOnMobile: true },
            { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
            }
            rows={ATTENDANCE_LOG}
            caption="My attendance history" />
          
          </Card>
        </div>
      }

      {tab === 'Leave' &&
      <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {LEAVE_BALANCES.map((b) =>
          <Card key={b.type} className="p-5">
                <p className="text-[13px] text-ink-muted">{b.type}</p>
                <p className="mt-1 text-[24px] font-semibold text-ink tabular-nums">
                  {b.remaining} <span className="text-[14px] font-normal text-ink-muted">days left</span>
                </p>
                <p className="mt-1 text-[12.5px] text-ink-muted">
                  {b.taken} taken of {b.entitled}
                </p>
              </Card>
          )}
          </div>

          <Card>
            <CardHeader
            title="My leave requests"
            subtitle="Approvals are handled by the HR office"
            action={
            <Button size="sm" icon={<PlusIcon size={15} />} onClick={() => setLeaveOpen(true)}>
                  Request leave
                </Button>
            } />
          
            <DataTable
            columns={[
            { key: 'type', header: 'Type', render: (r: any) => <span className="font-medium">{r.type}</span> },
            { key: 'from', header: 'From' },
            { key: 'to', header: 'To', hideOnMobile: true },
            { key: 'days', header: 'Days', align: 'right' },
            { key: 'reason', header: 'Reason', hideOnMobile: true },
            { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
            }
            rows={LEAVE_REQUESTS}
            caption="My leave requests" />
          
          </Card>
        </div>
      }

      {tab === 'Payslips' &&
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader
            title={`Payslip — ${PAYSLIP.month}`}
            subtitle={`Paid ${PAYSLIP.paidOn} · Staff no. SALA-T-018`}
            action={
            <span className="flex gap-2">
                  <Button variant="secondary" size="sm" icon={<DownloadIcon size={15} />}>
                    Download
                  </Button>
                  <Button variant="ghost" size="sm" icon={<PrinterIcon size={15} />} onClick={() => window.print()}>
                    Print
                  </Button>
                </span>
            } />
          
            <div className="p-5">
              <dl className="space-y-2.5">
                <div className="flex justify-between text-[14px]">
                  <dt className="text-ink-muted">Basic salary</dt>
                  <dd className="font-medium text-ink tabular-nums">{formatKES(PAYSLIP.basic)}</dd>
                </div>
                {PAYSLIP.allowances.map((a) =>
              <div key={a.label} className="flex justify-between text-[14px]">
                    <dt className="text-ink-muted">{a.label}</dt>
                    <dd className="text-ink tabular-nums">{formatKES(a.amount)}</dd>
                  </div>
              )}
                <div className="flex justify-between border-t border-line pt-2.5 text-[14px]">
                  <dt className="font-medium text-ink">Gross pay</dt>
                  <dd className="font-semibold text-ink tabular-nums">{formatKES(PAYSLIP.basic + PAYSLIP.allowances.reduce((a, b) => a + b.amount, 0))}</dd>
                </div>
                {PAYSLIP.deductions.map((d) =>
              <div key={d.label} className="flex justify-between text-[14px]">
                    <dt className="text-ink-muted">{d.label}</dt>
                    <dd className="text-red-600 tabular-nums">− {formatKES(d.amount)}</dd>
                  </div>
              )}
                <div className="flex justify-between border-t border-line pt-2.5 text-[15px]">
                  <dt className="font-semibold text-ink">Net pay</dt>
                  <dd className="font-semibold text-forest-700 tabular-nums">{formatKES(PAYSLIP.net)}</dd>
                </div>
              </dl>
              <p className="mt-4 text-[12px] text-ink-muted">Paid to KCB ••••4471 on {PAYSLIP.paidOn}. Prototype data.</p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Payslip history" />
            <ul className="divide-y divide-line">
              {PAYSLIP_HISTORY.map((p) =>
            <li key={p.month} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[13.5px] font-medium text-ink">{p.month}</p>
                    <p className="text-[12.5px] text-ink-muted tabular-nums">Net {formatKES(p.net)}</p>
                  </div>
                  <span className="flex items-center gap-2">
                    <Badge tone="success">{p.status}</Badge>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </span>
                </li>
            )}
            </ul>
          </Card>
        </div>
      }

      {tab === 'Duty roster' &&
      <Card>
          <CardHeader title="Weekly duty roster" subtitle="Term 3 · week 3" />
          <DataTable
          columns={[
          { key: 'day', header: 'Day', render: (r: any) => <span className="font-medium">{r.day}</span> },
          { key: 'time', header: 'Time' },
          { key: 'duty', header: 'Duty' },
          { key: 'location', header: 'Location', hideOnMobile: true },
          { key: 'teacher', header: 'Teacher', render: (r: any) => r.teacher === 'Mr. Brian Kimani' ? <Badge tone="success">You</Badge> : r.teacher }]
          }
          rows={DUTY_ROSTER}
          caption="Duty roster" />
        
        </Card>
      }

      {tab === 'HR tickets' &&
      <div className="space-y-6">
          <Alert tone="info" title="HR support">Tickets are answered by the HR office, usually within two working days.</Alert>
          <Card>
            <CardHeader
            title="My tickets"
            action={
            <Button size="sm" icon={<PlusIcon size={15} />} onClick={() => setTicketOpen(true)}>
                  New ticket
                </Button>
            } />
          
            <DataTable
            columns={[
            { key: 'id', header: 'Ref' },
            { key: 'subject', header: 'Subject', render: (r: any) => <span className="font-medium">{r.subject}</span> },
            { key: 'category', header: 'Category', hideOnMobile: true },
            { key: 'created', header: 'Created', hideOnMobile: true },
            { key: 'owner', header: 'Assigned to', hideOnMobile: true },
            { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> }]
            }
            rows={HR_TICKETS.filter((t) => t.staff === 'Mr. Brian Kimani')}
            caption="My HR tickets" />
          
          </Card>
        </div>
      }

      <Modal
        open={leaveOpen}
        onClose={() => setLeaveOpen(false)}
        title="Request leave"
        footer={
        <>
            <Button variant="secondary" size="sm" onClick={() => setLeaveOpen(false)}>
              Cancel
            </Button>
            <Button
            size="sm"
            onClick={() => {
              setLeaveOpen(false);
              toast({ tone: 'pending', title: 'Leave request submitted', body: 'Awaiting approval from the HR office.' });
            }}>
            
              Submit request
            </Button>
          </>
        }>
        
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Leave type" required>
            <Select defaultValue="Annual leave">
              {LEAVE_BALANCES.map((b) =>
              <option key={b.type}>{b.type}</option>
              )}
            </Select>
          </Field>
          <Field label="Days requested">
            <Input readOnly defaultValue="5 days" />
          </Field>
          <Field label="From" required>
            <Input type="date" defaultValue="2026-10-12" />
          </Field>
          <Field label="To" required>
            <Input type="date" defaultValue="2026-10-16" />
          </Field>
          <Field label="Reason" required className="sm:col-span-2">
            <Textarea defaultValue="Family travel to Eldoret. Cover arranged with Mrs. Wambui for Grade 4 mathematics." />
          </Field>
        </div>
      </Modal>

      <Modal
        open={ticketOpen}
        onClose={() => setTicketOpen(false)}
        title="Raise an HR ticket"
        footer={
        <>
            <Button variant="secondary" size="sm" onClick={() => setTicketOpen(false)}>
              Cancel
            </Button>
            <Button
            size="sm"
            onClick={() => {
              setTicketOpen(false);
              toast({ tone: 'success', title: 'Ticket HR-2046 created', body: 'The HR office will respond within two working days.' });
            }}>
            
              Submit ticket
            </Button>
          </>
        }>
        
        <div className="space-y-5">
          <Field label="Category" required>
            <Select defaultValue="Payroll">
              {['Payroll', 'Leave', 'Training', 'Facilities', 'Contract', 'Other'].map((c) =>
              <option key={c}>{c}</option>
              )}
            </Select>
          </Field>
          <Field label="Subject" required>
            <Input placeholder="Short summary of the issue" />
          </Field>
          <Field label="Describe the issue" required>
            <Textarea placeholder="Give as much detail as you can…" />
          </Field>
          <Field label="Attachment">
            <Input type="file" className="h-auto py-2.5" />
          </Field>
        </div>
      </Modal>
    </div>);

}