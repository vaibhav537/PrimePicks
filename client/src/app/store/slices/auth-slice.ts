import { StateCreator } from "zustand";

export interface UserInfoType {
  id: string;
}

export interface AdminInfoType {
  id: string;
}


export interface AuthSlice {
  userInfo: undefined | UserInfoType;
  setUserInfo: (userInfo: UserInfoType) => void;
}

export interface AdminAuthSlice {
  adminInfo: undefined | AdminInfoType;
  setAdminInfo: (adminInfo: AdminInfoType) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  userInfo: undefined,
  setUserInfo: (userInfo: any) => set({ userInfo }),
});

export const createAdminAuthSlice: StateCreator<AdminAuthSlice> = (set, get) => ({
  adminInfo: undefined,
  setAdminInfo: (adminInfo: any) => set({ adminInfo }),
});
