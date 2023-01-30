import React, { ReactNode, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { colors } from "@/styles/colors";

export interface TableColumn {
  key: string | number;
  name: string | ReactNode;
  index: string;
  width: number;
  render?: (value: unknown, row: unknown) => ReactNode;
  resizable?: boolean;
}
export interface DragFunctionOptions {
  newColumns?: TableColumn[];
  mouseXy?: number[];
  targetIndex?: string;
  draggingIndex?: string;
}

interface Props<T> {
  data: T[];
  columns: TableColumn[];
  tableKey: string;
  setColumns?: (e: TableColumn[]) => void;
  dragStartFunction: (
    e?: React.MouseEvent,
    options?: DragFunctionOptions
  ) => void;
  dragEndFunction?: (e?: MouseEvent, options?: DragFunctionOptions) => void;
  draggingFunction?: (
    e?: React.MouseEvent,
    options?: DragFunctionOptions
  ) => void;
}

const Table = <T,>({
  data,
  columns,
  tableKey,
  setColumns,
  draggingFunction,
  dragStartFunction,
  dragEndFunction,
}: Props<T>) => {
  const defaultXy = [0, 0];
  const [nowColumns, setNowColumns] = useState<TableColumn[]>([...columns]);
  const [draggingIndex, setDraggingIndex] = useState<string>();
  const [targetIndex, setTargetIndex] = useState<string>();
  const [mouseXy, setMouseXy] = useState<number[]>(defaultXy);
  const isDragging = draggingIndex !== undefined;
  let element = null;
  let clickPosX = 0;
  let event;
  const isNotEqualTargetIndexAndDraggingIndex = draggingIndex !== targetIndex;

  // 리사이즈 시작입니당
  const handleMouseMoveResize = (e: MouseEvent) => {
    console.log(e.pageX);
  };
  const handleMouseDownResize = (e: React.MouseEvent) => {
    clickPosX = e.pageX;
    console.log(e.pageX);
    e.stopPropagation();
    document.addEventListener("mousemove", handleMouseMoveResize);
    const parent = e.currentTarget.parentNode;
    if (parent) {
    }
  };
  const handleMouseUpResize = (e: React.MouseEvent) => {
    console.log(e);
  };
  // 리사이즈 여기까징
  const handleMouseDownThead = (
    e: React.MouseEvent,
    columns: TableColumn[],
    i: number
  ) => {
    if (isDragging) {
      setTargetIndex(undefined);
      setDraggingIndex(undefined);
    } else {
      setTargetIndex(columns[i].index);
      setDraggingIndex(columns[i].index);
      setMouseXy([e.clientX, e.clientY]);
      if (dragStartFunction)
        dragStartFunction(e, {
          targetIndex,
          draggingIndex,
          mouseXy,
          newColumns: nowColumns,
        });
    }
  };
  const handleMouseMoveThead = (
    e: React.MouseEvent,
    columns: TableColumn[],
    i: number
  ) => {
    if (isDragging) {
      setMouseXy([e.clientX, e.clientY]);
      const newColumns = [...nowColumns];
      const nowTargetArrayIndex = newColumns.findIndex(
        (val) => val.index === columns[i].index
      );
      const nowDraggingArrayIndex = newColumns.findIndex(
        (val) => val.index === draggingIndex
      );
      const nowTargetEle = newColumns[nowTargetArrayIndex];
      const nowDraggingEle = newColumns[nowDraggingArrayIndex];
      newColumns[nowDraggingArrayIndex] = nowTargetEle;
      newColumns[nowTargetArrayIndex] = nowDraggingEle;
      setTargetIndex(columns[i].index);
      if (setColumns) {
        setColumns(newColumns);
      } else {
        setNowColumns(newColumns);
      }
      if (draggingFunction)
        draggingFunction(e, {
          targetIndex,
          draggingIndex,
          mouseXy,
          newColumns: nowColumns,
        });
    }
  };
  const handleMouseUp = (e: MouseEvent) => {
    if (targetIndex !== draggingIndex) {
      const newColumns = [...nowColumns];
      const nowTargetArrayIndex = newColumns.findIndex(
        (val) => val.index === targetIndex
      );
      const nowDraggingArrayIndex = newColumns.findIndex(
        (val) => val.index === draggingIndex
      );
      const nowTargetEle = newColumns[nowTargetArrayIndex];
      const nowDraggingEle = newColumns[nowDraggingArrayIndex];
      newColumns[nowDraggingArrayIndex] = nowTargetEle;
      newColumns[nowTargetArrayIndex] = nowDraggingEle;
      if (setColumns) {
        setColumns(newColumns);
      } else {
        setNowColumns(newColumns);
      }
      if (dragEndFunction)
        dragEndFunction(e, { targetIndex, draggingIndex, mouseXy, newColumns });
    }
    setDraggingIndex(undefined);
    setTargetIndex(undefined);
  };

  const renderHead = (columns: TableColumn[]): JSX.Element => {
    const colgroupList: JSX.Element[] = [];
    const theadList: JSX.Element[] = [];

    for (let i = 0; i < columns.length; i++) {
      const isNowTarget = columns[i].index === targetIndex;
      colgroupList.push(
        <col key={columns[i].key + "column"} width={columns[i].width}></col>
      );
      theadList.push(
        <StyledTh
          isNowDragged={draggingIndex === columns[i].index}
          isNowTarget={isNowTarget}
          onMouseDown={(e) => {
            handleMouseDownThead(e, columns, i);
          }}
          onClick={(e) => console.log(e.currentTarget.offsetWidth)}
          onMouseMove={(e) => {
            handleMouseMoveThead(e, columns, i);
          }}
          key={columns[i].key + String(i) + "th"}
        >
          {columns[i].name}
          {columns[i].resizable && (
            <ResizeHandle
              onMouseDown={handleMouseDownResize}
              onMouseUp={() => console.log("good")}
            >
              |
            </ResizeHandle>
          )}
        </StyledTh>
      );
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
        items.push(
          <StyledTd
            isNowDragged={index === draggingIndex}
            isNowTarget={index === targetIndex}
            key={item.id + item[index] + "Td"}
          >
            {item[index]}
          </StyledTd>
        );
      }
      body.push(<tr key={item["id"] + "tr"}>{items}</tr>);
    }
    return <tbody>{body}</tbody>;
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [draggingIndex, targetIndex]);

  return (
    <div>
      <table border={1}>
        {renderHead(nowColumns)}
        {renderBody(data, nowColumns)}
      </table>
    </div>
  );
};

export default Table;

const StyledTh = styled.th<{ isNowTarget?: boolean; isNowDragged?: boolean }>`
  position: relative;
  cursor: move;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  ${({ isNowTarget, isNowDragged }) => (isNowDragged ? nowDraggenCss : "")}
`;
const StyledTd = styled.td<{ isNowTarget?: boolean; isNowDragged?: boolean }>`
  ${({ isNowTarget, isNowDragged }) => (isNowDragged ? nowDraggenCss : "")}
`;

const nowDraggenCss = css`
  color: #c6f9f9;
  background-color: #d5f3ff;
  border: none;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`;
const StyledDraggedTh = styled.th``;

const StyledDraggedTable = styled.table<{
  isDragged?: boolean;
  mouseXy?: number[];
}>`
  position: fixed;
  left: ${({ mouseXy }) => (mouseXy ? mouseXy[0] || 0 : 0)}px;
  top: ${({ mouseXy }) => (mouseXy ? mouseXy[1] || 0 : 0)}px;
  display: ${({ isDragged }) => (isDragged ? "default" : "none")};
  background-color: white;
`;
const ResizeHandle = styled.div`
  width: 20px;
  position: absolute;
  right: 20px;
  top: 2px;
  background-color: red;
  cursor: pointer;
  z-index: 20;
`;
