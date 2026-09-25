import React from 'react';
import { Badge, Card, CardHeader, PageHeader, Progress, Stat } from '../../components/ui/primitives';
import { AreaChartBlock, BarChartBlock, ChartFrame, DataTable } from '../../components/ui/data';
import { ATTENDANCE_SUMMARY, CLASS_SUBJECT_AVERAGES, RECOMMENDED_TOPICS, SUBJECT_SCORES, SUBJECT_TOPICS, TERM_TREND } from '../../data/academics';

export function StudentProgress() {
  const average = Math.round(SUBJECT_SCORES.reduce((a, s) => a + s.score, 0) / SUBJECT_SCORES.length);

  return (
    <div>
      <PageHeader title="My progress" subtitle="Term 3 · 2026 — how you are doing across every subject." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Term average" value={`${average}%`} sub="Up 2 points from Term 2" tone="primary" />
        <Stat label="Best subject" value="English 91%" sub="Reading fluency and expression" />
        <Stat label="Focus subject" value="Maths 55%" sub="Fractions support plan active" tone="gold" />
        <Stat label="Attendance" value={`${ATTENDANCE_SUMMARY.percentage}%`} sub={`${ATTENDANCE_SUMMARY.present} days present`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartFrame title="My average over time" subtitle="Last six terms">
          <AreaChartBlock data={TERM_TREND} xKey="term" areaKey="average" name="Average %" />
        </ChartFrame>
        <ChartFrame title="Me vs my class" subtitle="Average score by subject">
          <BarChartBlock
            data={CLASS_SUBJECT_AVERAGES}
            xKey="subject"
            bars={[
            { key: 'average', name: 'Me', color: '#1F5E43' },
            { key: 'classAvg', name: 'Class', color: '#D4A23A' }]
            } />
          
        </ChartFrame>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader title="Results this term" />
          <DataTable
            columns={[
            { key: 'subject', header: 'Subject', render: (r: any) => <span className="font-medium">{r.subject}</span> },
            { key: 'score', header: 'Score', align: 'right', render: (r: any) => `${r.score}%` },
            { key: 'previous', header: 'Last term', align: 'right', render: (r: any) => `${r.previous}%`, hideOnMobile: true },
            { key: 'grade', header: 'Grade', render: (r: any) => <Badge tone={r.score < 60 ? 'warning' : 'success'}>{r.grade}</Badge> },
            { key: 'teacher', header: 'Teacher', hideOnMobile: true }]
            }
            rows={SUBJECT_SCORES}
            caption="Results this term" />
          
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Topic completion" />
            <ul className="divide-y divide-line">
              {SUBJECT_TOPICS.map((s) =>
              <li key={s.subject} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13.5px] text-ink">{s.subject}</span>
                    <span className="text-[13px] font-medium text-ink tabular-nums">{s.progress}%</span>
                  </div>
                  <Progress className="mt-1.5" value={s.progress} label={s.subject} />
                </li>
              )}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Suggested next steps" subtitle="Based on your quizzes and assignments" />
            <ul className="divide-y divide-line">
              {RECOMMENDED_TOPICS.slice(0, 4).map((r) =>
              <li key={r.topic} className="px-5 py-3">
                  <p className="text-[13.5px] font-medium text-ink">{r.topic}</p>
                  <p className="text-[12.5px] text-ink-muted mt-0.5">{r.activity}</p>
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>);

}