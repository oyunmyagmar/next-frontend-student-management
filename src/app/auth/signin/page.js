"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Alert, Button, Checkbox, Form, Input, Divider } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { signIn } from "next-auth/react";
import { openNotification } from "../../../utils/notificationResponse";

const Auth = dynamic(() => import("../index"), { ssr: false });

const SignIn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);

    try {
      // credentials-аар нэвтрэх хүсэлт илгээх
      const result = await signIn("credentials", {
        redirect: false, // Хуудсыг шууд refresh хийхээс сэргийлнэ
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        // authorize() функцээс шидсэн throw new Error() энд ирнэ
        setError(result.error);
        openNotification("error", "Нэвтрэхэд алдаа гарлаа", result.error);
      } else if (result?.ok) {
        openNotification("success", "Амжилттай", "Та системд нэвтэрлээ.");

        // Dashboard руу шилжих
        router.push("/dashboard");
        // Сессийг бүрэн шинэчлэх
        router.refresh();
      }
    } catch (err) {
      setError("Системд холбогдоход алдаа гарлаа.");
      openNotification("error", "Алдаа", "Сервертэй холбогдож чадсангүй.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Auth>
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Системд нэвтрэх
        </h3>
        <p style={{ color: "#8c8c8c" }}>
          Бүртгэлтэй имэйл хаяг болон нууц үгээ ашиглана уу.
        </p>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: "20px" }}
        />
      )}

      <Form name="login_form" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Имэйл хаягаа бичнэ үү!" },
            { type: "email", message: "Имэйл хаяг буруу байна!" },
          ]}
        >
          <Input
            size="large"
            prefix={<MailOutlined />}
            placeholder="Имэйл хаяг"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Нууц үгээ бичнэ үү!" }]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="Нууц үг"
          />
        </Form.Item>

        <Form.Item>
          <Checkbox name="remember">Намайг сана</Checkbox>
          <Link href="/auth/forgot" style={{ float: "right" }}>
            Мартсан уу?
          </Link>
        </Form.Item>

        <Form.Item>
          <Button
            size="large"
            type="primary"
            loading={loading}
            block
            htmlType="submit"
          >
            Нэвтрэх
          </Button>
        </Form.Item>

        <Divider plain>Эсвэл</Divider>

        <Button size="large" block onClick={() => router.push("/auth/signup")}>
          Шинээр бүртгүүлэх
        </Button>
      </Form>
    </Auth>
  );
};

export default SignIn;
