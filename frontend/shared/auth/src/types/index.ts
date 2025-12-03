export type AuthUser = {
  id: string;
  email: string;
  is_admin: boolean;
  name?: string;
};

export type SignInDTO = {
  email: string;
  password: string;
};

export type SignUpDTO = {
  email: string;
  password: string;
  name: string;
};

export type AuthError = {
  code: string;
  message: string;
};

export type AuthState = {
  user: AuthUser | null;
  loading: boolean;
};

export type AuthContextValue = {
  state: AuthState;
  setLoading: (loading: boolean) => void;
  setUser: (user: AuthState['user']) => void;
};
