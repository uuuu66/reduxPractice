import { shallowEqual, useSelector } from "react-redux";
import { IState } from "redux/rootReducer";

type UseShallowSelector = <T>(callback: (state: IState) => T) => T;

const useShallowSelector: UseShallowSelector = (selector) => {
  return useSelector(selector, shallowEqual);
};
export default useShallowSelector;
