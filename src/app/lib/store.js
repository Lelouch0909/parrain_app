import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./store/AuthReducer/reducer";

const store = configureStore({
  reducer: {
    auth: authReducer.reducer,
  },
});

export default store;
