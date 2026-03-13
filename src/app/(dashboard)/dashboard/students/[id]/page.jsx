"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Tag,
  Button,
  Descriptions,
  Divider,
  Spin,
  Space,
  Upload,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  CheckCircleOutlined,
  CameraOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../../../../utils/axiosInstance";

const { Title, Text } = Typography;

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // 1. Оюутны мэдээлэл татах хэсэг
  useEffect(() => {
    const fetchStudentDetails = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/students/${params.id}`);
        setStudent(response);

        if (response && response.avatarUrl) {
          // Хэрэв DB-д байгаа URL нь бүтэн биш бол Backend хаягийг залгана
          const finalUrl = response.avatarUrl.startsWith("http")
            ? response.avatarUrl
            : `http://localhost:8086${response.avatarUrl}`;
          setImageUrl(finalUrl);
        }
      } catch (error) {
        console.error("Дата татахад алдаа гарлаа:", error);
        message.error("Мэдээлэл татахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchStudentDetails();
  }, [params.id]);

  // 2. Зураг upload хийх үеийн логик
  const handleUpload = (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }
    if (info.file.status === "done") {
      // Backend-ээс ResponseEntity.ok(Map.of("url", fileUrl)) гэж ирж байгаа
      const resPath = info.file.response.url;
      const fullUrl = resPath.startsWith("http")
        ? resPath
        : `http://localhost:8086${resPath}`;

      setImageUrl(fullUrl);
      setUploading(false);
      message.success("Зураг амжилттай шинэчлэгдлээ.");
    } else if (info.file.status === "error") {
      setUploading(false);
      message.error("Зураг хуулахад алдаа гарлаа.");
    }
  };

  if (loading)
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
      >
        <Spin size="large" tip="Уншиж байна..." />
      </div>
    );

  if (!student)
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Title level={4}>Оюутан олдсонгүй.</Title>
        <Button onClick={() => router.back()}>Буцах</Button>
      </div>
    );

  return (
    <div style={{ padding: "24px", background: "#f5f7fa", minHeight: "100vh" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          style={{ marginBottom: 8 }}
        >
          Жагсаалт руу буцах
        </Button>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card
              bordered={false}
              style={{ textAlign: "center", borderRadius: 12 }}
            >
              <Upload
                name="file"
                listType="picture-circle"
                className="avatar-uploader"
                showUploadList={false}
                action={`http://localhost:8086/api/students/${params.id}/upload-avatar`}
                onChange={handleUpload}
              >
                {imageUrl ? (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.3)",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        opacity: 0,
                        transition: "0.3s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                    >
                      <CameraOutlined style={{ color: "#fff", fontSize: 20 }} />
                    </div>
                  </div>
                ) : (
                  <div>
                    {uploading ? (
                      <LoadingOutlined />
                    ) : (
                      <CameraOutlined style={{ fontSize: 24 }} />
                    )}
                    <div style={{ marginTop: 8 }}>Зураг</div>
                  </div>
                )}
              </Upload>

              <Title level={4} style={{ marginBottom: 4 }}>
                {student.lastName} {student.firstName}
              </Title>
              <Text type="secondary">{student.email}</Text>

              <div style={{ marginTop: 16 }}>
                <Tag
                  color={student.status === "ACTIVE" ? "green" : "orange"}
                  style={{ borderRadius: 10, padding: "2px 10px" }}
                >
                  {student.status === "ACTIVE" ? "Идэвхтэй" : "Идэвхгүй"}
                </Tag>
              </div>
              <Divider />
              <div style={{ textAlign: "left" }}>
                <Text strong>Системд бүртгэгдсэн:</Text>
                <div style={{ color: "#8c8c8c", fontSize: "12px" }}>
                  {student.id}
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={16}>
            <Card
              bordered={false}
              title="Оюутны үндсэн мэдээлэл"
              style={{ borderRadius: 12 }}
            >
              <Descriptions
                column={1}
                labelStyle={{ fontWeight: "bold", width: "200px" }}
              >
                <Descriptions.Item
                  label={
                    <Space>
                      <IdcardOutlined /> Овог
                    </Space>
                  }
                >
                  {student.lastName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <UserOutlined /> Нэр
                    </Space>
                  }
                >
                  {student.firstName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <MailOutlined /> Имэйл хаяг
                    </Space>
                  }
                >
                  {student.email}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <CheckCircleOutlined /> Төлөв
                    </Space>
                  }
                >
                  {student.status === "ACTIVE"
                    ? "Суралцаж байгаа"
                    : "Түр завсарласан"}
                </Descriptions.Item>
              </Descriptions>
              <Divider orientation="left">Бусад тэмдэглэл</Divider>
              <Text type="secondary">
                Энэ хэсэгт оюутны сурлагын явц, төлбөрийн түүх болон бусад
                нэмэлт мэдээллийг харуулах боломжтой.
              </Text>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
}
