// 게임 정보를 위한 인터페이스
export interface Game {
  id: number;
  name: string;
  price: number;
  // 필요에 따라 다른 속성 추가
}

// 주문 항목 정보를 위한 인터페이스
export interface OrderItem {
  id: number;
  game: Game;
  price: number; // 주문 시점의 가격
}

export type OrderStatus =
  | "PRE_ORDERED"
  | "PENDING"
  | "PAYMENT_COMPLETED"
  | "PAYMENT_FAILED"
  | "PURCHASED_CONFIRMED"
  | "REFUND_REQUESTED"
  | "PARTIALLY_REFUNDED"
  | "FULLY_REFUNDED";

// 주문 정보를 위한 인터페이스
export interface Order {
  id: number;
  userId: number;
  orderItems: OrderItem[];
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

// API 응답을 위한 기본 인터페이스
// TODO: 이 친구 어디서 쓰나요??
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
