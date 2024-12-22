import { StateCreator } from "zustand";

export interface CartSlice {
  cartProducts: { id: string; quantity: number; price: number }[];
  addToCart: (id: string, price: number) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  getQuantityByID: (id: string) => number;
  getTotalAmount: () => number;
  removeFromCart: (id: string) => void;
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
  increaseQuantity: (id) => {
    set((state) => {
      const product = state.cartProducts.find((product) => product.id === id);
      if (product) {
        product.quantity += 1;
      }
      return { cartProducts: [...state.cartProducts] };
    });
  },
  decreaseQuantity: (id) => {
    set((state) => {
      const updatedCartProducts = state.cartProducts
        .map((product) => {
          if (product.id === id) {
            return {
              ...product,
              quantity: product.quantity > 1 ? product.quantity - 1 : 0,
            };
          }
          return product;
        })
        .filter((product) => product.quantity > 0); // Remove products with quantity 0

      return { cartProducts: updatedCartProducts };
    });
  },
  getQuantityByID: (id: string) => {
    const product = get().cartProducts.find((product) => product.id === id);
    return product ? product.quantity : 0;
  },
  getTotalAmount: () => {
    const { cartProducts } = get();
    const totalAmount = cartProducts.reduce((total, product) => {
      const productPrice = product.price;
      return total + product.quantity * productPrice;
    }, 0);
    return totalAmount;
  },
  removeFromCart: (id) => {
    set((state) => {
      const updatedCartProducts = state.cartProducts.filter(
        (product) => product.id !== id
      );
      return { cartProducts: updatedCartProducts };
    });
  },
  emptyCart: () => set({ cartProducts: [] }),
});
