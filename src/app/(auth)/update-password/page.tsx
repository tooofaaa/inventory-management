"use client";

import { AuthFormCard } from "@/components/features/auth/AuthFormCard";
import UpdatePasswordForm from "@/components/features/auth/UpdatePasswordForm";

export default function UpdatePasswordPage() {
  return (
    <AuthFormCard
      header={
        <div className="flex flex-col items-center gap-2 mb-2 text-center">
          <h1 className="font-bold text-2xl sm:text-3xl text-gray-900">
            Update Password
          </h1>
          <p className="text-gray-500 text-sm">
            Please enter your new password below.
          </p>
        </div>
      }
    >
      <UpdatePasswordForm />
    </AuthFormCard>
  );
}
