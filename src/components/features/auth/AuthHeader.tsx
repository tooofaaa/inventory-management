"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

interface AuthHeaderProps {
  titleKey: "login" | "signup";
}

export function AuthHeader({ titleKey }: AuthHeaderProps) {
  const { t } = useLanguage();
  const section = t[titleKey];
  const title = "title" in section ? section.title : "";
  const subtitle = "subtitle" in section ? section.subtitle : "";

  return (
    <div className="flex flex-col items-center gap-2 mb-2 text-center">
      <h1 className="font-bold text-2xl sm:text-3xl text-gray-900">{title}</h1>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
}
