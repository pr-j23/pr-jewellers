import api from "./api";

// Generic function to handle API requests
const apiRequest = async (method, url, data = null) => {
  try {
    const response = await api({ method, url, data });
    console.log(
      `${method.toUpperCase()} request to ${url} successful:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error with ${method.toUpperCase()} request to ${url}:`,
      error
    );
    throw error;
  }
};

// Health check
const checkHealth = () => apiRequest("get", "/health");

// Create table
const createTable = (tableData) =>
  apiRequest("post", "/tables/create", tableData);

// Create columns
const createColumns = (tableName, columnsData) =>
  apiRequest("post", `/tables/${tableName}/columns`, columnsData);

// Create record
const createRecord = (tableName, recordData) =>
  apiRequest("post", `/tables/${tableName}/records`, recordData);

// Fetch records
const fetchRecords = (tableName) =>
  apiRequest("get", `/tables/${tableName}/records`);

// Update record
const updateRecord = (tableName, productId, updatedData) =>
  apiRequest("put", `/tables/${tableName}/records/${productId}`, updatedData);
