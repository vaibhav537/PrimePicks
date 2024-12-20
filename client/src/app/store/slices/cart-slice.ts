import { StateCreator } from "zustand";

export interface CartSlice {
  cartProducts: { id: string; quantity: number; price: number }[];
  addToCart: (id: string, price: number) => void;
  emptyCart: () => void;
}

export const createCartSlice: StateCreator<CartSlice> = (set, get) => ({
  cartProducts: [],
  addToCart: (id: string, price: number) => {
    set((state) => {
      const existingProduct = state.cartProducts.find(
        (product) => product.id === id
      );
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.cartProducts.push({ id, quantity: 1, price });
      }
      return {
        cartProducts: [...state.cartProducts],
      };
    });
  },
  emptyCart: () => set({ cartProducts: [] }),
});
