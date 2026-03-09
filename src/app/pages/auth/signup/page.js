"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Row, Col, Form, Input, Button } from "antd";
import { inject, observer } from "mobx-react";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import Countdown from "antd/lib/statistic/Countdown";
import { useRouter } from "next/navigation";
import { openNotification } from "../../../../utils/notificationResponse";

const Auth = dynamic(() => import("../index"), { ssr: false });

const SignUp = observer(({ registerStore }) => {
  const router = useRouter();
  const { loading } = registerStore;
  const [codeSent, setCodeSent] = useState(false);
  const [username, setUsername] = useState("");

  const onFinish = (values) => {
    registerStore.sendCode(values).then((response) => {
      openNotification(
        response?.result ? "success" : "warning",
        response?.result ? response?.data : response?.message || "",
      );

      if (response?.result) {
        router.push("/pages/auth/signin");
      }
    });
  };

  const onFinishActivate = (values) => {
    registerStore.activate(values.code, username).then((response) => {
      openNotification(
        response?.result ? "success" : "warning",
        response?.result ? response?.data : response?.message || "",
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
        <>
          <Countdown
            title="Хугацаа"
            value={deadline}
            onFinish={() => setCodeSent(false)}
          />
          <Form name="signup" scrollToFirstError onFinish={onFinishActivate}>
            <Form.Item
              name="code"
              rules={[
                { required: true, message: "Баталгаажуулах код оруулна уу." },
              ]}
            >
              <Input
                size="large"
                prefix={<KeyOutlined />}
                placeholder="Баталгаажуулах код"
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
          </Form>
        </>
      ) : (
        <>
          <h3>Хэрэглэгчийн бүртгэл</h3>
          <Form name="signup" scrollToFirstError onFinish={onFinish}>
            <Row gutter={15}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  rules={[{ required: true, message: "Нэр бичнэ үү" }]}
                >
                  <Input
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="Таны нэр"
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="lastName"
                  rules={[
                    { required: true, message: "Эцэг/ эхийн нэр бичнэ үү" },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="Эцэг/ эхийн нэр"
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
                placeholder="Нууц үгээ давтах"
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
const SignUpWrapper = inject((stores) => ({
  registerStore: stores.registerStore,
}))(SignUp);

export default SignUpWrapper;
