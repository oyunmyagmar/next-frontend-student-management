import { FallOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Typography } from "antd";
import React from "react";

export const StudentStatisticInfo = ({
  totalCount,
  activeCount,
  inactiveCount,
}) => {
  const { Title } = Typography;

  return (
    <div>
      <Title level={3}>Стастик мэдээ</Title>
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
          span={3.3}
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
    </div>
  );
};
