"use client";

import AuthSection from "@/components/AuthSection";
export default function SignupPage() {
  type AuthSectionProps = {
    isLoggedIn: boolean;
  };
  return (
    <>
      <AuthSection isLoggedIn />
    </>
  );
}
