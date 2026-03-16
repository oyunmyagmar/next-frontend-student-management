"use client";

import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Popconfirm,
  message,
  Input,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../../utils/axiosInstance";
import { useEffect, useState, useCallback } from "react";
import { useSessionTimeout } from "../../hooks/useSessionTimeout";
import { useRouter } from "next/navigation";
import { StudentInfoEditModal, StudentStatisticInfo } from "./_components";

export default function DashboardPage() {
  const [students, setStudents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const router = useRouter();
  useSessionTimeout();

  // Жагсаалт болон тоог татах функц
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm || null,
        status: statusFilter === "ALL" ? null : statusFilter,
      };

      // API-уудаас датаг зэрэг татах
      const [countRes, recentRes] = await Promise.all([
        axiosInstance.get("/api/counts"),
        axiosInstance.get("/api/recent", { params }),
      ]);

      // Статистик болон жагсаалтыг шинэчлэх
      setTotalCount(countRes.total);
      setActiveCount(countRes.active);
      setInactiveCount(countRes.inactive);
      setStudents(recentRes);
    } catch (error) {
      console.error("Дата татахад алдаа гарлаа:", error);
      message.error("Дата татахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  // Анх удаа ачааллах болон event listener тохируулах
  useEffect(() => {
    fetchStudents();

    const handleRefresh = () => {
      fetchStudents();
    };

    window.addEventListener("studentAdded", handleRefresh);
    return () => {
      window.removeEventListener("studentAdded", handleRefresh);
    };
  }, [fetchStudents]);

  // Устгах үйлдэл
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

  // Модал нээх (Засах)
  const showEditModal = (record) => {
    setEditingStudent(record);
    setIsEditModalOpen(true);
  };

  // Шинэчлэх үйлдэл
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
      console.error("Шинэчлэхэд алдаа гарлаа:", error);
      message.error("Шинэчлэхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <StudentStatisticInfo
        totalCount={totalCount}
        activeCount={activeCount}
        inactiveCount={inactiveCount}
      />

      <div style={{ marginTop: 30 }}>
        <Card
          title="Бүртгэлийн жагсаалт"
          variant="borderless"
          extra={
            <Space size="middle">
              <Input
                placeholder="Нэр эсвэл имэйлээр хайх"
                prefix={<SearchOutlined />}
                style={{ width: 250 }}
                allowClear
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onPressEnter={fetchStudents}
              />
              <Select
                placeholder="Төлөв сонгох"
                style={{ width: 150 }}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                options={[
                  { value: "ALL", label: "Бүгд" },
                  { value: "ACTIVE", label: "Идэвхтэй" },
                  { value: "INACTIVE", label: "Идэвхгүй" },
                ]}
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                loading={loading}
                onClick={fetchStudents}
              >
                Шүүх
              </Button>
            </Space>
          }
        >
          <Table
            loading={loading}
            pagination={{ pageSize: 10 }}
            dataSource={students}
            rowKey="id"
            columns={[
              {
                title: "#",
                key: "index",
                width: 60,
                render: (_, __, index) => index + 1,
              },
              {
                title: "Овог нэр",
                key: "fullName",
                width: 200,
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
