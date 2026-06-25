-- Add reservation start and end dates to suppliers table
ALTER TABLE public.suppliers
ADD COLUMN IF NOT EXISTS reservation_start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS reservation_end_date timestamp with time zone;
