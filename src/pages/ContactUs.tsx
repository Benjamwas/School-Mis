import React, { useEffect, useState } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import api from '../api';
import * as L from 'leaflet';
import type { Campus } from '../types';

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const NAIROBI: [number, number] = [-1.1735, 36.9532];

const ContactUs = () => {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '', campus: '', childAge: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get('/campuses').then((res) => setCampuses(res.data)).catch(() => {});
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      if (hash === 'enroll' || hash === 'tour') {
        setActiveTab(hash);
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const type = activeTab === 'contact' ? 'inquiry' : activeTab === 'tour' ? 'tour' : 'enrollment';
      const payload: Record<string, unknown> = {
        type,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        campus: formData.campus,
        subject: formData.subject,
        message: formData.message
      };
      if (activeTab === 'enroll' && formData.childAge) {
        payload.age = Number(formData.childAge);
      }
      const res = await api.post('/forms', payload);
      if (res.status === 201 || res.status === 200) {
        setFormSubmitted(true);
        setErrorMessage('');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '', campus: '', childAge: '' });
        setTimeout(() => setFormSubmitted(false), 6000);
      } else {
        setErrorMessage('Unexpected response from server');
      }
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { error?: string } } };
      setErrorMessage(apiErr?.response?.data?.error || 'Failed to submit form. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full pt-20">
      <section className="relative py-20 bg-gray-100">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Contact Us</h1>
            <p className="text-xl text-gray-600">
              We'd love to hear from you. Reach out with questions, schedule a tour, or begin the enrollment process.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campuses.map((campus) => (
              <div key={campus.id} className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{campus.name}</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 mt-0.5 mr-2 text-red-600" />
                    <span className="text-gray-600">{campus.address}</span>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-2 text-red-600" />
                    <a href={`tel:${campus.contact_phone}`} className="text-gray-600 hover:text-red-600 transition-colors">
                      {campus.contact_phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <MailIcon className="h-5 w-5 mr-2 text-red-600" />
                    <a href={`mailto:${campus.contact_email}`} className="text-gray-600 hover:text-red-600 transition-colors">
                      {campus.contact_email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2 text-red-600" />
                    <span className="text-gray-600">{campus.hours || '7:30 AM - 4:30 PM'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle title="Find Our Campuses" subtitle="Our four campuses are conveniently located across the city." center />
          <div className="h-[500px] rounded-lg overflow-hidden shadow-md mt-12">
            <MapContainer
              {...({ center: NAIROBI, zoom: 13, style: { height: '100%', width: '100%' } } as Record<string, unknown>)}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {campuses.map((campus) => {
                const pos: [number, number] =
                  campus.latitude != null && campus.longitude != null
                    ? [campus.latitude, campus.longitude]
                    : NAIROBI;
                return (
                  <Marker key={campus.id} position={pos}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-gray-800">{campus.name}</h3>
                        <p className="text-gray-600 text-sm">{campus.address}</p>
                        <p className="text-gray-600 text-sm mt-1">{campus.contact_phone}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
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

            {formSubmitted && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6" role="status">
                <p className="font-bold">Thank you for your submission!</p>
                <p className="text-sm">We've received your message and will get back to you as soon as possible.</p>
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                <p className="font-bold">Submission failed</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            {activeTab === 'contact' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                    <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required></textarea>
                  </div>
                  <div>
                    <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'tour' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule a Campus Tour</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required />
                    </div>
                    <div>
                      <label htmlFor="campus" className="block text-gray-700 font-medium mb-2">Campus to Visit</label>
                      <select id="campus" name="campus" value={formData.campus} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required>
                        <option value="">Select a campus</option>
                        {campuses.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Additional Information</label>
                    <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"></textarea>
                  </div>
                  <div>
                    <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Sending...' : 'Request Tour'}</Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'enroll' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Enrollment Information Request</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Parent/Guardian Name</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required />
                    </div>
                    <div>
                      <label htmlFor="childAge" className="block text-gray-700 font-medium mb-2">Child's Age</label>
                      <select id="childAge" name="childAge" value={formData.childAge} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required>
                        <option value="">Select an age</option>
                        {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((a) => <option key={a} value={a}>{a} years</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="campus" className="block text-gray-700 font-medium mb-2">Interested Campus</label>
                    <select id="campus" name="campus" value={formData.campus} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required>
                      <option value="">Select a campus</option>
                      {campuses.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Additional Questions or Comments</label>
                    <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"></textarea>
                  </div>
                  <div>
                    <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Sending...' : 'Request Information'}</Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
