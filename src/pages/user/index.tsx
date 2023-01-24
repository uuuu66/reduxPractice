import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "redux/store";
import { getUserApi, test } from "redux/user/userSlice";

interface Props {}

const Saga: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((root: RootState) => root.loading.isLoading);
  const { name } = useSelector((root: RootState) => root.user, shallowEqual);

  const handleButtonClick = () => {
    dispatch(getUserApi());
  };
  const handleTestClick = () => {
    dispatch(test());
  };
  return (
    <div>
      <div>
        <div>로딩: {isLoading ? "로딩 중" : "로딩 끝"}</div>
        <button onClick={handleButtonClick}>{name}</button>
        <button onClick={handleTestClick}>test</button>
      </div>
    </div>
  );
};
export default Saga;
