import "styles/globals.css";
import type { AppProps } from "next/app";
import createSagaMiddleware from "redux-saga";
import wrapper from "redux/store";
// import { configureStore, applyMiddleware } from "@reduxjs/toolkit";

// const sagaMiddleware = createSagaMiddleware();
// // 스토어에 mount 합니다.
// const store = configureStore(reducer, applyMiddleware(sagaMiddleware));

// // 그리고 saga를 실행합니다.
// sagaMiddleware.run(mySaga);

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default wrapper.withRedux(App);
