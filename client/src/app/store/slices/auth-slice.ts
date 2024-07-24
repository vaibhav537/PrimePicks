import { StateCreator } from "zustand";

export interface UserInfoType {
  id: string;
}

export interface AuthSlice {
  userInfo: undefined | UserInfoType;
  setUserInfo: (userInfo: UserInfoType) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  userInfo: undefined,
  setUserInfo: (userInfo: any) => set({ userInfo }),
});
