export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface Campus {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  long_description: string;
  image: string;
  features: string;
  address: string;
  hours: string;
  age_range: string;
  contact_phone: string;
  contact_email: string;
  latitude: number | null;
  longitude: number | null;
  sort_order: number;
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  campus_id: number | null;
  campus_name?: string | null;
  description: string;
  image: string;
  status: 'draft' | 'published';
  featured: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image: string;
  tags: string;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryCategory {
  id: number;
  name: string;
  sort_order: number;
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category_id: number | null;
  category_name?: string | null;
  sort_order: number;
}

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  image: string;
  sort_order: number;
  is_active: number;
}

export interface StaffMember {
  id: number;
  name: string;
  role_title: string;
  bio: string;
  image: string;
  sort_order: number;
  is_active: number;
}

export interface FormSubmission {
  id: number;
  type: string;
  name: string;
  email: string;
  phone: string;
  campus: string;
  age: number | null;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  created_at: string;
}

export interface MediaUpload {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  path: string;
  alt: string;
  created_at: string;
}

export interface SiteSettings {
  [key: string]: string | string[] | object | undefined;
}

export interface ChatbotEntry {
  question: string;
  answer: string;
}

export interface Stats {
  events: number;
  eventsUpcoming: number;
  blogPosts: number;
  galleryImages: number;
  campuses: number;
  newLeads: number;
}
