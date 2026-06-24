-- 1. Create trigger for new user signups to automatically insert into public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists to be safe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Fix Row Level Security Policies for Suppliers and Products
-- Drop the existing policies that restrict visibility
DROP POLICY IF EXISTS "Users manage own suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users manage own products" ON public.products;

-- Create new policies
-- For Suppliers: Anyone authenticated can view, but only owner can update/delete
CREATE POLICY "Authenticated users can view all suppliers" ON public.suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own suppliers" ON public.suppliers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own suppliers" ON public.suppliers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own suppliers" ON public.suppliers FOR DELETE USING (auth.uid() = user_id);

-- For Products: Anyone authenticated can view, but only owner can update/delete
CREATE POLICY "Authenticated users can view all products" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own products" ON public.products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own products" ON public.products FOR DELETE USING (auth.uid() = user_id);
