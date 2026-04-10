// Consistent API response handling
import { NextResponse } from "next/server";

export interface ApiResponseData<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, any>;
  };
}

export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    } as ApiResponseData<T>,
    { status },
  );
}

export function errorResponse(message: string, status: number = 400, code?: string, details?: Record<string, any>) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details,
      },
    } as ApiResponseData<never>,
    { status },
  );
}
