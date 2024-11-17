import { useState } from 'react';
import { ImageOff } from 'lucide-react';

const Favourite = ({ image_src, imdb_url, title, year, genre, runtime, imdb, rotten }) => {
  const [flipped, setFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);
  const genres = genre.split("/");

  const handleTouchStart = (e) => {
    e.preventDefault();
    setFlipped(true);
  };

  const handleTouchEnd = () => {
    setFlipped(false);
  };

  return (
    <div
      className="relative w-full perspective-1000"
      style={{ aspectRatio: '2/3' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className={`relative w-full h-full transition-transform duration-500 transform-gpu preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
        {/* Front of card */}
        <div className="absolute w-full h-full backface-hidden">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
              <ImageOff className="w-12 h-12 text-gray-400" />
            </div>
          ) : (
            <a 
              href={imdb_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block w-full h-full"
            >
              <img
                src={image_src}
                alt={title}
                className="w-full h-full object-cover rounded-lg"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            </a>
          )}
        </div>

        {/* Back of card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gray-800/90 rounded-lg flex flex-col items-center justify-center p-4 space-y-4">
          <a 
            href={imdb_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white text-center line-clamp-2">{title}</h2>
          </a>
          
          <div className="flex flex-col md:flex-row items-center gap-2 text-sm md:text-base text-white">
            <span>{year}</span>
            <span className="hidden md:inline">•</span>
            <div className="flex flex-wrap justify-center gap-1">
              {genres.map((g) => (
                <span 
                  key={g + title} 
                  className="px-2 py-0.5 rounded-full text-sm" 
                  style={{ backgroundColor: 'rgba(61, 211, 174, 0.2)', color: '#3DD3AE' }}
                >
                  {g}
                </span>
              ))}
            </div>
            <span className="hidden md:inline">•</span>
            <span className="text-center">{runtime}</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm md:text-base">
            <span className="text-yellow-400">{imdb}</span>
            <span className="text-red-500">{rotten}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favourite