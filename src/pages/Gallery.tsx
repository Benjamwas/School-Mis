import React, { useEffect, useState, memo } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import { XIcon } from 'lucide-react';
const galleryImages = [{
  id: 1,
  src: '/images/20250116_162154.jpg',
  alt: 'Students in classroom',
  category: 'Classroom'
}, {
  id: 2,
  src: '/images/20250116_162626.jpg',
  alt: 'School library',
  category: 'Facilities'
}, {
  id: 3,
  src: '/images/20250116_170704.jpg',
  alt: 'Science lab',
  category: 'Science'
}, {
  id: 4,
  src: '/images/20250129_115716.jpg',
  alt: 'Sports activities',
  category: 'Sports'
}, {
  id: 5,
  src: '/images/20250129_132339.jpg',
  alt: 'Pre-primary students in classroom',
  category: 'Pre-Primary'
}, {
  id: 6,
  src: '/images/charity.jpg',
  alt: 'School history',
  category: 'Events'
},];
const categories = ['All', 'Classroom', 'Facilities', 'Arts','Science', 'Sports', 'Events', 'Pre-Primary'];
const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredImages, setFilteredImages] = useState(galleryImages);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredImages(galleryImages);
    } else {
      setFilteredImages(galleryImages.filter(img => img.category === selectedCategory));
    }
  }, [selectedCategory]);
  const openLightbox = image => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };
  return <div className="w-full pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-100">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1494059980473-813e73ee784b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')"
      }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Photo Gallery
            </h1>
            <p className="text-xl text-gray-600">
              Explore moments and memories from across our four campuses.
            </p>
          </div>
        </div>
      </section>
      {/* Gallery */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle title="School Life in Pictures" subtitle="Browse through photos showcasing the vibrant life at BrightFuture Schools." center />
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 mt-8">
            {categories.map((category, idx) => <button key={idx} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === category ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {category}
              </button>)}
          </div>
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map(image => <div key={image.id} className="relative overflow-hidden rounded-lg shadow-md cursor-pointer group" onClick={() => openLightbox(image)}>
                <img src={image.src} alt={image.alt} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="text-white text-center p-4">
                    <p className="font-medium">{image.alt}</p>
                    <span className="text-sm bg-red-600 px-2 py-1 rounded-full mt-2 inline-block">
                      {image.category}
                    </span>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>
      {/* Lightbox */}
      {selectedImage && <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors" onClick={closeLightbox}>
            <XIcon className="h-8 w-8" />
          </button>
          <div className="max-w-4xl w-full">
            <img src={selectedImage.src} alt={selectedImage.alt} className="w-full h-auto max-h-[80vh] object-contain" />
            <div className="text-white mt-4">
              <p className="font-medium text-xl">{selectedImage.alt}</p>
              <p className="text-gray-300">{selectedImage.category}</p>
            </div>
          </div>
        </div>}
    </div>;
};
export default Gallery;