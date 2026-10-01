import { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import api from '../api';
import type { GalleryImage } from '../types';

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([
      api.get('/gallery/images'),
      api.get('/gallery/categories')
    ])
      .then(([imgRes, catRes]) => {
        setImages(imgRes.data);
        setCategories(['All', ...catRes.data.map((c: { name: string }) => c.name)]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = selectedCategory === 'All'
    ? images
    : images.filter((img) => img.category_name === selectedCategory);

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="w-full pt-20">
      <section className="relative py-20 bg-gray-100">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Photo Gallery</h1>
            <p className="text-xl text-gray-600">
              Explore moments and memories from across our four campuses.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle title="School Life in Pictures" subtitle="Browse through photos showcasing the vibrant life at Vendramini Schools." center />

          <div className="flex flex-wrap justify-center gap-2 mb-12 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading gallery...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No photos in this category yet.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((image) => (
                <button
                  key={image.id}
                  onClick={() => openLightbox(image)}
                  className="group relative overflow-hidden rounded-lg shadow-md aspect-square bg-gray-100"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-end p-3">
                    <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      {image.alt}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white hover:text-gray-300">
            <XIcon className="h-8 w-8" />
          </button>
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-0 right-0 text-center text-white">
            <p className="text-lg">{selectedImage.alt}</p>
            {selectedImage.category_name && <p className="text-sm text-gray-300">{selectedImage.category_name}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
