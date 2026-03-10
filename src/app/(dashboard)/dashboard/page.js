"use client";
import { Row, Col, Card, Statistic, Table, Typography } from "antd";
import { UserOutlined, RiseOutlined, FallOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function DashboardPage() {
  return (
    <div>
      <Title level={3}>Системийн төлөв</Title>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card bordered={false} style={{ borderLeft: "4px solid #1890ff" }}>
            <Statistic
              title="Нийт Оюутнууд"
              value={1204}
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
            pagination={false}
            dataSource={[
              {
                key: 1,
                name: "Д. Болд",
                date: "2024-03-10",
                status: "Амжилттай",
              },
              {
                key: 2,
                name: "Т. Сарнай",
                date: "2024-03-09",
                status: "Хүлээгдэж буй",
              },
            ]}
            columns={[
              { title: "Нэр", dataIndex: "name", key: "name" },
              { title: "Огноо", dataIndex: "date", key: "date" },
              { title: "Төлөв", dataIndex: "status", key: "status" },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
