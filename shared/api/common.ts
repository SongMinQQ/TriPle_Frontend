import axios from "axios";
import { TOAST_MESSAGES } from "../constants/toast";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_ADDRESS;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      void import("@/shared/hooks/use-toast").then(({ toast }) => {
        toast({
          variant: "destructive",
          title: TOAST_MESSAGES.SESSION_EXPIRED.title,
          description: TOAST_MESSAGES.SESSION_EXPIRED.description,
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
