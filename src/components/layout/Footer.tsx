import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon, MapPinIcon, PhoneIcon, MailIcon } from 'lucide-react';
import api from '../../api';

const Footer = () => {
  const [phone, setPhone] = useState('0114468263 / 0722217531');
  const [email, setEmail] = useState('vendraminischools@gmail.com');
  const [address, setAddress] = useState('Kahawa West, Nairobi, Kenya');
  const [campuses, setCampuses] = useState<Array<{ id: number; slug: string; name: string }>>([]);

  useEffect(() => {
    api.get('/settings/public')
      .then((res) => {
        if (typeof res.data.footer_phone === 'string') setPhone(res.data.footer_phone);
        if (typeof res.data.footer_email === 'string') setEmail(res.data.footer_email);
        if (typeof res.data.footer_address === 'string') setAddress(res.data.footer_address);
      })
      .catch(() => {});
    api.get('/campuses')
      .then((res) => setCampuses(res.data))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-red-500">Vendramini </span>Schools
            </h3>
            <p className="mb-4 text-gray-300">
              Providing quality education to children ages 3-13 across our four
              campuses, fostering a love for learning in a nurturing environment.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61583810420720" className="text-gray-300 hover:text-white transition">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <YoutubeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition">About Us</Link></li>
              <li><Link to="/campuses" className="text-gray-300 hover:text-white transition">Our Campuses</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition">School Blog</Link></li>
              <li><Link to="/events" className="text-gray-300 hover:text-white transition">Events</Link></li>
              <li><Link to="/gallery" className="text-gray-300 hover:text-white transition">Photo Gallery</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Our Campuses</h3>
            <ul className="space-y-2">
              {campuses.length === 0 && (
                <>
                  <li><Link to="/campuses" className="text-gray-300 hover:text-white transition">Pre-Primary 1</Link></li>
                  <li><Link to="/campuses" className="text-gray-300 hover:text-white transition">Pre-Primary 2</Link></li>
                  <li><Link to="/campuses" className="text-gray-300 hover:text-white transition">Pre-Primary 3</Link></li>
                  <li><Link to="/campuses" className="text-gray-300 hover:text-white transition">Primary School</Link></li>
                </>
              )}
              {campuses.map((c) => (
                <li key={c.id}>
                  <Link to={`/campuses#${c.slug}`} className="text-gray-300 hover:text-white transition">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon className="h-5 w-5 mr-2 mt-0.5 text-red-500" />
                <span className="text-gray-300">{address}</span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2 text-red-500" />
                <span className="text-gray-300">{phone}</span>
              </li>
              <li className="flex items-center">
                <MailIcon className="h-5 w-5 mr-2 text-red-500" />
                <span className="text-gray-300">{email}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Vendramini Schools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
