"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProfileIcon } from "@/components/icons";
import { User } from "@/lib/types";
import { logout } from "@/lib/actions/auth";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function UserDropdown({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden cursor-pointer transition-all duration-200 flex items-center justify-center"
        style={{
          border: "2px solid rgba(99,102,241,0.25)",
          background: "rgba(99,102,241,0.08)",
          boxShadow: isOpen ? "0 0 0 3px rgba(99,102,241,0.15)" : "none",
        }}
      >
        {user.profile_picture ? (
          <Image
            src={user.profile_picture}
            alt={user.name}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="font-bold text-indigo-600 text-sm">
            {user.name?.charAt(0).toUpperCase() || <ProfileIcon />}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-3 w-72 rounded-2xl overflow-hidden z-50"
          style={{
            background: "rgba(255,255,255,0.98)",
            border: "1px solid rgba(99,102,241,0.12)",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(99,102,241,0.08)",
            backdropFilter: "blur(20px)",
            animation: "dropdownIn 0.15s ease-out",
          }}
        >
          {/* User info header */}
          <div
            className="p-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(129,140,248,0.03))",
              borderBottom: "1px solid rgba(99,102,241,0.08)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative"
                style={{ border: "2px solid rgba(99,102,241,0.2)" }}
              >
                {user.profile_picture ? (
                  <Image
                    src={user.profile_picture}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-indigo-600 font-bold text-xl"
                    style={{ background: "rgba(99,102,241,0.1)" }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate" title={user.email}>
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-2 flex flex-col gap-1">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm text-gray-700 rounded-xl transition-colors duration-150"
              style={{ border: "1px solid transparent" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(99,102,241,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent";
              }}
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t.topbar.accountSettings}
            </Link>
            <button
              onClick={() => logout()}
              className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors duration-150 cursor-pointer"
              style={{ color: "#ef4444" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(239,68,68,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {t.topbar.logOut}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
