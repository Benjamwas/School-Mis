import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarIcon, ClockIcon, MapPinIcon, ArrowLeft } from 'lucide-react';
import api from '../api';
import type { Event } from '../types';

function formatDate(d: string) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return d;
  }
}

const EventDetail = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/events/${slug}`)
      .then((res) => setEvent(res.data))
      .catch(() => setError('Event not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="w-full pt-32 text-center text-gray-500">Loading...</div>;
  if (error || !event) {
    return (
      <div className="w-full pt-32 text-center">
        <p className="text-gray-600 mb-4">{error || 'Event not found'}</p>
        <Link to="/events" className="text-red-600 hover:text-red-700">← Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="w-full pt-20">
      {event.image && (
        <div className="h-64 md:h-96 overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="container mx-auto px-4 py-12">
        <Link to="/events" className="inline-flex items-center text-red-600 hover:text-red-700 mb-6 text-sm font-medium">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Events
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">{event.title}</h1>
        <div className="flex flex-wrap gap-6 mb-8 text-gray-600">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-red-600" />
            <span>{formatDate(event.date)}</span>
          </div>
          {event.time && (
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-red-600" />
              <span>{event.time}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2 text-red-600" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
        <div className="max-w-3xl">
          <p className="text-lg text-gray-700 whitespace-pre-wrap leading-relaxed">{event.description}</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
