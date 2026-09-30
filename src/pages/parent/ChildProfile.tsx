import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2Icon, DownloadIcon, LightbulbIcon, MessageSquareIcon, TargetIcon } from 'lucide-react';
import { Avatar, Badge, Button, Card, CardHeader, PageHeader, Progress, StatusBadge, cx } from '../../components/ui/primitives';
import { BarChartBlock, ChartFrame, DataTable, LineChartBlock, Tabs } from '../../components/ui/data';
import { Alert, EmptyState } from '../../components/ui/feedback';
import {
  ASSIGNMENTS,
  ATTENDANCE_DAYS,
  ATTENDANCE_SUMMARY,
  CLASS_SUBJECT_AVERAGES,
  RECOMMENDED_TOPICS,
  STRENGTHS,
  SUBJECT_SCORES,
  SUPPORT_AREAS,
  TERM,
  TERM_TREND } from
'../../data/academics';
import { STUDENTS, TEACHERS } from '../../data/people';
import { useApiLive, useDetail, useObject } from '../../api/hooks';
import type { ApiStudent } from '../../api/types';

const TABS = ['Overview', 'Academics', 'Personalised learning', 'Assignments', 'Attendance', 'Results', 'Communication'];

export function ChildProfile() {
  const { id = 's1', tab = 'Overview' } = useParams();
  const navigate = useNavigate();
  const live = useApiLive();
  const studentRes = useDetail<ApiStudent>('/students/', id);
  const attendanceRes = useObject<Record<string, number>>(`/students/${id}/attendance/`);
  const academicRes = useObject<Record<string, unknown>>(`/students/${id}/academic_summary/`);
  const average = Math.round(SUBJECT_SCORES.reduce((a, s) => a + s.score, 0) / SUBJECT_SCORES.length);
  const demoChild = STUDENTS.find((s) => s.id === id) ?? STUDENTS[0];
  const child = live && studentRes.data ? {
    ...demoChild,
    id: studentRes.data.id,
    name: studentRes.data.full_name,
    admissionNo: studentRes.data.admission_number,
    className: studentRes.data.current_class_name ?? demoChild.className,
    status: studentRes.data.status
  } : demoChild;
  const liveAverage = academicRes.data?.subject_performance as { total_score?: string }[] | undefined;
  const averageValue = liveAverage?.length ? Math.round(liveAverage.reduce((sum, result) => sum + Number(result.total_score ?? 0), 0) / liveAverage.length) : average;
  const attendanceValue = attendanceRes.data?.percentage ?? ATTENDANCE_SUMMARY.percentage;

  return (
    <div>
      <PageHeader
        title={child.name}
        subtitle={`${child.className} ${child.stream} · Admission ${child.admissionNo} · Class teacher ${TEACHERS[0].name}`}
        actions={
        <>
            <Button variant="secondary" size="sm" icon={<MessageSquareIcon size={15} />} onClick={() => navigate('/parent/messages')}>
              Message teacher
            </Button>
            <Button size="sm" icon={<DownloadIcon size={15} />}>
              Download report
            </Button>
          </>
        } />
      

      <div className="mb-6">
        <Tabs tabs={TABS} active={tab} onChange={(t) => navigate(`/parent/child/${child.id}/${t}`)} />
      </div>

      {tab === 'Overview' &&
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <Card className="p-5">
              <div className="flex items-start gap-4">
                <Avatar initials={child.avatarInitials} size="lg" />
                <div>
                  <h2 className="font-serif text-[22px] text-ink">{child.name}</h2>
                  <p className="text-[13px] text-ink-muted">
                    {child.age} years old · {child.gender} · {TERM}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <StatusBadge status={child.status} />
                    <Badge tone="info">House: Baobab</Badge>
                  </div>
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-line pt-4">
                {[
               ['Term average', `${averageValue}%`],
              ['Class position', '9 of 26'],
               ['Attendance', `${attendanceValue}%`],
              ['Assignments on time', '9 of 11']].
              map(([k, v]) =>
              <div key={k}>
                    <dt className="text-[12px] text-ink-muted">{k}</dt>
                    <dd className="text-[18px] font-semibold text-ink tabular-nums">{v}</dd>
                  </div>
              )}
              </dl>
            </Card>

            <ChartFrame title="Subject performance" subtitle="Your child compared with the class average">
              <BarChartBlock
              data={CLASS_SUBJECT_AVERAGES}
              xKey="subject"
              bars={[
              { key: 'average', name: child.name.split(' ')[0], color: '#1F5E43' },
              { key: 'classAvg', name: 'Class average', color: '#D4A23A' }]
              } />
            
            </ChartFrame>

            <Card>
              <CardHeader title="Recent teacher comments" />
              <ul className="divide-y divide-line">
                {SUBJECT_SCORES.slice(0, 4).map((s) =>
              <li key={s.subject} className="px-5 py-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[14px] font-medium text-ink">{s.subject}</p>
                      <span className="text-[13px] text-ink-muted">{s.teacher}</span>
                    </div>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-ink-muted">{s.comment}</p>
                  </li>
              )}
              </ul>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="text-[15px] font-semibold text-ink flex items-center gap-2">
                <CheckCircle2Icon size={17} className="text-forest-600" /> Strengths
              </h3>
              <ul className="mt-3 space-y-2 text-[13.5px] text-ink-muted">
                {STRENGTHS.map((s) =>
              <li key={s}>· {s}</li>
              )}
              </ul>
            </Card>
            <Card className="p-5">
              <h3 className="text-[15px] font-semibold text-ink flex items-center gap-2">
                <TargetIcon size={17} className="text-gold-500" /> Areas to improve
              </h3>
              <ul className="mt-3 space-y-2 text-[13.5px] text-ink-muted">
                {SUPPORT_AREAS.map((s) =>
              <li key={s}>· {s}</li>
              )}
              </ul>
              <Button variant="secondary" size="sm" full className="mt-4" onClick={() => navigate(`/parent/child/${child.id}/Personalised learning`)}>
                See the support plan
              </Button>
            </Card>
          </div>
        </div>
      }

      {tab === 'Academics' &&
      <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartFrame title="Performance trend" subtitle="Six-term average">
              <LineChartBlock data={TERM_TREND} xKey="term" lines={[{ key: 'average', name: 'Average %', color: '#1F5E43' }]} />
            </ChartFrame>
            <ChartFrame title="This term vs last term" subtitle="Change by subject">
              <BarChartBlock
              data={SUBJECT_SCORES.map((s) => ({ subject: s.subject.split(' ')[0], now: s.score, before: s.previous }))}
              xKey="subject"
              bars={[
              { key: 'before', name: 'Term 2', color: '#B9D7C6' },
              { key: 'now', name: 'Term 3', color: '#1F5E43' }]
              } />
            
            </ChartFrame>
          </div>

          <Card>
            <CardHeader title="Subject detail" subtitle={TERM} />
            <ul className="divide-y divide-line">
              {SUBJECT_SCORES.map((s) => {
              const delta = s.score - s.previous;
              return (
                <li key={s.subject} className="px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[14.5px] font-medium text-ink">{s.subject}</p>
                        <p className="text-[12.5px] text-ink-muted">{s.teacher}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={cx('text-[13px] font-medium', delta >= 0 ? 'text-forest-700' : 'text-red-600')}>
                          {delta >= 0 ? '+' : ''}
                          {delta} pts
                        </span>
                        <span className="text-[17px] font-semibold text-ink tabular-nums">{s.score}%</span>
                        <Badge tone={s.score < 60 ? 'warning' : 'success'}>Grade {s.grade}</Badge>
                      </div>
                    </div>
                    <Progress className="mt-3" value={s.score} tone={s.score < 60 ? 'gold' : 'forest'} label={s.subject} />
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">{s.comment}</p>
                  </li>);

            })}
            </ul>
          </Card>
        </div>
      }

      {tab === 'Personalised learning' &&
      <div className="space-y-6">
          <Alert tone="info" title="How this is built">
            Recommendations come from quiz results, assignment scores and topic mastery recorded by your child’s teachers. They update weekly.
          </Alert>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-5">
              <h3 className="text-[15px] font-semibold text-ink">Doing well</h3>
              <ul className="mt-3 space-y-2.5">
                {STRENGTHS.map((s) =>
              <li key={s} className="flex gap-2.5 text-[13.5px] text-ink-muted">
                    <CheckCircle2Icon size={16} className="mt-0.5 shrink-0 text-forest-600" />
                    {s}
                  </li>
              )}
              </ul>
            </Card>
            <Card className="p-5">
              <h3 className="text-[15px] font-semibold text-ink">Needs support</h3>
              <ul className="mt-3 space-y-2.5">
                {SUPPORT_AREAS.map((s) =>
              <li key={s} className="flex gap-2.5 text-[13.5px] text-ink-muted">
                    <TargetIcon size={16} className="mt-0.5 shrink-0 text-gold-500" />
                    {s}
                  </li>
              )}
              </ul>
            </Card>
          </div>

          <Card>
            <CardHeader title="Recommended topics" subtitle="Five topics, ordered by the difference they will make this term" />
            <ul className="divide-y divide-line">
              {RECOMMENDED_TOPICS.map((r) =>
            <li key={r.topic} className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14.5px] font-medium text-ink flex items-center gap-2">
                        <LightbulbIcon size={16} className="text-gold-500 shrink-0" />
                        {r.topic}
                      </p>
                      <p className="text-[12.5px] text-ink-muted mt-0.5">{r.subject}</p>
                    </div>
                    <span className="text-[13px] text-ink-muted tabular-nums">{r.progress}% mastered</span>
                  </div>
                  <Progress className="mt-3" value={r.progress} tone={r.progress < 50 ? 'gold' : 'forest'} label={r.topic} />
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-muted">
                    <span className="font-medium text-ink">Why: </span>
                    {r.reason}
                  </p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-muted">
                    <span className="font-medium text-ink">Recommended: </span>
                    {r.activity}
                  </p>
                </li>
            )}
            </ul>
          </Card>
        </div>
      }

      {tab === 'Assignments' &&
      <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            {[
          ['Upcoming', ASSIGNMENTS.filter((a) => a.status === 'Not Started' || a.status === 'In Progress').length],
          ['Submitted', ASSIGNMENTS.filter((a) => a.status === 'Submitted').length],
          ['Graded', ASSIGNMENTS.filter((a) => a.status === 'Graded').length],
          ['Late', ASSIGNMENTS.filter((a) => a.status === 'Late').length]].
          map(([k, v]) =>
          <Card key={k as string} className="p-4">
                <p className="text-[12.5px] text-ink-muted">{k}</p>
                <p className="text-[22px] font-semibold text-ink tabular-nums">{v as number}</p>
              </Card>
          )}
          </div>

          <Card>
            <CardHeader title="All assignments" subtitle={TERM} />
            <DataTable
            columns={[
            { key: 'title', header: 'Assignment', render: (r: any) => <span className="font-medium">{r.title}</span> },
            { key: 'subject', header: 'Subject' },
            { key: 'teacher', header: 'Teacher', hideOnMobile: true },
            { key: 'due', header: 'Due' },
            { key: 'status', header: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
            { key: 'score', header: 'Score', align: 'right', render: (r: any) => r.score != null ? `${r.score}/${r.marks}` : '—' }]
            }
            rows={ASSIGNMENTS}
            caption="Assignments for this term" />
          
          </Card>

          <Card>
            <CardHeader title="Teacher feedback" />
            <ul className="divide-y divide-line">
              {ASSIGNMENTS.filter((a) => a.feedback).map((a) =>
            <li key={a.id} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[14px] font-medium text-ink">{a.title}</p>
                    <span className="text-[13px] font-semibold text-ink tabular-nums">
                      {a.score}/{a.marks}
                    </span>
                  </div>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-muted">{a.feedback}</p>
                  <p className="mt-1 text-[12px] text-ink-soft">{a.teacher}</p>
                </li>
            )}
            </ul>
          </Card>
        </div>
      }

      {tab === 'Attendance' &&
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">September 2026</h3>
            <div className="mt-4 grid grid-cols-7 gap-1.5">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) =>
            <span key={i} className="text-center text-[11px] font-medium text-ink-soft">
                  {d}
                </span>
            )}
              {ATTENDANCE_DAYS.map((d) => {
              const style =
              d.status === 'present' ?
              'bg-forest-50 text-forest-800 border-forest-200' :
              d.status === 'absent' ?
              'bg-red-50 text-red-700 border-red-200' :
              d.status === 'late' ?
              'bg-gold-50 text-gold-600 border-gold-200' :
              'bg-cream text-ink-soft border-line';
              return (
                <span key={d.day} className={cx('aspect-square rounded-md border grid place-items-center text-[12px] font-medium', style)} title={`${d.day} September — ${d.status}`}>
                    {d.day}
                  </span>);

            })}
            </div>
            <ul className="mt-4 flex flex-wrap gap-4 text-[12.5px] text-ink-muted">
              {[
            ['Present', 'bg-forest-200'],
            ['Absent', 'bg-red-300'],
            ['Late', 'bg-gold-300'],
            ['No school', 'bg-line']].
            map(([l, c]) =>
            <li key={l} className="flex items-center gap-1.5">
                  <span className={cx('h-2.5 w-2.5 rounded-sm', c)} /> {l}
                </li>
            )}
            </ul>
          </Card>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[
            ['Attendance rate', `${ATTENDANCE_SUMMARY.percentage}%`],
            ['Days present', ATTENDANCE_SUMMARY.present],
            ['Days absent', ATTENDANCE_SUMMARY.absent],
            ['Late arrivals', ATTENDANCE_SUMMARY.late]].
            map(([k, v]) =>
            <Card key={k as string} className="p-4">
                  <p className="text-[12.5px] text-ink-muted">{k}</p>
                  <p className="text-[22px] font-semibold text-ink tabular-nums">{v as any}</p>
                </Card>
            )}
            </div>
            <Card>
              <CardHeader title="Attendance history" />
              <ul className="divide-y divide-line">
                {[
              ['Wed, 23 Sep', 'Absent', 'Reported by parent — medical appointment'],
              ['Fri, 18 Sep', 'Late', 'Arrived 8:14am — traffic on Kiambu Road'],
              ['Fri, 11 Sep', 'Late', 'Arrived 8:05am'],
              ['Fri, 04 Sep', 'Absent', 'Unwell — no note received']].
              map(([d, s, n]) =>
              <li key={d} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[13.5px] font-medium text-ink">{d}</p>
                      <p className="text-[12.5px] text-ink-muted">{n}</p>
                    </div>
                    <StatusBadge status={s} />
                  </li>
              )}
              </ul>
            </Card>
          </div>
        </div>
      }

      {tab === 'Results' &&
      <div className="space-y-6">
          <Card>
            <CardHeader
            title="Term 3 · 2026 report"
            subtitle="Released 6 November 2026"
            action={
            <Button variant="secondary" size="sm" icon={<DownloadIcon size={15} />}>
                  Download PDF
                </Button>
            } />
          
            <DataTable
            columns={[
            { key: 'subject', header: 'Subject', render: (r: any) => <span className="font-medium">{r.subject}</span> },
            { key: 'score', header: 'Score', align: 'right', render: (r: any) => `${r.score}%` },
            { key: 'previous', header: 'Last term', align: 'right', render: (r: any) => `${r.previous}%`, hideOnMobile: true },
            { key: 'grade', header: 'Grade', render: (r: any) => <Badge tone={r.score < 60 ? 'warning' : 'success'}>{r.grade}</Badge> },
            { key: 'comment', header: 'Teacher comment', hideOnMobile: true }]
            }
            rows={SUBJECT_SCORES}
            caption="Term 3 results" />
          
            <div className="px-5 py-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13.5px] text-ink-muted">
                Overall average <span className="font-semibold text-ink">{average}%</span> · Class position 9 of 26 · Grade B+
              </p>
              <span className="text-[13px] text-ink-muted">Class teacher: {TEACHERS[0].name}</span>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">Class teacher’s comment</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
              Wanjiru has had a strong term in language and the arts, and her science practicals are consistently among the best in the class. Mathematics
              remains the priority: she understands the methods but loses accuracy under time pressure. The fractions support plan starts next week and I would
              like to see ten minutes of tables practice at home each evening.
            </p>
            <p className="mt-3 text-[13px] text-ink-soft">{TEACHERS[0].name} · 6 November 2026</p>
          </Card>

          <Card>
            <CardHeader title="Previous terms" />
            <ul className="divide-y divide-line">
              {[
            ['Term 2 · 2026', '76%', 'Grade B+', '11 of 26'],
            ['Term 1 · 2026', '72%', 'Grade B', '13 of 26'],
            ['Term 3 · 2025', '70%', 'Grade B', '14 of 25']].
            map(([t, a, g, p]) =>
            <li key={t} className="px-5 py-3 flex items-center justify-between gap-3">
                  <span className="text-[13.5px] font-medium text-ink">{t}</span>
                  <span className="flex items-center gap-4 text-[13px] text-ink-muted">
                    <span className="tabular-nums">{a}</span>
                    <Badge tone="neutral">{g}</Badge>
                    <span className="hidden sm:inline">Position {p}</span>
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

      {tab === 'Communication' &&
      <Card>
          <CardHeader title="Conversations about this child" subtitle="Messages between you and your child’s teachers" />
          <EmptyState
          icon={<MessageSquareIcon size={22} />}
          title="No messages about Wanjiru yet"
          body="Start a conversation with the class teacher or a subject teacher. Replies usually arrive within one school day."
          action={
          <Button size="sm" onClick={() => navigate('/parent/messages')}>
                Message a teacher
              </Button>
          } />
        
        </Card>
      }
    </div>);

}
