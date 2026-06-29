"use server";

import { createClientServer } from "@/lib/supabase/server";

export interface HealthMetrics {
  uptimePercentage: number;
  apiLatencyMs: number;
  dbConnections: number;
  activePartners: number;
  activeEmployees: number;
}

export async function getSystemHealth(): Promise<HealthMetrics> {
  const supabase = await createClientServer();
  
  // Fetch latest health metric
  const { data: metrics } = await supabase
    .from("system_health_metrics")
    .select("*")
    .order("recorded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Fetch partners (suppliers count)
  const { count: partnersCount } = await supabase
    .from("suppliers")
    .select("id", { count: "exact", head: true });

  // Fetch clients (customers count)
  const { count: clientsCount } = await supabase
    .from("customers")
    .select("id", { count: "exact", head: true });

  return {
    uptimePercentage: metrics ? Number(metrics.uptime_percentage) : 99.99,
    apiLatencyMs: metrics ? Number(metrics.api_latency_ms) : 40,
    dbConnections: metrics ? Number(metrics.db_connections) : 10,
    activePartners: partnersCount || 0,
    activeEmployees: clientsCount || 0, // Mocking employees with clients counts
  };
}
