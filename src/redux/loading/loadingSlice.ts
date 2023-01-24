import { createSlice } from "@reduxjs/toolkit";

const NAME = "loading";

export interface ILoadingState {
  isLoading: boolean;
}

const initialState: ILoadingState = {
  isLoading: false,
};

const loadingSlice = createSlice({
  name: NAME,
  initialState: initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    endLoading: (state) => {
      state.isLoading = false;
    },
  },
});

export const { startLoading, endLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
