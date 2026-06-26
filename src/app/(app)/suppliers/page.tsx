"use client";

import SupplierTable from "@/components/features/suppliers/SupplierTable";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getPendingSuppliers } from "@/lib/actions/suppliers";
import { createBrowserClient } from "@supabase/ssr";

type Tab = "all" | "pending";

function SuppliersContent() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab");
  const activeTab: Tab = tabParam === "pending" ? "pending" : "all";

  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  // Fetch the pending supplier count for the badge
  useEffect(() => {
    const fetchPendingCount = async () => {
      const data = await getPendingSuppliers();
      setPendingCount(data?.length ?? 0);
    };
    fetchPendingCount();
  }, [refreshKey]);

  // Real-time listener: update pending count when suppliers table changes
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase
      .channel("suppliers-page-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "suppliers" },
        () => {
          triggerRefresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "suppliers" },
        () => {
          triggerRefresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const setTab = (tab: Tab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "all") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    router.replace(`/suppliers?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white shadow-md p-4 rounded-md">
        {/* Header */}
        <div className="flex flex-row justify-between items-center gap-3 mb-4">
          <h1 className="text-lg tracking-wide font-semibold">Suppliers</h1>
        </div>

        {/* Pending Approvals Banner — shown when there are pending suppliers */}
        {pendingCount > 0 && (
          <div
            className="mb-4 rounded-xl p-3 flex items-center gap-3 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(251,191,36,0.04))",
              border: "1px solid rgba(245,158,11,0.25)",
            }}
            onClick={() => setTab("pending")}
          >
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-700">
                {pendingCount} Supplier Registration{pendingCount > 1 ? "s" : ""} Awaiting Approval
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                New suppliers cannot access the platform until you approve or decline their registration.
              </p>
            </div>
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0"
              style={{
                background: "rgba(245,158,11,0.15)",
                color: "#d97706",
                border: "1px solid rgba(245,158,11,0.3)",
              }}
            >
              Review Now →
            </span>
          </div>
        )}

        {/* Tabs */}
        <div
          className="flex gap-1 mb-4 p-1 rounded-xl"
          style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.08)" }}
        >
          <button
            onClick={() => setTab("all")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={
              activeTab === "all"
                ? {
                    background: "white",
                    color: "#6366f1",
                    boxShadow: "0 1px 6px rgba(99,102,241,0.15)",
                  }
                : { color: "#64748b" }
            }
          >
            All Suppliers
          </button>
          <button
            onClick={() => setTab("pending")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={
              activeTab === "pending"
                ? {
                    background: "white",
                    color: "#d97706",
                    boxShadow: "0 1px 6px rgba(245,158,11,0.2)",
                  }
                : { color: "#64748b" }
            }
          >
            Pending Approvals
            {pendingCount > 0 && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                style={{
                  background:
                    activeTab === "pending"
                      ? "rgba(245,158,11,0.15)"
                      : "rgba(239,68,68,0.1)",
                  color: activeTab === "pending" ? "#d97706" : "#ef4444",
                }}
              >
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Pending Tab: explanatory header */}
        {activeTab === "pending" && (
          <div
            className="mb-3 px-3 py-2 rounded-lg text-xs text-amber-700 flex items-start gap-2"
            style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}
          >
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              These suppliers have registered on the Supplier Portal and are waiting for your decision.
              Use <strong>Approve</strong> to grant access or <strong>Decline</strong> to reject the registration.
            </span>
          </div>
        )}

        {/* Table */}
        <div className="pt-2">
          <Suspense fallback={<div className="p-4 text-gray-500">Loading suppliers...</div>}>
            <SupplierTable
              refreshKey={refreshKey}
              onOrderChange={triggerRefresh}
              statusFilter={activeTab === "pending" ? "Pending" : undefined}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default function SuppliersPage() {
  return (
    <Suspense fallback={<div className="p-4 text-gray-500">Loading...</div>}>
      <SuppliersContent />
    </Suspense>
  );
}
