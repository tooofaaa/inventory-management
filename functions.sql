-- 1. Dashboard Card Stats Function
CREATE OR REPLACE FUNCTION public.get_dashboard_card_stats(p_user_id uuid)
RETURNS TABLE(
    total_revenue numeric,
    total_profit numeric,
    total_cost numeric,
    total_qty_sold bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(si.price_at_sale * si.quantity), 0) AS total_revenue,
    COALESCE(SUM((si.price_at_sale - si.cost_at_sale) * si.quantity), 0) AS total_profit,
    COALESCE(SUM(si.cost_at_sale * si.quantity), 0) AS total_cost,
    COALESCE(SUM(si.quantity), 0)::bigint AS total_qty_sold
  FROM public.sales_items si
  JOIN public.sales s ON s.id = si.sales_id
  WHERE s.user_id = p_user_id;
END;
$$;

-- 2. Dashboard Chart Data Function
CREATE OR REPLACE FUNCTION public.get_dashboard_chart_data(p_period text, p_user_id uuid)
RETURNS TABLE(
    name text,
    sales numeric,
    purchase numeric,
    ordered numeric,
    delivered numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH dates AS (
      SELECT generate_series(
          current_date - interval '30 days',
          current_date,
          '1 day'::interval
      )::date AS d
  )
  SELECT 
      to_char(dates.d, 'Mon DD') AS name,
      COALESCE(SUM(s.total_amount), 0) AS sales,
      COALESCE(SUM(o.total_cost), 0) AS purchase,
      COUNT(DISTINCT o.id)::numeric AS ordered,
      COUNT(DISTINCT CASE WHEN o.status = 'Completed' THEN o.id END)::numeric AS delivered
  FROM dates
  LEFT JOIN public.sales s ON date(s.sale_date) = dates.d AND s.user_id = p_user_id
  LEFT JOIN public.orders o ON date(o.created_at) = dates.d AND o.user_id = p_user_id
  GROUP BY dates.d
  ORDER BY dates.d ASC;
END;
$$;
