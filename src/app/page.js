"use client"

import { Provider } from "react-redux";
import store from "./lib/store";
import Main from "./homepage/page";

export default function Home() {
  return (
    <Provider store={store}>
      <Main></Main>
    </Provider>
  );
}
