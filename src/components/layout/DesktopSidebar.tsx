"use client";

import Image from "next/image";
import NavItem from "@/components/ui/NavItem";
import { logout } from "@/lib/actions/auth";
import { LogOutIcon } from "@/components/icons";
import { MAIN_NAV_LINKS, FOOTER_NAV_LINKS } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageToggle from "@/components/ui/LanguageToggle";

export default function DesktopSidebar() {
  const { t } = useLanguage();
  const navLabels = t.nav;

  const navLabelMap: Record<string, string> = {
    "/dashboard": navLabels.dashboard,
    "/sales": navLabels.sales,
    "/inventory": navLabels.inventory,
    "/orders": navLabels.orders,
    "/customers": navLabels.customers,
    "/suppliers": navLabels.suppliers,
    "/settings": navLabels.settings,
  };

  return (
    <aside
      className="py-6 px-4 h-screen w-60 fixed flex flex-col justify-between overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0f1117 0%, #131720 100%)",
        borderRight: "1px solid rgba(99,102,241,0.12)",
      }}
    >
      {/* Top: Logo + Nav */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 pb-4">
          <div
            className="p-1.5 rounded-xl flex-shrink-0"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Image src="/logo.png" width={36} height={36} alt="Logo" />
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-tight">
              {t.brandName}
            </p>
            <p className="text-xs leading-tight" style={{ color: "#6366f1" }}>
              {t.brandTagline}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mx-2 mb-4"
          style={{ height: "1px", background: "rgba(255,255,255,0.07)" }}
        />

        {/* Main nav */}
        <nav className="flex flex-col gap-2">
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

      {/* Bottom: Footer nav + lang + logout */}
      <div className="flex flex-col gap-2">
        {/* Divider */}
        <div
          className="mx-2 mb-4"
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
            className="w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
            style={{ color: "rgba(239,68,68,0.8)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(239,68,68,0.1)";
              (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
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
    </aside>
  );
}
