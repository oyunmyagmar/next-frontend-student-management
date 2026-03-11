// useSessionTimeout.js
"use client";

import { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { Modal, message } from "antd";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../utils/axiosInstance";

export const useSessionTimeout = () => {
  const { data: session } = useSession();
  const [timeLeft, setTimeLeft] = useState(null);
  const modalOpened = useRef(false);

  useEffect(() => {
    if (!session?.accessToken) return;

    const checkTokenOnClient = () => {
      try {
        const decoded = jwtDecode(session.accessToken);
        const currentTime = Date.now() / 1000;
        const remaining = decoded.exp - currentTime;

        setTimeLeft(Math.max(0, Math.floor(remaining)));

        if (remaining <= 0) {
          signOut({ callbackUrl: "/auth/signin" });
          message.error("Таны сесс дууссан тул автоматаар гарлаа.");
          return;
        }

        if (remaining <= 20 && remaining > 0 && !modalOpened.current) {
          modalOpened.current = true;

          Modal.warning({
            title: "Анхааруулга!",
            content: "Таны сесс 20 хүрэхгүй секундын дараа дуусах гэж байна.",
            okText: "Ойлголоо",
            onOk: () => {},
          });
        }
      } catch (error) {
        console.error("Token decoding error:", error);
      }
    };

    const clientInterval = setInterval(checkTokenOnClient, 1000);
    const serverInterval = setInterval(() => {
      axiosInstance.get("/api/auth/check-token").catch(() => {});
    }, 60000);

    return () => {
      clearInterval(clientInterval);
      clearInterval(serverInterval);
    };
  }, [session]);

  return { timeLeft };
};
