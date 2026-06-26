import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// We must use the service role key to bypass RLS for a background cron job
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // 1. Fetch all approved suppliers whose next_deduction_date is past or now
    // and who don't already have insufficient funds
    const now = new Date().toISOString();
    const { data: suppliers, error: fetchError } = await supabaseAdmin
      .from('suppliers')
      .select('id, reservation_cost, reservation_period, next_deduction_date')
      .eq('status', 'Approved')
      .eq('has_insufficient_funds', false)
      .lte('next_deduction_date', now);

    if (fetchError) {
      throw fetchError;
    }

    if (!suppliers || suppliers.length === 0) {
      return NextResponse.json({ message: 'No pending deductions' });
    }

    const results = [];

    // 2. Process each supplier
    for (const supplier of suppliers) {
      // Get current balance
      const { data: balanceData } = await supabaseAdmin
        .from('supplier_balances')
        .select('balance')
        .eq('supplier_id', supplier.id)
        .single();
        
      const currentBalance = balanceData?.balance || 0;

      if (currentBalance >= supplier.reservation_cost) {
        // Sufficient funds, create a CHARGE transaction
        const { error: insertError } = await supabaseAdmin
          .from('supplier_transactions')
          .insert({
            supplier_id: supplier.id,
            transaction_type: 'CHARGE',
            amount: supplier.reservation_cost,
            description: `Automated reservation charge for period: ${supplier.reservation_period}`,
          });

        if (!insertError) {
          // Calculate next deduction date
          const nextDate = new Date(supplier.next_deduction_date);
          if (supplier.reservation_period === 'Weekly') {
            nextDate.setDate(nextDate.getDate() + 7);
          } else if (supplier.reservation_period === 'Yearly') {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
          } else {
            nextDate.setMonth(nextDate.getMonth() + 1);
          }

          // Update the next_deduction_date
          await supabaseAdmin
            .from('suppliers')
            .update({ next_deduction_date: nextDate.toISOString() })
            .eq('id', supplier.id);

          results.push({ supplierId: supplier.id, status: 'charged' });
        } else {
          results.push({ supplierId: supplier.id, status: 'error', error: insertError.message });
        }
      } else {
        // Insufficient funds
        // Flag the supplier as having insufficient funds so we don't keep trying
        await supabaseAdmin
          .from('suppliers')
          .update({ has_insufficient_funds: true })
          .eq('id', supplier.id);
          
        results.push({ supplierId: supplier.id, status: 'insufficient_funds' });
      }
    }

    return NextResponse.json({ message: 'Processed deductions', results });
  } catch (error) {
    console.error('Error in cron job:', error);
    const errMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
