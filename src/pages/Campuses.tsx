import React, { useEffect, Children } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';
import { MapPinIcon, UsersIcon, ClockIcon, PhoneIcon } from 'lucide-react';
const campuses = [{
  id: 'pre-primary-1',
  name: 'Pre-Primary Campus 1',
  tagline: 'Nurturing Young Minds',
  description: 'Our North District campus provides a warm, supportive environment for our youngest learners, focusing on play-based learning and social development.',
  longDescription: 'At our North District Pre-Primary Campus, we create a nurturing environment where children aged 3-5 can explore, discover, and grow. Our play-based curriculum encourages curiosity and creativity while building a strong foundation for future learning. With spacious classrooms, a dedicated outdoor play area, and specialized learning zones, children develop social skills, early literacy, and numeracy in a supportive setting.',
  image: 'https://images.unsplash.com/photo-1567448400815-59d52a2935d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  features: ['Specialized early learning curriculum', 'Low student-teacher ratio (8:1)', 'Dedicated outdoor play spaces', 'Modern, child-friendly facilities', 'Nutritious meal program'],
  details: {
    address: '123 North Avenue, North District',
    hours: '8:00 AM - 3:30 PM (Extended care available until 5:30 PM)',
    ageRange: 'Ages 3-5',
    contact: '(123) 456-7890'
  }
}, {
  id: 'pre-primary-2',
  name: 'Pre-Primary Campus 2',
  tagline: 'Building Strong Foundations',
  description: 'Located in the East District, this campus specializes in early literacy and numeracy skills in a supportive environment for children aged 3-5.',
  longDescription: 'Our East District Pre-Primary Campus is designed to build strong foundations in early literacy and numeracy. Through a structured yet flexible approach, children develop essential skills that prepare them for primary education. Our experienced educators use innovative teaching methods, incorporating music, movement, and hands-on activities to make learning engaging and effective for young minds.',
  image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  features: ['Focus on early literacy and numeracy', 'Language-rich environment', 'Interactive learning stations', 'Regular progress assessments', 'Parent involvement programs'],
  details: {
    address: '456 East Boulevard, East District',
    hours: '8:00 AM - 3:30 PM (Extended care available until 5:30 PM)',
    ageRange: 'Ages 3-5',
    contact: '(123) 456-7891'
  }
}, {
  id: 'pre-primary-3',
  name: 'Pre-Primary Campus 3',
  tagline: 'Inspiring Creativity',
  description: 'Our arts-focused West District campus encourages creativity and expression for pre-primary students ages 3-5.',
  longDescription: 'The West District Pre-Primary Campus is our arts-focused early learning center, where creativity and expression are central to the educational experience. Children engage in a variety of artistic pursuits including visual arts, music, movement, and dramatic play, all integrated with core early learning concepts. This approach nurtures creative thinking, emotional expression, and cognitive development in a joyful, inspiring environment.',
  image: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  features: ['Arts-integrated curriculum', 'Dedicated art studio spaces', 'Weekly music and movement classes', 'Regular art exhibitions', 'Collaborative creative projects'],
  details: {
    address: '789 West Street, West District',
    hours: '8:00 AM - 3:30 PM (Extended care available until 5:30 PM)',
    ageRange: 'Ages 3-5',
    contact: '(123) 456-7892'
  }
}, {
  id: 'primary',
  name: 'Primary School',
  tagline: 'Excellence in Education',
  description: 'Our Central District Primary School provides comprehensive education for students aged 6-13, with a focus on academic excellence and character development.',
  longDescription: 'The BrightFuture Primary School in Central District offers a comprehensive education for students aged 6-13. Our curriculum balances academic rigor with character development, preparing students for future success. With specialized teachers for core subjects, modern facilities including science and computer labs, and a wide range of extracurricular activities, we provide a well-rounded education that challenges and inspires each student to reach their full potential.',
  image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  features: ['Comprehensive curriculum aligned with national standards', 'Specialized subject teachers', 'Modern science and computer labs', 'Sports program with dedicated facilities', 'Character education and leadership development'],
  details: {
    address: '101 Central Road, Central District',
    hours: '8:00 AM - 3:45 PM (Extended care available until 5:30 PM)',
    ageRange: 'Ages 6-13',
    contact: '(123) 456-7893'
  }
}];
const Campuses = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    // Handle hash navigation
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }, 500);
      }
    }
  }, []);
  return <div className="w-full pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-100">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')"
      }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Our Campuses
            </h1>
            <p className="text-xl text-gray-600">
              Explore our four unique campuses, each designed to provide the
              best educational experience for different age groups and learning
              styles.
            </p>
          </div>
        </div>
      </section>
      {/* Campuses Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campuses.map((campus, index) => <a key={campus.id} href={`#${campus.id}`} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
                <div className="h-48 overflow-hidden">
                  <img src={campus.image} alt={campus.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {campus.name}
                  </h3>
                  <p className="text-sm font-medium text-red-600 mb-3">
                    {campus.tagline}
                  </p>
                  <p className="text-gray-600">{campus.description}</p>
                </div>
              </a>)}
          </div>
        </div>
      </section>
      {/* Individual Campuses */}
      {campuses.map((campus, index) => <section id={campus.id} key={campus.id} className={`py-16 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className={`lg:w-1/2 ${index % 2 === 1 ? 'order-2' : ''}`}>
                <div className="relative">
                  <img src={campus.image} alt={campus.name} className="rounded-lg shadow-lg w-full" />
                  {index % 2 === 0 ? <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-red-100 rounded-lg -z-10"></div> : <div className="absolute -top-6 -right-6 w-48 h-48 bg-light-blue-100 rounded-lg -z-10"></div>}
                </div>
              </div>
              <div className="lg:w-1/2">
                <SectionTitle title={campus.name} subtitle={campus.tagline} />
                <p className="text-gray-600 mb-6">{campus.longDescription}</p>
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">
                    Campus Features
                  </h4>
                  <ul className="space-y-2">
                    {campus.features.map((feature, idx) => <li key={idx} className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>)}
                  </ul>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 mt-0.5 mr-2 text-red-600" />
                    <div>
                      <h4 className="font-medium text-gray-800">Address</h4>
                      <p className="text-gray-600">{campus.details.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <ClockIcon className="h-5 w-5 mt-0.5 mr-2 text-red-600" />
                    <div>
                      <h4 className="font-medium text-gray-800">Hours</h4>
                      <p className="text-gray-600">{campus.details.hours}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <UsersIcon className="h-5 w-5 mt-0.5 mr-2 text-red-600" />
                    <div>
                      <h4 className="font-medium text-gray-800">Age Range</h4>
                      <p className="text-gray-600">{campus.details.ageRange}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <PhoneIcon className="h-5 w-5 mt-0.5 mr-2 text-red-600" />
                    <div>
                      <h4 className="font-medium text-gray-800">Contact</h4>
                      <p className="text-gray-600">{campus.details.contact}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button href="/contact#tour" variant="primary">
                    Schedule a Tour
                  </Button>
                  <Button href="/contact#enroll" variant="outline">
                    Enrollment Info
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>)}
    </div>;
};
export default Campuses;