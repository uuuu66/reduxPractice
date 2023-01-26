import React, { ReactNode } from "react";

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
      <table border={1}>
        {renderHead(columns)}
        {renderBody(data, columns)}
      </table>
    </div>
  );
};
export default Table;
