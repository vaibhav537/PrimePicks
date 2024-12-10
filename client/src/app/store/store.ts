import { create } from "zustand";
import {
  AdminAuthSlice,
  createAdminAuthSlice,
  AuthSlice,
  createAuthSlice,
} from "./slices/auth-slice";
import { CartSlice, createCartSlice } from "./slices/cart-slice";

type StoreState = AuthSlice & CartSlice;
type AdminStoreState = AdminAuthSlice;

export const useAppStore = create<StoreState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createCartSlice(...a),
}));

export const useAdminAppStore = create<AdminAuthSlice>()((...a) => ({
  ...createAdminAuthSlice(...a),
}));
