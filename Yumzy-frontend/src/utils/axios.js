import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:2411/api", // your backend
  withCredentials: true, // VERY IMPORTANT
});

export default api;