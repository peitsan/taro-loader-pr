import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface UserInfoType {
  id: number;
  username: string;
  permission: string;
  nickname: string;
}

const initialState: UserInfoType = {
  id: 0,
  username: "用户",
  permission: "worker",
  nickname: "用户",
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    updateUserInfo(state, action: PayloadAction<UserInfoType>) {
      [
        state.id = state.id,
        state.username = state.username,
        state.permission = state.permission,
        state.nickname = state.nickname,
      ] = [
        action.payload.id,
        action.payload.username,
        action.payload.permission,
        action.payload.nickname,
      ];
    },
  },
});

export const { updateUserInfo: updateUserInfoAC } = userInfoSlice.actions;
