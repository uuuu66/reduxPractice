import { all, fork } from "redux-saga/effects";

import { animalSaga } from "./user";

export default function* rootSaga() {
  yield all([fork(animalSaga)]);
}
