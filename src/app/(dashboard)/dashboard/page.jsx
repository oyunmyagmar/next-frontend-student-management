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
import { StudentInfoEditModal } from "./_components/StudentInfoEditModal";
import { useRouter } from "next/navigation";
const { Title } = Typography;

export default function DashboardPage() {
  const [students, setStudents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const router = useRouter();

  useSessionTimeout();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const [countRes, recentRes] = await Promise.all([
        axiosInstance.get("/api/counts"),
        axiosInstance.get("/api/recent"),
      ]);

      setTotalCount(countRes.total);
      setStudents(recentRes);
      setActiveCount(countRes.active);
      setInactiveCount(countRes.inactive);
    } catch (error) {
      console.error("Дата татахад алдаа гарлаа:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();

    const handleRefresh = () => {
      console.log("Шинэ оюутан нэмэгдсэн дохио ирлээ. Датаг шинэчилж байна...");
      fetchStudents();
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
      fetchStudents();
    } catch (error) {
      console.error("Устгахад алдаа гарлаа:", error);
      message.error("Оюутныг устгахад алдаа гарлаа");
      setLoading(false);
    }
  };

  const showEditModal = (record) => {
    setEditingStudent(record);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      await axiosInstance.put(
        `/api/update-student/${editingStudent.id}`,
        values,
      );
      message.success("Мэдээлэл амжилттай шинэчлэгдлээ");
      setIsEditModalOpen(false);
      fetchStudents();
    } catch (error) {
      message.error("Шинэчлэхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={3}>Системийн төлөв</Title>

      <Row gutter={[16, 16]} align="stretch" style={{ height: "130px" }}>
        <Col span={6} style={{ height: "100%" }}>
          <Card
            variant="borderless"
            style={{
              borderLeft: "4px solid #1890ff",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
            styles={{ body: { padding: "12px 16px", width: "100%" } }}
          >
            <Statistic
              title={<span style={{ fontSize: "14px" }}>Нийт Оюутнууд</span>}
              value={totalCount}
              prefix={<UserOutlined style={{ fontSize: "20px" }} />}
              styles={{
                content: {
                  fontSize: "16px",
                },
              }}
            />
          </Card>
        </Col>
        <Col
          span={6}
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Card
            variant="borderless"
            style={{
              borderLeft: "4px solid #52c41a",
              flex: 1,
              display: "flex",
              alignItems: "center",
            }}
            styles={{ body: { padding: "4px 12px", width: "100%" } }}
          >
            <Statistic
              title={<span style={{ fontSize: "14px" }}>Идэвхитэй оюуан</span>}
              value={activeCount}
              styles={{
                content: {
                  color: "#52c41a",
                  fontSize: "16px",
                  lineHeight: "1",
                },
              }}
            />
          </Card>
          <Card
            variant="borderless"
            style={{
              borderLeft: "4px solid #faad14",
              flex: 1,
              display: "flex",
              alignItems: "center",
            }}
            styles={{ body: { padding: "4px 12px", width: "100%" } }}
          >
            <Statistic
              title={<span style={{ fontSize: "14px" }}>Идэвхигүй оюутан</span>}
              value={inactiveCount}
              styles={{
                content: {
                  color: "#faad14",
                  fontSize: "16px",
                  lineHeight: "1",
                },
              }}
            />
          </Card>
        </Col>

        <Col span={6} style={{ height: "100%" }}>
          <Card
            variant="borderless"
            style={{
              borderLeft: "4px solid #f5222d",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
            styles={{ body: { padding: "4px 12px", width: "100%" } }}
          >
            <Statistic
              title={
                <span style={{ fontSize: "14px" }}>Төлбөрийн үлдэгдэлтэй</span>
              }
              value={totalCount}
              prefix={<FallOutlined style={{ fontSize: "20px" }} />}
              styles={{ content: { color: "#cf1322", fontSize: "20px" } }}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 30 }}>
        <Card title="Сүүлийн үеийн бүртгэл" variant="borderless">
          <Table
            loading={loading}
            pagination={{ pageSize: 10 }}
            dataSource={students}
            rowKey="id"
            columns={[
              { title: "Сонгох" },
              {
                title: "Овог нэр",
                key: "fullName",
                render: (record) => (
                  <span
                    style={{
                      color: "#1890ff",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                    onClick={() =>
                      router.push(`/dashboard/students/${record.id}`)
                    }
                  >
                    {`${record.lastName} ${record.firstName}`}
                  </span>
                ),
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

      <StudentInfoEditModal
        open={isEditModalOpen}
        student={editingStudent}
        loading={loading}
        onCancel={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
