-- Allow public branch lookup for the branch-manager login selector
CREATE POLICY "Public can view branches"
ON public.branches
FOR SELECT
TO public
USING (true);