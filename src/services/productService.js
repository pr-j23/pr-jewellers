import axios from "axios";
import { API_CONFIG } from "./apiConfig";

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
    const response = await axios.post(
      `${API_CONFIG.hostUrl}/api/tables/${API_CONFIG.tableName}/records`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding data:", error);
    throw error;
  }
};
