"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Provider } from "mobx-react";
import * as stores from "../stores";

export default function Providers({ children }) {
  return (
    <AntdRegistry>
      <Provider {...stores}>{children}</Provider>
    </AntdRegistry>
  );
}
