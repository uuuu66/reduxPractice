import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";

export interface HelloState {
  message: string;
}
const helloSlice = createSlice({
  name: "hello",
  initialState: { message: "hi" },
  reducers: {
    requestMessage: () => {},
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    removeMessage: (state) => {
      state.message = "removed";
    },
  },
});

export const { setMessage, removeMessage, requestMessage } = helloSlice.actions;

export default helloSlice.reducer;
