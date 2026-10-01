import { useEffect, useState } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import { BookOpenIcon, UsersIcon, AwardIcon, HeartIcon, TargetIcon, EyeIcon } from 'lucide-react';
import api from '../api';
import type { StaffMember, SiteSettings } from '../types';

interface CoreValue {
  title: string;
  description: string;
}

const valueIcons = [AwardIcon, HeartIcon, TargetIcon, EyeIcon];

const defaultValues: CoreValue[] = [
  { title: 'Excellence', description: 'We pursue the highest standards in teaching, learning, and character.' },
  { title: 'Integrity', description: 'We act with honesty, fairness, and respect in all we do.' },
  { title: 'Service', description: 'We give back to our community and lift others as we climb.' },
  { title: 'Innovation', description: 'We embrace creativity and modern methods to prepare children for the future.' }
];

const AboutUs = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [values, setValues] = useState<CoreValue[]>(defaultValues);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get('/settings/public')
      .then((res) => {
        setSettings(res.data);
        if (Array.isArray(res.data.core_values) && res.data.core_values.length > 0) {
          setValues(res.data.core_values as CoreValue[]);
        }
      })
      .catch(() => {});
    api.get('/staff?active=1')
      .then((res) => setStaff(res.data))
      .catch(() => setStaff([]));
  }, []);

  const mission = typeof settings.about_mission === 'string'
    ? settings.about_mission
    : 'To provide an exceptional educational experience that nurtures each child\'s intellectual, creative, physical, and emotional growth in a supportive and inclusive environment.';
  const vision = typeof settings.about_vision === 'string'
    ? settings.about_vision
    : 'To be the leading multi-campus school network in Kenya, known for academic excellence, character formation, and innovation.';
  const history = typeof settings.about_history === 'string'
    ? settings.about_history
    : 'Vendramini Schools was founded with a simple but powerful belief: that every child, regardless of background, deserves access to quality education in a nurturing environment.';

  return (
    <div className="w-full pt-20">
      <section className="relative py-20 bg-gray-100">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/images/20250104_104747.jpg')" }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">About Our School</h1>
            <p className="text-xl text-gray-600">
              Learn about our history, mission, and the values that drive our approach to education across all our campuses.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-light-blue-50 p-8 rounded-lg shadow-md">
              <div className="bg-light-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <BookOpenIcon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-600">{mission}</p>
            </div>
            <div className="bg-red-50 p-8 rounded-lg shadow-md">
              <div className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <UsersIcon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-600">{vision}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle title="Our Core Values" subtitle="The principles that guide everything we do at Vendramini Schools." center />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {values.map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length];
              return (
                <div key={value.title} className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="bg-red-50 text-red-600 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <SectionTitle title="Our History" center />
            <p className="text-gray-600 leading-relaxed">{history}</p>
          </div>
        </div>
      </section>

      {staff.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <SectionTitle title="Our Leadership" subtitle="Meet the people who lead Vendramini Schools with vision and dedication." center />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {staff.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden text-center p-6">
                  <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                  <p className="text-red-600 font-medium mb-3">{member.role_title}</p>
                  {member.bio && <p className="text-gray-600 text-sm">{member.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutUs;
