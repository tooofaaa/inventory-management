"use client";

import { AuthFormCard } from "@/components/features/auth/AuthFormCard";
import ForgotPasswordForm from "@/components/features/auth/ForgotPasswordForm";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const tf = t.forgotPassword;

  return (
    <AuthFormCard
      header={
        <div className="flex flex-col items-center gap-2 mb-2 text-center">
          <h1 className="font-bold text-2xl sm:text-3xl text-gray-900">
            {tf.title}
          </h1>
          <p className="text-gray-500 text-sm">{tf.subtitle}</p>
        </div>
      }
    >
      <ForgotPasswordForm />
    </AuthFormCard>
  );
}
