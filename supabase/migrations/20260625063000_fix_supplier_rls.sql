-- 1. Drop old update and delete policies for suppliers
DROP POLICY IF EXISTS "Users can update own suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users can delete own suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users and admins can update suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users and admins can delete suppliers" ON public.suppliers;

-- 2. Create simplified, robust update and delete policies
DROP POLICY IF EXISTS "Allow authenticated users to update suppliers" ON public.suppliers;
CREATE POLICY "Allow authenticated users to update suppliers" ON public.suppliers
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to delete suppliers" ON public.suppliers;
CREATE POLICY "Allow authenticated users to delete suppliers" ON public.suppliers
FOR DELETE TO authenticated
USING (true);

-- 3. Sync any users from auth.users to public.users (resolves profile fetching issues)
INSERT INTO public.users (id, email, name, created_at, updated_at)
SELECT id, email, COALESCE(raw_user_meta_data->>'name', 'Admin'), created_at, last_sign_in_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 4. Link all suppliers with NULL user_id to the first user
UPDATE public.suppliers
SET user_id = (SELECT id FROM public.users LIMIT 1)
WHERE user_id IS NULL;
