// Auth-related TypeScript types
export interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      username: string;
    };
    session: {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      expires_at: number;
      token_type: string;
    };
  };
  error?: {
    message: string;
    code?: string;
  };
}

export interface SignupInput {
  email: string;
  password: string;
  username: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshTokenInput {
  refresh_token: string;
}

export interface DecodedToken {
  sub: string;
  aud: string;
  role: string;
  iat: number;
  exp: number;
  email?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

export interface Session {
  user: {
    id: string;
    email?: string;
    username?: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  };
}
