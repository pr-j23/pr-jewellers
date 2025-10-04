import { useCallback, useEffect, useRef } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { API_CONFIG } from '../../services/apiConfig';

const ImageUploader = ({ previewImages, setPreviewImages, setProduct, setImagesToDelete }) => {
  const fileInputRef = useRef(null);

  const handleImageChange = useCallback(e => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    if (files.length) {
      const newPreviews = [];

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const image = reader.result;
          newPreviews.push({
            id: URL.createObjectURL(file), // Create a unique ID for the image
            file, // Original file
            preview: image, // Data URL for the preview
          });

          // When all files are processed, update state
          if (newPreviews.length === files.length) {
            setPreviewImages(prevPreviewImages => [...prevPreviewImages, ...newPreviews]);
            setProduct(prev => ({
              ...prev,
              images: [...(prev.images || []), ...newPreviews.map(img => img.file)],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }, []);

  useEffect(() => {
    if (!previewImages?.length) {
      fileInputRef.current.value = '';
    }
  }, [previewImages?.length]);

  const handleImageRemove = removeableImage => {
    if (removeableImage?.id) {
      // Clear the file input and reset the preview and product state
      let remainingImages;
      setPreviewImages(prevPreviewImages => {
        remainingImages = prevPreviewImages?.filter(image => image?.id !== removeableImage?.id);
        return prevPreviewImages?.filter(image => image?.id !== removeableImage?.id);
      });
      setProduct(prev => ({
        ...prev,
        images: remainingImages,
      }));
      // if fileInputRef.current.value is empty, it will display 'No files chosen'.
      if (
        previewImages?.length === 1 ||
        (previewImages?.length === 2 && previewImages.some(item => typeof item === 'string'))
      ) {
        fileInputRef.current.value = '';
      }
    } else {
      let remainingImages;
      setPreviewImages(prevPreviewImages => {
        remainingImages = prevPreviewImages?.filter(image => {
          // Only remove if both are strings and match
          if (typeof image === 'string') {
            return image !== removeableImage;
          }
          // Keep objects always
          return true;
        });

        return remainingImages;
      });

      setProduct(prev => ({
        ...prev,
        images: remainingImages,
      }));
      setImagesToDelete(prev => [...prev, removeableImage]);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2">
        <label className="block text-gray-700 font-bold mb-2">Images</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple // Allow multiple file uploads
          onChange={handleImageChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {previewImages?.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {previewImages.map((image, index) => (
            <div key={image?.id || `preview-img-${index + 1}`} className="relative">
              <img
                src={image?.id ? image?.id : `${API_CONFIG.hostUrl}${image}`}
                alt="Preview"
                className="w-full h-auto border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={() => handleImageRemove(image)}
                className="absolute top-0 right-0 bg-gray-800 text-red-500 p-2 rounded-full"
              >
                <FaTrashAlt />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
