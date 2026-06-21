"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t, isRTL, language, toggleLanguage } = useLanguage();

  return (
    <div className="flex flex-row min-h-screen">
      {/* Left branding panel - visible on desktop only */}
      <div
        className="hidden sm:flex flex-col items-center justify-center w-1/2 gap-8 p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0d1a 100%)",
        }}
      >
        {/* Decorative grid lines */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Glowing orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #818cf8, transparent)" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div
            className="p-4 rounded-2xl"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <Image
              src="/logo.png"
              width={120}
              height={120}
              alt="Product & Service Logo"
              quality={100}
              priority
              className="drop-shadow-2xl"
            />
          </div>

          <div className="text-center">
            <h1 className="text-white text-4xl font-bold tracking-wide">
              {t.brandName}
            </h1>
            <p
              className="text-sm mt-3 font-medium tracking-widest uppercase"
              style={{ color: "rgba(129,140,248,0.8)" }}
            >
              {t.brandTagline}
            </p>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 mt-4">
            {[
              { value: "99.9%", label: "Uptime" },
              { value: "10k+", label: "Products" },
              { value: "24/7", label: "Support" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="text-xl font-bold"
                  style={{ color: "#818cf8" }}
                >
                  {stat.value}
                </p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Language toggle at bottom */}
        <button
          onClick={toggleLanguage}
          className="absolute bottom-8 right-8 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-105"
          style={{
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#a5b4fc",
          }}
        >
          {language === "en" ? "🇸🇦 عربي" : "🇬🇧 English"}
        </button>
      </div>

      {/* Right form panel */}
      <div
        className="flex flex-col items-center justify-center w-full sm:w-1/2 relative"
        style={{ background: "#fafafa" }}
      >
        {/* Mobile language toggle */}
        <button
          onClick={toggleLanguage}
          className="absolute top-6 right-6 sm:hidden flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300"
          style={{
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
            color: "#6366f1",
          }}
        >
          {language === "en" ? "عربي" : "English"}
        </button>

        {/* Mobile logo */}
        <div
          className="flex sm:hidden flex-col items-center gap-2 mb-6 mt-16"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <Image
            src="/logo.png"
            alt="Product & Service Logo"
            width={70}
            height={70}
            quality={100}
            priority
          />
          <p className="text-sm font-bold text-gray-700">{t.brandName}</p>
        </div>

        {children}
      </div>
    </div>
  );
}
