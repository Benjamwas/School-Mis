import React, { useState } from 'react';
import { DownloadIcon, PrinterIcon } from 'lucide-react';
import { Button, Card, CardHeader, PageHeader, Stat } from '../../components/ui/primitives';
import { BarChartBlock, ChartFrame, DataTable, FilterSelect, LineChartBlock, Tabs } from '../../components/ui/data';
import { CLASS_ATTENDANCE_TREND, CLASS_SUBJECT_AVERAGES, TERM_TREND } from '../../data/academics';
import { COLLECTIONS_TREND, STUDENT_BALANCES, formatKES } from '../../data/finance';
import { PIPELINE_COUNTS } from '../../data/crm';
import { STAFF_LEAVE_QUEUE } from '../../data/hr';
import { useApiLive, useObject } from '../../api/hooks';
import type { ApiReportDef, ApiReportTable } from '../../api/types';

const TABS = ['Academic', 'Attendance', 'Finance', 'Admissions', 'HR'];

const REPORT_BY_TAB: Record<string, string> = {
  Academic: 'performance',
  Attendance: 'attendance_summary',
  Finance: 'fee_balance',
  Admissions: 'lead_pipeline',
  HR: 'staff_roster'
};

const REPORT_TITLES: Record<string, string> = {
  performance: 'Subject performance',
  attendance_summary: 'Absence summary',
  fee_balance: 'Fee balances',
  lead_pipeline: 'Admissions pipeline',
  staff_roster: 'Staff roster'
};

function LiveReportTable({ table, title, caption }: { table: ApiReportTable | null; title: string; caption: string }) {
  const columns = (table?.columns ?? []).map((c, i) => ({
    key: `c${i}`,
    header: String(c),
    align: 'right' as const
  }));
  const rows = (table?.rows ?? []).map((r) => {
    const row: Record<string, string | number> = { key: r.join('|') };
    columns.forEach((c, i) => { row[c.key] = r[i]; });
    return row;
  });
  return (
    <Card className="mb-6">
      <CardHeader
        title={title}
        subtitle={table?.summary
          ? Object.entries(table.summary).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(' · ')
          : undefined} />
      <DataTable
        columns={columns.map((c, i) => (i === 0
          ? { key: c.key, header: c.header, render: (r: any) => <span className="font-medium">{String(r[c.key] ?? '')}</span> }
          : c))}
        rows={rows}
        mobileTitle={(r: any) => String(r[columns[0]?.key] ?? '')}
        caption={caption} />
    </Card>
  );
}

export function AdminReports() {
  const [tab, setTab] = useState(TABS[0]);
  const [term, setTerm] = useState('Term 3 · 2026');
  const [klass, setKlass] = useState('All classes');

  const live = useApiLive();
  const defs = useObject<ApiReportDef>('reports/');
  const academicReport = useObject<ApiReportTable>(`reports/${REPORT_BY_TAB.Academic}/`);
  const attendanceReport = useObject<ApiReportTable>(`reports/${REPORT_BY_TAB.Attendance}/`);
  const financeReport = useObject<ApiReportTable>(`reports/${REPORT_BY_TAB.Finance}/`);
  const admissionsReport = useObject<ApiReportTable>(`reports/${REPORT_BY_TAB.Admissions}/`);
  const hrReport = useObject<ApiReportTable>(`reports/${REPORT_BY_TAB.HR}/`);

  const reportFor = (key: string) => {
    if (key === 'Academic') return academicReport;
    if (key === 'Attendance') return attendanceReport;
    if (key === 'Finance') return financeReport;
    if (key === 'Admissions') return admissionsReport;
    return hrReport;
  };

  const active = reportFor(tab);
  const reportError = defs.error ?? active.error;
  const available = defs.data?.reports ?? [];

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Filtered, exportable reporting across academics, attendance, finance, admissions and HR."
        actions={
        <>
            <FilterSelect label="Term" value={term} onChange={setTerm} options={['Term 3 · 2026', 'Term 2 · 2026', 'Term 1 · 2026']} />
            <FilterSelect label="Class" value={klass} onChange={setKlass} options={['All classes', 'Grade 4 Acacia', 'Grade 5 Acacia', 'Grade 6 Cedar']} />
            <Button size="sm" variant="secondary" icon={<DownloadIcon size={15} />}>
              Export
            </Button>
            <Button size="sm" variant="ghost" icon={<PrinterIcon size={15} />} onClick={() => window.print()}>
              Print
            </Button>
          </>
        } />
      

      <div className="mb-6">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {live && reportError &&
      <p className="mb-4 text-sm text-rose-600">{reportError}</p>
      }

      {live &&
      <LiveReportTable
        table={active.data}
        title={`${REPORT_TITLES[REPORT_BY_TAB[tab]]} — ${REPORT_BY_TAB[tab]}`}
        caption={REPORT_TITLES[REPORT_BY_TAB[tab]]} />
      }
      {live && available.length > 0 &&
      <p className="mb-6 text-[12.5px] text-ink-muted">{available.length} reports available on the backend.</p>
      }

      {tab === 'Academic' &&
      <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <Stat label="School average" value="74%" sub="+3 on Term 2" tone="primary" />
            <Stat label="Best subject" value="Creative Arts" sub="84% average" />
            <Stat label="Weakest subject" value="Mathematics" sub="64% average" tone="gold" />
            <Stat label="Learners below 60%" value="147" sub="Support plans active" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartFrame title="Subject performance" subtitle={term}>
              <BarChartBlock data={CLASS_SUBJECT_AVERAGES} xKey="subject" bars={[{ key: 'classAvg', name: 'Average %', color: '#1F5E43' }]} />
            </ChartFrame>
            <ChartFrame title="Performance over time" subtitle="Six terms">
              <LineChartBlock data={TERM_TREND} xKey="term" lines={[{ key: 'average', name: 'School average', color: '#1F5E43' }]} />
            </ChartFrame>
          </div>
        </div>
      }

      {tab === 'Attendance' &&
      <div className="space-y-6">
          <ChartFrame title="Attendance rate" subtitle="School-wide monthly">
            <BarChartBlock data={CLASS_ATTENDANCE_TREND} xKey="month" bars={[{ key: 'rate', name: 'Attendance %', color: '#1F5E43' }]} />
          </ChartFrame>
          <Card className={live ? 'hidden' : undefined}>
            <CardHeader title="Absence summary by class" subtitle={term} />
            <DataTable
            columns={[
            { key: 'cls', header: 'Class', render: (r: any) => <span className="font-medium">{r.cls}</span> },
            { key: 'rate', header: 'Rate', align: 'right' },
            { key: 'absences', header: 'Absences', align: 'right' },
            { key: 'late', header: 'Late', align: 'right', hideOnMobile: true }]
            }
            rows={[
            { cls: 'Grade 4 Acacia', rate: '96%', absences: 24, late: 11 },
            { cls: 'Grade 5 Acacia', rate: '94%', absences: 31, late: 14 },
            { cls: 'Grade 6 Cedar', rate: '97%', absences: 18, late: 7 },
            { cls: 'Grade 3 Baobab', rate: '95%', absences: 26, late: 9 }]
            }
            caption="Absence summary" />
          
          </Card>
        </div>
      }

      {tab === 'Finance' &&
      <div className="space-y-6">
          <ChartFrame title="Collections vs target" subtitle="KES millions">
            <BarChartBlock
            data={COLLECTIONS_TREND}
            xKey="month"
            bars={[
            { key: 'collected', name: 'Collected', color: '#1F5E43' },
            { key: 'target', name: 'Target', color: '#B9D7C6' }]
            } />
          
          </ChartFrame>
          <Card className={live ? 'hidden' : undefined}>
            <CardHeader title="Outstanding balances" subtitle={term} />
            <DataTable
            columns={[
            { key: 'student', header: 'Learner', render: (r: any) => <span className="font-medium">{r.student}</span> },
            { key: 'className', header: 'Class', hideOnMobile: true },
            { key: 'billed', header: 'Billed', align: 'right', render: (r: any) => formatKES(r.billed) },
            { key: 'paid', header: 'Paid', align: 'right', render: (r: any) => formatKES(r.paid) },
            { key: 'balance', header: 'Balance', align: 'right', render: (r: any) => formatKES(r.balance) }]
            }
            rows={STUDENT_BALANCES.filter((b) => b.balance > 0)}
            caption="Outstanding balances" />
          
          </Card>
        </div>
      }

      {tab === 'Admissions' &&
      <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <Stat label="Enquiries" value="148" sub="This intake" tone="primary" />
            <Stat label="Applications" value="24" sub="16% of enquiries" />
            <Stat label="Offers" value="11" sub="46% of applications" tone="gold" />
            <Stat label="Enrolled" value="9" sub="82% offer acceptance" />
          </div>
          <ChartFrame title="Pipeline conversion" subtitle="Leads by stage">
            <BarChartBlock data={PIPELINE_COUNTS} xKey="stage" bars={[{ key: 'count', name: 'Leads', color: '#D4A23A' }]} />
          </ChartFrame>
        </div>
      }

      {tab === 'HR' &&
      <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <Stat label="Staff attendance" value="97.8%" sub="September" tone="primary" />
            <Stat label="Leave days taken" value="112" sub="Year to date" />
            <Stat label="Payroll (monthly)" value={formatKES(7840000)} sub="Gross" tone="gold" />
            <Stat label="Open tickets" value="2" sub="Average 1.4 days to close" />
          </div>
          <Card className={live ? 'hidden' : undefined}>
            <CardHeader title="Leave register" subtitle="Current requests" />
            <DataTable
            columns={[
            { key: 'staff', header: 'Staff', render: (r: any) => <span className="font-medium">{r.staff}</span> },
            { key: 'type', header: 'Type' },
            { key: 'dates', header: 'Dates' },
            { key: 'days', header: 'Days', align: 'right' },
            { key: 'status', header: 'Status' }]
            }
            rows={STAFF_LEAVE_QUEUE}
            caption="Leave register" />
          
          </Card>
        </div>
      }
    </div>);

}