import { getFilieres } from "./action";

const { createSlice } = require("@reduxjs/toolkit");



const initialState = {
  filieres: [],
  error: "",
  loading: false,
};

export const filiereReducer = createSlice({
  name: "filiere",
  initialState,
  reducers: {
    setFilieres: (state, action) => {
      state.filieres.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFilieres.fulfilled, (state, action) => {
        state.filieres = action.payload.documents;
        state.loading = false;
      })
      .addCase(getFilieres.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getFilieres.rejected, (state, action) => {
        console.log(action);
        
        state.error = action.error.message;
        state.loading = false;

      });
  },
});

