import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, UserIcon, SearchIcon } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import api from '../api';
import type { BlogPost } from '../types';

function formatDate(d: string | null) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return d || '';
  }
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [categories, setCategories] = useState<string[]>(['All Categories']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get('/blog?status=published')
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
    api.get('/blog/categories')
      .then((res) => setCategories(['All Categories', ...res.data]))
      .catch(() => {});
  }, []);

  const filtered = posts.filter((post) => {
    let tags: string[] = [];
    try {
      const parsed = JSON.parse(post.tags || '[]');
      tags = Array.isArray(parsed) ? parsed : [];
    } catch { /* ignore */ }
    const matchCat = selectedCategory === 'All Categories' || post.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchQ = !term
      || post.title.toLowerCase().includes(term)
      || post.excerpt.toLowerCase().includes(term)
      || tags.some((t) => t.toLowerCase().includes(term));
    return matchCat && matchQ;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="w-full pt-20">
      <section className="relative py-20 bg-gray-100">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">School Blog</h1>
            <p className="text-xl text-gray-600">
              Insights, updates, and educational resources from our school community.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle title="Latest Articles" subtitle="Browse our latest posts on education, parenting, and school life." center />

          <div className="flex flex-col md:flex-row gap-4 mb-10 mt-8">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading posts...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No published posts yet. Check back soon!</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featured && (
                <div className="lg:col-span-2">
                  <Link to={`/blog/${featured.slug}`} className="block group">
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      {featured.image && (
                        <div className="h-72 overflow-hidden">
                          <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-6">
                        {featured.category && (
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-full mb-3">
                            {featured.category}
                          </span>
                        )}
                        <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors">
                          {featured.title}
                        </h2>
                        <p className="text-gray-600 mb-4">{featured.excerpt}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <UserIcon className="h-4 w-4 mr-1" />
                          <span className="mr-4">{featured.author}</span>
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{formatDate(featured.published_at || featured.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              <div className="space-y-6">
                {rest.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="block group">
                    <div className="flex gap-4 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-3">
                      {post.image && (
                        <div className="w-28 h-24 overflow-hidden rounded shrink-0">
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="min-w-0">
                        {post.category && (
                          <span className="inline-block px-2 py-0.5 text-xs bg-red-50 text-red-600 rounded mb-1">
                            {post.category}
                          </span>
                        )}
                        <h3 className="font-bold text-gray-800 text-sm leading-snug group-hover:text-red-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(post.published_at || post.created_at)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
