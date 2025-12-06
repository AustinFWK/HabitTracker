import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

let getTokenFunction: (() => Promise<string | null>) | null = null;

export const setAuthTokenGetter = (
  tokenGetter: () => Promise<string | null>
) => {
  getTokenFunction = tokenGetter;
};

axiosInstance.interceptors.request.use(
  async (config) => {
    if (getTokenFunction) {
      const token = await getTokenFunction();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
