// Auth service - handles Supabase Auth operations
import { createClient } from "@supabase/supabase-js";
import type { AuthError } from "@supabase/supabase-js";
import { SignupInput, LoginInput } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing required Supabase environment variables");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function signupWithSupabase(input: SignupInput) {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      user_metadata: {
        username: input.username,
      },
    });

    if (error) {
      throw new AuthError(error.message, error.name);
    }

    // Generate session for the new user so they're logged in immediately after signup
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.getUserById(data.user!.id);

    if (sessionError) {
      throw new AuthError(sessionError.message, sessionError.name);
    }

    return {
      user: data.user,
      session: sessionData,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError("Failed to sign up", "SIGNUP_ERROR");
  }
}

export async function loginWithSupabase(input: LoginInput) {
  try {
    // Use the regular Supabase client for user login
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      throw new AuthError(error.message, error.name);
    }

    if (!data.session) {
      throw new AuthError("No session created", "NO_SESSION");
    }

    return {
      user: data.user,
      session: data.session,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError("Failed to login", "LOGIN_ERROR");
  }
}

export async function verifySupabaseToken(token: string) {
  try {
    // Verify the JWT token with Supabase
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      throw new AuthError("Invalid token", "INVALID_TOKEN");
    }

    return data.user;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError("Token verification failed", "TOKEN_VERIFY_ERROR");
  }
}

export async function refreshSupabaseToken(refresh_token: string) {
  try {
    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token,
    });

    if (error) {
      throw new AuthError(error.message, error.name);
    }

    if (!data.session) {
      throw new AuthError("No session created", "NO_SESSION");
    }

    return data.session;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError("Failed to refresh token", "REFRESH_ERROR");
  }
}

export async function logoutFromSupabase(session_id: string) {
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteSession(session_id);

    if (error) {
      throw new AuthError(error.message, error.name);
    }

    return true;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError("Failed to logout", "LOGOUT_ERROR");
  }
}
