import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import classNames from "classnames";
import Button from "../components/shared/Button";
import { FaCaretDown, FaCaretUp, FaTrashAlt } from "react-icons/fa";
import {
  addProductRecords,
  handleHealthCheck,
} from "../services/productService";
import { fetchProductsRequest } from "../redux/reducers/productsSlice";
import { useDispatch } from "react-redux";
import ProductCard from "../components/products/ProductCard";
import { toTitleCase } from "../utils";
import { formFields } from "../mockData";
import { API_CONFIG } from "../services/apiConfig";

export default function AddProduct() {
  const initialVal = {
    product_id: "",
    name: "",
    description: "",
    image: "https://via.placeholder.com/200",
    weight: "",
    category: "",
    fixed_price: 0,
  };
  const [product, setProduct] = useState(initialVal);
  const [preview, setPreview] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [healthCheck, setHealthCheck] = useState({
    data: null,
    isLoading: false,
    error: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null); // Reference for file input

  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useDispatch();

  const location = useLocation();
  const productDetails = location.state?.productDetails;
  console.log(
    productDetails,
    "productDetails",
    `${API_CONFIG.hostUrl}${preview}`
  );

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
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const image = reader.result;
        setPreview(image);
        setProduct((prev) => ({ ...prev, image }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleImageRemove = () => {
    // Clear the file input and reset the preview and product state
    setPreview(null);
    fileInputRef.current.value = ""; // Reset the file input field
    setProduct((prev) => ({ ...prev, image: "" })); // Reset the image value in the product state
  };

  const isFormValid = () => {
    return Object.entries(product).every(([key, val]) => {
      if (key === "image") {
        return val && val !== "https://via.placeholder.com/200"; // Ensure image is not the placeholder
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
        await addProductRecords(
          product,
          fileInputRef.current.files[0],
          successCallBack
        );
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

  const handleSelectOption = (option) => {
    setProduct((prev) => ({
      ...prev,
      category: option.value,
    }));
    setDropdownOpen(false); // Close dropdown after selection
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
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex items-center justify-between"
            >
              <span>{toTitleCase(product[value]) || "Select Category"}</span>
              {/* Show "Select Category" if no category is selected */}
              <span className="ml-2">
                {dropdownOpen ? <FaCaretUp /> : <FaCaretDown />}
              </span>
            </button>
            <div
              className={`absolute mt-2 bg-white shadow-lg rounded w-full z-10 transition-all duration-300 ease-in-out overflow-hidden ${
                dropdownOpen ? "max-h-60" : "max-h-0"
              }`}
            >
              <ul className="max-h-60 overflow-y-auto">
                {options?.map((option) => (
                  <li
                    key={option.value}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSelectOption(option)} // Use handleSelectOption to change value
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false); // Close dropdown if clicked outside
      }
    };

    // Attach event listener to detect clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {productDetails ? "Edit Product" : "Add New Product"}
      </h1>
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
      <div className="w-full flex flex-col sm:flex-row gap-12 justify-between">
        <form
          onSubmit={handleSubmit}
          className={classNames(
            "w-full grid grid-cols-1 gap-6",
            isFormValid()
              ? "md:grid-cols-2 lg:grid-cols-3"
              : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          )}
        >
          {formFields.map(({ label, value, type, options }) => (
            <div key={value}>
              <label className="block text-gray-700 font-bold mb-2">
                {label}
              </label>
              {renderField(type, label, value, options)}
            </div>
          ))}

          <div>
            <label className="block text-gray-700 font-bold mb-2">Image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {preview && (
              <div className="mt-4 relative">
                <img
                  src={preview || `${API_CONFIG.hostUrl}${preview}`}
                  alt="Preview"
                  className="w-full h-auto"
                />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute top-0 right-0 bg-gray-800  text-red-500 p-2 rounded-full"
                >
                  <FaTrashAlt />
                </button>
              </div>
            )}
          </div>
          <div>
            <Button
              label={buttonLabel}
              isDisabled={isSubmitting || !isFormValid()} // Disable button during submission or invalid form
              classN={classNames(
                "w-full my-4 bg-purple-600 transition-colors text-white font-bold py-2 px-4 rounded-md",
                isFormValid() && "hover:bg-purple-700",
                isSubmitting && "opacity-50 cursor-not-allowed" // Styling for disabled state
              )}
              buttonType="submit"
            />
          </div>
        </form>
        {isFormValid() && (
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
        )}
      </div>
    </div>
  );
}
