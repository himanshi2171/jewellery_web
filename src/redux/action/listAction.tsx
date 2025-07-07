import axios from "axios";
import { ACTION_TYPES, ListItem, ListAction } from "./ActionType";

export const addList = (item: ListItem): ListAction => ({
  type: ACTION_TYPES.ADD_LIST,
  payload: item,
});

export const deleteList = (id: number): ListAction => ({
  type: ACTION_TYPES.DELETE_LIST,
  payload: id,
});

export const updateList = (item: ListItem): ListAction => ({
  type: ACTION_TYPES.UPDATE_LIST,
  payload: item,
});

export const listAction =
  ({
    onSuccess,
    onFailure,
  }: {
    onSuccess: (data: any) => void;
    onFailure: (error: any) => void;
  }) =>
  async (dispatch: any) => {
    dispatch({
      type: ACTION_TYPES.FETCH_PRODUCTS_REQUEST,
    });

    try {
      const response = await axios.get("http://localhost:5000/collections");
      dispatch({
        type: ACTION_TYPES.FETCH_PRODUCTS_SUCCESS,
        payload: response.data,
      });
      onSuccess(response);
    } catch (error: any) {
      dispatch({
        type: ACTION_TYPES.FETCH_PRODUCTS_FAILURE,
        payload: error.message,
      });
      onFailure(error);
    }
  };

export const fetchProductByTitle =
  ({
    title,
    onSuccess,
    onFailure,
  }: {
    title: string;
    onSuccess: (data: any) => void;
    onFailure: (error: any) => void;
  }) =>
  async (dispatch: any) => {
    dispatch({
      type: ACTION_TYPES.FETCH_PRODUCTS_REQUEST,
    });

    try {
      const response = await axios.get(
        `http://localhost:5000/collections/title?name=${encodeURIComponent(
          title
        )}`
      );
      dispatch({
        type: ACTION_TYPES.FETCH_PRODUCTS_SUCCESS,
        payload: response.data,
      });
      onSuccess(response);
    } catch (error: any) {
      console.error("Error fetching product by title:", error);
      dispatch({
        type: ACTION_TYPES.FETCH_PRODUCTS_FAILURE,
        payload: error.message,
      });
      onFailure(error.message);
    }
  };
