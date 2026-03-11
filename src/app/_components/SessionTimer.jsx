"use client";

import { useSessionTimeout } from "../hooks/useSessionTimeout";
import { Badge, Space, Typography } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function SessionTimer() {
  const { timeLeft } = useSessionTimeout();

  if (timeLeft === null) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const isUrgent = timeLeft < 60;
  const statusColor = isUrgent ? "#ff4d4f" : "#52c41a";

  return (
    <Space
      style={{
        background: isUrgent ? "#fff2f0" : "#f6ffed",
        padding: "0px 8px",
        height: "24px",
        display: "flex",
        alignItems: "center",
        borderRadius: "20px",
        border: `1px solid ${statusColor}`,
        transition: "all 0.3s",
        lineHeight: 1,
      }}
    >
      <ClockCircleOutlined style={{ color: statusColor }} />
      <Text strong style={{ color: statusColor, fontSize: "12px" }}>
        {timeLeft > 0 ? `Сесс: ${timeString}` : "Хугацаа дууслаа"}
      </Text>
      {isUrgent && timeLeft > 0 && <Badge status="processing" color="red" />}
    </Space>
  );
}
