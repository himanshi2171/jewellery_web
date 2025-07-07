import { combineReducers } from "@reduxjs/toolkit";
import { listReducer } from "./listReducer";
import { wishlistReducer } from "./wishlistReducer";
import cartReducer from "./cartReducer";
import { userReducer } from "./userReducer";

export const rootReducer = combineReducers({
  listReducer: listReducer,
  wishlistReducer: wishlistReducer,
  cart: cartReducer,
  userReducer: userReducer,
});
