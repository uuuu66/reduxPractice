import UserChange from "components/User/UserChange";
import UserName from "components/User/UserName";
import React from "react";

interface Props {}

const Saga: React.FC<Props> = () => {
  return (
    <div>
      <div>
        {/* <div>로딩: {isLoading ? "로딩 중" : "로딩 끝"}</div> */}
        <UserName />
        <UserChange />
      </div>
    </div>
  );
};
export default Saga;
