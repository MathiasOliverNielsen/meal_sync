import { NextRequest } from "next/server";
import { refreshSupabaseToken, getUserBySupabaseId } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refresh_token } = body;

    if (!refresh_token) {
      return errorResponse("Refresh token is required", 400, "MISSING_REFRESH_TOKEN");
    }

    // Get new session from Supabase
    const newSession = await refreshSupabaseToken(refresh_token);

    // Optionally get user profile
    const userProfile = await getUserBySupabaseId(newSession.user?.id || "");

    return successResponse({
      user: userProfile
        ? {
            id: userProfile.id,
            email: userProfile.email,
            username: userProfile.username,
            supabaseId: userProfile.supabaseUserId,
          }
        : null,
      session: {
        access_token: newSession.access_token,
        refresh_token: newSession.refresh_token,
        expires_in: newSession.expires_in,
        token_type: newSession.token_type,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    if (error instanceof Error) {
      return errorResponse(error.message, 401, "REFRESH_FAILED");
    }

    return errorResponse("Failed to refresh token", 500, "REFRESH_ERROR");
  }
}
