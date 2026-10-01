import { useEffect, useState } from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
import api from '../../api';
import type { Event } from '../../types';

function formatDate(d: string) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return d;
  }
}

const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    api.get('/events?status=published&featured=true&limit=3')
      .then((res) => {
        if (res.data.length < 3) {
          return api.get('/events?status=published&limit=3').then((r) => setEvents(r.data));
        }
        setEvents(res.data);
      })
      .catch(() => setEvents([]));
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionTitle title="Upcoming Events" subtitle="Stay connected with what's happening across our campuses with these upcoming events and activities." center />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                {event.image && (
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2 text-red-600" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  {event.time && (
                    <div className="flex items-center text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-2 text-red-600" />
                      <span>{event.time}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2 text-red-600" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                <Link
                  to={`/events/${event.slug}`}
                  className="inline-block px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button href="/events" variant="primary">View All Events</Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
