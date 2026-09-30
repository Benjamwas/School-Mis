import { CalendarDaysIcon, MapPinIcon } from 'lucide-react';
import { Badge, Button, Card, CardHeader, PageHeader } from '../../components/ui/primitives';
import { EVENTS } from '../../data/school';
import { useApiLive, useList } from '../../api/hooks';
import { useObject } from '../../api/hooks';
import { api } from '../../api/client';
import type { ApiEvent } from '../../api/types';

function titleCase(value?: string): string {
  if (!value) return 'Scheduled';
  return value.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function mapEvent(event: ApiEvent) {
  const start = new Date(event.start_time);
  const end = event.end_time ? new Date(event.end_time) : null;
  const validStart = !Number.isNaN(start.getTime());
  const validEnd = end && !Number.isNaN(end.getTime());
  const dateFormatter = new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', timeZone: 'Africa/Nairobi' });
  const timeFormatter = new Intl.DateTimeFormat('en-KE', { hour: 'numeric', minute: '2-digit', timeZone: 'Africa/Nairobi' });
  const time = validStart
    ? `${timeFormatter.format(start)}${validEnd ? ` – ${timeFormatter.format(end!)}` : ''}`
    : 'Time to be confirmed';
  return {
    id: event.id,
    title: event.title,
    date: validStart ? dateFormatter.format(start) : 'Date to be confirmed',
    time,
    type: event.event_type ? titleCase(event.event_type) : 'Event',
    location: event.venue ?? 'Venue to be confirmed',
    status: titleCase(event.status),
  };
}

export function ParentEvents() {
  const live = useApiLive();
  const events = useList<ApiEvent>('events/');
  const parent = useObject<{ full_name: string; person?: { email?: string; phone?: string } }>('/parents/me');
  const eventRows = live ? (events.data ?? []).map(mapEvent) : EVENTS;
  const register = async (eventId: string) => {
    if (!live) return;
    try {
      await api.post(`/events/${eventId}/register/`, {
        full_name: parent.data?.full_name || 'Parent visitor',
        email: parent.data?.person?.email || 'parent@example.com',
        phone: parent.data?.person?.phone || ''
      });
      window.alert('Your place has been requested.');
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Registration could not be completed.');
    }
  };
  return (
    <div>
      <PageHeader title="School calendar" subtitle="Term 3 · 2026 — events relevant to Grade 4 Acacia and Grade 1 Baobab." />

      {live && events.error && <p className="text-sm text-rose-600">{events.error}</p>}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader title="Upcoming events" subtitle={live ? `${events.data?.length ?? 0} event${events.data?.length === 1 ? '' : 's'} returned` : '5 events in the next six weeks'} />
          <ul className="divide-y divide-line">
            {eventRows.map((e) =>
            <li key={e.id} className="px-5 py-4 flex flex-wrap items-start gap-4">
                <div className="w-14 shrink-0 rounded-lg bg-forest-50 text-center py-2">
                  <span className="block text-[18px] font-semibold text-forest-800 leading-none">{e.date.split(' ')[0]}</span>
                  <span className="block text-[11px] uppercase text-forest-600 mt-1">{e.date.split(' ')[1]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[15px] font-medium text-ink">{e.title}</p>
                    <Badge tone="neutral">{e.type}</Badge>
                  </div>
                  <p className="mt-1 text-[13px] text-ink-muted flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1.5">
                      <CalendarDaysIcon size={14} /> {e.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPinIcon size={14} /> {e.location}
                    </span>
                  </p>
                </div>
                {e.type === 'Parent Event' &&
                 <Button size="sm" variant="secondary" onClick={() => void register(e.id)}>
                    Book a slot
                  </Button>
              }
              </li>
            )}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">Term dates</h3>
            <dl className="mt-3 divide-y divide-line text-[13.5px]">
              {[
              ['Term 3 begins', '1 September 2026'],
              ['Mid-term break', '9 – 13 October 2026'],
              ['Assessments', '20 – 30 October 2026'],
              ['Term 3 ends', '6 November 2026'],
              ['Term 1 2027 begins', '6 January 2027']].
              map(([k, v]) =>
              <div key={k} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-ink-muted">{k}</dt>
                  <dd className="font-medium text-ink">{v}</dd>
                </div>
              )}
            </dl>
          </Card>

          <Card className="p-5">
            <h3 className="text-[15px] font-semibold text-ink">Your RSVPs</h3>
            <ul className="mt-3 space-y-3 text-[13.5px]">
              <li className="flex items-center justify-between gap-3">
                <span className="text-ink">Consultation Day</span>
                <Badge tone="pending">Booking opens Monday</Badge>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-ink">Athletics Gala</span>
                <Badge tone="success">Attending</Badge>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-ink">Grade 5 Trip</span>
                <Badge tone="neutral">Not applicable</Badge>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>);

}
