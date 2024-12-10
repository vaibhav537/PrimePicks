import { StateCreator } from "zustand";

export interface CartSlice {
  cartProducts: { id: string; quantity: number; price: number }[];
}

export const createCartSlice: StateCreator<CartSlice> = (set, get) => ({
  cartProducts: [],
});
