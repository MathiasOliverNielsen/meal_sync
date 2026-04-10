import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getUserBySupabaseId } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Create Supabase client with cookies (for session management)
    const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options as any));
          } catch {
            // Ignore server component errors
          }
        },
      },
    });

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse("Unauthorized", 401, "NOT_AUTHENTICATED");
    }

    // Get user profile from database
    const userProfile = await getUserBySupabaseId(user.id);

    if (!userProfile) {
      return errorResponse("User profile not found", 404, "PROFILE_NOT_FOUND");
    }

    // This is a protected endpoint - only authenticated users can access it
    return successResponse({
      message: "This is a protected endpoint",
      user: {
        id: userProfile.id,
        username: userProfile.username,
        email: userProfile.email,
        createdAt: userProfile.createdAt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Protected endpoint error:", error);
    return errorResponse("Internal server error", 500, "INTERNAL_ERROR");
  }
}
