import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8086",
  timeout: 30000, // 30 секунд болгож сунгав (файлын ажиллагаа болон хүнд query-д хэрэгтэй)
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    const token = session?.token || session?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Токен дууссан байна. Системээс гаргаж байна...");

      await signOut({ callbackUrl: "/auth/signin" });
    }
    return Promise.reject(error);
    // const originalRequest = error.config;

    // // Хэрэв токен хүчингүй болсон (401) бол системээс гаргах эсвэл рефреш хийх
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   console.error("Authorization expired or invalid.");
    //   // Хэрэв client талд байгаа бол signOut хийх
    //   if (typeof window !== "undefined") {
    //     // signOut({ callbackUrl: '/auth/login' });
    //   }
    // }

    // Алдааны мессежийг илүү ойлгомжтой болгох
    // const customError = {
    //   message: error.response?.data?.message || "Системд алдаа гарлаа",
    //   status: error.response?.status,
    //   data: error.response?.data,
    // };

    // return Promise.reject(customError);
  },
);

export default axiosInstance;
