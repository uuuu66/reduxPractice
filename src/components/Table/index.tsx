import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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

  draggingIndex?: string;
}
export interface DragRowFunctionOptions<T> {
  newData?: T[];
  mouseXy?: number[];

  draggingData?: T;
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

  draggingColFunction?: (
    e?: React.MouseEvent,
    options?: DragColFunctionOptions
  ) => void;
  dragRowStartFunction: (
    e?: React.MouseEvent,
    options?: DragRowFunctionOptions<T>
  ) => void;

  draggingRowFunction?: (
    e?: React.MouseEvent,
    options?: DragRowFunctionOptions<T>
  ) => void;
  isDraggableCol?: boolean;
  isDraggableRow?: boolean | IsDraggableRowOptions;
  rowDragHandleClassName?: string;
  dragColEndFunction?: (
    e?: React.MouseEvent,
    options?: DragColFunctionOptions
  ) => void;

  dragRowEndFunction?: (
    e?: React.MouseEvent,
    options?: DragRowFunctionOptions<T>
  ) => void;
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
  rowDragHandleClassName = "row-handle",
}: Props<T>) => {
  //드래그 관련

  const [nowData, setNowData] = useState<T[]>(data);

  const [nowColumns, setNowColumns] = useState<TableColumn[]>([...columns]);

  const handleRef = useRef<HTMLTableCellElement>(null);

  let element = null;
  let clickPosX = 0;
  let event;

  const draggingItem = useRef<number>();
  const dragOverItem = useRef<number>();
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

  const isMoveableRow =
    isDraggableRow === true ||
    (isDraggableRow as IsDraggableRowOptions).value === true;
  const isRenderHandle =
    isMoveableRow &&
    (isDraggableRow as IsDraggableRowOptions).isRenderHandle === true;

  const handleDragStartTColumn = (e: React.MouseEvent, i: number) => {
    if (isDraggableCol) {
      draggingItem.current = i;
      if (dragColStartFunction)
        dragColStartFunction(e, {
          draggingIndex: nowColumns[i].index,
          mouseXy: [e.clientX, e.clientY],
          newColumns: nowColumns,
        });
    }
  };
  const handleDragEnterTColumn = (e: React.MouseEvent, i: number) => {
    if (isDraggableCol && draggingItem.current !== undefined) {
      dragOverItem.current = i;
      const copyData = [...nowColumns];
      const draggingData = copyData[draggingItem.current];
      copyData.splice(draggingItem.current, 1);
      copyData.splice(dragOverItem.current, 0, draggingData);
      draggingItem.current = i;
      dragOverItem.current = undefined;
      if (setColumns) setColumns(copyData);
      else setNowColumns(copyData);
      if (draggingColFunction)
        draggingColFunction(e, {
          draggingIndex: draggingData.index,
          mouseXy: [e.clientX, e.clientY],
          newColumns: copyData,
        });
    }
  };

  const handleDragStartTbody = (e: React.MouseEvent, i: number) => {
    if (isDraggableRow) {
      draggingItem.current = i;
      if (dragRowStartFunction)
        dragRowStartFunction(e, {
          draggingData: nowData[i],
          mouseXy: [e.clientX, e.clientY],
          newData: nowData,
        });
    }
  };
  const handleDragEnterTbody = (
    e: React.MouseEvent,

    i: number
  ) => {
    if (isDraggableRow && draggingItem.current !== undefined) {
      dragOverItem.current = i;
      const copyData = [...nowData];
      const draggingData = copyData[draggingItem.current];
      copyData.splice(draggingItem.current, 1);

      copyData.splice(dragOverItem.current, 0, draggingData);

      draggingItem.current = i;
      dragOverItem.current = undefined;

      if (setData) setData(copyData);
      else setNowData(copyData);
      if (draggingRowFunction)
        draggingRowFunction(e, {
          draggingData,
          mouseXy: [e.clientX, e.clientY],
          newData: nowData,
        });
    }
  };
  const handleDragOver = (
    e: React.MouseEvent,
    i: number,
    type: "COL" | "ROW"
  ) => {
    e.preventDefault();
    if (dragColEndFunction && type === "COL")
      dragColEndFunction(e, {
        draggingIndex: nowColumns[i].index,
        mouseXy: [e.clientX, e.clientY],
        newColumns: nowColumns,
      });
    if (dragRowEndFunction && type === "ROW")
      dragRowEndFunction(e, {
        draggingData: nowData[i],
        mouseXy: [e.clientX, e.clientY],
        newData: nowData,
      });
  };
  const renderHead = (columns: TableColumn[]): JSX.Element => {
    const colgroupList: JSX.Element[] = [];
    const theadList: JSX.Element[] = [];
    if (isRenderHandle) {
      colgroupList.push(<col width={40}></col>);
      theadList.push(<StyledDraggedRowTh />);
    }
    for (let i = 0; i < columns.length; i++) {
      colgroupList.push(
        <col key={columns[i].key + "column"} width={columns[i].width}></col>
      );
      theadList.push(
        <StyledTh
          draggable
          onDragStart={(e) => {
            handleDragStartTColumn(e, i);
          }}
          onDragEnter={(e) => {
            handleDragEnterTColumn(e, i);
          }}
          onDragOver={(e) => {
            handleDragOver(e, i, "COL");
          }}
          isDraggableCol={isDraggableCol}
          // onMouseDown={(e) => {
          //   handleDragStartTColumn(e, i);
          // }}
          onClick={(e) => console.log(e.currentTarget.offsetWidth)}
          // onMouseMove={(e) => {
          //   handleDragEnterTColumn(e, i);
          // }}
          // onMouseUp={() => {
          //   draggingItem.current = undefined;
          //   dragOverItem.current = undefined;
          // }}
          key={columns[i].key + String(i) + "th"}
        >
          {columns[i].name}
          {/* {columns[i].resizable && (
            <ResizeHandle
              onMouseDown={handleMouseDownResize}
              onMouseUp={() => console.log("good")}
            >
              |
            </ResizeHandle>
          )} */}
        </StyledTh>
      );
    }
    return (
      <>
        <colgroup>{colgroupList}</colgroup>
        <thead draggable={false}>
          <tr draggable={false}>{theadList}</tr>
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
            ref={handleRef}
            className={rowDragHandleClassName}
            style={{ width: "20px" }}
          >
            ::
          </StyledDraggedRowHandle>
        );
      }

      for (let j = 0; j < columns.length; j++) {
        const { index, render } = columns[j];

        items.push(
          <StyledTd key={i + item[index] + item[tableKey] + "Tdr" + j}>
            {item[index]}
          </StyledTd>
        );
      }

      body.push(
        <tr
          draggable
          onDragStart={(e) => {
            if (!(isDraggableRow as IsDraggableRowOptions)?.isRenderHandle)
              handleDragStartTbody(e, i);
            else if (
              e.clientX <=
                (handleRef.current?.clientLeft || 0) +
                  (handleRef.current?.clientWidth || 0) &&
              e.clientX >= (handleRef.current?.clientLeft || 0)
            ) {
              handleDragStartTbody(e, i);
            }
          }}
          onDragEnter={(e) => {
            if (!(isDraggableRow as IsDraggableRowOptions)?.isRenderHandle)
              handleDragEnterTbody(e, i);
            else if (
              e.clientX <=
                (handleRef.current?.clientLeft || 0) +
                  (handleRef.current?.clientWidth || 0) &&
              e.clientX >= (handleRef.current?.clientLeft || 0)
            ) {
              handleDragEnterTbody(e, i);
            }
          }}
          onDragOver={(e) => {
            handleDragOver(e, i, "ROW");
          }}
          key={item["id"] + "tr" + i}
        >
          {items}
        </tr>
      );
    }
    return <tbody>{body}</tbody>;
  };

  return (
    <>
      <div>
        <StyledTable draggable={false}>
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
  /* -webkit-user-drag: none; */
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

const StyledDraggedRowTh = styled.th`
  height: 40px;
  border: 1px solid black;
`;
const StyledDraggedRowHandle = styled.td`
  cursor: move;
  ${nowDraggingCss};
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
