"use client"
import { Provider } from "react-redux";
import store from "./lib/store";

export default function Home() {
  return (
    <Provider store={store}>
      <h1>Hello World</h1>
    </Provider>
  );
}
