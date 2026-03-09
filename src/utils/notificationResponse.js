import { notification } from "antd";

export const openNotification = (type, message, description = "") => {
  notification[type]({
    message: message || (type === "success" ? "Амжилттай" : "Алдаа гарлаа"),
    description: description,
    placement: "topRight",
  });
};
