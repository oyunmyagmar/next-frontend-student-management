import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

class RegisterStore {
  loading = false;
  user = null;

  constructor() {
    makeAutoObservable(this);
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
      return response.data;
    } catch (error) {
      return {
        result: false,
        message: error.response?.data?.message || "Бүртгэл амжилтгүй боллоо",
      };
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async activate(code, username) {
    this.loading = true;
    try {
      const response = await axios.post(
        "http://localhost:8086/api/auth/activate",
        { code, username },
      );
      return response.data;
      // return { result: true, data: response.data };
    } catch (error) {
      return {
        result: false,
        message: error.response?.data?.message || "Баталгаажуулалт амжилтгүй",
      };
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

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
