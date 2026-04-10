import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    // Logout is typically handled on the client side by clearing tokens
    // This endpoint is here for completeness and can be used to:
    // 1. Clear server-side sessions if stored
    // 2. Log the logout event
    // 3. Revoke tokens on the server side

    // For now, we just return success - the client clears the tokens
    return successResponse({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse("An error occurred during logout", 500, "LOGOUT_ERROR");
  }
}
