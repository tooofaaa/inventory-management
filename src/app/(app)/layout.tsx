"use client";

import { useState, Suspense } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { t, isRTL } = useLanguage();

  let mainContentClasses = "md:ml-60 w-full h-screen overflow-y-auto";
  if (isMobileSidebarOpen) {
    mainContentClasses += " overflow-hidden";
  }

  return (
    <div className="flex" dir={isRTL ? "rtl" : "ltr"}>
      <Sidebar
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
      />

      <div className={mainContentClasses}>
        <Topbar onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="pt-4 px-4 md:px-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8 text-gray-400">
                {t.common.loading}
              </div>
            }
          >
            {children}
          </Suspense>
        </main>
        <footer className="mt-8 py-4 px-6 text-center">
          <div
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs"
            style={{
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.1)",
              color: "#94a3b8",
            }}
          >
            Developed by{" "}
            <span className="font-semibold text-indigo-400">Jupi Solutions</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;