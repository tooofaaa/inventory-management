-- Drop the existing policies if they exist
DROP POLICY IF EXISTS "Users manage transactions of their suppliers" ON public.supplier_transactions;
DROP POLICY IF EXISTS "Portal users view their own transactions" ON public.supplier_transactions;

-- 1. Admins can manage everything in supplier_transactions
-- We verify admin status by checking if auth.uid() exists in the public.users table.
CREATE POLICY "Admins manage supplier transactions" ON public.supplier_transactions
FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid())
);

-- 2. Supplier Portal users can view their own transactions
CREATE POLICY "Portal users view their own transactions" ON public.supplier_transactions
FOR SELECT TO authenticated
USING (
  supplier_id IN (
    SELECT id FROM public.suppliers WHERE portal_user_id = auth.uid()
  )
);
