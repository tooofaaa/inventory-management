"use server";

import { createClientServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface PendingProduct {
  id: number;
  product_name: string;
  product_category: string;
  product_type: string;
  sell_price: number;
  buy_price: number;
  amount_stock: number;
  approval_status: string;
  supplier_id: number;
  supplier_name?: string;
  created_at: string;
}

/** Get all products pending admin approval from any supplier */
export async function getPendingProducts(): Promise<{ data: PendingProduct[]; error: string | null }> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from("products")
    .select("id, product_name, product_category, product_type, sell_price, buy_price, amount_stock, approval_status, supplier_id, created_at, suppliers(supplier_name)")
    .eq("approval_status", "Pending")
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };

  const mapped = (data || []).map((p: any) => ({
    id: p.id,
    product_name: p.product_name,
    product_category: p.product_category,
    product_type: p.product_type,
    sell_price: p.sell_price,
    buy_price: p.buy_price,
    amount_stock: p.amount_stock,
    approval_status: p.approval_status,
    supplier_id: p.supplier_id,
    supplier_name: p.suppliers?.supplier_name || "Unknown Supplier",
    created_at: p.created_at,
  }));

  return { data: mapped, error: null };
}

/** Admin approves a supplier-submitted product — makes it live on the customer catalog */
export async function approveProduct(productId: number): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("products")
    .update({
      approval_status: "Approved",
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);

  if (error) return { success: false, error: error.message };

  // Audit log
  await supabase.from("admin_audit_logs").insert({
    user_id: user?.id,
    action_type: "Product Approved",
    details: `Admin approved product ID: ${productId} — now visible on Customer Platform.`,
  });

  revalidatePath("/admin");
  revalidatePath("/inventory");
  return { success: true, error: null };
}

/** Admin rejects a supplier-submitted product */
export async function rejectProduct(productId: number, reason?: string): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("products")
    .update({
      approval_status: "Rejected",
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);

  if (error) return { success: false, error: error.message };

  await supabase.from("admin_audit_logs").insert({
    user_id: user?.id,
    action_type: "Product Rejected",
    details: `Admin rejected product ID: ${productId}. Reason: ${reason || "No reason provided."}`,
  });

  revalidatePath("/admin");
  return { success: true, error: null };
}

/** Get full platform stats for the admin dashboard */
export async function getEnterpriseStats(): Promise<{
  totalProducts: number;
  pendingApprovals: number;
  totalCustomers: number;
  totalSuppliers: number;
  totalOrders: number;
  totalRevenue: number;
}> {
  const supabase = await createClientServer();

  const [products, pending, customers, suppliers, orders] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("approval_status", "Pending"),
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("suppliers").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("total_cost"),
  ]);

  const totalRevenue = (orders.data || []).reduce((s, o) => s + (Number(o.total_cost) || 0), 0);

  return {
    totalProducts: products.count || 0,
    pendingApprovals: pending.count || 0,
    totalCustomers: customers.count || 0,
    totalSuppliers: suppliers.count || 0,
    totalOrders: orders.data?.length || 0,
    totalRevenue,
  };
}
