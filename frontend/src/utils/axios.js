// src/utils/axios.js

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:7000/api/v1",
  withCredentials: true,
});

// Optional: automatic refresh‐token handling
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ reject, resolve }) => {
    error ? reject(error) : resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const originalReq = err.config;
    if (
      err.response?.status === 401 &&
      !originalReq._retry &&
      !originalReq.url.includes("/users/login") &&
      !originalReq.url.includes("/users/refresh-token")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalReq));
      }

      originalReq._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        api
          .post("/users/refresh-token")
          .then(() => {
            processQueue(null);
            resolve(api(originalReq));
          })
          .catch((e) => {
            processQueue(e);
            reject(e);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(err);
  }
);

export default api;
