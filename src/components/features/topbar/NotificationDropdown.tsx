"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { NotificationIcon } from "@/components/icons";
import { StockAlert } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function NotificationDropdown({
  alerts,
}: {
  alerts: StockAlert[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifCount = alerts.length;
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
        className="relative cursor-pointer p-2 rounded-xl transition-all duration-200 focus:outline-none"
        style={{ color: "#64748b" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(99,102,241,0.08)";
          (e.currentTarget as HTMLButtonElement).style.color = "#6366f1";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
        }}
      >
        <NotificationIcon />
        {notifCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
            style={{
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              border: "2px solid white",
              boxShadow: "0 2px 8px rgba(239,68,68,0.4)",
            }}
          >
            {notifCount > 9 ? "9+" : notifCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-3 w-80 rounded-2xl overflow-hidden z-50"
          style={{
            background: "rgba(255,255,255,0.98)",
            border: "1px solid rgba(99,102,241,0.12)",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(99,102,241,0.08)",
            backdropFilter: "blur(20px)",
            animation: "dropdownIn 0.15s ease-out",
          }}
        >
          {/* Header */}
          <div
            className="p-4 flex justify-between items-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(129,140,248,0.03))",
              borderBottom: "1px solid rgba(99,102,241,0.08)",
            }}
          >
            <h3 className="font-bold text-gray-900 text-sm">
              {t.topbar.notifications}
            </h3>
            {notifCount > 0 && (
              <span
                className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  color: "#ef4444",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                {notifCount} {t.topbar.lowStock}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="p-8 text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: "rgba(99,102,241,0.08)" }}
                >
                  <svg
                    className="w-6 h-6"
                    style={{ color: "#6366f1" }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {t.topbar.noNotifications}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {t.topbar.stockHealthy}
                </p>
              </div>
            ) : (
              <ul>
                {alerts.map((item) => (
                  <li
                    key={item.id}
                    style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
                  >
                    <Link
                      href={`/product/${item.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-start gap-3 p-3 transition-colors duration-150"
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.background =
                          "rgba(99,102,241,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.background =
                          "transparent";
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden relative"
                        style={{
                          background: "rgba(0,0,0,0.04)",
                          border: "1px solid rgba(0,0,0,0.06)",
                        }}
                      >
                        {item.product_image ? (
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            IMG
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                          {item.product_name}
                        </p>
                        <p
                          className="text-xs font-medium mt-0.5"
                          style={{ color: "#ef4444" }}
                        >
                          Only {item.amount_stock} left in stock
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {notifCount > 0 && (
            <div
              className="p-3"
              style={{ borderTop: "1px solid rgba(99,102,241,0.08)" }}
            >
              <Link
                href="/inventory"
                onClick={() => setIsOpen(false)}
                className="block text-center text-xs font-semibold py-2 px-4 rounded-xl transition-all duration-200"
                style={{
                  color: "#6366f1",
                  background: "rgba(99,102,241,0.06)",
                  border: "1px solid rgba(99,102,241,0.12)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(99,102,241,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(99,102,241,0.06)";
                }}
              >
                {t.topbar.viewAllInventory}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
