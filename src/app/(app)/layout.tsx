"use client";

import { useState, Suspense } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  let mainContentClasses = "md:ml-60 w-full h-screen overflow-y-auto";

  if (isMobileSidebarOpen) {
    mainContentClasses += " overflow-hidden";
  }

  return (
    <div className="flex">
      <Sidebar
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
      />

      <div className={mainContentClasses}>
        <Topbar onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="pt-3 mx-3 md:mx-0">
          <Suspense fallback={<div className="flex items-center justify-center p-8 text-gray-500">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;