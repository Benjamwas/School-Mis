import { useEffect } from 'react';
import HeroSection from '../components/sections/HeroSection';
import CampusesOverview from '../components/sections/CampusesOverview';
import EventsSection from '../components/sections/EventsSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';
const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <div className="w-full">
      <HeroSection />
      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
              <SectionTitle title="Welcome to Vendramini Schools" subtitle="Where education meets innovation in a nurturing environment." />
              <p className="text-gray-600 mb-6">
                At Vendramini, we believe in providing a holistic education
                that nurtures not just academic excellence, but also creativity,
                character, and confidence. Our four campuses serve children from
                ages 3 to 13, providing a seamless educational journey.
              </p>
              <p className="text-gray-600 mb-8">
                With small class sizes, dedicated teachers, and a curriculum
                that balances traditional learning with modern approaches, we
                prepare students not just for academic success, but for life.
              </p>
              <Button href="/about" variant="primary">
                Learn More About Us
              </Button>
            </div>
            <div className="lg:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img src="/images/20250116_162154.jpg" 
                  alt="Students in classroom" 
                  className="rounded-lg shadow-md w-full h-48 object-cover" />
                  <img src="/images/20250116_170704.jpg" 
                  alt="School library" 
                  className="rounded-lg shadow-md w-full h-64 object-cover" />
                </div>
                <div className="space-y-4 mt-8">
                  <img src="/images/20250129_132339.jpg"
                   alt="Art class" 
                   className="rounded-lg shadow-md w-full h-64 object-cover" />
                  <img src="/images/20250129_115716.jpg" 
                  alt="Sports activities" 
                  className="rounded-lg shadow-md w-full h-48 object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CampusesOverview />
      <EventsSection />
      <TestimonialsSection />
      {/* Call to Action */}
      <section className="py-20 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our School Community?
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Whether you're looking for a pre-primary placement or considering
            our primary school, we invite you to learn more about enrollment
            opportunities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/contact#enroll" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:bg-opacity-20">
              Enroll Now
            </Button>
            <Button href="/contact#tour" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:bg-opacity-20">
              Schedule a Tour
            </Button>
          </div>
        </div>
      </section>
    </div>;
};
export default Home;