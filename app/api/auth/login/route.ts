import { NextRequest, NextResponse } from "next/server";
import { validateLoginInput, loginWithSupabase, getUserByEmail } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    const validation = validateLoginInput({ email, password });
    if (!validation.valid) {
      return errorResponse("Validation failed", 400, "VALIDATION_ERROR", validation.errors);
    }

    // Attempt login with Supabase
    const { user, session } = await loginWithSupabase({
      email,
      password,
    });

    // Get user profile from our database
    const userProfile = await getUserByEmail(email);
    if (!userProfile) {
      return errorResponse("User profile not found", 404, "PROFILE_NOT_FOUND");
    }

    // Return success with session tokens
    return successResponse({
      user: {
        id: userProfile.id,
        email: userProfile.email,
        username: userProfile.username,
        supabaseId: userProfile.supabaseUserId,
      },
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        token_type: session.token_type,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      // Handle specific Supabase auth errors
      if (message.includes("invalid login credentials") || message.includes("email not confirmed")) {
        return errorResponse("Invalid email or password", 401, "INVALID_CREDENTIALS");
      }

      return errorResponse(error.message, 500, "LOGIN_ERROR");
    }

    return errorResponse("An unexpected error occurred during login", 500, "UNKNOWN_ERROR");
  }
}
