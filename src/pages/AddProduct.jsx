import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function AddProduct() {
  const initialVal = {
    product_id: "",
    name: "",
    description: "",
    image: "https://via.placeholder.com/200",
    weight: "",
    category: "",
  };
  const [product, setProduct] = useState(initialVal);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();

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

  const isFormValid = () => {
    return Object.values(product).every((val) => val !== "" && val !== null);
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (isFormValid()) {
        // addProduct({
        //   ...product,
        // });
        toast.success("Product added successfully!");
        setProduct(initialVal);
        navigate("/");
      } else {
        toast.error("Please fill in all details.");
      }
    },
    [product, isFormValid, navigate]
  );

  const formFields = [
    { label: "Product ID", value: "product_id", type: "text" }, // Changed to 'product_id'
    { label: "Product Name", value: "name", type: "text" },
    { label: "Description", value: "description", type: "textarea" },
    { label: "Weight", value: "weight", type: "text" },
    { label: "Category", value: "category", type: "text" },
  ];

  return (
    <div className="w-full px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {formFields.map(({ label, value, type }) => (
          <div key={value}>
            <label className="block text-gray-700 font-bold mb-2">
              {label}
            </label>
            {type === "textarea" ? (
              <textarea
                required
                placeholder={`Enter product ${label.toLowerCase()}`}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
                value={product[value]}
                onChange={(e) =>
                  setProduct((prev) => ({ ...prev, [value]: e.target.value }))
                }
              />
            ) : (
              <input
                type={type}
                required
                placeholder={`Enter product ${label.toLowerCase()}`}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={product[value]}
                onChange={(e) =>
                  setProduct((prev) => ({ ...prev, [value]: e.target.value }))
                }
              />
            )}
          </div>
        ))}

        <div>
          <label className="block text-gray-700 font-bold mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {preview && (
            <img src={preview} alt="Preview" className="mt-4 w-full h-auto" />
          )}
        </div>

        <button
          type="submit"
          className={`my-4 bg-purple-600 hover:bg-purple-700 transition-colors text-white font-bold py-2 px-4 rounded-md ${
            !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isFormValid()}
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
