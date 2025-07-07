import {
  ADD_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
  EMPTY_CART,
} from "../action/cartActions";

const initialState = {
  items: [], // { product, quantity }
};

const cartReducer = (state = initialState, action) => {
  let newItems = state.items;
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
      return {
        ...state,
        items: newItems,
      };
    }
    case UPDATE_CART_ITEM: {
      const { productId, quantity } = action.payload;
      newItems = state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      return {
        ...state,
        items: newItems,
      };
    }
    case REMOVE_FROM_CART: {
      const { productId } = action.payload;
      newItems = state.items.filter((item) => item.product.id !== productId);
      return {
        ...state,
        items: newItems,
      };
    }
    case EMPTY_CART:
      return { ...state, items: [] };
    default:
      return state;
  }
};

export default cartReducer;
