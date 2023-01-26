import "styles/globals.css";
import type { AppProps } from "next/app";
import wrapper, { store } from "redux_mango/store";
import { Provider } from "react-redux";

const reduxStore = store;

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={reduxStore}>
      <Component {...pageProps} />
    </Provider>
  );
}
export default wrapper.withRedux(App);
