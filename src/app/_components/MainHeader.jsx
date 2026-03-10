"use client";

import React from "react";
import { Layout, Button, Space, Avatar, Dropdown, Typography } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const { Header } = Layout;
const { Text } = Typography;

export default function MainHeader() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const items = [
    {
      key: "profile",
      label: "Миний профайл",
      icon: <UserOutlined />,
    },
    {
      key: "logout",
      label: "Системээс гарах",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => signOut({ callbackUrl: "/auth/signin" }),
    },
  ];

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff",
        padding: "0 2%",
        borderBottom: "1px solid #f0f0f0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        height: "70px",
      }}
    >
      <div
        style={{
          fontWeight: "800",
          fontSize: "24px",
          color: "#1890ff",
          cursor: "pointer",
          letterSpacing: "1px",
        }}
        onClick={() => router.push("/")}
      >
        STUDENT.MN
      </div>

      {/* 2. Баруун талын хэсэг */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {status === "authenticated" ? (
          <Dropdown menu={{ items }} placement="bottomRight" arrow>
            <Space
              style={{
                cursor: "pointer",
                padding: "6px 16px", // Дотор зайг нэмэв
                borderRadius: "25px",
                background: "#f8f9fa",
                border: "1px solid #f0f0f0",
                transition: "all 0.3s",
              }}
              className="header-user-dropdown"
            >
              <div style={{ textAlign: "right", marginRight: "8px" }}>
                <Text
                  strong
                  style={{
                    fontSize: "14px",
                    display: "block",
                    lineHeight: "1",
                  }}
                >
                  {session.user?.name || "Хэрэглэгч"}
                </Text>
                <Text type="secondary" style={{ fontSize: "11px" }}>
                  {session.user?.email}
                </Text>
              </div>
              <Avatar
                size="large" // Аватарыг томруулав
                style={{ backgroundColor: "#1890ff" }}
                icon={<UserOutlined />}
                src={session.user?.image}
              />
            </Space>
          </Dropdown>
        ) : (
          <Space size="middle">
            {" "}
            {/* Товчнууд хоорондын зайг нэмэв */}
            <Button
              type="text"
              size="large"
              icon={<LoginOutlined />}
              onClick={() => router.push("/auth/signin")}
            >
              Нэвтрэх
            </Button>
            <Button
              type="primary"
              size="large" // Товчийг томруулав
              icon={<UserAddOutlined />}
              style={{ borderRadius: "8px", fontWeight: "600" }}
              onClick={() => router.push("/auth/signup")}
            >
              Бүртгүүлэх
            </Button>
          </Space>
        )}
      </div>
    </Header>
  );
}
