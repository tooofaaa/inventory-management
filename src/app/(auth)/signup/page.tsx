"use client";

import { AuthFormCard } from "@/components/features/auth/AuthFormCard";
import { AuthHeader } from "@/components/features/auth/AuthHeader";
import { AuthFooter } from "@/components/features/auth/AuthFooter";
import SignUpForm from "@/components/features/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <AuthFormCard
      header={<AuthHeader titleKey="signup" />}
      footer={<AuthFooter type="signup" />}
    >
      <SignUpForm />
    </AuthFormCard>
  );
}
