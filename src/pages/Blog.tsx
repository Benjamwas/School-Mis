import React, { useEffect, useState, Children } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import { CalendarIcon, UserIcon, TagIcon, SearchIcon } from 'lucide-react';
const blogPosts = [{
  id: 1,
  title: 'The Importance of Play-Based Learning in Early Education',
  excerpt: 'Research shows that play-based learning helps develop crucial cognitive and social skills in young children.',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.',
  category: 'Early Education',
  author: 'Vendramini',
  date: 'May 15, 2023',
  image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  tags: ['early education', 'play-based learning', 'child development']
}, {
  id: 2,
  title: "Supporting Your Child's Transition to Primary School",
  excerpt: 'Practical tips for parents to help their children make a smooth transition from pre-primary to primary education.',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.',
  category: 'Parenting',
  author: 'Vendramini',
  date: 'June 2, 2023',
  image: '/images/20250129_132339.jpg',
  tags: ['school transition', 'primary school', 'parenting tips']
}, {
  id: 3,
  title: 'The Role of Arts in Developing Creative Thinking',
  excerpt: 'How our arts-focused curriculum helps children develop creative thinking and problem-solving skills.',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.',
  category: 'Arts Education',
  author: 'Vendramini',
  date: 'June 18, 2023',
  image: '/images/20250104_104919.jpg',
  tags: ['arts education', 'creativity', 'child development']
}, {
  id: 4,
  title: 'Nutrition and Learning: The Connection Between Diet and Academic Performance',
  excerpt: 'Understanding how proper nutrition supports cognitive development and learning in school-aged children.',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.',
  category: 'Health & Wellness',
  author: 'Vendramini',
  date: 'July 5, 2023',
  image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  tags: ['nutrition', 'academic performance', 'child health']
}, {
  id: 5,
  title: 'Technology in the Classroom: Finding the Right Balance',
  excerpt: 'How we integrate technology in age-appropriate ways to enhance learning without compromising development.',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.',
  category: 'Educational Technology',
  author: 'Vendramini',
  date: 'July 22, 2023',
  image: '/images/20250116_153019.jpg',
  tags: ['educational technology', 'digital learning', 'screen time']
}, {
  id: 6,
  title: 'Building Resilience in Children: Why It Matters',
  excerpt: 'Strategies for helping children develop resilience and cope with challenges in school and life.',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.',
  category: 'Child Psychology',
  author: 'Vendramini',
  date: 'August 10, 2023',
  image: '/images/20250116_162626.jpg',
  tags: ['resilience', 'mental health', 'child development']
}];
const categories = ['All Categories', 'Early Education', 'Parenting', 'Arts Education', 'Health & Wellness', 'Educational Technology', 'Child Psychology'];
const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    let results = blogPosts;
    // Filter by category
    if (selectedCategory !== 'All Categories') {
      results = results.filter(post => post.category === selectedCategory);
    }
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(post => post.title.toLowerCase().includes(term) || post.excerpt.toLowerCase().includes(term) || post.tags.some(tag => tag.toLowerCase().includes(term)));
    }
    setFilteredPosts(results);
  }, [searchTerm, selectedCategory]);
  return <div className="w-full pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-100">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')"
      }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              School Blog
            </h1>
            <p className="text-xl text-gray-600">
              Insights, updates, and educational resources from our school
              community.
            </p>
          </div>
        </div>
      </section>
      {/* Blog Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              {filteredPosts.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPosts.map(post => <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                      <div className="h-48 overflow-hidden">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                            {post.category}
                          </span>
                          <span className="mx-2">•</span>
                          <div className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {post.date}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-red-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{post.excerpt}</p>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <UserIcon className="h-4 w-4 mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, idx) => <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
                              #{tag}
                            </span>)}
                        </div>
                      </div>
                    </article>)}
                </div> : <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    No posts found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter to find what you're
                    looking for.
                  </p>
                </div>}
            </div>
            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Search */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Search</h3>
                <div className="relative">
                  <input type="text" placeholder="Search articles..." className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              {/* Categories */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Categories
                </h3>
                <ul className="space-y-2">
                  {categories.map((category, idx) => <li key={idx}>
                      <button onClick={() => setSelectedCategory(category)} className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === category ? 'bg-red-100 text-red-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                        {category}
                      </button>
                    </li>)}
                </ul>
              </div>
              {/* Featured Post */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Featured Post
                </h3>
                <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Featured post" className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h4 className="text-md font-bold text-gray-800 mb-2 hover:text-red-600 transition-colors">
                      The Importance of Play-Based Learning in Early Education
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      <span>May 15, 2023</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Research shows that play-based learning helps develop
                      crucial cognitive and social skills in young children.
                    </p>
                  </div>
                </div>
              </div>
              {/* Tags */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['early education', 'play-based learning', 'child development', 'parenting tips', 'primary school', 'arts education', 'nutrition', 'technology', 'resilience'].map((tag, idx) => <span key={idx} className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setSearchTerm(tag)}>
                      #{tag}
                    </span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Blog;