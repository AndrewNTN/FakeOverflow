import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "https://fake-overflow-api.onrender.com",
  withCredentials: true,
});

export default axiosInstance;
