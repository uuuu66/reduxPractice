import { hello } from "apis/hello";
import { Data } from "pages/api/hello";
import { call, put } from "redux-saga/effects";
import helloSlice, {
  removeMessage,
  setMessage,
} from "redux_mango/slice/helloSlice";

export function* handleHello() {
  try {
    const res: Data = yield call(hello);

    yield put(setMessage(res.message));
  } catch (error) {
    yield put(removeMessage());
  }
}
