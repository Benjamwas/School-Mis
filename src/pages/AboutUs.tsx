import React, { useEffect } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import { BookOpenIcon, UsersIcon, AwardIcon, HeartIcon } from 'lucide-react';
const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <div className="w-full pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-100">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{
        backgroundImage: "url('/images/20250104_104747.jpg')"
      }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              About Our School
            </h1>
            <p className="text-xl text-gray-600">
              Learn about our history, mission, and the values that drive our
              approach to education across all our campuses.
            </p>
          </div>
        </div>
      </section>
      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-light-blue-50 p-8 rounded-lg shadow-md transform transition-transform hover:scale-105">
              <div className="bg-light-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <BookOpenIcon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600">
                To provide an exceptional educational experience that nurtures
                each child's intellectual, creative, physical, and emotional
                growth in a supportive and inclusive environment. We strive to
                develop lifelong learners who are curious, confident, and
                compassionate.
              </p>
            </div>
            <div className="bg-red-50 p-8 rounded-lg shadow-md transform transition-transform hover:scale-105">
              <div className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <UsersIcon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600">
                To be a leading educational institution that inspires and
                empowers students to become thoughtful, responsible global
                citizens. We envision graduates who are well-prepared for future
                academic challenges and who contribute positively to their
                communities.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle title="Our Core Values" subtitle="These principles guide everything we do across all our campuses." center />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AwardIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Excellence
              </h3>
              <p className="text-gray-600">
                We strive for excellence in all aspects of education,
                encouraging students to achieve their personal best.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-light-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="h-8 w-8 text-light-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Compassion
              </h3>
              <p className="text-gray-600">
                We foster empathy, kindness, and respect for others, building a
                caring community.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Innovation
              </h3>
              <p className="text-gray-600">
                We embrace creativity and innovation in our teaching methods and
                learning environments.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Community
              </h3>
              <p className="text-gray-600">
                We value strong partnerships between students, parents,
                teachers, and the wider community.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Our History */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
              <SectionTitle title="Our History" subtitle="A legacy of educational excellence spanning over two decades." />
              <div className="space-y-4 text-gray-600">
                <p>
                  Vendramini Schools was founded in 2000 with our first
                  pre-primary campus, established by a group of dedicated
                  educators who believed in creating a more nurturing and
                  innovative approach to early childhood education.
                </p>
                <p>
                  Following the success of our first campus, we expanded with
                  two additional pre-primary locations in 2005 and 2010, each
                  serving different neighborhoods while maintaining our core
                  educational philosophy.
                </p>
                <p>
                  In 2015, we opened our primary school to provide a seamless
                  educational journey for our students. This allowed us to
                  extend our unique approach to education for children up to age
                  13.
                </p>
                <p>
                  Today, our four campuses serve hundreds of families in our
                  community, with a dedicated staff of over 100 educators and
                  support personnel committed to providing the highest quality
                  education.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <img src="/images/20250104_110857.jpg" 
                alt="School history" 
                className="rounded-lg shadow-lg w-full" 
                />
                <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-red-100 rounded-lg -z-10"></div>
                <div className="absolute -top-6 -right-6 w-48 h-48 bg-light-blue-100 rounded-lg -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Leadership Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle title="Our Leadership Team" 
          subtitle="Meet the dedicated educators who guide our schools." center />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-lg overflow-hidden shadow-md transform transition-transform hover:scale-105">
              <img src="" 
              alt="Administrator" 
              className="w-full h-64 object-cover object-center"
               />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  Sr. Agnes
                </h3>
                <p className="text-red-600 font-medium mb-4">
                  Executive Principal
                </p>
                <p className="text-gray-600">
                  With over 20 years in education, Sr. Agnes leads our network
                  of schools with passion and vision.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-md transform transition-transform hover:scale-105">
              <img src="/images/20250116_161339.jpg" 
              alt="Vice Principal" 
              className="w-full h-64 object-cover object-center" 
              />

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  Fred Wasike
                </h3>
                <p className="text-red-600 font-medium mb-4">
                  Head of Primary School
                </p>
                <p className="text-gray-600">
                  Mr. Fred brings innovation and excellence to our primary
                  school curriculum and operations.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-md transform transition-transform hover:scale-105">
              <img src="" 
              alt="Early Education Director" 
              className="w-full h-64 object-cover object-center"
               />

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  
                </h3>
                <p className="text-red-600 font-medium mb-4">
                  Early Education Director
                </p>
                <p className="text-gray-600">
                  The teachers oversee our pre-primary campuses, ensuring quality
                  early childhood education.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default AboutUs;