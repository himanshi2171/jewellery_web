// Action Types
export const ADD_TO_WISHLIST = "ADD_TO_WISHLIST";
export const REMOVE_FROM_WISHLIST = "REMOVE_FROM_WISHLIST";
export const MOVE_TO_CART = "MOVE_TO_CART";
export const EMPTY_WISHLIST = "EMPTY_WISHLIST";

// Action Creators
export const addToWishlist = (product: any) => ({
  type: ADD_TO_WISHLIST,
  payload: { product },
});

export const removeFromWishlist = (productId: number) => ({
  type: REMOVE_FROM_WISHLIST,
  payload: { productId },
});

export const moveToCart = (product: any) => ({
  type: MOVE_TO_CART,
  payload: { product },
});

export const emptyWishlist = () => ({
  type: EMPTY_WISHLIST,
}); 