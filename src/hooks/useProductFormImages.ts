import { useCallback, useState } from 'react';
import type { ImagePreview, Product } from '../types/product';

const isFile = (value: unknown): value is File =>
  typeof File !== 'undefined' && value instanceof File;

export const toPreviewImages = (images: Product['images'] = []): Array<string | ImagePreview> =>
  images.filter(
    (image): image is string | ImagePreview => typeof image === 'string' || !isFile(image)
  );

export const useProductFormImages = () => {
  const [previewImages, setPreviewImages] = useState<Array<string | ImagePreview>>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const resetImages = useCallback(() => {
    setPreviewImages([]);
    setImagesToDelete([]);
  }, []);

  return {
    previewImages,
    setPreviewImages,
    imagesToDelete,
    setImagesToDelete,
    resetImages,
  };
};

export default useProductFormImages;
