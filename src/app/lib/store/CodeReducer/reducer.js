import { createSlice } from "@reduxjs/toolkit";
import { verifyAndGenerateCode } from "./action";

const initialState = {
  success: false,
  newCode: null,
  error: null,
  loading: false
};

export const codeReducer = createSlice({
  name: "code",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(verifyAndGenerateCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAndGenerateCode.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.newCode = action.payload.newCode;
        state.error = null;
      })
      .addCase(verifyAndGenerateCode.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.newCode = null;
        state.error = action.payload;
      });
  },
});

