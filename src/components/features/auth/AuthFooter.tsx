"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface AuthFooterProps {
  type: "login" | "signup";
}

export function AuthFooter({ type }: AuthFooterProps) {
  const { t } = useLanguage();

  if (type === "login") {
    return (
      <div className="flex gap-2 text-sm mt-2">
        <p className="text-gray-500">{t.login.noAccount}</p>
        <Link
          href="/signup"
          className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          {t.login.signUp}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-2 text-sm mt-2">
      <p className="text-gray-500">{t.signup.alreadyAccount}</p>
      <Link
        href="/login"
        className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        {t.signup.logIn}
      </Link>
    </div>
  );
}