import { NextRequest } from "next/server";
import { validateSignupInput, signupWithSupabase, createUserProfile, getUserByEmail, getUserByUsername, AuthError } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, username } = body;

    // Validate input
    const validation = validateSignupInput({ email, password, username });
    if (!validation.valid) {
      return errorResponse("Validation failed", 400, "VALIDATION_ERROR", validation.errors);
    }

    // Check if email already exists in our database
    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return errorResponse("Email is already registered", 409, "EMAIL_EXISTS");
    }

    // Check if username already exists
    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return errorResponse("Username is already taken", 409, "USERNAME_EXISTS");
    }

    // Create user in Supabase Auth
    const { user } = await signupWithSupabase({
      email,
      password,
      username,
    });

    // Create user profile in our database
    const userProfile = await createUserProfile(user!.id, email, username);

    // Return success - user should now login
    return successResponse(
      {
        user: {
          id: userProfile.id,
          email: userProfile.email,
          username: userProfile.username,
          supabaseId: userProfile.supabaseUserId,
        },
        message: "Account created successfully. Please log in.",
      },
      201,
    );
  } catch (error) {
    console.error("Signup error:", error);

    if (error instanceof AuthError) {
      return errorResponse(error.message, 400, error.code);
    }

    if (error instanceof Error) {
      return errorResponse(error.message, 400, "SIGNUP_ERROR");
    }

    return errorResponse("An unexpected error occurred during signup", 500, "UNKNOWN_ERROR");
  }
}
