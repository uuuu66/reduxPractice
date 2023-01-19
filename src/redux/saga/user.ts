import { PayloadAction } from "@reduxjs/toolkit";
import { ServerResponse } from "http";
import { getUserInfo } from "pages/api/user";
import {
  all,
  fork,
  put,
  call,
  takeLatest,
  takeEvery,
} from "redux-saga/effects";
import { getUser, setUser } from "redux/user/userSlice";

function* getUserInfoAction(action: PayloadAction<any, any>) {
  try {
    console.log("g");
    // api 통신할때는 call
    const result: ServerResponse = yield call(getUserInfo);
    yield console.log(result);
  } catch (err) {
    yield console.log(err);
  }
}

export function* animalSaga() {
  yield takeEvery(getUser, getUserInfoAction);
}
