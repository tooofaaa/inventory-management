"use server";

import { createClientServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface AdminRole {
  id: number;
  role_name: string;
  permissions: string[];
}

export interface UserRoleAssignment {
  id: number;
  user_id: string;
  email?: string;
  role_name: string;
}

export async function getAdminRoles(): Promise<AdminRole[]> {
  const supabase = await createClientServer();
  const { data } = await supabase.from("admin_roles").select("*");
  return (data || []) as AdminRole[];
}

export async function getUserRoleAssignments(): Promise<UserRoleAssignment[]> {
  const supabase = await createClientServer();
  
  const { data } = await supabase
    .from("admin_user_roles")
    .select("*, admin_roles(role_name), users(email)");

  return (data || []).map((ur: any) => ({
    id: ur.id,
    user_id: ur.user_id,
    email: ur.users?.email || "Unknown User",
    role_name: ur.admin_roles?.role_name || "None Assigned",
  }));
}

export async function assignUserRole(userId: string, roleId: number): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();
  
  const { error } = await supabase
    .from("admin_user_roles")
    .upsert({
      user_id: userId,
      role_id: roleId,
    }, { onConflict: "user_id" });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  return { success: true, error: null };
}

export async function logSessionActivity(actionType: string, details: string): Promise<void> {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("admin_audit_logs").insert({
    user_id: user.id,
    action_type: actionType,
    details: details,
  });
}
