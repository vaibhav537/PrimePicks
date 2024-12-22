import { create } from "zustand";
import {
  AdminAuthSlice,
  createAdminAuthSlice,
  AuthSlice,
  createAuthSlice,
} from "./slices/auth-slice";
import { CartSlice, createCartSlice } from "./slices/cart-slice";
import { OrderSlice, createOrderSlice } from "./slices/order-slice";


type StoreState = AuthSlice & CartSlice & OrderSlice;
type AdminStoreState = AdminAuthSlice;

export const useAppStore = create<StoreState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createCartSlice(...a),
  ...createOrderSlice(...a)
}));

export const useAdminAppStore = create<AdminAuthSlice>()((...a) => ({
  ...createAdminAuthSlice(...a),
}));
