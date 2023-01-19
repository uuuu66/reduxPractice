import { AnyAction, CombinedState, combineReducers } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import userSlice, { IUserState } from "./user/userSlice";

export interface IState {
  user: IUserState;
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
        user: userSlice,
      });
      return combinedReducer(state, action);
    }
  }
};
export default rootReducer;
