import axios from "axios";
import { ACCESS_TOKEN } from "./constants";


const api = axios.create({
  baseURL: 'apolloniandevs.onrender.com' || '/api'
});

export default api;
