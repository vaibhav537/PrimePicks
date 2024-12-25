import axios from "axios";
import { Helper } from "../utils/HelperClient";
const apiURL = "http://localhost:5000";
const jwtKey = "accessToken";
const adminKey = "adminToken";
const adminRedirect = "/admin";
const userRedirect = "/login";

axios.interceptors.request.use(
  (config) => {
    if (config.url) {
      const { origin } = new URL(config.url);
      const allowedOrigins = [apiURL];
      const accessToken =
        localStorage.getItem(jwtKey) || localStorage.getItem(adminKey);
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

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const helper = new Helper();
    const status = error.response?.status;
    if (status === 401 || status === 403 || !status) {
      const isAdmin: boolean = Boolean(localStorage.getItem(adminKey));
      if (isAdmin) {
        window.location.href = adminRedirect;
        helper.showErrorMessage("Session Expired");
      } else {
        window.location.href = userRedirect;
        helper.showErrorMessage("Session Expired");
      }
    }
    return Promise.reject(error);
  }
);
/**
 * Create a fully qualified URL from an endpoint.
 * @param {string} endPoint - API endpoint.
 * @returns {string} Fully qualified URL.
 */
export const createUrl = (endPoint: string): string => new URL(endPoint, apiURL).href;

/**
 * Check if a JWT is stored in localStorage.
 * @returns {boolean} True if the JWT is stored.
 */
export const isStoredJWT = () => Boolean(localStorage.getItem(jwtKey));

// export const isAdminStoredJWT = () => Boolean(localStorage.getItem(adminKey));

/**
 * Store a JWT in localStorage.
 * @param {string} accessToken - The JWT to store.
 */
export const setStoredJWT = (accessToken: string) =>
  localStorage.setItem(jwtKey, accessToken);

/**
 * Store an admin JWT in localStorage.
 * @param {string} accessToken - The admin JWT to store.
 */
export const setAdminStoredJWT = (accessToken: string) =>
  localStorage.setItem(adminKey, accessToken);

/**
 * Check if an admin JWT is stored in localStorage.
 * @param {boolean} allowForClient - If true, bypasses the localStorage check and always returns true.
 *                                   Useful for scenarios where client-side access is guaranteed.
 * @returns {boolean} True if the admin JWT is stored or `allowForClient` is true.
 */
export const isAdminStoredJWT = (allowForClient: boolean = false): boolean => {
  if (allowForClient) {
    return true;
  }
  // Check if `window` is defined (i.e., client-side environment)
  if (typeof window === "undefined") {
    return false; // Returning false if SSR or `localStorage` isn't available
  }
  return !!localStorage.getItem(adminKey);
};

/**
 * Utility methods to use axios for HTTP requests.
 */
export const get = axios.get;
export const patch = axios.patch;
export const post = axios.post;
export const axiosDelete = axios.delete;
