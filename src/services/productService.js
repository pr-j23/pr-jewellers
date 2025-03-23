import { deleteAPI, getAPI, postAPI } from "../utils/axios";
import { API_CONFIG } from "./apiConfig";

export const handleHealthCheck = async () => {
  try {
    const response = await getAPI("/api/health");
    return response;
  } catch (error) {
    console.error("Error on api health check:", error);
    throw error;
  }
};

export const addProductRecords = async (productData, successCallBack) => {
  const formData = new FormData();

  // Append the product data to the form
  for (const key in productData) {
    if (key !== "images") {
      // Skip the `images` key, as we'll handle it separately
      formData.append(key, productData[key]);
    }
  }

  // Append each image file in the images array
  if (productData?.images?.length) {
    productData.images.forEach((file) => {
      formData.append("images", file); // Just append as a single field
    });
  }

  try {
    const response = await postAPI(
      `/api/tables/${API_CONFIG.tableName}/records?overwrite=true`, // overwrite to use same image in multiple places
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // pass this if you want to send custom headers , if it is json dont send
        },
      }
    );
    if (response.status === "success") {
      successCallBack();
    }
    return response;
  } catch (error) {
    console.error("Error in addProductRecords:", error);
    throw error;
  }
};

export const getProductRecords = async () => {
  try {
    const response = await getAPI(
      `/api/tables/${API_CONFIG.tableName}/records`
    );
    return response;
  } catch (error) {
    console.error("Error in getProductRecords:", error);
    throw error;
  }
};

export const deleteProductRecords = async (product_id, successCallBack) => {
  try {
    const response = await deleteAPI(
      `/api/tables/${API_CONFIG.tableName}/records/${product_id}`
    );
    if (response?.status === "success") {
      successCallBack();
    }
    return response;
  } catch (error) {
    console.error("Error in deleteProductRecords:", error);
    throw error;
  }
};

export const editProductRecord = async (
  productId,
  productData,
  successCallBack
) => {
  const formData = new FormData();

  // Append the product data to the form
  for (const key in productData) {
    if (key !== "images") {
      formData.append(key, productData[key]);
    }
  }

  // Append images if they exist
  if (productData?.images?.length) {
    productData.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  try {
    const response = await postAPI(
      `/api/tables/${API_CONFIG.tableName}/records/${productId}`,
      formData,
      {
        method: "PUT", // Use PUT method for updating
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === "success") {
      successCallBack();
    }

    return response;
  } catch (error) {
    console.error("Error in editProductRecord:", error);
    throw error;
  }
};
