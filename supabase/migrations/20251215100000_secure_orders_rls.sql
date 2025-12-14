-- Secure RLS policies for orders table
-- Drop existing policies
DROP POLICY IF EXISTS "Allow public order creation" ON public.orders;
DROP POLICY IF EXISTS "Allow public order reading" ON public.orders;
DROP POLICY IF EXISTS "Deny public read access" ON public.orders;
DROP POLICY IF EXISTS "Deny public update access" ON public.orders;
DROP POLICY IF EXISTS "Deny public delete access" ON public.orders;

-- Deny all public access to orders table
-- Only service role (used in edge functions) can perform operations
DROP POLICY IF EXISTS "Deny all public access" ON public.orders;
CREATE POLICY "Deny all public access"
ON public.orders
FOR ALL
TO anon, authenticated
USING (false);

-- Allow service role full access
CREATE POLICY "Allow service role access"
ON public.orders
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
