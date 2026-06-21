"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { logout } from "@/lib/actions/auth";
import NavItem from "@/components/ui/NavItem";
import { CloseIcon, LogOutIcon } from "@/components/icons";
import { MAIN_NAV_LINKS, FOOTER_NAV_LINKS } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageToggle from "@/components/ui/LanguageToggle";

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileSidebar({
  isOpen,
  setIsOpen,
}: MobileSidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const navLabels = t.nav;

  const navLabelMap: Record<string, string> = {
    "/dashboard": navLabels.dashboard,
    "/sales": navLabels.sales,
    "/inventory": navLabels.inventory,
    "/orders": navLabels.orders,
    "/customers": navLabels.customers,
    "/suppliers": navLabels.suppliers,
    "/reports": navLabels.reports,
    "/settings": navLabels.settings,
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 flex flex-col overflow-hidden
                  transition-transform duration-300 ease-in-out
                  ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          background: "linear-gradient(180deg, #0f1117 0%, #131720 100%)",
          borderRight: "1px solid rgba(99,102,241,0.12)",
        }}
      >
        <div className="h-full flex flex-col overflow-y-auto p-5">
          <div className="flex flex-col flex-grow">
            {/* Header: Logo + Close */}
            <div className="flex items-center justify-between pb-6">
              <div className="flex items-center gap-3">
                <div
                  className="p-1.5 rounded-xl flex-shrink-0"
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Image src="/logo.png" width={32} height={32} alt="Logo" />
                </div>
                <div>
                  <p className="text-white text-xs font-bold leading-tight">
                    {t.brandName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl transition-colors cursor-pointer"
                style={{ color: "rgba(148,163,184,0.7)" }}
                aria-label="Close menu"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.07)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                }}
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Divider */}
            <div
              className="mb-4"
              style={{ height: "1px", background: "rgba(255,255,255,0.07)" }}
            />

            {/* Main nav */}
            <nav className="flex flex-col gap-1">
              {MAIN_NAV_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <NavItem
                    key={link.href}
                    href={link.href}
                    label={navLabelMap[link.href] ?? link.label}
                    icon={<Icon className="w-5 h-5" />}
                  />
                );
              })}
            </nav>
          </div>

          {/* Footer nav */}
          <div className="flex flex-col gap-1">
            {/* Divider */}
            <div
              className="mb-3"
              style={{ height: "1px", background: "rgba(255,255,255,0.07)" }}
            />

            {FOOTER_NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <NavItem
                  key={link.href}
                  href={link.href}
                  label={navLabelMap[link.href] ?? link.label}
                  icon={<Icon className="w-5 h-5" />}
                />
              );
            })}

            <LanguageToggle />

            <form action={logout}>
              <button
                className="w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{ color: "rgba(239,68,68,0.8)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(239,68,68,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "#ef4444";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(239,68,68,0.8)";
                }}
              >
                <LogOutIcon className="w-5 h-5 flex-shrink-0" />
                <span>{navLabels.logOut}</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
