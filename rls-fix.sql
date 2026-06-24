-- ======================================================================================
-- SECURITY: ROW LEVEL SECURITY (RLS) POLICIES
-- ======================================================================================
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
-- Users can only read and manage their own profile
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can delete own profile" ON public.users FOR DELETE USING (auth.uid() = id);

-- 2. CUSTOMERS
CREATE POLICY "Users manage own customers" ON public.customers FOR ALL USING (auth.uid() = user_id);

-- 3. SUPPLIERS
CREATE POLICY "Users manage own suppliers" ON public.suppliers FOR ALL USING (auth.uid() = user_id);

-- 4. PRODUCTS
CREATE POLICY "Users manage own products" ON public.products FOR ALL USING (auth.uid() = user_id);

-- 5. ORDER SEQUENCES
-- Global sequences, allowing any authenticated user to process orders
CREATE POLICY "Authenticated users can access order sequences" ON public.order_sequences FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. INVOICE SEQUENCES
-- Global sequences, allowing any authenticated user to process invoices
CREATE POLICY "Authenticated users can access invoice sequences" ON public.invoice_sequences FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. ORDERS
CREATE POLICY "Users manage own orders" ON public.orders FOR ALL USING (auth.uid() = user_id);

-- 8. ORDER ITEMS
-- Uses EXISTS to check if the related order belongs to the user
CREATE POLICY "Users manage own order items" ON public.order_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
  )
);

-- 9. SALES
CREATE POLICY "Users manage own sales" ON public.sales FOR ALL USING (auth.uid() = user_id);

-- 10. SALES ITEMS
-- Uses EXISTS to check if the related sale belongs to the user
CREATE POLICY "Users manage own sales items" ON public.sales_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.sales s
    WHERE s.id = sales_items.sales_id AND s.user_id = auth.uid()
  )
);
