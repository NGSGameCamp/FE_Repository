import { fetchApi } from "../fetchApi";
import type { Order, PendingOrderDetails } from "./types";

// 현재 사용자의 장바구니 정보를 가져옵니다. 장바구니가 없으면 새로 생성
export const getCart = (): Promise<Order> => {
  return fetchApi<Order>(`/orders/cart`);
};

// 장바구니에 게임을 추가
export const addGameToCart = (gameId: number): Promise<Order> => {
  return fetchApi<Order>(`/orders/cart/add?gameId=${gameId}`, {
    method: "POST",
  });
};

// 장바구니에서 게임을 제거
export const removeGameFromCart = (gameId: number): Promise<Order> => {
  return fetchApi<Order>(`/orders/cart/remove/${gameId}`, {
    method: "DELETE",
  });
};

// 현재 사용자의 모든 주문 내역을 가져옴
export const getMyOrders = (): Promise<Order[]> => {
  return fetchApi<Order[]>(`/orders`);
};

export const getPendingOrder = (): Promise<PendingOrderDetails> => {
  return fetchApi<PendingOrderDetails>(`/orders/pending`);
};

export type {
  Game,
  Order,
  OrderItem,
  OrderStatus,
  ApiResponse,
  PendingOrderDetails,
  PendingOrderItem,
  PendingOrderCustomer,
} from "./types";
