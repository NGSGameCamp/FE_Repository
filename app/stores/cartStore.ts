import { create } from 'zustand';
import { getCart } from '../api/orderApi';

type CartStore = {
  itemCount: number;
  gameIds: number[];
  fetchCart: () => Promise<void>;
  isLoading: boolean;
};

export const useCartStore = create<CartStore>((set) => ({
  itemCount: 0,
  gameIds: [],
  isLoading: true,
  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await getCart();
      set({
        itemCount: cart.orderItems.length,
        gameIds: cart.orderItems.map((item) => item.game.id),
        isLoading: false,
      });
    } catch (error) {
      console.error("장바구니 정보 조회 실패:", error);
      set({ itemCount: 0, gameIds: [], isLoading: false });
    }
  },
}));
