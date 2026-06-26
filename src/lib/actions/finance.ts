"use server";

import { createClientServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { FormState, SupplierTransaction } from "@/lib/types";

export async function getSupplierBalances() {
  const supabase = await createClientServer();
  
  // Get all approved suppliers and join with their balance
  // Since we created a view `supplier_balances`, we can query it
  // Wait, Supabase client might not know the type.
  
  const { data: suppliers, error: suppliersError } = await supabase
    .from("suppliers")
    .select("id, supplier_name, reserved_space_m3, reservation_cost, reservation_period, next_deduction_date, has_insufficient_funds, reservation_start_date, reservation_end_date")
    .eq("status", "Approved")
    .order("supplier_name");

  if (suppliersError) {
    console.error("Error fetching suppliers for finance:", suppliersError.message);
    return [];
  }

  const { data: balances, error: balancesError } = await supabase
    .from("supplier_balances")
    .select("*");

  if (balancesError) {
    console.error("Error fetching supplier balances:", balancesError.message);
    return suppliers.map(s => ({ ...s, balance: 0 }));
  }

  const balanceMap = new Map(balances.map(b => [b.supplier_id, b.balance]));

  return suppliers.map(s => ({
    ...s,
    balance: balanceMap.get(s.id) || 0,
  }));
}

export async function getSupplierTransactions(supplierId: string | number) {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("supplier_transactions")
    .select("*")
    .eq("supplier_id", supplierId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error.message);
    return [];
  }

  return data as SupplierTransaction[];
}

export async function addSupplierCredit(
  supplierId: number | string,
  amount: number,
  description: string
): Promise<FormState> {
  const supabase = await createClientServer();

  const { data: { session } } = await supabase.auth.getSession();
  console.log("Session in addSupplierCredit:", session?.user?.id);
  
  // Debug: Let's fetch the supplier to see what user_id it actually has
  const { data: debugSupplier } = await supabase
    .from("suppliers")
    .select("id, user_id, portal_user_id")
    .eq("id", supplierId)
    .single();
  console.log("Supplier in DB:", debugSupplier);

  console.log("Attempting to insert for supplier:", supplierId, "amount:", amount);

  if (amount <= 0) {
    return { success: false, message: "Credit amount must be positive." };
  }

  const { error } = await supabase
    .from("supplier_transactions")
    .insert({
      supplier_id: supplierId,
      transaction_type: "CREDIT",
      amount,
      description,
    });

  if (error) {
    console.error("Error adding credit:", error.message, error.details, error.hint);
    return { success: false, message: error.message };
  }

  // Check if we can reset the has_insufficient_funds flag
  // Recalculate balance
  const { data: currentBalanceData } = await supabase
    .from("supplier_balances")
    .select("balance")
    .eq("supplier_id", supplierId)
    .single();

  const currentBalance = currentBalanceData?.balance || 0;
  
  // Get supplier details to check cost
  const { data: supplier } = await supabase
    .from("suppliers")
    .select("reservation_cost, has_insufficient_funds")
    .eq("id", supplierId)
    .single();

  if (supplier?.has_insufficient_funds && currentBalance >= supplier.reservation_cost) {
    await supabase
      .from("suppliers")
      .update({ has_insufficient_funds: false })
      .eq("id", supplierId);
  }

  revalidatePath("/finance");
  return { success: true, message: "Credit added successfully." };
}

export async function runDeductions() {
  const { createClient } = await import('@supabase/supabase-js');
  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  try {
    const now = new Date().toISOString();
    const { data: suppliers, error: fetchError } = await supabaseAdmin.from('suppliers').select('id, reservation_cost, reservation_period, next_deduction_date').eq('status', 'Approved').eq('has_insufficient_funds', false).or(`next_deduction_date.lte.${now},next_deduction_date.is.null`);
    if (fetchError) return { success: false, message: fetchError.message };
    if (!suppliers || suppliers.length === 0) return { success: true, message: 'No pending deductions', results: [] };
    const results = [];
    for (const supplier of suppliers) {
      const { data: balanceData } = await supabaseAdmin.from('supplier_balances').select('balance').eq('supplier_id', supplier.id).single();
      const currentBalance = balanceData?.balance || 0;
      if (currentBalance >= supplier.reservation_cost) {
        const { error: insertError } = await supabaseAdmin.from('supplier_transactions').insert({ supplier_id: supplier.id, transaction_type: 'CHARGE', amount: supplier.reservation_cost, description: `Automated reservation charge for period: ${supplier.reservation_period}` });
        if (!insertError) {
          const nextDate = new Date(supplier.next_deduction_date || new Date());
          if (supplier.reservation_period === 'Weekly') nextDate.setDate(nextDate.getDate() + 7);
          else if (supplier.reservation_period === 'Yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);
          else nextDate.setMonth(nextDate.getMonth() + 1);
          await supabaseAdmin.from('suppliers').update({ next_deduction_date: nextDate.toISOString() }).eq('id', supplier.id);
          results.push({ supplierId: supplier.id, status: 'charged' });
        } else { results.push({ supplierId: supplier.id, status: 'error', error: insertError.message }); }
      } else {
        await supabaseAdmin.from('suppliers').update({ has_insufficient_funds: true }).eq('id', supplier.id);
        results.push({ supplierId: supplier.id, status: 'insufficient_funds' });
      }
    }
    return { success: true, message: 'Processed deductions', results };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : String(error) };
  }
}
