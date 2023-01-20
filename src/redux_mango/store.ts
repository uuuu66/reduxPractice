import { AnyAction, configureStore, Reducer, Store } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./saga/rootSaga";
import rootReducer, { IState } from "./slice/rootReducer";

export const createStore = () =>
  configureStore({
    reducer: rootReducer as Reducer<IState, AnyAction>,
    middleware: [sagaMiddleware],
  });

const sagaMiddleware = createSagaMiddleware();

const store = createStore();

export const wrapper = createWrapper<Store>(createStore);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

sagaMiddleware.run(rootSaga);
export default wrapper;
