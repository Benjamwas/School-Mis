import React, { useEffect, useState } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});
const campusLocations = [{
  id: 'pre-primary-1',
  name: 'Pre-Primary Campus 1',
  address: '123 North Avenue, North District',
  position: [51.505, -0.09],
  phone: '(123) 456-7890',
  email: 'preprimary1@brightfuture.edu'
}, {
  id: 'pre-primary-2',
  name: 'Pre-Primary Campus 2',
  address: '456 East Boulevard, East District',
  position: [51.51, -0.1],
  phone: '(123) 456-7891',
  email: 'preprimary2@brightfuture.edu'
}, {
  id: 'pre-primary-3',
  name: 'Pre-Primary Campus 3',
  address: '789 West Street, West District',
  position: [51.5, -0.12],
  phone: '(123) 456-7892',
  email: 'preprimary3@brightfuture.edu'
}, {
  id: 'primary',
  name: 'Primary School',
  address: '101 Central Road, Central District',
  position: [51.515, -0.09],
  phone: '(123) 456-7893',
  email: 'primary@brightfuture.edu'
}];
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    campus: '',
    childAge: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  useEffect(() => {
    window.scrollTo(0, 0);
    // Handle hash navigation
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      if (hash === 'enroll' || hash === 'tour') {
        setActiveTab(hash);
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }, 500);
      }
    }
  }, []);
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    // In a real application, you would send the form data to your backend
    console.log(formData);
    setFormSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      campus: '',
      childAge: ''
    });
    // Reset form submitted state after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };
  return <div className="w-full pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-100">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')"
      }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600">
              We'd love to hear from you. Reach out with questions, schedule a
              tour, or begin the enrollment process.
            </p>
          </div>
        </div>
      </section>
      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campusLocations.map(campus => <div key={campus.id} className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {campus.name}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 mt-0.5 mr-2 text-red-600" />
                    <span className="text-gray-600">{campus.address}</span>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-2 text-red-600" />
                    <a href={`tel:${campus.phone}`} className="text-gray-600 hover:text-red-600 transition-colors">
                      {campus.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <MailIcon className="h-5 w-5 mr-2 text-red-600" />
                    <a href={`mailto:${campus.email}`} className="text-gray-600 hover:text-red-600 transition-colors">
                      {campus.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2 text-red-600" />
                    <span className="text-gray-600">8:00 AM - 3:30 PM</span>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>
      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle title="Find Our Campuses" subtitle="Our four campuses are conveniently located across the city." center />
          <div className="h-[500px] rounded-lg overflow-hidden shadow-md mt-12">
            <MapContainer center={[51.505, -0.09]} zoom={13} style={{
            height: '100%',
            width: '100%'
          }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
              {campusLocations.map(campus => <Marker key={campus.id} position={campus.position}>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-gray-800">{campus.name}</h3>
                      <p className="text-gray-600 text-sm">{campus.address}</p>
                      <p className="text-gray-600 text-sm mt-1">
                        {campus.phone}
                      </p>
                    </div>
                  </Popup>
                </Marker>)}
            </MapContainer>
          </div>
        </div>
      </section>
      {/* Contact Forms Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-8">
              <button id="contact" onClick={() => setActiveTab('contact')} className={`py-3 px-6 font-medium text-sm focus:outline-none ${activeTab === 'contact' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600 hover:text-gray-800'}`}>
                General Inquiry
              </button>
              <button id="tour" onClick={() => setActiveTab('tour')} className={`py-3 px-6 font-medium text-sm focus:outline-none ${activeTab === 'tour' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600 hover:text-gray-800'}`}>
                Schedule a Tour
              </button>
              <button id="enroll" onClick={() => setActiveTab('enroll')} className={`py-3 px-6 font-medium text-sm focus:outline-none ${activeTab === 'enroll' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600 hover:text-gray-800'}`}>
                Enrollment Information
              </button>
            </div>
            {/* Success Message */}
            {formSubmitted && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-start">
                <svg className="h-5 w-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-bold">Thank you for your submission!</p>
                  <p className="text-sm">
                    We'll get back to you as soon as possible.
                  </p>
                </div>
              </div>}
            {/* Contact Form */}
            {activeTab === 'contact' && <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Get in Touch
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Your Name
                      </label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                        Email Address
                      </label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                      Subject
                    </label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                      Message
                    </label>
                    <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" required></textarea>
                  </div>
                  <div>
                    <Button type="submit" variant="primary">
                      Send Message
                    </Button>
                  </div>
                </form>
              </div>}
            {/* Tour Form */}
            {activeTab === 'tour' && <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Schedule a Campus Tour
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Your Name
                      </label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                        Email Address
                      </label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                        Phone Number
                      </label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                    </div>
                    <div>
                      <label htmlFor="campus" className="block text-gray-700 font-medium mb-2">
                        Campus to Visit
                      </label>
                      <select id="campus" name="campus" value={formData.campus} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" required>
                        <option value="">Select a campus</option>
                        <option value="pre-primary-1">
                          Pre-Primary Campus 1
                        </option>
                        <option value="pre-primary-2">
                          Pre-Primary Campus 2
                        </option>
                        <option value="pre-primary-3">
                          Pre-Primary Campus 3
                        </option>
                        <option value="primary">Primary School</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                      Additional Information
                    </label>
                    <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"></textarea>
                  </div>
                  <div>
                    <Button type="submit" variant="primary">
                      Request Tour
                    </Button>
                  </div>
                </form>
              </div>}
            {/* Enrollment Form */}
            {activeTab === 'enroll' && <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Enrollment Information Request
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Parent/Guardian Name
                      </label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                        Email Address
                      </label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                        Phone Number
                      </label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                    </div>
                    <div>
                      <label htmlFor="childAge" className="block text-gray-700 font-medium mb-2">
                        Child's Age
                      </label>
                      <select id="childAge" name="childAge" value={formData.childAge} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" required>
                        <option value="">Select an age</option>
                        <option value="3">3 years</option>
                        <option value="4">4 years</option>
                        <option value="5">5 years</option>
                        <option value="6">6 years</option>
                        <option value="7">7 years</option>
                        <option value="8">8 years</option>
                        <option value="9">9 years</option>
                        <option value="10">10 years</option>
                        <option value="11">11 years</option>
                        <option value="12">12 years</option>
                        <option value="13">13 years</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="campus" className="block text-gray-700 font-medium mb-2">
                      Interested Campus
                    </label>
                    <select id="campus" name="campus" value={formData.campus} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" required>
                      <option value="">Select a campus</option>
                      <option value="pre-primary-1">
                        Pre-Primary Campus 1
                      </option>
                      <option value="pre-primary-2">
                        Pre-Primary Campus 2
                      </option>
                      <option value="pre-primary-3">
                        Pre-Primary Campus 3
                      </option>
                      <option value="primary">Primary School</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                      Additional Questions or Comments
                    </label>
                    <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"></textarea>
                  </div>
                  <div>
                    <Button type="submit" variant="primary">
                      Request Information
                    </Button>
                  </div>
                </form>
              </div>}
          </div>
        </div>
      </section>
    </div>;
};
export default ContactUs;