import React, { useState } from 'react';
import { DownloadIcon, SendIcon } from 'lucide-react';
import { Avatar, Badge, Button, Card, CardHeader, PageHeader, Stat } from '../../components/ui/primitives';
import { BarChartBlock, ChartFrame, DataTable, FilterSelect, LineChartBlock, Tabs } from '../../components/ui/data';
import { CLASS_SUBJECT_AVERAGES, SUBJECT_SCORES, TERM_TREND } from '../../data/academics';
import { STUDENTS } from '../../data/people';
import { useApp } from '../../contexts/AppContext';

const TABS = ['Assessments', 'Class results', 'Analysis'];

export function TeacherResults() {
  const { role, toast } = useApp();
  const [tab, setTab] = useState(TABS[0]);
  const [term, setTerm] = useState('Term 3 · 2026');
  const learners = STUDENTS.filter((s) => s.className === 'Grade 4');
  const subjectOnly = role === 'subjectteacher';

  return (
    <div>
      <PageHeader
        title={subjectOnly ? 'English results' : 'Assessments & results'}
        subtitle={subjectOnly ? 'Results for the classes you teach English to.' : 'Grade 4 Acacia — all subjects, all assessments this term.'}
        actions={
        <>
            <FilterSelect label="Term" value={term} onChange={setTerm} options={['Term 3 · 2026', 'Term 2 · 2026', 'Term 1 · 2026']} />
            <Button size="sm" variant="secondary" icon={<DownloadIcon size={15} />}>
              Export
            </Button>
            <Button size="sm" icon={<SendIcon size={15} />} onClick={() => toast({ tone: 'success', title: 'Results published', body: 'Parents can now see Term 3 results in the Parent Portal.' })}>
              Publish results
            </Button>
          </>
        } />
      

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Class average" value="74%" sub="Up 3 points from Term 2" tone="primary" />
        <Stat label="Highest" value="91%" sub="Wanjiru Kamau — English" />
        <Stat label="Below 60%" value="4 learners" sub="Support plans active" tone="gold" />
        <Stat label="Assessments recorded" value={subjectOnly ? 6 : 18} sub="This term" />
      </div>

      <div className="mt-6 mb-6">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {tab === 'Assessments' &&
      <Card>
          <CardHeader title="Recorded assessments" subtitle={term} />
          <DataTable
          columns={[
          { key: 'name', header: 'Assessment', render: (r: any) => <span className="font-medium">{r.name}</span> },
          { key: 'subject', header: 'Subject', hideOnMobile: true },
          { key: 'date', header: 'Date' },
          { key: 'marks', header: 'Out of', align: 'right' },
          { key: 'avg', header: 'Class avg', align: 'right', render: (r: any) => <Badge tone={r.avg < 60 ? 'warning' : 'success'}>{r.avg}%</Badge> }]
          }
          rows={[
          { name: 'Fractions topic quiz', subject: 'Mathematics', date: '18 Sep 2026', marks: 10, avg: 58 },
          { name: 'Comprehension assessment', subject: 'English', date: '15 Sep 2026', marks: 20, avg: 79 },
          { name: 'Insha ya mwisho wa juma', subject: 'Kiswahili', date: '12 Sep 2026', marks: 20, avg: 71 },
          { name: 'Energy sorting task', subject: 'Science & Technology', date: '09 Sep 2026', marks: 10, avg: 74 },
          { name: 'Map work assessment', subject: 'Social Studies', date: '05 Sep 2026', marks: 15, avg: 68 }].
          filter((r) => subjectOnly ? r.subject === 'English' : true)}
          caption="Recorded assessments" />
        
        </Card>
      }

      {tab === 'Class results' &&
      <Card>
          <CardHeader title="Learner results" subtitle={term} />
          <DataTable
          columns={[
          {
            key: 'name',
            header: 'Learner',
            render: (r: any) =>
            <span className="flex items-center gap-2.5">
                    <Avatar initials={r.avatarInitials} size="sm" />
                    <span className="font-medium">{r.name}</span>
                  </span>

          },
          { key: 'eng', header: 'English', align: 'right', render: () => '79%' },
          { key: 'kis', header: 'Kiswahili', align: 'right', render: () => '72%', hideOnMobile: true },
          { key: 'mat', header: 'Maths', align: 'right', render: (r: any) => r.id === 's1' ? '55%' : '68%', hideOnMobile: true },
          { key: 'sci', header: 'Science', align: 'right', render: () => '75%', hideOnMobile: true },
          { key: 'avg', header: 'Average', align: 'right', render: (r: any) => <Badge tone={r.id === 's1' ? 'warning' : 'success'}>{r.id === 's1' ? '68%' : '74%'}</Badge> }]
          }
          rows={learners}
          mobileTitle={(r: any) => r.name}
          caption="Learner results" />
        
        </Card>
      }

      {tab === 'Analysis' &&
      <div className="grid gap-6 lg:grid-cols-2">
          <ChartFrame title="Subject averages" subtitle="Class vs top quartile">
            <BarChartBlock
            data={subjectOnly ? CLASS_SUBJECT_AVERAGES.slice(0, 1) : CLASS_SUBJECT_AVERAGES}
            xKey="subject"
            bars={[
            { key: 'classAvg', name: 'Class', color: '#1F5E43' },
            { key: 'average', name: 'Top quartile', color: '#D4A23A' }]
            } />
          
          </ChartFrame>
          <ChartFrame title="Class average over time" subtitle="Six terms">
            <LineChartBlock data={TERM_TREND} xKey="term" lines={[{ key: 'average', name: 'Class average', color: '#1F5E43' }]} />
          </ChartFrame>
          <Card className="lg:col-span-2">
            <CardHeader title="Topic-level insight" subtitle="Where the class is losing marks" />
            <ul className="divide-y divide-line">
              {SUBJECT_SCORES.map((s) =>
            <li key={s.subject} className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-medium text-ink">{s.subject}</p>
                    <p className="text-[12.5px] text-ink-muted">{s.comment}</p>
                  </div>
                  <Badge tone={s.score < 60 ? 'warning' : 'success'}>Class {s.score}%</Badge>
                </li>
            )}
            </ul>
          </Card>
        </div>
      }
    </div>);

}