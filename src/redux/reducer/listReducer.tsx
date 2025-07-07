// src/reducers/listReducer.ts

import { TYPES, ListAction, ListItem } from "../action/ActionType";

interface ListState {
  list: ListItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ListState = {
  list: [],
  loading: false,
  error: null,
};

export const listReducer = (
  state: ListState = initialState,
  action: ListAction
): ListState => {
  switch (action.type) {
    // Legacy action types
    case TYPES.FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case TYPES.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload,
      };
    case TYPES.FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
