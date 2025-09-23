
// 백엔드 API의 기본 URL
const API_BASE_URL = "/api";

// API 응답을 위한 기본 인터페이스
interface ApiResponse<T> {
  data?: T;
  error?: string;
}

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
  | 'CART'
  | 'PRE_ORDERED'
  | 'PENDING'
  | 'PAYMENT_COMPLETED'
  | 'PAYMENT_FAILED'
  | 'PURCHASED_CONFIRMED'
  | 'REFUND_REQUESTED'
  | 'PARTIALLY_REFUNDED'
  | 'FULLY_REFUNDED';

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

// 공통 fetch 함수
async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: '알 수 없는 오류가 발생했습니다.' }));
    throw new Error(errorData.message || 'API 요청에 실패했습니다.');
  }

  return response.json();
}

/**
 * 현재 사용자의 장바구니 정보를 가져옵니다. 장바구니가 없으면 새로 생성합니다.
 * @returns {Promise<Order>} 장바구니 정보
 */
export const getCart = (): Promise<Order> => {
  return fetchApi<Order>(`${API_BASE_URL}/orders/cart`);
};

/**
 * 장바구니에 게임을 추가합니다.
 * @param {number} gameId - 추가할 게임의 ID
 * @returns {Promise<Order>} 업데이트된 장바구니 정보
 */
export const addGameToCart = (gameId: number): Promise<Order> => {
  return fetchApi<Order>(`${API_BASE_URL}/orders/cart/add?gameId=${gameId}`, {
    method: 'POST',
  });
};

/**
 * 장바구니에서 게임을 제거합니다.
 * @param {number} gameId - 제거할 게임의 ID
 * @returns {Promise<Order>} 업데이트된 장바구니 정보
 */
export const removeGameFromCart = (gameId: number): Promise<Order> => {
  return fetchApi<Order>(`${API_BASE_URL}/orders/cart/remove/${gameId}`, {
    method: 'DELETE',
  });
};

/**
 * 현재 사용자의 모든 주문 내역을 가져옵니다.
 * @returns {Promise<Order[]>} 주문 내역 리스트
 */
export const getMyOrders = (): Promise<Order[]> => {
  return fetchApi<Order[]>(`${API_BASE_URL}/orders`);
};
