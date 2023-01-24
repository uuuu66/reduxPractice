import { all, fork, takeEvery } from "redux-saga/effects";
import { requestMessage } from "redux_mango/slice/helloSlice";
import { handleHello } from "./helloSaga";
function* watchHelloSaga() {
  yield takeEvery(requestMessage.type, handleHello);
}

export default function* rootSaga() {
  yield all([fork(watchHelloSaga)]);
}
