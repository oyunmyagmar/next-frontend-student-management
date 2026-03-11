"use client";

import dynamic from "next/dynamic";
import { Row, Col, Form, Input, Button } from "antd";
import { observer } from "mobx-react";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { openNotification } from "../../../utils/notificationResponse";
import { registerStore } from "../../../stores";
import Countdown from "antd/es/statistic/Countdown";

const Auth = dynamic(() => import("../index"), { ssr: false });

const SignUp = observer(() => {
  const router = useRouter();
  const { loading } = registerStore;
  const [codeSent, setCodeSent] = useState(false);
  const [username, setUsername] = useState("");

  // 1. Бүртгүүлэх хүсэлт илгээх
  const onFinish = (values) => {
    registerStore.sendCode(values).then((response) => {
      openNotification(
        response?.result ? "success" : "warning",
        response?.result
          ? "Баталгаажуулах код имэйлээр илгээгдлээ."
          : response?.message || "Алдаа гарлаа",
      );

      if (response?.result) {
        setUsername(values.email);
        setCodeSent(true);
      }
    });
  };

  // 2. Кодоо баталгаажуулаад нэвтрэх рүү шилжих
  const onFinishActivate = (values) => {
    registerStore.activate(values.code, username).then((response) => {
      openNotification(
        response?.result ? "success" : "warning",
        response?.result ? "Амжилттай баталгаажлаа." : response?.message || "",
      );
      if (response?.result) {
        router.push("/auth/signin");
      }
    });
  };

  const deadline = Date.now() + 295 * 1000;

  return (
    <Auth>
      {codeSent ? (
        <div style={{ textAlign: "center" }}>
          <Countdown
            title="Код хүчинтэй хугацаа"
            value={deadline}
            onFinish={() => setCodeSent(false)}
          />
          <Form
            name="activate"
            scrollToFirstError
            onFinish={onFinishActivate}
            layout="vertical"
          >
            <Form.Item
              name="code"
              rules={[
                { required: true, message: "Баталгаажуулах код оруулна уу." },
              ]}
            >
              <Input
                size="large"
                prefix={<KeyOutlined />}
                placeholder="6 оронтой код"
              />
            </Form.Item>
            <Form.Item>
              <Button
                loading={loading}
                size="large"
                type="primary"
                block
                htmlType="submit"
              >
                Баталгаажуулах
              </Button>
            </Form.Item>
            <Button type="link" onClick={() => setCodeSent(false)}>
              Буцах
            </Button>
          </Form>
        </div>
      ) : (
        <>
          <h3 style={{ marginBottom: 24 }}>Хэрэглэгчийн бүртгэл</h3>
          <Form name="signup" layout="vertical" onFinish={onFinish}>
            <Row gutter={15}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  rules={[{ required: true, message: "Нэр бичнэ үү" }]}
                >
                  <Input
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="Нэр"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  rules={[{ required: true, message: "Овог бичнэ үү" }]}
                >
                  <Input
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="Овог"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="email"
              rules={[
                { type: "email", message: "Имэйл хаягаа зөв бичнэ үү" },
                { required: true, message: "Имэйл хаяг бичнэ үү" },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="Имэйл"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Нууц үг бичнэ үү" }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Нууц үг"
              />
            </Form.Item>
            <Form.Item
              name="confirm"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Нууц үгээ давтана уу" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value)
                      return Promise.resolve();
                    return Promise.reject(new Error("Нууц үг таарахгүй байна"));
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Нууц үг давтах"
              />
            </Form.Item>
            <Form.Item>
              <Button
                loading={loading}
                size="large"
                type="primary"
                block
                htmlType="submit"
              >
                Бүртгүүлэх
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </Auth>
  );
});

export default SignUp;
