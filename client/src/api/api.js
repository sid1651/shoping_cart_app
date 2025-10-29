import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_PROD_URL, // backend base URL
});

export default api;
