-- Fix RLS policies for portfolio_content to allow public read access
-- This ensures portfolio content loads for all visitors (not just authenticated users)

-- Drop ALL existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own portfolio content" ON portfolio_content;
DROP POLICY IF EXISTS "Public can view portfolio content" ON portfolio_content;
DROP POLICY IF EXISTS "Users can update their own portfolio content" ON portfolio_content;
DROP POLICY IF EXISTS "Users can insert their own portfolio content" ON portfolio_content;

-- Policy: Anyone can read portfolio content (public access for portfolio visitors)
-- This allows unauthenticated visitors to see the portfolio
CREATE POLICY "Public can view portfolio content"
  ON portfolio_content FOR SELECT
  USING (true);

-- Policy: Users can only update their own content (keep this for security)
CREATE POLICY "Users can update their own portfolio content"
  ON portfolio_content FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can insert their own content
CREATE POLICY "Users can insert their own portfolio content"
  ON portfolio_content FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Verify the policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'portfolio_content'
ORDER BY policyname;

