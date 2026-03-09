import axios from "axios";

const api = axios.create({
  baseURL: "https://yumzy-food-ordering.onrender.com/api", // your backend
  withCredentials: true, // VERY IMPORTANT
});

export default api;