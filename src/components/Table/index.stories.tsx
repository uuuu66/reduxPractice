import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Table, { TableColumn } from "./index";

export default {
  title: "components/Table",
  component: Table,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Table>;

interface Data {
  name: string;
  age: number;
  phone: string;
  id?: number;
}

const columns: TableColumn[] = [
  { key: "id", width: 200, name: "id", index: "id", resizable: true },
  { key: "name", width: 200, name: "이름", index: "name", resizable: true },

  { key: "age", width: 200, name: "나이", index: "age" },
  { key: "phone", width: 200, name: "휴대폰 번호", index: "phone" },
];

const mockData: Data[] = [
  {
    name: "이경수",
    age: 28,
    phone: "01090024823",
  },
  {
    name: "이민기",
    age: 29,
    phone: "01041412323",
  },
];
const data: Data[] = [];
for (let i = 0; i < 10; i += 1) {
  data.push({ id: i, ...(i % 2 === 0 ? mockData[0] : mockData[1]) });
}

const Template: ComponentStory<typeof Table> = (args) => (
  <Table
    {...args}
    isDraggableRow={{ isRenderHandle: false, value: true }}
    isDraggableCol={true}
    data={data}
    columns={columns}
    tableKey="id"
  />
);

export const Primary = Template.bind({});
