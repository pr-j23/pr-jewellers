import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for handling image uploads with previews
 * @param {Array} initialImages - Initial images (URLs or File objects)
 * @param {Object} options - Configuration options
 * @param {number} options.maxSize - Maximum file size in bytes (default: 5MB)
 * @param {Array} options.allowedTypes - Allowed MIME types (default: all images)
 * @returns {Object} Image state and handlers
 */
export const useImageUpload = (initialImages = [], options = {}) => {
  const [images, setImages] = useState(initialImages);
  const [previews, setPreviews] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [errors, setErrors] = useState([]);

  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  } = options;

  // Generate previews for initial images
  useEffect(() => {
    const generatePreviews = () => {
      const newPreviews = initialImages
        .map(img => {
          // If it's already a string URL, use it directly
          if (typeof img === 'string') {
            return img;
          }

          // If it's a File object, create a preview URL
          if (img instanceof File) {
            return URL.createObjectURL(img);
          }

          // If it has a file property that's a File object
          if (img?.file instanceof File) {
            return URL.createObjectURL(img.file);
          }

          return null;
        })
        .filter(Boolean);

      setPreviews(newPreviews);
    };

    generatePreviews();

    // Cleanup function to revoke object URLs
    return () => {
      previews.forEach(preview => {
        if (typeof preview === 'string' && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [initialImages]);

  const validateFile = useCallback(
    file => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        return `File type not supported. Allowed types: ${allowedTypes.join(', ')}`;
      }

      // Check file size
      if (file.size > maxSize) {
        return `File is too large (max ${Math.round(maxSize / (1024 * 1024))}MB)`;
      }

      return null;
    },
    [allowedTypes, maxSize]
  );

  const handleImageChange = useCallback(
    e => {
      const files = Array.from(e.target.files);
      const newErrors = [];
      const validFiles = [];
      const newPreviews = [...previews];

      files.forEach(file => {
        const error = validateFile(file);
        if (error) {
          newErrors.push({ file: file.name, error });
        } else {
          validFiles.push(file);

          // Create preview URL
          const previewUrl = URL.createObjectURL(file);
          newPreviews.push(previewUrl);
        }
      });

      setErrors(newErrors);
      setImages(prev => [...prev, ...validFiles]);
      setPreviews(newPreviews);

      return validFiles.length > 0;
    },
    [previews, validateFile]
  );

  const removeImage = useCallback(
    index => {
      // If the image is a string URL (existing image), add to delete list
      if (typeof images[index] === 'string') {
        setImagesToDelete(prev => [...prev, images[index]]);
      } else if (previews[index] && previews[index].startsWith('blob:')) {
        // Revoke the object URL to prevent memory leaks
        URL.revokeObjectURL(previews[index]);
      }

      // Remove from previews
      setPreviews(prev => prev.filter((_, i) => i !== index));

      // Remove from images
      setImages(prev => prev.filter((_, i) => i !== index));
    },
    [images, previews]
  );

  const resetImages = useCallback(() => {
    // Revoke any object URLs to avoid memory leaks
    previews.forEach(preview => {
      if (typeof preview === 'string' && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    });

    setImages([]);
    setPreviews([]);
    setImagesToDelete([]);
    setErrors([]);
  }, [previews]);

  return {
    images,
    previews,
    imagesToDelete,
    errors,
    handleImageChange,
    removeImage,
    resetImages,
    setImages,
    setPreviews,
    setImagesToDelete,
    hasErrors: errors.length > 0,
  };
};

export default useImageUpload;
