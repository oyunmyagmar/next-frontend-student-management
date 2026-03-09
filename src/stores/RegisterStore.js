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
        "http://localhost:8086/api/auth/send-code", // URL хэвээрээ байна
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

  // 2. Код баталгаажуулж бүртгэл идэвхжүүлэх
  // async activate(code, username) {
  //   this.loading = true;
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8086/api/auth/activate",
  //       { code, username },
  //     );
  //     return { result: true, data: response.data };
  //   } catch (error) {
  //     return {
  //       result: false,
  //       message: error.response?.data?.message || "Баталгаажуулалт амжилтгүй",
  //     };
  //   } finally {
  //     this.loading = false;
  //   }
  // }

  // 3. Нэвтрэх логик (Хэрэв Next-Auth-аас гадуур MobX-оор удирдах бол)
  // Жишээ нь: Профайл мэдээлэл татах
  async fetchUserProfile() {
    try {
      const response = await axios.get("http://localhost:8086/api/user/me");
      this.user = response.data;
    } catch (error) {
      console.error("Профайл татахад алдаа гарлаа");
    }
  }
}

export default RegisterStore;
