import { all, fork, takeLatest } from "redux-saga/effects";
import { requestMessage } from "redux_mango/slice/helloSlice";
import { handleHello } from "./helloSaga";
function* watchHelloSaga() {
  yield [takeLatest(requestMessage.type, handleHello)];
}
function* helloSaga() {
  yield all([fork(watchHelloSaga)]);
}
export default function* rootSaga() {
  yield all([fork(helloSaga)]);
}
