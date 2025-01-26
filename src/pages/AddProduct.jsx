import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import classNames from "classnames";
import Button from "../components/shared/Button";
import {
  addProductRecords,
  handleHealthCheck,
} from "../services/productService";
import { fetchProductsRequest } from "../redux/reducers/productsSlice";
import { useDispatch } from "react-redux";
import ProductCard from "../components/products/ProductCard";
import { formFields } from "../mockData";
import { API_CONFIG } from "../services/apiConfig";
import Dropdown from "../components/shared/Dropdown";
import ImageUploader from "../components/shared/ImageUploader";

export default function AddProduct() {
  const initialVal = {
    product_id: "",
    name: "",
    description: "",
    images: [],
    weight: "",
    category: "",
    fixed_price: 0,
  };
  const [product, setProduct] = useState(initialVal);
  const [preview, setPreview] = useState(null);
  const [healthCheck, setHealthCheck] = useState({
    data: null,
    isLoading: false,
    error: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]); // Array to hold image previews

  const fileInputRef = useRef(null); // Reference for file input

  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useDispatch();

  const location = useLocation();
  const productDetails = location.state?.productDetails;

  const buttonLabel = useMemo(() => {
    if (isSubmitting) {
      return "Saving..."; // If submitting, show "Saving..."
    }
    if (productDetails) {
      return "Save Changes"; // If editing, show "Save Changes"
    }
    return "Add Product"; // Default label
  }, [isSubmitting, productDetails]);

  // Redirect if not admin
  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    if (files.length) {
      const newPreviews = [];

      files.forEach((file) => {
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
            setPreviewImages((prevPreviewImages) => [
              ...prevPreviewImages,
              ...newPreviews,
            ]);
            setProduct((prev) => ({
              ...prev,
              images: [
                ...(prev.images || []),
                ...newPreviews.map((img) => img.file),
              ],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }, []);

  const handleImageRemove = (id) => {
    // Clear the file input and reset the preview and product state
    let remainingImages;
    setPreviewImages((prevPreviewImages) => {
      remainingImages = prevPreviewImages?.filter((image) => image?.id !== id);
      return prevPreviewImages?.filter((image) => image?.id !== id);
    });
    setProduct((prev) => ({
      ...prev,
      images: remainingImages,
    }));
    // if fileInputRef.current.value is empty, it will display 'No files chosen'.
    if (previewImages?.length === 1) {
      fileInputRef.current.value = "";
    }
  };

  const isFormValid = () => {
    return Object.entries(product).every(([key, val]) => {
      if (key === "images") {
        return Array.isArray(val) && val.length > 0; // Ensure there is at least one image
      }
      return val !== "" && val !== null && val !== "Select Category";
    });
  };

  const handleHealthClick = async () => {
    setHealthCheck({ ...healthCheck, isLoading: true });
    try {
      const res = await handleHealthCheck();
      setHealthCheck({ data: res, isLoading: false, error: res?.error });
    } catch (error) {
      console.error("Error during health check:", error);
      setHealthCheck({ data: null, isLoading: false, error: error.message });
    }
  };

  const successCallBack = () => {
    dispatch(fetchProductsRequest());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formValid = isFormValid();
    if (formValid) {
      setIsSubmitting(true); // Set to true to disable the button and show loading
      try {
        await addProductRecords(product, successCallBack);
        toast.success("Product added successfully!");
        setProduct(initialVal);
        setIsSubmitting(false); // Reset the button state
      } catch (error) {
        toast.error("Failed to add product. Please try again.");
        setIsSubmitting(false); // Reset the button state
      }
    } else {
      toast.error("Please fill in all details.");
    }
  };

  const handleChange = (e, field) => {
    setProduct((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const renderField = (type, label, value, options) => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            required
            placeholder={`Enter ${label}`}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
            value={product[value]}
            onChange={(e) => handleChange(e, value)}
          />
        );

      case "select":
        return (
          <Dropdown
            value={value}
            options={options}
            product={product}
            setProduct={setProduct}
          />
        );

      case "text":
      default:
        return (
          <input
            type={type}
            required
            placeholder={`Enter ${label}`}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={product[value]}
            onChange={(e) => handleChange(e, value)}
          />
        );
    }
  };

  useEffect(() => {
    if (productDetails) {
      setProduct(productDetails);
      setPreview(productDetails.image);
    }
  }, [productDetails]);

  useEffect(() => {
    handleHealthClick();
  }, []);

  return (
    <div className="w-full px-4 py-8">
      <div className="mb-8 flex gap-4 items-center">
        <div className="text-xl font-serif font-semibold underline">
          {/* {productDetails ? "Edit Product" : "Add New Product"} */}
          Update Data
        </div>
        <Button
          label={healthCheck?.isLoading ? "Loading" : "Health Check"}
          classN={classNames(
            "w-fit my-4 transition-colors text-white font-bold py-2 px-4 rounded-md",
            healthCheck?.data?.status && "bg-green-600",
            healthCheck?.error && "bg-red-600",
            !healthCheck?.data?.status && !healthCheck?.error && "bg-gray-300"
          )}
          onClick={handleHealthClick}
        />
      </div>
      <div className="w-full flex flex-col sm:flex-row gap-12 justify-between">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full sm:w-[60%] lg:w-[45%]"
          // className={classNames(
          //   "w-full grid grid-cols-1 gap-6",
          //   isFormValid()
          //     ? "md:grid-cols-2 lg:grid-cols-3"
          //     : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          // )}
        >
          {formFields.map(({ label, value, type, options }) => (
            <div key={value} className="grid grid-cols-2 items-baseline">
              <label className="block text-gray-700 font-bold mb-2">
                {label}
              </label>
              {renderField(type, label, value, options)}
            </div>
          ))}
          <ImageUploader
            fileInputRef={fileInputRef}
            previewImages={previewImages}
            handleImageChange={handleImageChange}
            handleImageRemove={handleImageRemove}
          />
          <div className="w-full flex justify-end">
            <Button
              label={buttonLabel}
              isDisabled={isSubmitting || !isFormValid()} // Disable button during submission or invalid form
              classN={classNames(
                "w-full sm:w-fit my-4 bg-purple-600 transition-colors text-white font-bold py-2 px-4 rounded-md",
                isFormValid() && "hover:bg-purple-700",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
              buttonType="submit"
            />
          </div>
        </form>
        {/* {isFormValid() && (
          <div>
            <div className="text-xl font-bold mb-4">New Product Preview</div>
            <ProductCard
              product={{
                ...product,
                image: preview || `${API_CONFIG.hostUrl}${preview}`,
              }}
              type="add-products"
            />
          </div>
        )} */}
      </div>
    </div>
  );
}
