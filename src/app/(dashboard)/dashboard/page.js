"use client";

import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Typography,
  Tag,
  Space,
  Button,
  Popconfirm,
  message,
} from "antd";
import {
  UserOutlined,
  RiseOutlined,
  FallOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../../utils/axiosInstance";
import { useEffect, useState } from "react";
import { useSessionTimeout } from "../../hooks/useSessionTimeout";
const { Title } = Typography;

export default function DashboardPage() {
  const [students, setStudents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  useSessionTimeout();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const count = await axiosInstance.get("/api/count");
      const data = await axiosInstance.get("/api/recent");
      setStudents(data);
      setTotalCount(count);
    } catch (error) {
      console.error("Оюутнуудыг татахад алдаа гарлаа:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsCount = async () => {
    setLoading(true);
    try {
    } catch (error) {
      console.error("Оюутнууд тоог татахад алдаа гарлаа:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    const handleRefresh = () => {
      console.log("Шинэ оюутан нэмэгдсэн дохио ирлээ. Датаг шинэчилж байна...");
      fetchStudents();
      fetchStudentsCount();
    };

    window.addEventListener("studentAdded", handleRefresh);

    return () => {
      window.removeEventListener("studentAdded", handleRefresh);
    };
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/api/delete-student/${id}`);

      message.success("Оюутан амжилттай устгагдлаа");
      await Promise.all([fetchStudents(), fetchStudentsCount()]);
    } catch (error) {
      console.error("Устгахад алдаа гарлаа:", error);
      message.error("Оюутныг устгахад алдаа гарлаа");
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={3}>Системийн төлөв</Title>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card bordered={false} style={{ borderLeft: "4px solid #1890ff" }}>
            <Statistic
              title="Нийт Оюутнууд"
              value={totalCount}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ borderLeft: "4px solid #52c41a" }}>
            <Statistic
              title="Ирц (Өнөөдөр)"
              value={94.2}
              precision={1}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ borderLeft: "4px solid #f5222d" }}>
            <Statistic
              title="Төлбөрийн үлдэгдэлтэй"
              value={12}
              prefix={<FallOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ borderLeft: "4px solid #faad14" }}>
            <Statistic title="Шинэ хүсэлт" value={5} />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 30 }}>
        <Card title="Сүүлийн үеийн бүртгэл" bordered={false}>
          <Table
            loading={loading}
            pagination={{ pageSize: 10 }}
            dataSource={students}
            rowKey="id"
            columns={[
              {
                title: "Овог нэр",
                key: "fullName",
                render: (record) => `${record.lastName} ${record.firstName}`,
              },
              { title: "Имэйл", dataIndex: "email", key: "email" },
              {
                title: "Төлөв",
                dataIndex: "status",
                key: "status",
                render: (status) => (
                  <Tag color={status === "ACTIVE" ? "green" : "orange"}>
                    {status === "ACTIVE" ? "Идэвхтэй" : "Идэвхгүй"}
                  </Tag>
                ),
              },
              {
                title: "Үйлдэл",
                key: "action",
                render: (_, record) => (
                  <Space size="middle">
                    <Button
                      type="primary"
                      ghost
                      icon={<EditOutlined />}
                      onClick={() => showEditModal(record)}
                    >
                      Засах
                    </Button>

                    <Popconfirm
                      title="Оюутныг устгах уу?"
                      description="Энэ үйлдлийг буцаах боломжгүй."
                      onConfirm={() => handleDelete(record.id)}
                      okText="Тийм"
                      cancelText="Үгүй"
                      okButtonProps={{ danger: true }}
                    >
                      <Button type="primary" danger icon={<DeleteOutlined />}>
                        Устгах
                      </Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
