"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Alert, Button, Checkbox, Form, Input, Divider } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { signIn } from "next-auth/react"; // NextAuth-ийн функцийг импортлох
import { openNotification } from "../../../utils/notificationResponse";

const Auth = dynamic(() => import("../index"), { ssr: false });

const SignIn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError(null);

      // 1. NextAuth-ийн signIn функцийг дуудах
      // Энэ нь цаанаа /api/auth/[...nextauth]/route.js доторх authorize() логикийг ажиллуулна
      const result = await signIn("credentials", {
        redirect: false, // Амжилттай болвол шууд үсрэхгүй, бид өөрсдөө Notification харуулахын тулд
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        // Хэрэв Backend-ээс алдаа ирвэл (Нууц үг буруу, эсвэл идэвхжээгүй гэх мэт)
        setError(result.error);
        openNotification("warning", "Алдаа", result.error);
      } else {
        // 2. Амжилттай болвол
        openNotification("success", "Амжилттай", "Та системд нэвтэрлээ.");

        // Dashboard руу шилжих
        router.push("/dashboard");
        // Next.js-ийн сессийг шинэчлэхийн тулд refresh хийнэ
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
    <>
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
            closable
            style={{ marginBottom: "20px" }}
            onClose={() => setError(null)}
          />
        )}

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish} // Form-ын утгыг onFinish функц рүү дамжуулна
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Имэйл хаягаа бичнэ үү!" },
              { type: "email", message: "Имэйл хаяг формат буруу байна!" },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Имэйл хаяг"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Нууц үгээ бичнэ үү!" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Нууц үг"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Намайг сана</Checkbox>
            </Form.Item>
            <Link
              href="/auth/forgot"
              style={{ float: "right", color: "#1890ff" }}
            >
              Нууц үгээ мартсан уу?
            </Link>
          </Form.Item>

          <Form.Item>
            <Button
              size="large"
              type="primary"
              loading={loading}
              block
              htmlType="submit"
              style={{
                height: "45px",
                fontSize: "16px",
                borderRadius: "8px",
                backgroundColor: "#1890ff",
              }}
            >
              Нэвтрэх
            </Button>
          </Form.Item>

          <Divider plain>
            <span style={{ color: "#d9d9d9" }}>Эсвэл</span>
          </Divider>

          <Form.Item>
            <Button
              size="large"
              block
              onClick={() => router.push("/auth/signup")}
              style={{
                height: "45px",
                borderRadius: "8px",
              }}
            >
              Шинээр бүртгүүлэх
            </Button>
          </Form.Item>
        </Form>
      </Auth>
    </>
  );
};

export default SignIn;
