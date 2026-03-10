import axios from "axios";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8086",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Хүсэлт явахын өмнө токен нэмэх
axiosInstance.interceptors.request.use(
  async (config) => {
    // NextAuth-ийн сессийг авна
    const session = await getSession();

    // session.accessToken нь бидний authOptions-ийн callback дотор тохируулсан нэр
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Хариултыг цэгцлэх
axiosInstance.interceptors.response.use(
  (response) => {
    // Backend-ийн бүтцээс хамаарч response.data-г шууд буцаана
    return response.data;
  },
  (error) => {
    // 401 (Unauthorized) алдаа ирвэл токен дууссан гэсэн үг
    if (error.response?.status === 401) {
      console.error("Токен хүчингүй болсон байна.");
      // Энд шаардлагатай бол signOut() дуудаж болно
    }

    return Promise.reject({
      message: error.response?.data?.message || "Системд алдаа гарлаа",
      status: error.response?.status,
    });
  },
);

export default axiosInstance;

// import axios from "axios";
// import { getSession, signOut } from "next-auth/react";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8086",
//   timeout: 30000, // 30 секунд болгож сунгав (файлын ажиллагаа болон хүнд query-д хэрэгтэй)
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // 1. Request Interceptor: Токеныг автоматаар нэмэх
// axiosInstance.interceptors.request.use(
//   async (config) => {
//     // Next-auth сессээс токеныг авна
//     const session = await getSession();
//     const token = session?.token || session?.accessToken;

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// // 2. Response Interceptor: Алдааг удирдах
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Backend-ээс ирсэн өгөгдлийг шууд .data-гаар нь буцаах (кодоо цэгцтэй болгоно)
//     return response.data;
//   },
//   async (error) => {
//     // const originalRequest = error.config;

//     // // Хэрэв токен хүчингүй болсон (401) бол системээс гаргах эсвэл рефреш хийх
//     // if (error.response?.status === 401 && !originalRequest._retry) {
//     //   console.error("Authorization expired or invalid.");
//     //   // Хэрэв client талд байгаа бол signOut хийх
//     //   if (typeof window !== "undefined") {
//     //     // signOut({ callbackUrl: '/auth/login' });
//     //   }
//     // }

//     // Алдааны мессежийг илүү ойлгомжтой болгох
//     const customError = {
//       message: error.response?.data?.message || "Системд алдаа гарлаа",
//       status: error.response?.status,
//       data: error.response?.data,
//     };

//     return Promise.reject(customError);
//   },
// );

// export default axiosInstance;
