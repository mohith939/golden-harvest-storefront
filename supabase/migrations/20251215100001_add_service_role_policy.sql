-- Add service role policy for orders table
DROP POLICY IF EXISTS "Allow service role access" ON public.orders;
CREATE POLICY "Allow service role access"
ON public.orders
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
