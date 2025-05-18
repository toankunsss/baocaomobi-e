import axios from "axios";
const BASE_URL = axios.create({
  baseURL: "http://192.168.1.8:5000/api",
  headers: { "Content-Type": "application/json" },
});
export default BASE_URL;
