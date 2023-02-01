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
export interface DragColFunctionOptions {
  newColumns?: TableColumn[];
  mouseXy?: number[];
  targetColIndex?: string;
  draggingColIndex?: string;
}
export interface DragRowFunctionOptions<T> {
  newData?: T[];
  mouseXy?: number[];
  targetRowIndex?: string;
  draggingRowIndex?: string;
}
export interface IsDraggableRowOptions {
  value?: boolean;
  isRenderHandle?: false | ReactNode;
}
interface Props<T> {
  data: T[];
  columns: TableColumn[];
  tableKey: string;
  setData?: (e: T[]) => void;
  setColumns?: (e: TableColumn[]) => void;
  dragColStartFunction: (
    e?: React.MouseEvent,
    options?: DragColFunctionOptions
  ) => void;
  dragColEndFunction?: (
    e?: MouseEvent,
    options?: DragColFunctionOptions
  ) => void;
  draggingColFunction?: (
    e?: React.MouseEvent,
    options?: DragColFunctionOptions
  ) => void;
  dragRowStartFunction: (
    e?: React.MouseEvent,
    options?: DragRowFunctionOptions<T>
  ) => void;
  dragRowEndFunction?: (
    e?: MouseEvent,
    options?: DragRowFunctionOptions<T>
  ) => void;
  draggingRowFunction?: (
    e?: React.MouseEvent,
    options?: DragRowFunctionOptions<T>
  ) => void;
  isDraggableCol?: boolean;
  isDraggableRow?: boolean | IsDraggableRowOptions;
}

const Table = <T,>({
  data,
  columns,
  tableKey,
  setData,
  setColumns,
  draggingColFunction,
  dragColStartFunction,
  dragColEndFunction,
  dragRowStartFunction,
  dragRowEndFunction,
  draggingRowFunction,
  isDraggableCol = true,
  isDraggableRow = { value: false, isRenderHandle: true },
}: Props<T>) => {
  //드래그 관련
  const defaultXy = [0, 0];
  const [nowData, setNowData] = useState<T[]>(data);

  const [nowColumns, setNowColumns] = useState<TableColumn[]>([...columns]);
  const [draggingColIndex, setDraggingHeadIndex] = useState<string>();
  const [targetColIndex, setTargetColIndex] = useState<string>();
  const [draggingRowIndex, setDraggingRowIndex] = useState<any>();
  const [targetRowIndex, setTargetRowIndex] = useState<any>();

  const [mouseXy, setMouseXy] = useState<number[]>(defaultXy);

  let element = null;
  let clickPosX = 0;
  let event;

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

  const isDraggingCol = draggingColIndex !== undefined;
  const isDraggingRow = draggingRowIndex !== undefined;
  const isMoveableRow =
    isDraggableRow === true ||
    (isDraggableRow as IsDraggableRowOptions).value === true;
  const isRenderHandle =
    isMoveableRow &&
    (isDraggableRow as IsDraggableRowOptions).isRenderHandle === true;

  const handleMouseDownSwitchTh = (
    e: React.MouseEvent,
    columns: TableColumn[],
    i: number
  ) => {
    if (isDraggableCol)
      if (isDraggingCol) {
        setTargetColIndex(undefined);
        setDraggingHeadIndex(undefined);
      } else {
        setTargetColIndex(columns[i].index);
        setDraggingHeadIndex(columns[i].index);
        setMouseXy([e.clientX, e.clientY + 30]);
        if (dragColStartFunction)
          dragColStartFunction(e, {
            targetColIndex,
            draggingColIndex,
            mouseXy,
            newColumns: nowColumns,
          });
      }
  };
  const handleMouseMoveSwitchTh = (
    e: React.MouseEvent,
    columns: TableColumn[],
    i: number
  ) => {
    if (isDraggableCol)
      if (isDraggingCol) {
        setMouseXy([e.clientX, e.clientY + 30]);
        const newColumns = [...nowColumns];
        const nowTargetArrayIndex = newColumns.findIndex(
          (val) => val.index === columns[i].index
        );
        const nowDraggingArrayIndex = newColumns.findIndex(
          (val) => val.index === draggingColIndex
        );
        const nowTargetEle = newColumns[nowTargetArrayIndex];
        const nowDraggingEle = newColumns[nowDraggingArrayIndex];
        newColumns[nowDraggingArrayIndex] = nowTargetEle;
        newColumns[nowTargetArrayIndex] = nowDraggingEle;
        setTargetColIndex(columns[i].index);
        if (setColumns) {
          setColumns(newColumns);
        } else {
          setNowColumns(newColumns);
        }
        if (draggingColFunction)
          draggingColFunction(e, {
            targetColIndex,
            draggingColIndex,
            mouseXy,
            newColumns: nowColumns,
          });
      }
  };
  const handleMouseUpSwitchTh = (e: MouseEvent) => {
    if (isDraggableCol) {
      if (targetColIndex !== draggingColIndex) {
        const newColumns = [...nowColumns];
        const nowTargetArrayIndex = newColumns.findIndex(
          (val) => val.index === targetColIndex
        );
        const nowDraggingArrayIndex = newColumns.findIndex(
          (val) => val.index === draggingColIndex
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
        if (dragColEndFunction)
          dragColEndFunction(e, {
            targetColIndex,
            draggingColIndex,
            mouseXy,
            newColumns,
          });
      }
      setDraggingHeadIndex(undefined);
      setTargetColIndex(undefined);
    }
  };
  const handleMouseDownSwitchTbody = (e: React.MouseEvent, i: number) => {
    if (isDraggableRow)
      if (isDraggingRow) {
        setTargetRowIndex(undefined);
        setDraggingRowIndex(undefined);
      } else {
        setTargetRowIndex(i);
        setDraggingRowIndex(i);
        setMouseXy([e.clientX + 30, e.clientY]);
        if (dragRowStartFunction)
          dragRowStartFunction(e, {
            targetRowIndex,
            draggingRowIndex,
            mouseXy,
            newData: nowData,
          });
      }
  };
  const handleMouseMoveSwitchTbody = (
    e: React.MouseEvent,

    i: number
  ) => {
    if (isDraggableRow)
      if (isDraggingRow) {
        setMouseXy([e.clientX + 30, e.clientY]);
        setTargetRowIndex(i);

        if (draggingRowFunction)
          draggingRowFunction(e, {
            targetRowIndex,
            draggingRowIndex,
            mouseXy,
            newData: nowData,
          });
      }
  };
  const handleMouseUpSwitchTbody = (e: MouseEvent) => {
    if (isDraggableRow) {
      if (targetColIndex !== draggingColIndex) {
        if (dragRowEndFunction)
          dragRowEndFunction(e, {
            targetRowIndex,
            draggingRowIndex,
            mouseXy,
            newData: nowData,
          });
      }
      setDraggingRowIndex(undefined);
      setTargetRowIndex(undefined);
    }
  };

  const renderHead = (columns: TableColumn[]): JSX.Element => {
    const colgroupList: JSX.Element[] = [];
    const theadList: JSX.Element[] = [];
    if (isRenderHandle) {
      colgroupList.push(<col width={40}></col>);
      theadList.push(<StyledDraggedRowTh />);
    }
    for (let i = 0; i < columns.length; i++) {
      const isNowTarget = columns[i].index === targetColIndex;
      colgroupList.push(
        <col key={columns[i].key + "column"} width={columns[i].width}></col>
      );
      theadList.push(
        <StyledTh
          isDraggableCol={isDraggableCol}
          isDragging={isDraggingCol || isDraggingRow}
          isNowDragged={draggingColIndex === columns[i].index}
          isNowTarget={isNowTarget}
          onMouseDown={(e) => {
            handleMouseDownSwitchTh(e, columns, i);
          }}
          onClick={(e) => console.log(e.currentTarget.offsetWidth)}
          onMouseMove={(e) => {
            handleMouseMoveSwitchTh(e, columns, i);
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
      if (isRenderHandle) {
        items.push(
          <StyledDraggedRowHandle
            onMouseDown={(e) => {
              if ((isDraggableRow as IsDraggableRowOptions)?.isRenderHandle)
                handleMouseDownSwitchTbody(e, i);
            }}
            onMouseMove={(e) => {
              if ((isDraggableRow as IsDraggableRowOptions)?.isRenderHandle)
                handleMouseMoveSwitchTbody(e, i);
            }}
            style={{ width: "20px" }}
          >
            ::
          </StyledDraggedRowHandle>
        );
      }

      for (let j = 0; j < columns.length; j++) {
        const { index, render } = columns[j];

        items.push(
          <StyledTd
            isNowDragged={index === draggingColIndex || i === draggingRowIndex}
            isNowTarget={index === targetColIndex || i === targetRowIndex}
            isDragging={isDraggingCol || isDraggingRow}
            key={i + item[index] + item[tableKey] + "Tdr" + j}
          >
            {item[index]}
          </StyledTd>
        );
      }
      body.push(
        <tr
          onMouseDown={(e) => {
            if (!(isDraggableRow as IsDraggableRowOptions)?.isRenderHandle)
              handleMouseDownSwitchTbody(e, i);
          }}
          onMouseMove={(e) => {
            if (!(isDraggableRow as IsDraggableRowOptions)?.isRenderHandle)
              handleMouseMoveSwitchTbody(e, i);
          }}
          key={item["id"] + "tr" + i}
        >
          {items}
        </tr>
      );
    }
    return <tbody>{body}</tbody>;
  };
  const handleMouseUp = (e: MouseEvent) => {
    handleMouseUpSwitchTh(e);
    handleMouseUpSwitchTbody(e);
  };
  useEffect(() => {
    const newData = [...nowData];
    if (targetRowIndex)
      if (targetRowIndex > draggingRowIndex) {
        const dragEle = newData[draggingRowIndex];
        const targetEle = newData[targetRowIndex];

        newData[targetRowIndex - 1] = targetEle;
        newData[targetRowIndex] = draggingRowIndex.ele;
      } else if (targetRowIndex < draggingRowIndex) {
      }

    setNowData(newData);
  }, [targetRowIndex]);
  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);

    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [draggingColIndex, targetColIndex]);

  return (
    <>
      {(isDraggableCol || isMoveableRow) && (
        <StyledDraggedTable
          border={1}
          isDragged={isDraggingCol || isDraggingRow}
          mouseXy={mouseXy}
        >
          <colgroup>
            {isDraggingCol && (
              <col
                width={
                  nowColumns.find((val) => val.index === draggingColIndex)
                    ?.width
                }
              ></col>
            )}
            {isDraggingRow &&
              columns.map((val) => (
                <col key={val.key + "column"} width={val.width}></col>
              ))}
          </colgroup>
          {isDraggingCol && (
            <thead>
              <tr>
                <StyledDraggedTh>
                  {
                    nowColumns.find((val) => val.index === draggingColIndex)
                      ?.name
                  }
                </StyledDraggedTh>
              </tr>
            </thead>
          )}
          {isDraggingRow && (
            <tbody>
              <tr>
                {nowColumns.map((val, i) => {
                  const item = data[draggingRowIndex] as { [key: string]: any };
                  const index = val.index;

                  return (
                    <StyledTd key={item.id + item[tableKey] + "dragged+" + i}>
                      {item[index]}
                    </StyledTd>
                  );
                })}
              </tr>
            </tbody>
          )}
        </StyledDraggedTable>
      )}
      <div>
        <StyledTable>
          {renderHead(nowColumns)}
          {renderBody(nowData, nowColumns)}
        </StyledTable>
      </div>
    </>
  );
};

export default Table;

const StyledTh = styled.th<{
  isNowTarget?: boolean;
  isNowDragged?: boolean;
  isDraggableCol?: boolean;
  isDragging?: boolean;
}>`
  cursor: ${({ isDraggableCol }) => (!isDraggableCol ? "default" : "move")};

  border: 1px solid black;
  max-height: 40px;
  ${({ isNowDragged }) => (isNowDragged ? nowDraggedCss : "")};
  ${({ isDragging }) => (isDragging ? nowDraggingCss : "")};
`;
const StyledTd = styled.td<{
  isNowTarget?: boolean;
  isNowDragged?: boolean;
  isDragging?: boolean;
}>`
  ${({ isNowTarget }) => (isNowTarget ? nowDraggedCss : "")};

  ${({ isDragging }) => (isDragging ? nowDraggingCss : "")};
`;

const nowDraggedCss = css`
  color: #c6f9f9;
  background-color: #d5f3ff;
  border: none;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`;
const nowDraggingCss = css`
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`;
const StyledDraggedTh = styled.th`
  height: 40px;
  border: 1px solid black;
`;
const StyledDraggedRowTh = styled.th`
  height: 40px;
  border: 1px solid black;
`;
const StyledDraggedRowHandle = styled.td`
  cursor: move;
  ${nowDraggingCss};
`;

const StyledDraggedTable = styled.table<{
  isDragged?: boolean;
  mouseXy?: number[];
}>`
  position: fixed;
  left: ${({ mouseXy }) => (mouseXy ? mouseXy[0] || 0 : 0)}px;
  top: ${({ mouseXy }) => (mouseXy ? mouseXy[1] || 0 : 0)}px;
  display: ${({ isDragged }) => (isDragged ? "default" : "none")};
  background-color: white;
  thead > tr {
    height: 40px;
    background-color: ${colors.G7};
    border: 2px solid black;
  }
  td {
    border: 1px solid black;
    max-height: 40px;
    height: 40px;
  }
`;
const StyledTable = styled.table`
  border-spacing: 0;
  padding: 0 0;
  thead {
    padding: 0 0;
    border-spacing: 0;
  }
  tr,
  td,
  th {
    padding: 0 0;
    border-spacing: 0;

    text-align: center;
  }
  thead > tr {
    height: 40px;
    background-color: ${colors.G7};
    border: 2px solid black;
  }
  td {
    border: 1px solid black;
    max-height: 40px;
    height: 40px;
  }
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
