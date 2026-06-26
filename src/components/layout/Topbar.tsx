"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { HamburgerIcon } from "@/components/icons";
import GlobalSearch from "@/components/ui/GlobalSearch";
import UserDropdown from "@/components/features/topbar/UserDropdown";
import NotificationDropdown from "@/components/features/topbar/NotificationDropdown";
import { User, StockAlert, Supplier } from "@/lib/types";
import { getProfile } from "@/lib/actions/profile";
import { getLowStockNotifications } from "@/lib/actions/notifications";
import { getPendingSuppliers } from "@/lib/actions/suppliers";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [pendingSuppliers, setPendingSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshPendingSuppliers = useCallback(async () => {
    try {
      const data = await getPendingSuppliers();
      setPendingSuppliers((data as unknown as Supplier[]) || []);
    } catch (error) {
      console.error("Failed to refresh pending suppliers:", error);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userData, notificationData, pendingSupplierData] = await Promise.all([
          getProfile(),
          getLowStockNotifications(),
          getPendingSuppliers(),
        ]);

        setUser(userData);
        setAlerts(notificationData);
        setPendingSuppliers((pendingSupplierData as unknown as Supplier[]) || []);
      } catch (error) {
        console.error("Failed to fetch topbar data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Real-time listener: when a supplier registers or status changes, refresh the pending count
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase
      .channel("topbar-suppliers-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "suppliers" },
        () => {
          refreshPendingSuppliers();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "suppliers" },
        () => {
          refreshPendingSuppliers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshPendingSuppliers]);

  return (
    <div
      className="flex flex-row justify-between items-center gap-3 px-4 py-3 md:pr-6 relative z-20"
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(99,102,241,0.1)",
        boxShadow: "0 1px 20px rgba(0,0,0,0.06)",
      }}
    >
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 -ml-1 rounded-xl transition-all duration-200 cursor-pointer"
        aria-label="Open menu"
        style={{ color: "#64748b" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(99,102,241,0.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "transparent";
        }}
      >
        <HamburgerIcon className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="relative flex-1 md:w-1/2 max-w-lg">
        <Suspense
          fallback={
            <div
              className="w-full h-10 rounded-xl animate-pulse"
              style={{ background: "rgba(99,102,241,0.06)" }}
            />
          }
        >
          <GlobalSearch />
        </Suspense>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-2 md:gap-3">
        {loading ? (
          <div
            className="w-9 h-9 rounded-full animate-pulse"
            style={{ background: "rgba(0,0,0,0.06)" }}
          />
        ) : (
          <NotificationDropdown alerts={alerts} pendingSuppliers={pendingSuppliers} />
        )}

        {loading ? (
          <div
            className="w-10 h-10 rounded-full animate-pulse"
            style={{ background: "rgba(0,0,0,0.06)" }}
          />
        ) : user ? (
          <UserDropdown user={user} />
        ) : (
          <div
            className="w-10 h-10 rounded-full"
            style={{ background: "rgba(0,0,0,0.06)" }}
          />
        )}
      </div>
    </div>
  );
}
