import { makeAutoObservable } from "mobx";
import axios from "axios";

class RegisterStore {
  loading = false;

  constructor() {
    makeAutoObservable(this); // Энэ нь loading өөрчлөгдөхөд React-д мэдэгдэнэ
  }

  // Баталгаажуулах код илгээх (Backend-ийн POST /api/auth/signup-тай холбогдоно)
  async sendCode(values) {
    this.loading = true;
    try {
      const response = await axios.post(
        "http://localhost:8083/api/auth/send-code", // URL хэвээрээ байна
        values, // Энд firstName, lastName, username, password бүгд явна
      );
      // Амжилттай болбол Backend-ээс ирсэн мессежийг буцаана
      return { result: true, data: response.data };
    } catch (error) {
      return {
        result: false,
        message: error.response?.data?.message || "Бүртгэл амжилтгүй боллоо",
      };
    } finally {
      this.loading = false;
    }
  }
}

export default RegisterStore;
