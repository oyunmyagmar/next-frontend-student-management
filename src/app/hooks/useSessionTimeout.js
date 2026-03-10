// useSessionTimeout.js
"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Modal, message } from "antd";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../utils/axiosInstance";

export const useSessionTimeout = () => {
  const { data: session } = useSession();
  const [warningShown, setWarningShown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

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

        // 20 секундээс бага үлдвэл анхааруулах
        if (remaining <= 20 && remaining > 0 && !warningShown) {
          setWarningShown(true);
          Modal.warning({
            title: "Анхааруулга!",
            content: "Таны сесс 20 хүрэхгүй секундын дараа дуусах гэж байна.",
            okText: "Ойлголоо",
            onOk: () => {
              setWarningShown(true);
            },
          });
        }
      } catch (error) {
        console.error("Token decoding error:", error);
      }
    };

    // Таймерууд
    const clientInterval = setInterval(checkTokenOnClient, 1000); // 1 сек тутамд (UI-д харуулах бол хурдан байх хэрэгтэй)
    const serverInterval = setInterval(() => {
      axiosInstance.get("/api/auth/check-token").catch(() => {});
    }, 6000);

    return () => {
      clearInterval(clientInterval);
      clearInterval(serverInterval);
    };
  }, [session, warningShown]);

  return { timeLeft };
};
