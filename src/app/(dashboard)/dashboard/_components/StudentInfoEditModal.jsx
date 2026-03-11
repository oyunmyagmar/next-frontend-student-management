"use client";

import React, { useEffect } from "react";
import { Form, Input, Modal, Select } from "antd";

export function StudentInfoEditModal({
  open,
  onCancel,
  onUpdate,
  student,
  loading,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && student) {
      form.setFieldsValue({
        lastName: student.lastName,
        firstName: student.firstName,
        email: student.email,
        status: student.status,
      });
    }
  }, [open, student, form]);

  return (
    <Modal
      title="Оюутны мэдээлэл засах"
      open={open}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText="Хадгалах"
      cancelText="Цуцлах"
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => onUpdate(values)}
      >
        <Form.Item
          label="Овог"
          name="lastName"
          rules={[{ required: true, message: "Овгоо оруулна уу!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Нэр"
          name="firstName"
          rules={[{ required: true, message: "Нэрээ оруулна уу!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Имэйл хаяг"
          name="email"
          rules={[
            { required: true, message: "Имэйл оруулна уу!" },
            { type: "email", message: "Зөв имэйл хаяг оруулна уу!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Төлөв" name="status">
          <Select
            options={[
              { value: "ACTIVE", label: "ACTIVE (Идэвхтэй)" },
              { value: "INACTIVE", label: "INACTIVE (Идэвхгүй)" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
