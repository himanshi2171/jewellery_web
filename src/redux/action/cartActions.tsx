// Action Types
export const ADD_TO_CART = "ADD_TO_CART";
export const UPDATE_CART_ITEM = "UPDATE_CART_ITEM";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const EMPTY_CART = "EMPTY_CART";

// Action Creators
export const addToCart = (product: any, quantity: number = 1) => ({
  type: ADD_TO_CART,
  payload: { product, quantity },
});

export const updateCartItem = (productId: number, quantity: number) => ({
  type: UPDATE_CART_ITEM,
  payload: { productId, quantity },
});

export const removeFromCart = (productId: number) => ({
  type: REMOVE_FROM_CART,
  payload: { productId },
});

export const emptyCart = () => ({
  type: EMPTY_CART,
}); 