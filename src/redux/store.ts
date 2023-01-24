import { AnyAction, configureStore, Reducer, Store } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import createSagaMiddleware from "redux-saga";
import rootReducer, { IState } from "./rootReducer";
import rootSaga from "./saga";

const sagaMiddleware = createSagaMiddleware();

const createStore = () => {
  const store = configureStore({
    reducer: rootReducer as Reducer<IState, AnyAction>,
    middleware: [sagaMiddleware],
    devTools: true,
  });
  return store;
};
export const store = createStore();
sagaMiddleware.run(rootSaga);

const wrapper = createWrapper<Store<IState>>(createStore);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default wrapper;
