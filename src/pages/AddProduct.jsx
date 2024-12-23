import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import classNames from "classnames";
import Button from "../components/shared/Button";
import { FaCaretDown, FaCaretUp, FaTrashAlt } from "react-icons/fa"; // You can use any icon here
import {
  addProductRecords,
  handleHealthCheck,
} from "../services/productService";

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
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null); // Reference for file input

  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not admin
  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  const categories = [
    { value: "rings", label: "Rings" },
    { value: "necklaces", label: "Necklaces" },
    { value: "earrings", label: "Earrings" },
    { value: "silver-coins", label: "Silver Coins" },
    { value: "anklets", label: "Anklets" },
    { value: "bangles", label: "Bangles" },
    { value: "bracelets", label: "Bracelets" },
  ];

  const formFields = [
    { label: "Product ID", value: "product_id", type: "text" },
    { label: "Product Name", value: "name", type: "text" },
    { label: "Description", value: "description", type: "textarea" },
    { label: "Weight", value: "weight", type: "text" },
    { label: "Fixed Price", value: "fixed_price", type: "number" },
    {
      label: "Category",
      value: "category",
      type: "select",
      options: categories,
    },
  ];

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
    return Object.values(product).every(
      (val) => val !== "" && val !== null && val !== "Select Category"
    );
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formValid = isFormValid();
    if (formValid) {
      try {
        await addProductRecords(product, fileInputRef.current.files[0]);
        toast.success("Product added successfully!");
        setProduct(initialVal);
        // navigate("/");
      } catch (error) {
        toast.error("Failed to add product. Please try again.");
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
              <span>{product[value] || "Select Category"}</span>{" "}
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
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
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
      <form
        onSubmit={handleSubmit}
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
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
              <img src={preview} alt="Preview" className="w-full h-auto" />
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
            label="Add Product"
            isDisabled={!isFormValid()}
            classN={classNames(
              "w-full my-4 bg-purple-600 transition-colors text-white font-bold py-2 px-4 rounded-md",
              isFormValid() && "hover:bg-purple-700"
            )}
            buttonType="submit"
          />
        </div>
      </form>
    </div>
  );
}
