"use client";

import { Row, Col } from "antd";

const AuthLayout = ({ children }) => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Col xs={22} sm={16} md={12} lg={8}>
          <div
            style={{
              backgroundColor: "#fff",
              padding: "40px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <h2 style={{ color: "#1890ff" }}>Student System</h2>
            </div>
            {children}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AuthLayout;
