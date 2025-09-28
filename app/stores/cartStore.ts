import { create } from "zustand";
import { getCart } from "../api/order/orderApi";
import { getLocalCart } from "./localCartStore";

type CartStore = {
  itemCount: number;
  gameIds: number[];
  fetchCart: () => Promise<void>;
  isLoading: boolean;
};

const AUTH_STORAGE_KEY = "auth:user";

export const useCartStore = create<CartStore>((set) => ({
  itemCount: 0,
  gameIds: [],
  isLoading: true,
  fetchCart: async () => {
    set({ isLoading: true });
    try {
      // 로컬 스토리지를 보고 로그인된 상태인지 확인
      const isAuthenticated = !!localStorage.getItem(AUTH_STORAGE_KEY);

      let cart;
      if (isAuthenticated) {
        // 로그인 되어있으면 백엔드에서 장바구니 정보 조회
        cart = await getCart();
      } else {
        // 로그인 되어있지 않으면 로컬 스토리지에서 장바구니 정보 조회
        cart = getLocalCart();
      }

      set({
        itemCount: cart.orderItems.length,
        gameIds: cart.orderItems.map((item) => item.game.id),
        isLoading: false,
      });
    } catch (error) {
      // 로그인 상태와 상관없이 장바구니 조회 실패 시
      console.error("장바구니 정보 조회 실패:", error);
      set({ itemCount: 0, gameIds: [], isLoading: false });
    }
  },
}));
