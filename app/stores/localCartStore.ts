import { getCookie, setCookie } from "../utils/cookies";
import type { Order, OrderItem, Game } from "../api/order/orderApi";

const LOCAL_CART_COOKIE = "localCart";

function createEmptyCart(): Order {
  return {
    id: 0, // 0 indicates it's a local cart, not from DB
    userId: 0,
    orderItems: [],
    status: "PENDING",
    totalPrice: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function getLocalCart(): Order {
  const localCartJson = getCookie(LOCAL_CART_COOKIE);
  if (localCartJson) {
    try {
      return JSON.parse(localCartJson);
    } catch (e) {
      console.error("Failed to parse local cart cookie", e);
      // If parsing fails, return an empty cart
      return createEmptyCart();
    }
  }
  return createEmptyCart();
}

function saveLocalCart(cart: Order) {
  setCookie(LOCAL_CART_COOKIE, JSON.stringify(cart), 7);
}

export function addGameToLocalCart(game: Game): Order {
  const cart = getLocalCart();

  // Check if item already exists
  const itemExists = cart.orderItems.some((item) => item.game.id === game.id);
  if (itemExists) {
    // Maybe show a notification that item is already in cart
    console.log("Game already in cart");
    return cart;
  }

  const newOrderItem: OrderItem = {
    id: Math.random(), // Temporary ID for local item
    game: game,
    price: game.price,
  };

  const updatedItems = [...cart.orderItems, newOrderItem];
  const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.price, 0);

  const updatedCart: Order = {
    ...cart,
    orderItems: updatedItems,
    totalPrice: newTotalPrice,
    updatedAt: new Date().toISOString(),
  };

  saveLocalCart(updatedCart);
  return updatedCart;
}

export function removeGameFromLocalCart(gameId: number): Order {
  const cart = getLocalCart();
  const updatedItems = cart.orderItems.filter(
    (item) => item.game.id !== gameId
  );
  const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.price, 0);

  const updatedCart: Order = {
    ...cart,
    orderItems: updatedItems,
    totalPrice: newTotalPrice,
    updatedAt: new Date().toISOString(),
  };

  saveLocalCart(updatedCart);
  return updatedCart;
}
