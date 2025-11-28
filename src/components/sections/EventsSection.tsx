import React from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
const events = [{
  id: 1,
  title: 'Charity Day',
  date: 'Sep 15, 2025',
  time: '9:00 AM - 3:00 PM',
  location: 'Kamiti',
  description: 'Join us for a charity day, as we share the day and get experiences from Kamiti Prisons',
  image: '/images/charity.jpg'
}, {
  id: 2,
  title: 'School Re-opening',
  date: 'January, 2026',
  time: '6:30 am',
  location: 'All Campuses',
  description: "Commencement of first term",
  image: '/images/20250116_153615.jpg'
}, {
  id: 3,
  title: 'TBD',
  date: 'TBD',
  time: 'TBD',
  location: 'TBD',
  description: 'TBD',
  image: 'https://images.unsplash.com/photo-1494059980473-813e73ee784b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
}];
const EventsSection = () => {
  return <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionTitle title="Upcoming Events" subtitle="Stay connected with what's happening across our campuses with these upcoming events and activities." center />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {events.map(event => <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {event.title}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2 text-red-600" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2 text-red-600" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2 text-red-600" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            </div>)}
        </div>
        <div className="text-center mt-12">
          <Button href="/events" variant="primary">
            View All Events
          </Button>
        </div>
      </div>
    </section>;
};
export default EventsSection;