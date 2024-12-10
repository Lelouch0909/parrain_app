import { createEtudiant, connection, getAccount, getCurrentUser } from "./action";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  user: null,
  account: null,
  error: null,
  loading: false,
};

export const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Création d'étudiant
      .addCase(createEtudiant.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(createEtudiant.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEtudiant.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Connexion
      .addCase(connection.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(connection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connection.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.user = null;
      })
      // Récupération du compte
      .addCase(getAccount.fulfilled, (state, action) => {
        state.account = action.payload;
        state.loading = false;
      })
      .addCase(getAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAccount.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.account = null;
      })
      // Récupération de l'utilisateur courant
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.user = null;
      });
  },
});

