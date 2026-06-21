"use client";

import { AuthFormCard } from "@/components/features/auth/AuthFormCard";
import { AuthHeader } from "@/components/features/auth/AuthHeader";
import { AuthFooter } from "@/components/features/auth/AuthFooter";
import LoginForm from "@/components/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthFormCard
      header={<AuthHeader titleKey="login" />}
      footer={<AuthFooter type="login" />}
    >
      <LoginForm />
    </AuthFormCard>
  );
}
