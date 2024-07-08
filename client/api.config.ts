import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "fake-overflow-api.onrender.com",
});

export default axiosInstance;
