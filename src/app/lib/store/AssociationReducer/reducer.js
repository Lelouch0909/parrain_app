import { getFilieres, getAssociations, createAssociationsForFiliere, getFullAssociations } from "./action";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  filleul: [],
  parrain: null,
  associations: [],
  error: "",
  loading: false,
};

export const associationReducer = createSlice({
  name: "association",
  initialState,
  
  extraReducers: (builder) => {
    builder
     
      
      .addCase(getAssociations.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getAssociations.fulfilled, (state, action) => {
        if (action.payload.length > 0 && action.payload[0].type_compte === TypeCompte.FILLEUL) {
          state.filleul = action.payload;
        } else {
          state.parrain = action.payload[0] || null;
        }
        state.loading = false;
      })
      .addCase(getAssociations.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(createAssociationsForFiliere.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createAssociationsForFiliere.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createAssociationsForFiliere.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(getFullAssociations.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getFullAssociations.fulfilled, (state, action) => {
        state.associations = action.payload;
        state.loading = false;
      })
      .addCase(getFullAssociations.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.associations = [];
      });
  },
});

