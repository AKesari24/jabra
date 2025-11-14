-- Add cart_items column to inquiries table to store cart contents
ALTER TABLE public.inquiries ADD COLUMN cart_items JSONB DEFAULT '[]'::jsonb;

-- Add price_eur column to products table
ALTER TABLE public.products ADD COLUMN price_eur NUMERIC NOT NULL DEFAULT 0;