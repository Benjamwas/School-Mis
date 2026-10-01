import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import api from '../api';
import type { Event } from '../types';

function formatDate(d: string) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return d;
  }
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get('/events?status=published')
      .then((res) => setEvents(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full pt-20">
      <section className="relative py-20 bg-gray-100">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">School Events</h1>
            <p className="text-xl text-gray-600">
              Stay connected with what's happening across our campuses.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No upcoming events right now. Check back soon!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 overflow-hidden">
                    {event.image && (
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h2>
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
                      className="inline-block px-4 py-2 border border-red-600 text-red-600 rounded-md text-sm font-medium hover:bg-red-600 hover:text-white transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
