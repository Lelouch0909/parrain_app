import { createUser } from "./action";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  user: null,
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
      .addCase(createUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(createUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;

      });
  },
});

