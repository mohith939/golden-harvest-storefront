-- Drop the existing permissive INSERT policy
DROP POLICY IF EXISTS "Allow public order creation" ON public.orders;

-- Create a restrictive INSERT policy that denies public access
-- Orders can only be created through the edge function (which uses service role)
CREATE POLICY "Deny public insert access" 
ON public.orders 
FOR INSERT 
TO public
WITH CHECK (false);

-- Also add a policy to deny UPDATE for public users
CREATE POLICY "Deny public update access" 
ON public.orders 
FOR UPDATE 
TO public
USING (false);