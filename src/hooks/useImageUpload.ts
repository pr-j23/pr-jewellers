import { useState, useCallback, useEffect } from 'react';
import type React from 'react';
import type { ImagePreview } from '../types/product';

type UploadableImage = string | File | ImagePreview;

type ImageUploadOptions = {
  maxSize?: number;
  allowedTypes?: string[];
};

type ImageUploadError = {
  file: string;
  error: string;
};

export const useImageUpload = (
  initialImages: UploadableImage[] = [],
  options: ImageUploadOptions = {}
) => {
  const [images, setImages] = useState<UploadableImage[]>(initialImages);
  const [previews, setPreviews] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [errors, setErrors] = useState<ImageUploadError[]>([]);

  const {
    maxSize = 5 * 1024 * 1024,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  } = options;

  useEffect(() => {
    const generatedPreviews = initialImages
      .map(img => {
        if (typeof img === 'string') {
          return img;
        }

        if (img instanceof File) {
          return URL.createObjectURL(img);
        }

        if (img?.file instanceof File) {
          return URL.createObjectURL(img.file);
        }

        return null;
      })
      .filter((preview): preview is string => Boolean(preview));

    setPreviews(generatedPreviews);

    return () => {
      generatedPreviews.forEach(preview => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [initialImages]);

  const validateFile = useCallback(
    (file: File) => {
      if (!allowedTypes.includes(file.type)) {
        return `File type not supported. Allowed types: ${allowedTypes.join(', ')}`;
      }

      if (file.size > maxSize) {
        return `File is too large (max ${Math.round(maxSize / (1024 * 1024))}MB)`;
      }

      return null;
    },
    [allowedTypes, maxSize]
  );

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): boolean => {
      const files = Array.from(event.target.files ?? []);
      const newErrors: ImageUploadError[] = [];
      const validFiles: File[] = [];
      const newPreviews = [...previews];

      files.forEach(file => {
        const error = validateFile(file);
        if (error) {
          newErrors.push({ file: file.name, error });
        } else {
          validFiles.push(file);
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
    (index: number) => {
      const image = images[index];
      if (typeof image === 'string') {
        setImagesToDelete(prev => [...prev, image]);
      } else if (previews[index]?.startsWith('blob:')) {
        URL.revokeObjectURL(previews[index]!);
      }

      setPreviews(prev => prev.filter((_, i) => i !== index));
      setImages(prev => prev.filter((_, i) => i !== index));
    },
    [images, previews]
  );

  const resetImages = useCallback(() => {
    previews.forEach(preview => {
      if (preview.startsWith('blob:')) {
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
