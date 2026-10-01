import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../ui/SectionTitle';
import api from '../../api';
import type { Campus } from '../../types';

const colors = ['bg-red-100', 'bg-light-blue-100', 'bg-gray-100', 'bg-white'];

const CampusesOverview = () => {
  const [campuses, setCampuses] = useState<Campus[]>([]);

  useEffect(() => {
    api.get('/campuses')
      .then((res) => setCampuses(res.data))
      .catch(() => setCampuses([]));
  }, []);

  if (campuses.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle title="Our Campuses" subtitle="Discover our four unique campuses, each with their own specialties while maintaining our core educational philosophy." center />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {campuses.map((campus, index) => (
            <div key={campus.id} className={`rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${colors[index % colors.length]}`}>
              <div className="h-48 overflow-hidden">
                {campus.image && (
                  <img src={campus.image} alt={campus.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{campus.name}</h3>
                <p className="text-sm font-medium text-red-600 mb-3">{campus.age_range || campus.address}</p>
                <p className="text-gray-600 mb-4">{campus.description}</p>
                <Link to={`/campuses#${campus.slug}`} className="inline-block text-red-600 font-medium hover:text-red-700 transition-colors">
                  Learn more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CampusesOverview;
