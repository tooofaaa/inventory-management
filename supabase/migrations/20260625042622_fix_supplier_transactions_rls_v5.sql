-- Drop the existing policy
DROP POLICY IF EXISTS "Admins manage supplier transactions" ON public.supplier_transactions;

-- The previous policy failed because the admin user was NOT present in the public.users table.
-- Instead, we assume that any authenticated user who is NOT a supplier (i.e. has no portal_user_id match) is the admin.
CREATE POLICY "Admins manage supplier transactions" ON public.supplier_transactions
FOR ALL TO authenticated
USING (
  NOT EXISTS (
    SELECT 1 FROM public.suppliers WHERE portal_user_id = auth.uid()
  )
)
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM public.suppliers WHERE portal_user_id = auth.uid()
  )
);
