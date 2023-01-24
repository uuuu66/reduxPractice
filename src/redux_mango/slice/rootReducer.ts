import { AnyAction, CombinedState, combineReducers } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import helloSlice, { HelloState } from "./helloSlice";

export interface IState {
  hello: HelloState;
}

const rootReducer = (
  state: IState,
  action: AnyAction
): CombinedState<IState> => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        hello: helloSlice,
      });

      return combinedReducer(state, action);
    }
  }
};
export default rootReducer;
