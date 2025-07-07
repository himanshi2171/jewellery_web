import {
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
  MOVE_TO_CART,
  EMPTY_WISHLIST,
} from "../action/wishlistActions";
import { RootState } from "@/types/page";

interface WishlistState {
  wishlist: any[];
}

// Helper to get current user ID from localStorage
function getCurrentUserId() {
  try {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    return user?.id || "guest";
  } catch {
    return "guest";
  }
}

function loadWishlist() {
  const userId = getCurrentUserId();
  return JSON.parse(localStorage.getItem(`wishlist_${userId}`) || "[]");
}

function saveWishlist(wishlist: any[]) {
  const userId = getCurrentUserId();
  localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlist));
}

const initialState: WishlistState = {
  wishlist: typeof window !== "undefined" ? loadWishlist() : [],
};

export const wishlistReducer = (
  state: WishlistState = initialState,
  action: any
): WishlistState => {
  let newWishlist = state.wishlist;
  switch (action.type) {
    case ADD_TO_WISHLIST:
      if (state.wishlist.find((item) => item.id === action.payload.product.id)) {
        return state;
      }
      newWishlist = [...state.wishlist, action.payload.product];
      saveWishlist(newWishlist);
      return {
        ...state,
        wishlist: newWishlist,
      };
    case REMOVE_FROM_WISHLIST:
      newWishlist = state.wishlist.filter((item) => item.id !== action.payload.productId);
      saveWishlist(newWishlist);
      return {
        ...state,
        wishlist: newWishlist,
      };
    case MOVE_TO_CART:
      newWishlist = state.wishlist.filter((item) => item.id !== action.payload.product.id);
      saveWishlist(newWishlist);
      return {
        ...state,
        wishlist: newWishlist,
      };
    case EMPTY_WISHLIST:
      saveWishlist([]);
      return {
        ...state,
        wishlist: [],
      };
    default:
      return state;
  }
}; 