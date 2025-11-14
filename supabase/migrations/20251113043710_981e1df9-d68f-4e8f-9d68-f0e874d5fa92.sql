-- Add SKU and sold out status to products
ALTER TABLE public.products 
ADD COLUMN sku text,
ADD COLUMN is_sold_out boolean DEFAULT false;