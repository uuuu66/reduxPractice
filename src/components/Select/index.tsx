import React, { useState } from "react";
import styled from "styled-components";
import { DataListType } from "../../shared/interfaces";
import Smile from "../../assets/smile.svg";
import Heart from "../../assets/heart.svg";
import Wink from "../../assets/wink.svg";
import { useEffect } from "react";
import { useRef } from "react";

export interface SelectProps {
  datas?: DataListType[];
  value?: any;
  onChange?: (e?: DataListType<any>) => void;
  disabled?: boolean;
  defaultOpen?: boolean;
}

const Select: React.FC<SelectProps> = ({
  datas = [],
  value = "",
  onChange,
  defaultOpen = false,
  disabled = false,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [isHover, setHover] = useState<boolean>(false);
  const [isFirstClicked, setIsFirstClicked] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(
    datas.findIndex((data) => data.value === value)
  );

  const handleHoverEvent = (isHover: boolean) => {
    setHover(isHover);
  };
  const handleClickListItem = (
    e: React.MouseEvent,
    value?: DataListType<any>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    if (onChange) onChange(value);
  };
  const handleClose = (e: MouseEvent) => {
    setIsOpen(false);
  };
  useEffect(() => {
    window.addEventListener("click", handleClose);
  }, []);
  return (
    <Container ref={wrapperRef}>
      <InputWrapper
        onMouseLeave={(e) => {
          e.preventDefault();
          handleHoverEvent(false);
        }}
        onMouseEnter={(e) => {
          e.preventDefault();
          handleHoverEvent(true);
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!isFirstClicked) setIsFirstClicked(true);
          setIsOpen(!isOpen);
        }}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (isFocused)
            switch (e.code) {
              case "ArrowDown":
              case "ArrowRight":
                if (focusedIndex + 1 >= datas.length) setFocusedIndex(0);
                else setFocusedIndex(focusedIndex + 1);
                break;
              case "ArrowUp":
              case "ArrowLeft":
                if (focusedIndex - 1 <= -1) setFocusedIndex(datas.length - 1);
                else setFocusedIndex(focusedIndex - 1);
                break;
              case "Enter":
                if (onChange)
                  onChange(datas.find((_, index) => index === focusedIndex));
                break;
            }
        }}
      >
        <input
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          readOnly
          value={
            value
              ? datas.find((val) => val.value === value)?.label || value
              : "선택"
          }
        />

        <div>
          {isHover ? (
            <img src={Wink} />
          ) : !isOpen ? (
            <img src={Smile} />
          ) : (
            <img src={Heart} />
          )}
        </div>
      </InputWrapper>

      <List
        top={wrapperRef.current?.clientHeight}
        isOpen={isOpen}
        isFirstClicked={isFirstClicked}
      >
        {datas.map((val, index) => (
          <ListItem
            isFocused={index === focusedIndex}
            isSelect={val.value === value}
            onClick={(e) => {
              e.stopPropagation();
              handleClickListItem(e, val);
            }}
            key={val.value}
          >
            {val.label}
          </ListItem>
        ))}
      </List>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  width: inherit;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  border: 1px solid black;
  border-radius: 4px;
  position: relative;
  z-index: 3;
  background-color: white;
  width: inherit;
  cursor: pointer;
  div {
    display: flex;
    align-items: center;
    flex: 1;
    z-index: 3;
    outline: 0 none;
    min-height: 32px;
    background-color: transparent;
    cursor: pointer;
    max-width: 20%;
  }
  input {
    max-width: 80%;
    outline: none;
    border: none;
    font-size: 40px;
    cursor: pointer;
    flex: 1;
    padding: 2px 4px;
    background-color: transparent;
  }
`;
const List = styled.ul<{
  isOpen?: boolean;
  isFirstClicked?: boolean;
  top?: number;
}>`
  margin: 0;
  padding: 0;
  border: 1px solid gray;
  list-style: none;
  font: inherit;
  width: 100%;
  border-radius: 4px;
  position: absolute;
  top: ${({ top }) => (top ? `${top + 4}px` : "44px")};
  z-index: 2;
  opacity: 0;
  vertical-align: baseline;
  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    30% {
      opacity: 0;
    }
    100% {
      opacity: 0;
      transform: translateY(-100px);
    }
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(-100px);
    }
    50% {
      opacity: 0;
    }
    100% {
      transform: translateY(0px);
      opacity: 1;
    }
  }
  background-color: white;
  animation-name: ${({ isOpen, isFirstClicked }) =>
    !isFirstClicked ? "none" : isOpen ? "fadeIn" : "fadeOut"};
  animation-duration: 0.4s;
  animation-delay: 0s;
  animation-fill-mode: forwards;
`;

const ListItem = styled.li<{ isSelect?: boolean; isFocused?: boolean }>`
  margin: 0;
  padding: 4px;
  border: 0;
  cursor: pointer;
  color: ${({ isSelect }) => (isSelect ? "red" : "black")};
  font-weight: ${({ isSelect }) => (isSelect ? 800 : 400)};
  font: inherit;
  vertical-align: baseline;
  &:hover {
    background-color: black;
    color: white;
  }
  background-color: ${({ isFocused }) => isFocused && "black"};
  color: ${({ isFocused }) => isFocused && "white"};
`;
export default Select;
