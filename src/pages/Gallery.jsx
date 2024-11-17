import { useState, useEffect } from 'react';
import Photo from '../components/Photo';
import ImageUploader from '../components/ImageUploader';
import axios from 'axios';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('/api/imagelist');
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
    }
  }, [images]);

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  const handleImageHover = (image_path) => {
    setHovering(false);
    setTempImage(image_path);
  };

  const handleImageLeave = () => {
    setTempImage(null);
  };

  // Calculate grid columns dynamically
  const columnCount = Math.floor(Math.sqrt(images.length));
  const gridStyles = {
    gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col items-center justify-center w-full lg:flex-row lg:items-stretch lg:gap-4">

        <div className="w-full lg:w-[34.5%] mb-4 lg:mb-0">
          <div
            className="grid w-full aspect-square"
            style={gridStyles}
          >
            {images.map((image, index) => (
              <Photo
                key={index}
                path={image.path}
                onClick={() => handleImageClick(image)}
                onEnter={() => handleImageHover(image.path)}
                onLeave={handleImageLeave}
              />
            ))}
          </div>
        </div>

        <div
          className="relative w-full lg:w-[60%] aspect-[3/2] transition-opacity duration-200"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {mainImage && (
            <>
              <img
                src={tempImage || mainImage.path}
                className={`w-full h-full object-cover ${hovering ? 'opacity-50' : ''}`}
                alt="Main display"
              />
              {hovering && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/30 p-4 rounded">
                    {mainImage.info.includes("{") ? (
                      Object.entries(JSON.parse(mainImage.info)).map(([key, value]) => (
                        <p key={key} className="text-white">
                          {key}: {value}
                        </p>
                      ))
                    ) : (
                      <p className="text-white">{mainImage.info}</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ImageUploader images={images} setImages={setImages} />
    </div>
  );
};

export default Gallery;