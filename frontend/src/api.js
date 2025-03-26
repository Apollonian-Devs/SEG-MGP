import axios from "axios";
import { ACCESS_TOKEN } from "./constants";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://apolloniandevs.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
