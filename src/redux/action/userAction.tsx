import axios from "axios";
import { USER_TYPES } from "./ActionType";

export const signUpAction = ({
  formData,
  onSuccess,
  onFailure,
}: {
  formData: any;
  onSuccess: (data: any) => void;
  onFailure: (error: any) => void;
}) => {
  return async (dispatch: any) => {
    dispatch({
      type: USER_TYPES.FETCH_USER_REQUEST,
    });

    const { name, email, password } = formData;

    try {
      const response = await axios.post("http://localhost:5000/user", {
        name,
        email,
        password,
      });
      dispatch({
        type: USER_TYPES.FETCH_USER_SUCCESS,
        payload: response.data,
      });
      onSuccess(response);
    } catch (error: any) {
      dispatch({
        type: USER_TYPES.FETCH_USER_FAILURE,
        payload: error?.message || error,
      });
      onFailure(error);
    }
  };
};

export const signInAction = ({
  formData,
  onSuccess,
  onFailure,
}: {
  formData: any;
  onSuccess: (data: any) => void;
  onFailure: (error: any) => void;
}) => {
  return async (dispatch: any) => {
    dispatch({
      type: USER_TYPES.FETCH_USER_REQUEST,
    });

    const { email, password } = formData;

    try {
      const response = await axios.post("http://localhost:5000/user/signIn", {
        email,
        password,
      });
      dispatch({
        type: USER_TYPES.FETCH_USER_SUCCESS,
        payload: response.data,
      });
      onSuccess(response);
    } catch (error: any) {
      dispatch({
        type: USER_TYPES.FETCH_USER_FAILURE,
        payload: error?.message || error,
      });
      onFailure(error);
    }
  };
};

export const addressFindByUser = ({
  userID,
  onSuccess,
  onFailure,
}: {
  userID: number;
  onSuccess: (data: any) => void;
  onFailure: (error: any) => void;
}) => {
  return async (dispatch: any) => {
    dispatch({
      type: USER_TYPES.FETCH_USER_REQUEST,
    });

    try {
      const response = await axios.get(
        `http://localhost:5000/addressGetAll?userId=${encodeURIComponent(
          userID
        )}`
      );
      dispatch({
        type: USER_TYPES.FETCH_USER_SUCCESS,
        payload: response.data,
      });
      onSuccess(response);
    } catch (error: any) {
      dispatch({
        type: USER_TYPES.FETCH_USER_FAILURE,
        payload: error?.message || error,
      });
      onFailure(error);
    }
  };
};

export const addressStoreByUser = ({
  formData,
  onSuccess,
  onFailure,
}: {
  formData: any;
  onSuccess: (data: any) => void;
  onFailure: (error: any) => void;
}) => {
  return async (dispatch: any) => {
    dispatch({
      type: USER_TYPES.FETCH_USER_REQUEST,
    });
    try {
      const response = await axios.post(
        "http://localhost:5000/user/addressStore",
        {
          userId: formData.userID,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        }
      );
      dispatch({
        type: USER_TYPES.FETCH_USER_SUCCESS,
        payload: response.data,
      });
      onSuccess(response);
    } catch (error: any) {
      dispatch({
        type: USER_TYPES.FETCH_USER_FAILURE,
        payload: error?.message || error,
      });
      onFailure(error);
    }
  };
};
