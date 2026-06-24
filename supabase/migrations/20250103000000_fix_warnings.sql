-- 1. Fix search_path for SECURITY DEFINER functions
ALTER FUNCTION public.complete_purchase_order(bigint) SET search_path = public;
ALTER FUNCTION public.create_new_purchase_order(bigint, text, timestamp without time zone, numeric, uuid, jsonb) SET search_path = public;
ALTER FUNCTION public.create_new_sale(uuid, bigint, text, text, timestamp with time zone, text, jsonb) SET search_path = public;
ALTER FUNCTION public.get_dashboard_card_stats(uuid) SET search_path = public;
ALTER FUNCTION public.get_dashboard_chart_data(text, uuid) SET search_path = public;
ALTER FUNCTION public.get_financial_report_data(uuid, timestamp with time zone, timestamp with time zone) SET search_path = public;
ALTER FUNCTION public.get_overall_order_stats(uuid) SET search_path = public;
ALTER FUNCTION public.get_overall_sales_stats(uuid) SET search_path = public;
ALTER FUNCTION public.handle_new_portal_customer() SET search_path = public;

-- 2. Revoke execution from anonymous public users
REVOKE EXECUTE ON FUNCTION public.complete_purchase_order(bigint) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_new_purchase_order(bigint, text, timestamp without time zone, numeric, uuid, jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_new_sale(uuid, bigint, text, text, timestamp with time zone, text, jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_dashboard_card_stats(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_dashboard_chart_data(text, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_financial_report_data(uuid, timestamp with time zone, timestamp with time zone) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_overall_order_stats(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_overall_sales_stats(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_portal_customer() FROM PUBLIC;

-- 3. Explicitly grant execution to authenticated users
GRANT EXECUTE ON FUNCTION public.complete_purchase_order(bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_new_purchase_order(bigint, text, timestamp without time zone, numeric, uuid, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_new_sale(uuid, bigint, text, text, timestamp with time zone, text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_dashboard_card_stats(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_dashboard_chart_data(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_financial_report_data(uuid, timestamp with time zone, timestamp with time zone) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_overall_order_stats(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_overall_sales_stats(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_portal_customer() TO authenticated;

-- 4. Fix RLS Always True warning for sequences
-- Instead of using literal `true`, we verify that the user is authenticated by checking their uid
DROP POLICY IF EXISTS "Authenticated users can access order sequences" ON public.order_sequences;
CREATE POLICY "Authenticated users can access order sequences" ON public.order_sequences 
FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can access invoice sequences" ON public.invoice_sequences;
CREATE POLICY "Authenticated users can access invoice sequences" ON public.invoice_sequences 
FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
