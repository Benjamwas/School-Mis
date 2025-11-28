import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../ui/SectionTitle';
const campusData = [{
  id: 'pre-primary-1',
  name: 'Vendramini Pambazuko',
  location: 'Kahawa West',
  image: '/images/20250104_100703.jpg',
  description: 'A nurturing environment for our youngest learners aged 3-5, focusing on play-based learning and social development.',
  color: 'bg-red-100'
}, {
  id: 'pre-primary-2',
  name: 'Vendramini Marengeta',
  location: 'Kamae',
  image: 'images/20250104_132614.jpg',
  description: 'Specializing in early literacy and numeracy skills in a supportive environment for children aged 3-5.',
  color: 'bg-light-blue-100'
}, {
  id: 'pre-primary-3',
  name: 'Vendramini Kongo',
  location: 'Kongo',
  image: '/images/20250129_125239.jpg',
  description: 'Our arts-focused pre-primary campus, encouraging creativity and expression for ages 3-5.',
  color: 'bg-gray-100'
}, {
  id: 'primary',
  name: 'Vendramini Pre-Primary Catholic School',
  location: 'Jua kali',
  image: '/images/20250104_104747.jpg',
  description: 'Comprehensive education for students aged 6-13, with a focus on academic excellence and character development.',
  color: 'bg-white'
}];
const CampusesOverview = () => {
  return <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle title="Our Campuses" subtitle="Discover our four unique campuses, each with their own specialties while maintaining our core educational philosophy." center />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {campusData.map(campus => <div key={campus.id} className={`rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${campus.color}`}>
              <div className="h-48 overflow-hidden">
                <img src={campus.image} alt={campus.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {campus.name}
                </h3>
                <p className="text-sm font-medium text-red-600 mb-3">
                  {campus.location}
                </p>
                <p className="text-gray-600 mb-4">{campus.description}</p>
                <Link to={`/campuses#${campus.id}`} className="inline-block text-red-600 font-medium hover:text-red-700 transition-colors">
                  Learn more →
                </Link>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default CampusesOverview;