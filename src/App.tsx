import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Chatbot from './components/layout/Chatbot';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Campuses from './pages/Campuses';
import Blog from './pages/Blog';
import Gallery from './pages/Gallery';
import ContactUs from './pages/ContactUs';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import BlogDetail from './pages/BlogDetail';
import NotFound from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import EventsAdmin from './pages/admin/EventsAdmin';
import EventForm from './pages/admin/EventForm';
import BlogAdmin from './pages/admin/BlogAdmin';
import BlogForm from './pages/admin/BlogForm';
import GalleryAdmin from './pages/admin/GalleryAdmin';
import CampusesAdmin from './pages/admin/CampusesAdmin';
import TestimonialsAdmin from './pages/admin/TestimonialsAdmin';
import StaffAdmin from './pages/admin/StaffAdmin';
import MediaLibrary from './pages/admin/MediaLibrary';
import LeadsAdmin from './pages/admin/LeadsAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center text-gray-500">
    Loading...
  </div>
);

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const AdminLoginRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/admin" replace />;
  return <Login />;
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginRoute />} />
          <Route
            path="/admin/*"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="events" element={<EventsAdmin />} />
            <Route path="events/new" element={<EventForm />} />
            <Route path="events/:id" element={<EventForm />} />
            <Route path="blog" element={<BlogAdmin />} />
            <Route path="blog/new" element={<BlogForm />} />
            <Route path="blog/:id" element={<BlogForm />} />
            <Route path="gallery" element={<GalleryAdmin />} />
            <Route path="campuses" element={<CampusesAdmin />} />
            <Route path="testimonials" element={<TestimonialsAdmin />} />
            <Route path="staff" element={<StaffAdmin />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="leads" element={<LeadsAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
          </Route>

          <Route
            path="*"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/campuses" element={<Campuses />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogDetail />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:slug" element={<EventDetail />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Chatbot />
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
