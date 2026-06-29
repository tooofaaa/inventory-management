"use server";

import { createClientServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface PricingRule {
  id: number;
  rule_name: string;
  margin_percentage: number;
  seasonal_coefficient: number;
  segment_coefficient: number;
  is_active: boolean;
}

export interface PricingFormula {
  id: number;
  formula_name: string;
  formula_expression: string;
  description: string;
  is_selected: boolean;
}

export async function getPricingRules(): Promise<PricingRule[]> {
  const supabase = await createClientServer();
  const { data } = await supabase.from("pricing_rules").select("*");
  return (data || []) as PricingRule[];
}

export async function getPricingFormulas(): Promise<PricingFormula[]> {
  const supabase = await createClientServer();
  const { data } = await supabase.from("pricing_formulas").select("*");
  return (data || []) as PricingFormula[];
}

export async function updatePricingRule(
  ruleId: number,
  payload: Partial<PricingRule>
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();
  const { error } = await supabase
    .from("pricing_rules")
    .update(payload)
    .eq("id", ruleId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  return { success: true, error: null };
}

export async function updatePricingFormulaExpression(
  formulaId: number,
  expression: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();
  const { error } = await supabase
    .from("pricing_formulas")
    .update({ formula_expression: expression })
    .eq("id", formulaId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  return { success: true, error: null };
}

// Simulates final product sell price based on standard expression:
// finalPrice = (cogs * seasonal) + margin
export async function simulateSellPrice(
  cogs: number,
  ruleName: string
): Promise<number> {
  const supabase = await createClientServer();
  
  const { data: rule } = await supabase
    .from("pricing_rules")
    .select("*")
    .eq("rule_name", ruleName)
    .single();

  if (!rule) return cogs * 1.15; // default 15% markup

  const seasonal = Number(rule.seasonal_coefficient);
  const segment = Number(rule.segment_coefficient);
  const marginAmt = cogs * (Number(rule.margin_percentage) / 100);

  return (cogs * seasonal * segment) + marginAmt;
}
