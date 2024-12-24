import axios from "axios";
import { postAPI } from "../utils/axios";
import { API_CONFIG } from "./apiConfig";

export const handleHealthCheck = async () => {
  try {
    const response = await axios.get(`${API_CONFIG.hostUrl}/api/health`);
    return response?.data;
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
    return response.data;
  } catch (error) {
    console.error("Error adding data:", error);
    throw error;
  }
};
