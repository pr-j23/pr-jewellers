import classNames from "classnames";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";
import Button from "../components/shared/Button";
import Dropdown from "../components/shared/Dropdown";
import UpdateRecordsForm from "../components/UpdateRecordsForm";
import { useAuth } from "../context/AuthContext";
import { apiType } from "../mockData";
import { setEditableProductDetails } from "../redux/reducers/editableProductDetailsSlice";
import { fetchProductsRequest } from "../redux/reducers/productsSlice";
import {
  addProductRecords,
  editProductRecord,
  handleHealthCheck,
} from "../services/productService";

export default function AddProduct() {
  const initialVal = {
    product_id: "",
    name: "",
    description: "",
    images: [],
    weight: 0,
    category: "",
    fixed_price: 0,
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [healthCheck, setHealthCheck] = useState({
    data: null,
    isLoading: false,
    error: null,
  });
  const [product, setProduct] = useState(initialVal);
  const [previewImages, setPreviewImages] = useState([]); // Array to hold image previews
  const [selectedApiType, setSelectedApiType] = useState(null);
  const [notAvailable, setNotAvailable] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const editableProductDetails = useSelector(
    (state) => state.editableProduct.editableProductDetails
  );

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

  const mapEditableDataToProduct = (data) => {
    const {
      product_id = "",
      name = "",
      description = "",
      images = [],
      weight = 0,
      category = "",
      fixed_price = 0,
    } = data || {};

    return {
      product_id,
      name,
      description,
      images,
      weight,
      category,
      fixed_price,
    };
  };

  const handleApiTypeDropdownSelection = (sApiType) => {
    const { label } = sApiType;
    setSelectedApiType(sApiType);
    setNotAvailable(
      label === "Add Carousel Image" ||
        (label === "Edit Product" && !editableProductDetails)
        ? true
        : null
    );
    if (editableProductDetails) {
      switch (label) {
        case "Add Product":
          setProduct(initialVal);
          dispatch(setEditableProductDetails(null));
          setPreviewImages([]);
          break;
        case "Edit Product":
          setProduct(mapEditableDataToProduct(editableProductDetails));
          setPreviewImages(editableProductDetails?.images);
          break;
        case "Add Carousel Image":
          dispatch(setEditableProductDetails(null));
          setPreviewImages([]);
          break;
        default:
          break;
      }
    }
  };

  const successCallBack = () => {
    dispatch(fetchProductsRequest());
  };

  const handleAddProduct = async () => {
    const formValid = isFormValid();
    if (formValid) {
      setIsSubmitting(true); // Set to true to disable the button and show loading
      try {
        await addProductRecords(product, successCallBack);
        toast.success("Product added successfully!");
        setProduct(initialVal);
        setPreviewImages([]); // Reset the preview images state
        setIsSubmitting(false); // Reset the button state
      } catch (error) {
        toast.error("Failed to add product. Please try again.");
        setIsSubmitting(false); // Reset the button state
      }
    } else {
      toast.error("Please fill in all details.");
    }
  };

  const handleEditProduct = async () => {
    setIsSubmitting(true); // Set to true to disable the button and show loading
    try {
      await editProductRecord(
        editableProductDetails?.id,
        product,
        imagesToDelete,
        successCallBack
      );
      toast.success("Edited product successfully!");
      dispatch(setEditableProductDetails(null));
      setProduct(initialVal);
      setPreviewImages([]); // Reset the preview images state
      setIsSubmitting(false); // Reset the button state
    } catch (error) {
      toast.error("Failed to edit product. Please try again.");
      setIsSubmitting(false); // Reset the button state
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedApiType?.label === "Add Product") {
      handleAddProduct();
    } else if (
      selectedApiType?.label === "Edit Product" &&
      editableProductDetails
    ) {
      handleEditProduct();
    }
  };

  const handleChange = (e, field) => {
    const { type, value } = e.target;
    const updatedValue = type === "number" && Number(value) < 0 ? 0 : value; // to prevent negative values

    setProduct((prev) => ({
      ...prev,
      [field]: updatedValue,
    }));
  };

  const handleCategoryChange = (option) => {
    setProduct((prev) => ({
      ...prev,
      category: option.value,
    }));
  };

  useEffect(() => {
    if (editableProductDetails) {
      setSelectedApiType({ value: "edit-product", label: "Edit Product" });
      const filtered = mapEditableDataToProduct(editableProductDetails);
      setProduct(filtered);
      const prevImage = editableProductDetails?.images || [];
      setPreviewImages(prevImage);
    }
  }, [editableProductDetails?.product_id]);

  useEffect(() => {
    handleHealthClick();
  }, []);

  return (
    <div className="w-full px-4 py-8">
      <div className="mb-8 flex gap-4 items-center">
        <div className="text-xl font-serif font-semibold underline">
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
          handleSelection={handleApiTypeDropdownSelection}
          initialOption={editableProductDetails ? "Edit Product" : "Select"}
        />
      </div>
      {((selectedApiType?.label === "Edit Product" && editableProductDetails) ||
        selectedApiType?.label === "Add Product") && (
        <div className="w-full flex flex-col sm:flex-row gap-12">
          <UpdateRecordsForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            isFormValid={isFormValid}
            isSubmitting={isSubmitting}
            previewImages={previewImages}
            setPreviewImages={setPreviewImages}
            product={product}
            setProduct={setProduct}
            handleCategoryChange={handleCategoryChange}
            selectedApiType={selectedApiType?.label}
            editableProductDetails={editableProductDetails}
            setImagesToDelete={setImagesToDelete}
          />
          {previewImages?.length > 0 && (
            <div className="w-[85%] sm:w-[25%]">
              <div className="text-xl font-bold mb-4">Product Preview</div>
              <ProductCard
                product={{
                  ...product,
                  images: previewImages,
                }}
                type={selectedApiType?.value}
              />
            </div>
          )}
        </div>
      )}
      {notAvailable && <div>Not available</div>}
    </div>
  );
}
