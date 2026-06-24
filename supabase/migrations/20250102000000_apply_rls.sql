-- Enable RLS for all tables to prevent public access
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_items ENABLE ROW LEVEL SECURITY;

-- 1. USERS
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete own profile" ON public.users;
CREATE POLICY "Users can delete own profile" ON public.users FOR DELETE USING (auth.uid() = id);

-- 2. CUSTOMERS
DROP POLICY IF EXISTS "Users manage own customers" ON public.customers;
CREATE POLICY "Users manage own customers" ON public.customers FOR ALL USING (auth.uid() = user_id);

-- 3. SUPPLIERS
DROP POLICY IF EXISTS "Users manage own suppliers" ON public.suppliers;
CREATE POLICY "Users manage own suppliers" ON public.suppliers FOR ALL USING (auth.uid() = user_id);

-- 4. PRODUCTS
DROP POLICY IF EXISTS "Users manage own products" ON public.products;
CREATE POLICY "Users manage own products" ON public.products FOR ALL USING (auth.uid() = user_id);

-- 5. ORDER SEQUENCES
DROP POLICY IF EXISTS "Authenticated users can access order sequences" ON public.order_sequences;
CREATE POLICY "Authenticated users can access order sequences" ON public.order_sequences FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. INVOICE SEQUENCES
DROP POLICY IF EXISTS "Authenticated users can access invoice sequences" ON public.invoice_sequences;
CREATE POLICY "Authenticated users can access invoice sequences" ON public.invoice_sequences FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. ORDERS
DROP POLICY IF EXISTS "Users manage own orders" ON public.orders;
CREATE POLICY "Users manage own orders" ON public.orders FOR ALL USING (auth.uid() = user_id);

-- 8. ORDER ITEMS
DROP POLICY IF EXISTS "Users manage own order items" ON public.order_items;
CREATE POLICY "Users manage own order items" ON public.order_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
  )
);

-- 9. SALES
DROP POLICY IF EXISTS "Users manage own sales" ON public.sales;
CREATE POLICY "Users manage own sales" ON public.sales FOR ALL USING (auth.uid() = user_id);

-- 10. SALES ITEMS
DROP POLICY IF EXISTS "Users manage own sales items" ON public.sales_items;
CREATE POLICY "Users manage own sales items" ON public.sales_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.sales s
    WHERE s.id = sales_items.sales_id AND s.user_id = auth.uid()
  )
);
