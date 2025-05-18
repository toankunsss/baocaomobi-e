import axios from "axios";
const BASE_URL = axios.create({
  baseURL: "http://192.168.1.8:3000",
  headers: { "Content-Type": "application/json" },
});
export default BASE_URL;
