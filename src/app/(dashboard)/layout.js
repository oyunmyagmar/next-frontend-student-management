"use client";
import React, { useState } from "react";
import {
  Layout,
  Menu,
  Button,
  theme,
  Space,
  Avatar,
  Badge,
  Form,
  Modal,
  Divider,
  Input,
  message,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  BellOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import axiosInstance from "../../utils/axiosInstance";
import SessionTimer from "../_components/SessionTimer";
import { useSessionTimeout } from "../hooks/useSessionTimeout";

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const pathname = usePathname();
  useSessionTimeout();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleAddStudent = async (values) => {
    try {
      const response = await axiosInstance.post("/api/create-student", values);
      console.log("Бүртгэх утгууд:", values);

      message.success(response.message || "Оюутан амжилттай бүртгэгдлээ!");

      form.resetFields();
      setIsModalOpen(false);
      window.dispatchEvent(new Event("studentAdded"));
    } catch (error) {
      message.error(error.message || "Бүртгэхэд алдаа гарлаа.");
      console.error("Student add error:", error);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 101,
        }}
      >
        <div
          style={{
            height: 32,
            margin: "24px 10px",
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: collapsed ? "12px" : "16px",
          }}
        >
          {collapsed ? "SMS" : "STUDENT MGMT"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          onClick={({ key }) => {
            if (key === "logout") {
              signOut({ callbackUrl: "/auth/signin" });
            } else {
              router.push(key);
            }
          }}
          items={[
            {
              key: "/dashboard",
              icon: <DashboardOutlined />,
              label: "Хянах самбар",
            },
            { key: "/students", icon: <TeamOutlined />, label: "Оюутнууд" },
            { key: "/teachers", icon: <TeamOutlined />, label: "Багш нар" },

            {
              key: "logout",
              icon: <LogoutOutlined />,
              label: "Гарах",
              danger: true,
            },
          ]}
        />
      </Sider>

      <Layout
        style={{ marginLeft: collapsed ? 80 : 240, transition: "all 0.2s" }}
      >
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 100,
            boxShadow: "0 1px 4px rgba(0,21,41,0.08)",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />

          <Space size={24}>
            <SessionTimer />
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setIsModalOpen(true)}
              style={{ borderRadius: "6px" }}
            >
              Оюутан бүртгэх
            </Button>
          </Space>
        </Header>

        <Content
          style={{
            margin: "24px 24px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>

        <Modal
          title="Шинэ оюутан бүртгэх"
          open={isModalOpen}
          onOk={() => form.submit()}
          onCancel={() => setIsModalOpen(false)}
          okText="Бүртгэх"
          cancelText="Цуцлах"
          destroyOnHidden
        >
          <Divider />
          <Form form={form} layout="vertical" onFinish={handleAddStudent}>
            <Form.Item
              label="Овог"
              name="lastName"
              rules={[{ required: true, message: "Овгоо оруулна уу!" }]}
            >
              <Input placeholder="Жишээ: Бат" />
            </Form.Item>

            <Form.Item
              label="Нэр"
              name="firstName"
              rules={[{ required: true, message: "Нэрээ оруулна уу!" }]}
            >
              <Input placeholder="Жишээ: Болд" />
            </Form.Item>

            <Form.Item
              label="Имэйл хаяг"
              name="email"
              rules={[
                { required: true, message: "Имэйл оруулна уу!" },
                { type: "email", message: "Зөв имэйл хаяг оруулна уу!" },
              ]}
            >
              <Input placeholder="example@student.mn" />
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </Layout>
  );
}
