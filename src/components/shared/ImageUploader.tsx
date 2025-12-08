import { useCallback, useEffect, useRef } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { API_CONFIG } from '../../services/apiConfig';
import type { ImagePreview, Product } from '../../types/product';

type PreviewImage = string | ImagePreview;

type ImageUploaderProps = {
  previewImages: PreviewImage[];
  setPreviewImages: React.Dispatch<React.SetStateAction<PreviewImage[]>>;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  setImagesToDelete: React.Dispatch<React.SetStateAction<string[]>>;
};

const ImageUploader = ({
  previewImages,
  setPreviewImages,
  setProduct,
  setImagesToDelete,
}: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newPreviews: ImagePreview[] = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({
          id: URL.createObjectURL(file),
          file,
          preview: reader.result as string,
        });

        if (newPreviews.length === files.length) {
          setPreviewImages(prev => [...prev, ...newPreviews]);
          setProduct(prev => ({
            ...prev,
            images: [
              ...(prev.images || []),
              ...newPreviews.map(img => (img.file instanceof File ? img.file : img)).filter(Boolean),
            ],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  }, [setPreviewImages, setProduct]);

  useEffect(() => {
    if (!previewImages.length && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [previewImages.length]);

  const handleImageRemove = useCallback(
    (removableImage: PreviewImage) => {
      const isPreviewObject = typeof removableImage !== 'string';
      setPreviewImages(prev => prev.filter(image => image !== removableImage));

      setProduct(prev => ({
        ...prev,
        images:
          prev.images?.filter(image => {
            if (typeof removableImage === 'string') {
              return image !== removableImage;
            }
            const targetFile = removableImage.file ?? removableImage;

            if (image instanceof File && targetFile instanceof File) {
              return image !== targetFile;
            }

            return image !== removableImage;
          }) || [],
      }));

      if (typeof removableImage === 'string') {
        setImagesToDelete(prev => [...prev, removableImage]);
      }

      if (fileInputRef.current && previewImages.length <= 1) {
        fileInputRef.current.value = '';
      }
    },
    [previewImages.length, setImagesToDelete, setPreviewImages, setProduct]
  );

  return (
    <div>
      <div className="grid grid-cols-2">
        <label className="block text-gray-700 font-bold mb-2">Images</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {previewImages?.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {previewImages.map((image, index) => {
            const imageKey = typeof image === 'string' ? image : image?.id || `preview-img-${index + 1}`;
            const src =
              typeof image === 'string'
                ? `${API_CONFIG.hostUrl}${image}`
                : image.id || image.preview || '';

            return (
              <div key={imageKey} className="relative">
                <img src={src} alt="Preview" className="w-full h-auto border border-gray-300 rounded" />
                <button
                  type="button"
                  onClick={() => handleImageRemove(image)}
                  className="absolute top-0 right-0 bg-gray-800 text-red-500 p-2 rounded-full"
                >
                  <FaTrashAlt />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
