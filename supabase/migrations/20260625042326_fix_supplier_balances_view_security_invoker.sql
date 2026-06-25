-- Recreate the view with security_invoker = true to fix the Supabase Linter warning
-- This ensures the view executes with the privileges of the calling user, not the creator.

DROP VIEW IF EXISTS public.supplier_balances;

CREATE VIEW public.supplier_balances WITH (security_invoker = true) AS
SELECT 
    supplier_id,
    COALESCE(SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE 0 END), 0) - 
    COALESCE(SUM(CASE WHEN transaction_type = 'CHARGE' THEN amount ELSE 0 END), 0) as balance
FROM public.supplier_transactions
GROUP BY supplier_id;

-- Ensure the view is accessible
GRANT SELECT ON public.supplier_balances TO authenticated;
GRANT SELECT ON public.supplier_balances TO anon;
