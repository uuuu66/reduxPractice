import React, { ReactNode } from "react";
import styled from "styled-components";
import { colors } from "@/styles/colors";

export interface TableColumn {
  key: string | number;
  name: string | ReactNode;
  index: string;
  width: number;
  render?: (value: unknown, row: unknown) => ReactNode;
}

interface Props<T> {
  data: T[];
  columns: TableColumn[];
  tableKey: string;
}

const Table = <T,>({ data, columns, tableKey }: Props<T>) => {
  const renderHead = (columns: TableColumn[]): JSX.Element => {
    const colgroupList: JSX.Element[] = [];
    const theadList: JSX.Element[] = [];
    for (let i = 0; i < columns.length; i++) {
      colgroupList.push(
        <col key={columns[i].key} width={columns[i].width}></col>
      );
      theadList.push(<th key={columns[i].key}>{columns[i].name}</th>);
    }
    return (
      <>
        <colgroup>{colgroupList}</colgroup>
        <thead>
          <tr>{theadList}</tr>
        </thead>
      </>
    );
  };
  const renderBody = <T,>(data: T[], columns: TableColumn[]): JSX.Element => {
    const body: JSX.Element[] = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i] as { [key: string]: any };
      const items: JSX.Element[] = [];
      for (let j = 0; j < columns.length; j++) {
        const { index, render } = columns[j];
        items.push(<td key={index}>{item[index]}</td>);
      }
      body.push(<tr key={item[tableKey]}>{items}</tr>);
    }
    return <tbody>{body}</tbody>;
  };
  return (
    <div>
      <MyTable border={1}>
        {renderHead(columns)}
        {renderBody(data, columns)}
      </MyTable>
    </div>
  );
};
export default Table;

const MyTable = styled.table`
  border-collapse: collapse;
  border: 1px solid ${colors.P5};
`;
