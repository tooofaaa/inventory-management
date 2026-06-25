-- Drop the existing policies if they exist
DROP POLICY IF EXISTS "Users manage transactions of their suppliers" ON public.supplier_transactions;
DROP POLICY IF EXISTS "Portal users view their own transactions" ON public.supplier_transactions;

-- Recreate policy using IN clause to avoid table prefix ambiguity in WITH CHECK
CREATE POLICY "Users manage transactions of their suppliers" ON public.supplier_transactions
FOR ALL USING (
  supplier_id IN (
    SELECT id FROM public.suppliers WHERE user_id = auth.uid()
  )
) WITH CHECK (
  supplier_id IN (
    SELECT id FROM public.suppliers WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Portal users view their own transactions" ON public.supplier_transactions
FOR SELECT USING (
  supplier_id IN (
    SELECT id FROM public.suppliers WHERE portal_user_id = auth.uid()
  )
);
