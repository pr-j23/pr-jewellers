import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "{{host_url}}/api",
  timeout: 5000,
});

export default api;
