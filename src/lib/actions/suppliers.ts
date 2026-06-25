"use server";

import { createClientServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sanitizePhoneNumber } from "@/lib/utils/formatters";
import { FormState } from "@/lib/types";

export async function getAllSuppliers() {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from("suppliers")
    .select("id, supplier_name, contact_number")
    .order("supplier_name");

  if (error) {
    console.error("Error fetching all suppliers:", error.message);
    return [];
  }

  return data;
}

export async function insertSupplier(
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClientServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, message: "User not authenticated." };
  }

  const supplier_name = formData.get("supplier_name") as string;
  const address = formData.get("address") as string;
  const contact_number_str = formData.get("contact_number") as string;
  const purchase_link = formData.get("purchase_link") as string;

  const sanitized_contact = sanitizePhoneNumber(contact_number_str);

  if (!supplier_name || !sanitized_contact) {
    return {
      success: false,
      message: "Supplier name and contact are required.",
    };
  }

  const contact_number = parseInt(sanitized_contact, 10);
  if (isNaN(contact_number)) {
    return { success: false, message: "Invalid contact number format." };
  }

  const { error } = await supabase.from("suppliers").insert({
    supplier_name: supplier_name,
    address: address,
    contact_number: contact_number,
    purchase_link: purchase_link,
    user_id: user.id,
  });

  if (error) {
    console.error("Failed to insert supplier:", error.message);
    return {
      success: false,
      message: `Failed to insert supplier: ${error.message}`,
    };
  }

  revalidatePath("/suppliers");
  return { success: true, message: "Supplier added successfully!" };
}

export async function updateSupplier(
  previousState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClientServer();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  const id = formData.get("id") as string;
  const supplier_name = formData.get("supplier_name") as string;
  const address = formData.get("address") as string;
  const contact_raw = formData.get("contact_number") as string;
  const purchase_link = formData.get("purchase_link") as string;
  
  // Optional reservation fields
  const reserved_space_m3 = formData.get("reserved_space_m3");
  const next_deduction_date = formData.get("next_deduction_date");
  const reservation_start_date = formData.get("reservation_start_date");
  const reservation_end_date = formData.get("reservation_end_date");

  const contact_sanitized = sanitizePhoneNumber(contact_raw);
  const contact_number = parseInt(contact_sanitized, 10);

  console.log("updateSupplier details:", {
    authUser: authUser ? { id: authUser.id, email: authUser.email } : null,
    id,
    supplier_name,
    address,
    contact_number,
    purchase_link,
    reserved_space_m3,
    next_deduction_date,
    reservation_start_date,
    reservation_end_date,
  });

  if (!id || !supplier_name || isNaN(contact_number)) {
    return { success: false, message: "Invalid data." };
  }
  
  const updatePayload: any = {
    supplier_name,
    address,
    contact_number,
    purchase_link,
  };
  
  // Handle reserved_space_m3: if it's in the form, parse it; if it's empty string, we can set it to null.
  if (reserved_space_m3 !== null) {
    const val = reserved_space_m3 as string;
    updatePayload.reserved_space_m3 = val === "" ? null : parseFloat(val);
  }
  
  // Handle dates: parse if set, set to null if empty string
  if (next_deduction_date !== null) {
    const val = next_deduction_date as string;
    updatePayload.next_deduction_date = val === "" ? null : new Date(val).toISOString();
  }
  if (reservation_start_date !== null) {
    const val = reservation_start_date as string;
    updatePayload.reservation_start_date = val === "" ? null : new Date(val).toISOString();
  }
  if (reservation_end_date !== null) {
    const val = reservation_end_date as string;
    updatePayload.reservation_end_date = val === "" ? null : new Date(val).toISOString();
  }

  console.log("updateSupplier updatePayload:", updatePayload);

  const { data, error, status, statusText } = await supabase
    .from("suppliers")
    .update(updatePayload)
    .eq("id", id)
    .select();

  console.log("updateSupplier Supabase Result:", { data, error, status, statusText });

  if (error) {
    console.error("Update Supplier Error:", error.message);
    return { success: false, message: error.message };
  }

  revalidatePath("/suppliers");
  return { success: true, message: "Supplier updated successfully." };
}

export async function deleteSupplier(id: string): Promise<FormState> {
  const supabase = await createClientServer();

  const { error } = await supabase.from("suppliers").delete().eq("id", id);

  if (error) {
    console.error("Delete Supplier Error:", error.message);
    return { success: false, message: error.message };
  }

  revalidatePath("/suppliers");
  return { success: true, message: "Supplier deleted successfully." };
}

export async function getPaginatedSuppliersByUser(
  page: number,
  pageSize: number,
  searchQuery?: string,
  statusFilter?: "Pending" | "Approved" | "Declined"
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = await createClientServer();

  let query = supabase
    .from("suppliers")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("id");

  if (searchQuery) {
    query = query.ilike("supplier_name", `%${searchQuery}%`);
  }

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return { data, total: count ?? 0 };
}

export async function getPendingSuppliers() {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from("suppliers")
    .select("id, supplier_name, email, contact_number, address, created_at")
    .eq("status", "Pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending suppliers:", error.message);
    return [];
  }
  return data;
}

export async function approveSupplier(
  id: string,
  space: number,
  cost: number,
  period: string
): Promise<FormState> {
  const supabase = await createClientServer();
  
  // Calculate next_deduction_date based on period
  const nextDate = new Date();
  if (period === 'Weekly') {
    nextDate.setDate(nextDate.getDate() + 7);
  } else if (period === 'Yearly') {
    nextDate.setFullYear(nextDate.getFullYear() + 1);
  } else {
    // Default to Monthly
    nextDate.setMonth(nextDate.getMonth() + 1);
  }

  const { error } = await supabase
    .from("suppliers")
    .update({ 
      status: "Approved",
      reserved_space_m3: space,
      reservation_cost: cost,
      reservation_period: period,
      next_deduction_date: nextDate.toISOString()
    })
    .eq("id", id);

  if (error) {
    console.error("Error approving supplier:", error.message);
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/suppliers");
  return { success: true, message: "Supplier approved successfully." };
}

export async function declineSupplier(id: string): Promise<FormState> {
  const supabase = await createClientServer();
  const { error } = await supabase
    .from("suppliers")
    .update({ status: "Declined" })
    .eq("id", id);

  if (error) {
    console.error("Error declining supplier:", error.message);
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/suppliers");
  return { success: true, message: "Supplier registration declined." };
}
