// Input validation utilities for auth
import { SignupInput, LoginInput } from "./types";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const PASSWORD_MIN_LENGTH = 8;

export function validateSignupInput(input: SignupInput): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate email
  if (!input.email || !EMAIL_REGEX.test(input.email)) {
    errors.push({
      field: "email",
      message: "Please provide a valid email address",
    });
  }

  // Validate username
  if (!input.username || !USERNAME_REGEX.test(input.username)) {
    errors.push({
      field: "username",
      message: "Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens",
    });
  }

  // Validate password
  if (!input.password || input.password.length < PASSWORD_MIN_LENGTH) {
    errors.push({
      field: "password",
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    });
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export function validateLoginInput(input: LoginInput): ValidationResult {
  const errors: ValidationError[] = [];

  if (!input.email || !EMAIL_REGEX.test(input.email)) {
    errors.push({
      field: "email",
      message: "Please provide a valid email address",
    });
  }

  if (!input.password || input.password.length === 0) {
    errors.push({
      field: "password",
      message: "Password is required",
    });
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validateUsername(username: string): boolean {
  return USERNAME_REGEX.test(username);
}

export function validatePassword(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH;
}
