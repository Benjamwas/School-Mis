import { useEffect, useState } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import { MapPinIcon, UsersIcon, ClockIcon, PhoneIcon } from 'lucide-react';
import api from '../api';
import type { Campus } from '../types';

const parseFeatures = (features: string): string[] => {
  try {
    const parsed = JSON.parse(features || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const Campuses = () => {
  const [campuses, setCampuses] = useState<Campus[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get('/campuses').then((res) => setCampuses(res.data)).catch(() => setCampuses([]));
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, []);

  return (
    <div className="w-full pt-20">
      <section className="relative py-20 bg-gray-100">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Campuses</h1>
            <p className="text-xl text-gray-600">
              Four unique campuses, one shared commitment to nurturing every child.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 space-y-20">
          {campuses.length === 0 && (
            <div className="text-center text-gray-500 py-12">Loading campuses...</div>
          )}
          {campuses.map((campus, index) => (
            <div key={campus.id} id={campus.slug} className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${index % 2 === 1 ? 'lg:direction-rtl' : ''}`}>
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                {campus.image && (
                  <img src={campus.image} alt={campus.name} className="rounded-lg shadow-lg w-full h-80 object-cover" />
                )}
              </div>
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <SectionTitle title={campus.name} subtitle={campus.tagline} />
                <p className="text-gray-600 mb-4">{campus.description}</p>
                <p className="text-gray-600 mb-6">{campus.long_description}</p>

                {parseFeatures(campus.features).length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                      <UsersIcon className="h-5 w-5 mr-2 text-red-600" /> Features
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {parseFeatures(campus.features).map((f, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-600">
                          <span className="text-red-600 mr-2">•</span>{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-3 text-gray-600">
                  {campus.address && (
                    <div className="flex items-start">
                      <MapPinIcon className="h-5 w-5 mr-2 mt-0.5 text-red-600 shrink-0" />
                      <span>{campus.address}</span>
                    </div>
                  )}
                  {campus.hours && (
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 mr-2 text-red-600 shrink-0" />
                      <span>{campus.hours}</span>
                    </div>
                  )}
                  {campus.contact_phone && (
                    <div className="flex items-center">
                      <PhoneIcon className="h-5 w-5 mr-2 text-red-600 shrink-0" />
                      <span>{campus.contact_phone}</span>
                    </div>
                  )}
                  {campus.age_range && (
                    <div className="text-sm text-gray-500">{campus.age_range}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Campuses;
