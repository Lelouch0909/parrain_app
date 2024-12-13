import { configureStore, } from "@reduxjs/toolkit";
import { authReducer } from "./store/AuthReducer/reducer";
import { filiereReducer } from "./store/FiliereReducer/reducer";
import { associationReducer } from "./store/AssociationReducer/reducer";
import { codeReducer } from "./store/CodeReducer/reducer";
import authMiddleware from "../middleware/authMiddleware";
const store = configureStore({
  reducer: {
    auth: authReducer.reducer,
    filieres: filiereReducer.reducer,
    associations: associationReducer.reducer,
    code: codeReducer.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware), // Ajout du middleware ici
});

export default store;
