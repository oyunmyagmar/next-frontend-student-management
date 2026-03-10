"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Provider } from "mobx-react";
import * as stores from "../stores";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <AntdRegistry>
        <Provider {...stores}>{children}</Provider>
      </AntdRegistry>
    </SessionProvider>
  );
}
