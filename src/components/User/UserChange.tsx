import React from "react";
import { useDispatch } from "react-redux";
import { getUserApi } from "redux/user/userSlice";

interface Props {}

const UserChange: React.FC<Props> = () => {
  const dispatch = useDispatch();

  const changeUser = () => {
    dispatch(getUserApi());
  };

  return (
    <div>
      <button onClick={changeUser}>사람 변경</button>
    </div>
  );
};
export default UserChange;
