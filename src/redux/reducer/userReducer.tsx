import { TYPES, ListAction, ListItem, UserItem, USER_TYPES } from "../action/ActionType";

interface UserState {
  list: UserItem[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  list: [],
  loading: false,
  error: null,
};

export const userReducer = (
  state: UserState = initialState,
  action: ListAction
): UserState => {
  switch (action.type) {
    case USER_TYPES.FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case USER_TYPES.FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload,
        error: null,
      };
    case USER_TYPES.FETCH_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
