import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="w-full pt-32 pb-20 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Link to="/" className="inline-block px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
