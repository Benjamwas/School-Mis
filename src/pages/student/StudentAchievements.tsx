import React from 'react';
import { Badge, Card, CardHeader, PageHeader, Progress, cx } from '../../components/ui/primitives';
import { Icon } from '../../components/ui/icons';
import { ACHIEVEMENTS } from '../../data/academics';

export function StudentAchievements() {
  const earned = ACHIEVEMENTS.filter((a) => a.earned);
  const inProgress = ACHIEVEMENTS.filter((a) => !a.earned);

  return (
    <div>
      <PageHeader title="My achievements" subtitle={`${earned.length} badges earned · ${inProgress.length} in progress. Badges are awarded by your teachers and by the portal.`} />

      <Card className="p-6 bg-forest-800 border-forest-800 text-white">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-[12.5px] uppercase tracking-[0.1em] text-gold-300 font-semibold">This term</p>
            <p className="mt-1 font-serif text-[30px] leading-none">{earned.length} badges</p>
          </div>
          <div className="h-10 w-px bg-white/20 hidden sm:block" />
          <div>
            <p className="text-[13px] text-forest-100/80">Longest streak</p>
            <p className="text-[19px] font-semibold">9 days of on-time submissions</p>
          </div>
          <div className="h-10 w-px bg-white/20 hidden sm:block" />
          <div>
            <p className="text-[13px] text-forest-100/80">Class ranking for badges</p>
            <p className="text-[19px] font-semibold">4th of 26</p>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Earned" subtitle="Well done — these are yours" />
          <ul className="p-5 grid sm:grid-cols-2 gap-4">
            {earned.map((a) =>
            <li key={a.name} className="rounded-card border border-gold-200 bg-gold-50 p-4 text-center">
                <span className="mx-auto h-14 w-14 rounded-full bg-white grid place-items-center text-gold-600">
                  <Icon name={a.icon} size={24} />
                </span>
                <p className="mt-2.5 text-[14px] font-semibold text-ink">{a.name}</p>
                <p className="mt-0.5 text-[12.5px] text-ink-muted">{a.desc}</p>
                <Badge tone="success" className="mt-2">
                  Earned
                </Badge>
              </li>
            )}
          </ul>
        </Card>

        <Card>
          <CardHeader title="In progress" subtitle="Keep going — you are close on two of these" />
          <ul className="divide-y divide-line">
            {inProgress.map((a) =>
            <li key={a.name} className="px-5 py-4 flex items-center gap-4">
                <span className={cx('h-11 w-11 rounded-full grid place-items-center shrink-0', 'bg-cream text-ink-soft')}>
                  <Icon name={a.icon} size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-ink">{a.name}</p>
                  <p className="text-[12.5px] text-ink-muted">{a.desc}</p>
                  <Progress className="mt-2" value={a.progress} tone="gold" label={a.name} />
                </div>
                <span className="text-[13px] font-medium text-ink tabular-nums">{a.progress}%</span>
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>);

}