import React from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
const events = [{
  id: 1,
  title: 'Annual Sports Day',
  date: 'June 15, 2023',
  time: '9:00 AM - 3:00 PM',
  location: 'Primary School Campus',
  description: 'Join us for a day of sports, games, and friendly competition across all age groups.',
  image: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
}, {
  id: 2,
  title: 'Parent-Teacher Conference',
  date: 'June 20-21, 2023',
  time: 'By Appointment',
  location: 'All Campuses',
  description: "Schedule a meeting with your child's teachers to discuss progress and development.",
  image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
}, {
  id: 3,
  title: 'Summer Arts Festival',
  date: 'July 5, 2023',
  time: '1:00 PM - 5:00 PM',
  location: 'Pre-Primary Campus 3',
  description: 'A celebration of student artwork, performances, and creative projects from the school year.',
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