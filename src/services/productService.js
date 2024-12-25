import { getAPI, postAPI } from "../utils/axios";
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

export const addProductRecords = async (productData, imageFile) => {
  const formData = new FormData();

  // Append the product data to the form
  for (const key in productData) {
    formData.append(key, productData[key]);
  }

  // Append the image file if it's provided
  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const response = await postAPI(
      `/api/tables/${API_CONFIG.tableName}/records`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // pass this if you want to send custom headers , if it is json dont send
        },
      }
    );
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
