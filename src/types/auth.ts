export type AuthSessionResponse = {
  user: AuthUser;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  is_verified: boolean;
  created_at: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: AuthUser;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignupCredentials = {
  email: string;
  password: string;
  name: string;
};
