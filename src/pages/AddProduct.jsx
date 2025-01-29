import classNames from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";
import Button from "../components/shared/Button";
import Dropdown from "../components/shared/Dropdown";
import ImageUploader from "../components/shared/ImageUploader";
import { useAuth } from "../context/AuthContext";
import { apiType, formFields } from "../mockData";
import { fetchProductsRequest } from "../redux/reducers/productsSlice";
import { API_CONFIG } from "../services/apiConfig";
import {
  addProductRecords,
  handleHealthCheck,
} from "../services/productService";

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
  const [selectedApiType, setSelectedApiType] = useState(null);
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

  const handleCategoryChange = (option) => {
    setProduct((prev) => ({
      ...prev,
      category: option.value,
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
            options={options}
            handleSelection={handleCategoryChange}
            initialOption={"Select Category"}
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
      <div className="w-44 mb-4">
        <Dropdown
          options={apiType}
          handleSelection={(sApiType) => setSelectedApiType(sApiType)}
          initialOption={"Select"}
        />
      </div>
      {selectedApiType && (
        <div className="w-full flex flex-col sm:flex-row gap-12 justify-between">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full sm:w-[60%] lg:w-[45%]"
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
              previewImages={previewImages}
              setPreviewImages={setPreviewImages}
              setProduct={setProduct}
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
      )}
    </div>
  );
}
