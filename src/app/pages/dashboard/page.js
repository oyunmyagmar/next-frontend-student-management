"use client";

import React, { useState } from "react";
import {
  Layout,
  Menu,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
} from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Цэсний зүйлс
  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Хянах самбар",
    },
    {
      key: "/user/management",
      icon: <UserOutlined />,
      label: "Хэрэглэгчид",
    },
    {
      key: "/student/management",
      icon: <TeamOutlined />,
      label: "Оюутнууд",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Хажуугийн цэс */}
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div
          style={{
            height: 64,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "6px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Title level={4} style={{ color: "white", margin: 0 }}>
            {!collapsed ? "TELCOCOM" : "T"}
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          onClick={({ key }) => router.push(key)}
          items={menuItems}
        />
        <div style={{ position: "absolute", bottom: 20, width: "100%" }}>
          <Menu
            theme="dark"
            mode="inline"
            selectable={false}
            items={[
              { key: "logout", icon: <LogoutOutlined />, label: "Гарах" },
            ]}
          />
        </div>
      </Sider>

      <Layout>
        {/* Дээд хэсэг */}
        <Header
          style={{
            padding: 0,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingRight: "24px",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />
          <Text strong>Админ: Г. Оюунмягмар</Text>
        </Header>

        {/* Үндсэн агуулга */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
            borderRadius: "8px",
            overflowY: "auto",
          }}
        >
          {/* Dashboard-ийн доторх статистик хэсэг */}
          <Title level={3}>Системийн тойм</Title>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card bordered={false} style={{ background: "#f9f9f9" }}>
                <Statistic
                  title="Нийт хэрэглэгч"
                  value={12}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false} style={{ background: "#f9f9f9" }}>
                <Statistic
                  title="Нийт оюутан"
                  value={450}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false} style={{ background: "#f9f9f9" }}>
                <Statistic title="Идэвхтэй курс" value={5} />
              </Card>
            </Col>
          </Row>

          <div style={{ marginTop: "32px" }}>
            <Title level={4}>Сүүлд хийгдсэн үйлдлүүд</Title>
            <Table
              size="small"
              columns={[
                { title: "Нэр", dataIndex: "name" },
                { title: "Төрөл", dataIndex: "type" },
                { title: "Огноо", dataIndex: "date" },
              ]}
              dataSource={[
                {
                  key: "1",
                  name: "User 1",
                  type: "Систем",
                  date: "2024-03-09",
                },
                {
                  key: "2",
                  name: "Student 45",
                  type: "Бүртгэл",
                  date: "2024-03-08",
                },
              ]}
              pagination={false}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
