import React from "react";
import { Card, DatePicker, Table } from "antd";
import { columns, dataSource } from "./libs/get-data";

const App = () => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div>
        <DatePicker />
      </div>

      <Card title="Хэрэглэгчийн жагсаалт">
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default App;
