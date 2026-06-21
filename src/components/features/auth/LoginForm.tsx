"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth";
import PasswordInput from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const initialState = { success: "", error: "" };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const { t, isRTL } = useLanguage();
  const tl = t.login;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 w-full sm:w-96"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Email field */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="login-email"
          className="text-sm font-semibold text-gray-700"
        >
          {tl.email}
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          placeholder={tl.emailPlaceholder}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 shadow-sm"
        />
      </div>

      {/* Password field */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">
          {tl.password}
        </label>
        <PasswordInput
          name="password"
          placeholder={tl.passwordPlaceholder}
        />
      </div>

      <div className="flex flex-row justify-between items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            name="remember"
            defaultChecked
            className="accent-indigo-600 w-4 h-4"
          />
          {tl.rememberMe}
        </label>
        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          {tl.forgotPassword}
        </Link>
      </div>

      {state.error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {state.error}
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full py-3 text-base mt-1">
        {isPending ? tl.signingIn : tl.signIn}
      </Button>
    </form>
  );
}
