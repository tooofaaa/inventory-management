-- Add fields to suppliers
ALTER TABLE public.suppliers
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS rating numeric(3,1) DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS delivery_time text DEFAULT '2-3 days',
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS categories text[] DEFAULT '{}';

-- Add fields to products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS unit_of_measure text DEFAULT 'pcs',
ADD COLUMN IF NOT EXISTS min_order_qty integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS description text;
