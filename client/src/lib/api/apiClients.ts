import axios from "axios";

const apiURL = "http://localhost:5000";
const jwtKey = "accessToken";
const adminKey = "adminToken";

axios.interceptors.request.use(
  (config) => {
    if (config.url) {
      const { origin } = new URL(config.url);
      const allowedOrigins = [apiURL];
      const accessToken = localStorage.getItem(jwtKey);
      if (allowedOrigins.includes(origin)) {
        config.headers.authorization = "Bearer " + accessToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createUrl = (endPoint: string) => new URL(endPoint, apiURL).href;

export const isStoredJWT = () => Boolean(localStorage.getItem(jwtKey));

export const isAdminStoredJWT = () => Boolean(localStorage.getItem(adminKey));

export const setStoredJWT = (accessToken: string) =>
  localStorage.setItem(jwtKey, accessToken);

export const setAdminStoredJWT = (accessToken: string) =>
  localStorage.setItem(adminKey, accessToken);

export const get = axios.get;
export const patch = axios.patch;
export const post = axios.post;
export const axiosDelete = axios.delete;
