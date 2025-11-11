import React, { useEffect, useState } from 'react';
import SectionTitle from '../ui/SectionTitle';
const testimonials = [{
  id: 1,
  quote: 'The teachers at BrightFuture have been incredible mentors for my son. His confidence and love for learning have grown tremendously since joining the school.',
  name: 'Sarah Johnson',
  role: 'Parent of Primary Student',
  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}, {
  id: 2,
  quote: "As a teacher, I'm proud to be part of a school that truly values both academic excellence and the emotional well-being of each child.",
  name: 'Michael Chen',
  role: 'Mathematics Teacher',
  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}, {
  id: 3,
  quote: "The pre-primary campus provided such a warm, nurturing start to my daughter's education. The transition to the primary school was seamless.",
  name: 'Emily Rodriguez',
  role: 'Parent of Two Students',
  image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}, {
  id: 4,
  quote: "I love my school! The teachers make learning fun and I've made so many friends. The science lab is my favorite place!",
  name: 'Alex Thompson',
  role: 'Year 5 Student',
  image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
}];
const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return <section className="py-16 bg-light-blue-50">
      <div className="container mx-auto px-4">
        <SectionTitle title="What Our Community Says" subtitle="Hear from parents, teachers, and students about their experiences at BrightFuture Schools." center />
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="relative">
            {testimonials.map((testimonial, index) => <div key={testimonial.id} className={`transition-opacity duration-500 ${index === activeIndex ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}>
                <div className="bg-white rounded-lg p-8 shadow-lg">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-red-100">
                        <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="md:w-3/4 md:pl-6">
                      <blockquote className="text-lg text-gray-700 italic mb-4">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="font-medium">
                        <p className="text-gray-900">{testimonial.name}</p>
                        <p className="text-red-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => <button key={index} onClick={() => setActiveIndex(index)} className={`w-3 h-3 rounded-full transition-colors ${index === activeIndex ? 'bg-red-600' : 'bg-gray-300 hover:bg-gray-400'}`} aria-label={`Go to testimonial ${index + 1}`} />)}
          </div>
        </div>
      </div>
    </section>;
};
export default TestimonialsSection;