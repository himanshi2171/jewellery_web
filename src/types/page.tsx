import { store } from "@/redux/store/store";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface WishlistProduct {
  id: number;
  image: string;
  name: string;
  description: string;
  price: string;
}

export interface CartProduct {
  id: number;
  image: string;
  name: string;
  description: string;
  price: string;
  quantity: number;
}
