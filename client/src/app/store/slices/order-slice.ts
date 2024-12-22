import { StateCreator } from "zustand";
import { OrderType } from "@/lib/utils/types";

export interface OrderSlice {
  orderInfo: undefined | OrderType;
  setOrderInfo: (orderInfo: OrderType) => void;
}

export const createOrderSlice: StateCreator<OrderSlice> = (set, get) => ({
  orderInfo: undefined,
  setOrderInfo: (orderInfo) => {
    set({ orderInfo });
  },
});
