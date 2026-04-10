import { NextRequest } from "next/server";
import { verifySupabaseToken, getUserBySupabaseId } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse("Missing or invalid authorization header", 401, "MISSING_AUTH_HEADER");
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    // Verify token with Supabase
    const user = await verifySupabaseToken(token);

    // Get user profile from our database
    const userProfile = await getUserBySupabaseId(user.id);

    if (!userProfile) {
      return errorResponse("User profile not found", 404, "PROFILE_NOT_FOUND");
    }

    return successResponse({
      user: {
        id: userProfile.id,
        email: userProfile.email,
        username: userProfile.username,
        supabaseId: userProfile.supabaseUserId,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    if (error instanceof Error) {
      if (error.message.toLowerCase().includes("invalid token")) {
        return errorResponse("Token is invalid or expired", 401, "INVALID_TOKEN");
      }

      return errorResponse(error.message, 401, "AUTH_ERROR");
    }

    return errorResponse("Failed to get current user", 500, "GET_USER_ERROR");
  }
}
