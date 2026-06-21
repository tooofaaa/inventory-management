"use client";

import { useActionState } from "react";
import { resetPasswordEmail } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";

const initialState = {
  error: "",
  success: "",
};

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    resetPasswordEmail,
    initialState
  );
  const { t, isRTL } = useLanguage();
  const tf = t.forgotPassword;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 w-full sm:w-96"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="forgot-email"
          className="text-sm font-semibold text-gray-700"
        >
          {tf.email}
        </label>
        <input
          id="forgot-email"
          name="email"
          type="email"
          placeholder={tf.emailPlaceholder}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 shadow-sm"
        />
      </div>

      {state?.error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          {state.success}
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full py-3 text-base">
        {isPending ? tf.sending : tf.sendReset}
      </Button>

      <Link
        href="/login"
        className="text-center text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
      >
        ← {tf.backToLogin}
      </Link>
    </form>
  );
}
