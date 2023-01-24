import { PayloadAction } from "@reduxjs/toolkit";
import { getUserInfo } from "pages/api/user";
import { put, call, takeLatest, delay } from "redux-saga/effects";
import { endLoading, startLoading } from "redux/loading/loadingSlice";
import { getUserApi, IUserState, setUser } from "redux/user/userSlice";

function* getUserInfoAction(action: PayloadAction<any, any>) {
  try {
    // api 통신할때는 call
    yield put(startLoading());
    yield delay(2000);
    const result: IUserState = yield call(getUserInfo);
    yield put(setUser(result));
  } catch (err) {
    yield console.log(err);
  } finally {
    yield put(endLoading());
  }
}

export function* animalSaga() {
  yield takeLatest(getUserApi, getUserInfoAction);
}
