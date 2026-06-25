-- Drop the existing policies if they exist
DROP POLICY IF EXISTS "Users manage transactions of their suppliers" ON public.supplier_transactions;
DROP POLICY IF EXISTS "Portal users view their own transactions" ON public.supplier_transactions;

-- Admin/User (business owner) can manage transactions for their own suppliers
-- Note: Explicit WITH CHECK is required for INSERTs
CREATE POLICY "Users manage transactions of their suppliers" ON public.supplier_transactions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.suppliers s
    WHERE s.id = supplier_transactions.supplier_id AND s.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.suppliers s
    WHERE s.id = supplier_transactions.supplier_id AND s.user_id = auth.uid()
  )
);

-- Supplier Portal users can view their own transactions
CREATE POLICY "Portal users view their own transactions" ON public.supplier_transactions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.suppliers s
    -- Note: Ensure `portal_user_id` is the correct column name here, from earlier schema
    WHERE s.id = supplier_transactions.supplier_id AND s.portal_user_id = auth.uid()
  )
);
