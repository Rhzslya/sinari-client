import axios, { isAxiosError } from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    const publicEndpoints = ["/login", "/register"];

    const isPublic = publicEndpoints.some((endpoint) =>
      config.url?.endsWith(endpoint),
    );

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response) {
      const { status, data, config } = error.response;
      const errorCode = data?.code;

      if (config.skipGlobalErrorHandler) {
        return Promise.reject(error);
      }

      if (status === 401) {
        const isLoginRequest = config.url?.endsWith("/login");

        if (!isLoginRequest) {
          if (errorCode === "SESSION_EXPIRED") {
            toast.error("Session Ended", {
              description: "You have logged in on another device.",
              duration: 5000,
            });
          } else {
            toast.error("Session Expired", {
              description: "Please login again.",
            });
          }

          localStorage.removeItem("token");
          localStorage.removeItem("role");

          window.location.href = "/login";
        }

        return Promise.reject(error);
      }

      if (status === 403) {
        const isLoginRequest = config.url?.endsWith("/login");
        if (!isLoginRequest) {
          toast.error("Access Denied", {
            description: "You do not have permission to access this resource.",
          });
        }
      }
    }

    return Promise.reject(error);
  },
);
