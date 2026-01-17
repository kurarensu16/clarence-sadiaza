# Vercel Environment Variables Setup

## Required Environment Variables

You need to add the following environment variables to your Vercel project:

### 1. `VITE_SUPABASE_URL`
- **Description**: Your Supabase project URL
- **Where to find it**: 
  - Go to Supabase Dashboard → Settings → API
  - Copy the "Project URL" (looks like: `https://xxxxx.supabase.co`)

### 2. `VITE_SUPABASE_ANON_KEY`
- **Description**: Your Supabase anonymous/public key
- **Where to find it**:
  - Go to Supabase Dashboard → Settings → API
  - Copy the "anon public" key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## How to Add Variables in Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Log in to your account

2. **Select Your Project**
   - Click on your `clarence-portfolio` project

3. **Go to Settings**
   - Click on **Settings** in the top navigation

4. **Navigate to Environment Variables**
   - Click on **Environment Variables** in the left sidebar

5. **Add Each Variable**
   - Click **Add New**
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: Paste your Supabase project URL
   - **Environment**: Select all (Production, Preview, Development)
   - Click **Save**
   
   - Repeat for `VITE_SUPABASE_ANON_KEY`

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Pull environment variables to local .env file (optional)
vercel env pull .env.local
```

## Important Notes

⚠️ **Security**: 
- The `VITE_SUPABASE_ANON_KEY` is safe to expose in client-side code
- It's designed to be public and is restricted by Row Level Security (RLS) policies
- Never commit your `.env` file to Git (it's already in `.gitignore`)

✅ **After Adding Variables**:
- You need to **redeploy** your project for changes to take effect
- Go to **Deployments** → Click the three dots on latest deployment → **Redeploy**

## Verification

After adding the variables and redeploying, check:
1. Your site should load without errors
2. Chat functionality should work
3. CMS login should work
4. No console errors about missing Supabase variables

## Example Values Format

```
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Troubleshooting

**Issue**: "Missing Supabase environment variables" error
- **Solution**: Make sure both variables are added and the project is redeployed

**Issue**: Variables not working after adding
- **Solution**: 
  1. Check that variable names start with `VITE_` (required for Vite)
  2. Redeploy the project
  3. Clear browser cache

**Issue**: Can't find Supabase keys
- **Solution**: 
  1. Make sure you're logged into the correct Supabase project
  2. Go to Settings → API (not Database or Auth)
  3. The keys are in the "Project API keys" section

