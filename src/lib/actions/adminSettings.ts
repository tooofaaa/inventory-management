"use server";

import { createClientServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface SystemSetting {
  id: number;
  setting_key: string;
  setting_value: string;
  category: string;
  description: string;
}

export interface AuditLog {
  id: number;
  user_email: string;
  action_type: string;
  details: string;
  created_at: string;
}

export async function getSystemSettings(): Promise<SystemSetting[]> {
  const supabase = await createClientServer();
  const { data } = await supabase.from("system_settings").select("*");
  return (data || []) as SystemSetting[];
}

export async function updateSystemSetting(
  key: string,
  value: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("system_settings")
    .update({
      setting_value: value,
      updated_at: new Date().toISOString(),
      updated_by: user?.id,
    })
    .eq("setting_key", key);

  if (error) {
    return { success: false, error: error.message };
  }

  // Log action
  if (user) {
    await supabase.from("admin_audit_logs").insert({
      user_id: user.id,
      action_type: "Update Setting",
      details: `Changed global setting ${key} to ${value}`,
    });
  }

  revalidatePath("/admin");
  return { success: true, error: null };
}

export async function getAdminAuditLogs(): Promise<AuditLog[]> {
  const supabase = await createClientServer();
  
  const { data } = await supabase
    .from("admin_audit_logs")
    .select("*, users(email)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (data || []).map((log: any) => ({
    id: log.id,
    user_email: log.users?.email || "System/Unknown",
    action_type: log.action_type,
    details: log.details || "",
    created_at: log.created_at,
  }));
}
