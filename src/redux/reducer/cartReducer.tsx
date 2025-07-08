import {
  ADD_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
  EMPTY_CART,
} from "../action/cartActions";

// Helper to load cart from localStorage
const loadCartFromLocalStorage = () => {
  if (typeof window === "undefined") return { items: [] };
  try {
    const serializedCart = localStorage.getItem("cart");
    if (serializedCart === null) return { items: [] };
    return JSON.parse(serializedCart);
  } catch (e) {
    return { items: [] };
  }
};

const saveCartToLocalStorage = (state) => {
  if (typeof window === "undefined") return;
  try {
    const serializedCart = JSON.stringify(state);
    localStorage.setItem("cart", serializedCart);
  } catch (e) {}
};

const initialState =
  typeof window !== "undefined" ? loadCartFromLocalStorage() : { items: [] };

const cartReducer = (state = initialState, action) => {
  let newItems = state.items;
  let newState = state;
  switch (action.type) {
    case ADD_TO_CART: {
      const { product, quantity } = action.payload;
      const existing = state.items.find(
        (item) => item.product.id === product.id
      );
      if (existing) {
        newItems = state.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity }];
      }
      newState = {
        ...state,
        items: newItems,
      };
      break;
    }
    case UPDATE_CART_ITEM: {
      const { productId, quantity } = action.payload;
      newItems = state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      newState = {
        ...state,
        items: newItems,
      };
      break;
    }
    case REMOVE_FROM_CART: {
      const { productId } = action.payload;
      newItems = state.items.filter((item) => item.product.id !== productId);
      newState = {
        ...state,
        items: newItems,
      };
      break;
    }
    case EMPTY_CART:
      newState = { ...state, items: [] };
      break;
    default:
      newState = state;
  }
  if (typeof window !== "undefined") {
    saveCartToLocalStorage(newState);
  }
  return newState;
};

export default cartReducer;
