import React from 'react';
import { PlusIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader, Progress, Stat } from '../../components/ui/primitives';
import { DataTable } from '../../components/ui/data';
import { CLASSES, TEACHERS } from '../../data/people';

export function AdminClasses() {
  return (
    <div>
      <PageHeader
        title="Classes"
        subtitle="Streams, class teachers, subject allocation and timetables."
        actions={
        <Button size="sm" icon={<PlusIcon size={15} />}>
            Add class
          </Button>
        } />
      

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Classes" value="42" sub="Across three sections" tone="primary" />
        <Stat label="Average class size" value="24" sub="Maximum 26 in primary" />
        <Stat label="Streams" value="Acacia · Baobab · Cedar" sub="Three per year group" />
        <Stat label="Classes without a teacher" value="0" sub="All allocations complete" />
      </div>

      <Card className="mt-6">
        <CardHeader title="Class list" subtitle="Upper and lower primary" />
        <DataTable
          columns={[
          { key: 'name', header: 'Class', render: (r: any) => <span className="font-medium">{r.name}</span> },
          { key: 'teacher', header: 'Class teacher' },
          { key: 'learners', header: 'Learners', align: 'right' },
          { key: 'room', header: 'Room', hideOnMobile: true },
          { key: 'average', header: 'Average', align: 'right', render: (r: any) => <Badge tone={r.average < 70 ? 'warning' : 'success'}>{r.average}%</Badge> },
          { key: 'attendance', header: 'Attendance', align: 'right', render: (r: any) => `${r.attendance}%`, hideOnMobile: true }]
          }
          rows={CLASSES}
          mobileTitle={(r: any) => r.name}
          caption="Class list" />
        
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Grade 4 Acacia" subtitle="Class detail" />
          <div className="p-5 space-y-4">
            <dl className="grid grid-cols-2 gap-4">
              {[
              ['Class teacher', 'Mr. Brian Kimani'],
              ['Room', 'Block B · Rm 12'],
              ['Learners', '26'],
              ['Average', '74%']].
              map(([k, v]) =>
              <div key={k}>
                  <dt className="text-[12px] text-ink-muted">{k}</dt>
                  <dd className="text-[14px] font-medium text-ink">{v}</dd>
                </div>
              )}
            </dl>
            <div>
              <p className="text-[12.5px] text-ink-muted mb-1.5">Capacity</p>
              <Progress value={26 / 28 * 100} label="Capacity" />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Subject teachers — Grade 4 Acacia" />
          <ul className="divide-y divide-line">
            {TEACHERS.slice(0, 5).map((t) =>
            <li key={t.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[13.5px] font-medium text-ink">{t.name}</p>
                  <p className="text-[12.5px] text-ink-muted">{t.subjects.join(', ')}</p>
                </div>
                <Badge tone="neutral">{t.role}</Badge>
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>);

}