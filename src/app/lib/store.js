import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./store/AuthReducer/reducer";
import { filiereReducer } from "./store/FiliereReducer/reducer";
import { associationReducer } from "./store/AssociationReducer/reducer";

const store = configureStore({
  reducer: {
    auth: authReducer.reducer,
    filieres: filiereReducer.reducer,
    associations: associationReducer.reducer,
  },
});

export default store;
