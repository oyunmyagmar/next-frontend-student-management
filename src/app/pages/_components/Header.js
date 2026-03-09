"use client";

import React from "react";
import { Layout, Button, Space, Typography, Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Header } = Layout;
const { Text } = Typography;

export default function Header() {
  // Хэрэглэгчийн цэс (Dropdown)
  const userMenuItems = {
    items: [
      {
        key: "1",
        label: "Профайл засах",
        icon: <SettingOutlined />,
      },
      {
        type: "divider",
      },
      {
        key: "2",
        label: "Системээс гарах",
        icon: <LogoutOutlined />,
        danger: true,
        onClick: () => console.log("Logout clicked"),
      },
    ],
  };

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff", // Цагаан дэвсгэр
        padding: "0 24px",
        boxShadow: "0 2px 8px #f0f1f2", // Үл ялиг сүүдэр
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
      }}
    >
      {/* 1. Зүүн тал: Лого эсвэл Нэр */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: 32,
            height: 32,
            background: "#1890ff",
            borderRadius: "4px",
            marginRight: "12px",
          }}
        />
        <Text strong style={{ fontSize: "18px" }}>
          TELCOCOM
        </Text>
      </div>

      {/* 2. Баруун тал: Мэдэгдэл болон Хэрэглэгч */}
      <Space size="large">
        {/* Мэдэгдлийн хонх */}
        <Button
          type="text"
          icon={<BellOutlined />}
          style={{ fontSize: "16px" }}
        />

        {/* Хэрэглэгчийн мэдээлэл */}
        <Dropdown menu={userMenuItems} trigger={["click"]}>
          <div
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <Space>
              <Avatar
                icon={<UserOutlined />}
                style={{ backgroundColor: "#87d068" }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: "1.2",
                }}
              >
                <Text strong size="small">
                  Г. Оюунмягмар
                </Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Админ
                </Text>
              </div>
            </Space>
          </div>
        </Dropdown>
      </Space>
    </Header>
  );
}
