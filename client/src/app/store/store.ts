import { create } from "zustand";
import { AdminAuthSlice,createAdminAuthSlice, AuthSlice, createAuthSlice } from "./slices/auth-slice";

type StoreState = AuthSlice;
type AdminStoreState = AdminAuthSlice;

export const useAppStore = create<StoreState>()((...a) => ({
  ...createAuthSlice(...a),
}));

export const useAdminAppStore = create<AdminAuthSlice>()((...a) => ({
  ...createAdminAuthSlice(...a),
}));