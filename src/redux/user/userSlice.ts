import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUserState {
  // 이름
  name: string;

  // 나이
  age: number;

  // 주소
  address: string;

  // 휴대폰 번호
  phone: string;
}

const NAME = "user";

/**
 * 초기값
 */
const initialState: IUserState = {
  age: 28,
  name: "이경수",
  address: "서울특별시 영등포구 선유서로",
  phone: "010-9002-4823",
};

/**
 * 슬라이스
 */
const userSlice = createSlice({
  name: NAME,
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUserState>) => {
      state = action.payload;
    },
    getUser: () => {},
  },
});

/**
 * 리듀서
 */
export const { setUser, getUser } = userSlice.actions;

export default userSlice.reducer;
