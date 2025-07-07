// src/action/ActionType.ts

export const ACTION_TYPES = {
  ADD_LIST: "ADD_LIST",
  DELETE_LIST: "DELETE_LIST",
  UPDATE_LIST: "UPDATE_LIST",
  ADD_TO_WISHLIST: "ADD_TO_WISHLIST",
  REMOVE_FROM_WISHLIST: "REMOVE_FROM_WISHLIST",
  CLEAR_WISHLIST: "CLEAR_WISHLIST",
  CLEAR_LIST: "CLEAR_LIST",
  FETCH_PRODUCTS_REQUEST: "FETCH_PRODUCTS_REQUEST",
  FETCH_PRODUCTS_SUCCESS: "FETCH_PRODUCTS_SUCCESS",
  FETCH_PRODUCTS_FAILURE: "FETCH_PRODUCTS_FAILURE",
} as const;

export const TYPES = {
  FETCH_PRODUCTS_REQUEST: "FETCH_PRODUCTS_REQUEST",
  FETCH_PRODUCTS_SUCCESS: "FETCH_PRODUCTS_SUCCESS",
  FETCH_PRODUCTS_FAILURE: "FETCH_PRODUCTS_FAILURE",
};

export const USER_TYPES = {
  FETCH_USER_REQUEST: "FETCH_USER_REQUEST",
  FETCH_USER_SUCCESS: "FETCH_USER_SUCCESS",
  FETCH_USER_FAILURE: "FETCH_USER_FAILURE",
} ;

export interface ListItem {
  id: number;
  name: string;
  image?: string;
  description?: string;
  price?: string;
  quantity?: number;
  [key: string]: unknown;
}

export interface UserItem {
  id: number;
  name: string;
  password: string;
  email: string;
  address: string;
}

export interface AddListAction {
  type: typeof ACTION_TYPES.ADD_LIST;
  payload: ListItem;
}

export interface DeleteListAction {
  type: typeof ACTION_TYPES.DELETE_LIST;
  payload: number;
}

export interface UpdateListAction {
  type: typeof ACTION_TYPES.UPDATE_LIST;
  payload: ListItem;
}

export interface AddToWishlistAction {
  type: typeof ACTION_TYPES.ADD_TO_WISHLIST;
  payload: ListItem;
}

export interface RemoveFromWishlistAction {
  type: typeof ACTION_TYPES.REMOVE_FROM_WISHLIST;
  payload: number;
}

export interface ClearWishlistAction {
  type: typeof ACTION_TYPES.CLEAR_WISHLIST;
}

export interface ClearListAction {
  type: typeof ACTION_TYPES.CLEAR_LIST;
}

export interface FetchProductsRequestAction {
  type: typeof ACTION_TYPES.FETCH_PRODUCTS_REQUEST;
}

export interface FetchProductsSuccessAction {
  type: typeof ACTION_TYPES.FETCH_PRODUCTS_SUCCESS;
  payload: any;
}

export interface FetchProductsFailureAction {
  type: typeof ACTION_TYPES.FETCH_PRODUCTS_FAILURE;
  payload: string;
}

export type ListAction =
  | AddListAction
  | DeleteListAction
  | UpdateListAction
  | AddToWishlistAction
  | RemoveFromWishlistAction
  | ClearWishlistAction
  | ClearListAction
  | FetchProductsRequestAction
  | FetchProductsSuccessAction
  | FetchProductsFailureAction;
