import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../api';
import type { BlogPost } from '../types';

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;
    api.get(`/blog/${slug}`)
      .then((res) => setPost(res.data))
      .catch(() => setError('Post not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="w-full pt-32 text-center text-gray-500">Loading...</div>;
  if (error || !post) {
    return (
      <div className="w-full pt-32 text-center">
        <p className="text-gray-600 mb-4">{error || 'Post not found'}</p>
        <Link to="/blog" className="text-red-600 hover:text-red-700">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="w-full pt-20">
      {post.image && (
        <div className="h-64 md:h-96 overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="container mx-auto px-4 py-12">
        <Link to="/blog" className="inline-flex items-center text-red-600 hover:text-red-700 mb-6 text-sm font-medium">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Blog
        </Link>
        <div className="max-w-3xl">
          {post.category && <span className="inline-block px-3 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-full mb-4">{post.category}</span>}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
          <div className="text-sm text-gray-500 mb-8">
            {post.author} · {post.published_at ? new Date(post.published_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
          </div>
          {post.excerpt && <p className="text-lg text-gray-600 italic mb-6">{post.excerpt}</p>}
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
