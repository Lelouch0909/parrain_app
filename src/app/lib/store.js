import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./store/AuthReducer/reducer";
import { filiereReducer } from "./store/FiliereReducer/reducer";
const store = configureStore({
  reducer: {
    auth: authReducer.reducer,
    filieres: filiereReducer.reducer,
  },
});

export default store;
