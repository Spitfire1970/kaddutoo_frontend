import { useState, useEffect } from 'react';
import axios from 'axios';
import MyButton from './MyButton';

const ImageUploader = ({ images, setImages }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    const file = e.target.files[0];
    setSelectedFile(file);
    extractMetadata(file);
  };

  const extractMetadata = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const meta = {
          name: file.name,
          type: file.type,
          size: Math.round(file.size / 1024) + ' KB',
          shot: new Date(file.lastModified).toLocaleString(),
          dimensions: `${img.width}x${img.height}`,
        };
        setMetadata(meta);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const cancel = () => {
    setMetadata(null);
    setPreview(null);
    setSelectedFile(null);
  };

  const uploadImage = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('info', JSON.stringify(metadata));

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImages(images.concat(response.data));
      setMetadata(null);
      setPreview(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 mt-5">
      <input
        id="browse_button"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="sr-only"
      />
      <label
        htmlFor="browse_button"
        className="cursor-pointer font-medium text-gray-600 text-lg hover:underline"
      >
        add image?
      </label>

      {(preview || metadata) && (
        <div className="w-full mt-4">
          <div className="flex flex-col md:flex-row md:justify-center md:gap-8 space-y-4 md:space-y-0">
            {preview && (
              <div className="flex flex-col items-center">
                <h3 className="font-semibold mb-2">Preview:</h3>
                <div className="w-full max-w-[300px] aspect-square rounded-lg shadow-md overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            
            {metadata && (
              <div className="flex flex-col items-center">
                <h3 className="font-semibold mb-2 text-center w-full">Metadata:</h3>
                <ul className="space-y-1 text-sm md:text-base">
                  {Object.entries(metadata).map(([key, value]) => (
                    <li key={key} className="text-white">
                      <span className="font-medium capitalize">{key}:</span>{' '}
                      <span className="break-all">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedFile && (
        <div className="flex gap-4 mt-5">
          <MyButton
            onClick={cancel}
            text_false = "Cancel"
          />
          <MyButton
            onClick={uploadImage}
            text_false = "Upload Image"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;