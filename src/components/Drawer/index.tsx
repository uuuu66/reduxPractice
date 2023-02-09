import { defaultBoxShadow } from "@/styles/boxShadow";
import React, { CSSProperties, FunctionComponent, useRef } from "react";
import styled, { css } from "styled-components";

type Direction = "LtoR" | "RtoL" | "BtoT" | "TtoB";
export interface Props extends React.PropsWithChildren {
  direction?: Direction;
  width?: string;
  height?: string;
  containerStyle?: CSSProperties;
  renderBackground?: boolean;
  initialTranslatePosition?: string;
  isOn: boolean;
  closeOnClickBackground?: boolean;
  onOffHandler: (e?: React.MouseEvent) => void;
}

interface StyleProps
  extends Pick<
    Props,
    "direction" | "width" | "height" | "initialTranslatePosition" | "isOn"
  > {}

const Drawer: FunctionComponent<Props> = function Drawer(props) {
  const {
    direction = "LtoR",
    width,
    height,
    containerStyle,
    renderBackground = true,
    children,
    initialTranslatePosition,
    isOn = false,
    closeOnClickBackground = false,
    onOffHandler,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const styleProps: StyleProps = {
    direction,
    width,
    height,
    initialTranslatePosition,
    isOn,
  };
  const handleClickBackground = (e: React.MouseEvent) => {
    if (closeOnClickBackground) {
      onOffHandler(e);
    }
  };
  return renderBackground ? (
    <DrawerBackground onClick={handleClickBackground}>
      <DrawerContainer
        style={containerStyle}
        ref={containerRef}
        {...styleProps}
      >
        {children}
      </DrawerContainer>
    </DrawerBackground>
  ) : (
    <DrawerContainer style={containerStyle} ref={containerRef} {...styleProps}>
      {children}
    </DrawerContainer>
  );
};

export default Drawer;
interface TransformProp extends StyleProps {}
const BtoT = css<TransformProp>`
  bottom: 0;
  right: 0;
  left: 0;

  max-width: ${({ width }) => width || "100%"};
  max-height: ${({ height }) => height || "80%"};
  transform: translateY(
    ${({ initialTranslatePosition, height, isOn }) =>
      isOn ? "0%" : initialTranslatePosition || height || "100%"}
  );
`;
const TtoB = css<TransformProp>`
  ${BtoT};
  bottom: auto;
  top: 0;
  transform: translateY(
    -${({ initialTranslatePosition, height, isOn }) => (isOn ? "0%" : initialTranslatePosition || height || "100%")}
  );
`;
const LtoR = css<TransformProp>`
  left: 0;
  top: 0;
  bottom: 0;
  max-width: ${({ width }) => width || "80%"};
  max-height: ${({ height }) => height || "100%"};
  transform: translateX(
    -${({ initialTranslatePosition, width, isOn }) => (isOn ? "0%" : initialTranslatePosition || width || "100%")}
  );
`;
const RtoL = css<TransformProp>`
  ${LtoR};
  left: auto;
  right: 0;
  transform: translateX(
    ${({ initialTranslatePosition, width, isOn }) =>
      isOn ? "0%" : initialTranslatePosition || width || "100%"}
  );
`;

const tranform = css<
  Pick<StyleProps, "direction" | "width" | "height" | "isOn">
>`
  ${({ direction }) => {
    switch (direction) {
      case "BtoT":
        return BtoT;
      case "LtoR":
        return LtoR;
      case "RtoL":
        return RtoL;
      case "TtoB":
        return TtoB;
      default:
        return LtoR;
    }
  }}
`;
const DrawerContainer = styled.div<StyleProps>`
  box-sizing: border-box; /* 오페라(Opera) */
  -moz-box-sizing: border-box; /* 파이어폭스(Firefox)*/
  -webkit-box-sizing: border-box;
  position: absolute;
  padding: 50px 50px;
  background-color: white;
  ${defaultBoxShadow};
  ${tranform};
  width: 100%;
  height: 100%;
  transition: transform 0.3s;
`;
const DrawerBackground = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
`;
