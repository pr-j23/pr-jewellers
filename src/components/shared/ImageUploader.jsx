import { FaTrashAlt } from "react-icons/fa";

const ImageUploader = ({
  fileInputRef,
  previewImages,
  handleImageChange,
  handleImageRemove,
}) => {
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
          {previewImages.map((image) => (
            <div key={image?.id} className="relative">
              <img
                src={image?.id} // src={preview || `${API_CONFIG.hostUrl}${preview}`}
                alt="Preview"
                className="w-full h-auto border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={() => handleImageRemove(image?.id)}
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
