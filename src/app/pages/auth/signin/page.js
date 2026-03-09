"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Alert, Button, Checkbox, Form, Input, Divider } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { openNotification } from "../../../../utils/notificationResponse";
import axiosInstance from "../../../../utils/axiosInstance";

const Auth = dynamic(() => import("../index"), { ssr: false });

const SignIn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError(null);
      let payloud = {
        email: values.email,
        password: values.password,
      };
      const response = await axiosInstance.post("/api/auth/login", payloud);

      if (response.status === 200) {
        const userData = response.data;

        localStorage.setItem("user", JSON.stringify(userData));

        openNotification("success", "Амжилттай", "Та системд нэвтэрлээ.");
        router.push("/pages/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.log("error : " + JSON.stringify(err));

      let errorMessage = "Имэйл эсвэл нууц үг буруу байна.";

      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      } else if (err.request) {
        errorMessage = "Сервертэй холбогдож чадсангүй (Backend асаалттай юу?)";
      }

      setError(errorMessage);
      openNotification("warning", "Алдаа", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Auth>
        <div style={{ marginBottom: "24px" }}>
          <h3>Хэрэглэгчийн системд нэвтрэх</h3>
          <p style={{ color: "#8c8c8c" }}>
            Өөрийн бүртгэлтэй имэйл хаягаар нэвтэрнэ үү.
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
          onFinish={onFinish}
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
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Намайг сана</Checkbox>
            </Form.Item>
            <Link href="/pages/auth/forgot" style={{ float: "right" }}>
              Нууц үгээ мартсан?
            </Link>
          </Form.Item>

          <Form.Item>
            <Button
              size="large"
              type="primary"
              loading={loading}
              block
              htmlType="submit"
              style={{ height: "45px", fontSize: "16px" }}
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
              onClick={() => router.push("/pages/auth/signup")}
              style={{ height: "45px" }}
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
