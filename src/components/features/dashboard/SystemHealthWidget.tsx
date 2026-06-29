"use client";

import { useEffect, useState } from "react";
import { getSystemHealth, HealthMetrics } from "@/lib/actions/health";
import DashboardStat from "@/components/ui/DashboardStat";

export default function SystemHealthWidget() {
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);

  useEffect(() => {
    async function loadHealth() {
      const res = await getSystemHealth();
      setMetrics(res);
    }
    loadHealth();
  }, []);

  if (!metrics) return null;

  return (
    <div className="bg-white shadow-md p-6 rounded-xl w-full">
      <h2 className="text-lg pb-4 font-semibold text-slate-800">System Diagnostics & Partner Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <DashboardStat
          title="Uptime"
          value={`${metrics.uptimePercentage}%`}
          icon="/profit.svg"
          color="text-emerald-600"
        />
        <DashboardStat
          title="Latency"
          value={`${metrics.apiLatencyMs} ms`}
          icon="/revenue.svg"
          color="text-indigo-600"
        />
        <DashboardStat
          title="DB Connections"
          value={metrics.dbConnections}
          icon="/quantity.svg"
          color="text-slate-700"
        />
        <DashboardStat
          title="Active Partners"
          value={metrics.activePartners}
          icon="/cost.svg"
          color="text-amber-600"
        />
        <DashboardStat
          title="Active Clients"
          value={metrics.activeEmployees}
          icon="/quantity.svg"
          color="text-rose-600"
        />
      </div>
    </div>
  );
}
