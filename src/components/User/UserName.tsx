import useShallowSelector from "hooks/useShallowSelector";
import React from "react";

interface Props {}

const UserName: React.FC<Props> = () => {
  const name = useShallowSelector((root) => root.user.name);

  return (
    <div>
      <div>{name}</div>
    </div>
  );
};
export default UserName;
