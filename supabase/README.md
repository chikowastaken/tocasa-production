# Supabase Migrations

This directory contains SQL migration files for the TOCASA Showroom database.

## How to Run Migrations

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/asopeqpwwwxwdgyanvih
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the migration file: `supabase/migrations/20240211000000_initial_schema.sql`
5. Copy all the contents and paste into the SQL editor
6. Click **Run** or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)
7. Verify tables were created in **Table Editor**

### Option 2: Via Supabase CLI (Advanced)

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link to your remote project
supabase link --project-ref asopeqpwwwxwdgyanvih

# Push migrations to remote database
supabase db push
```

## Migration Files

- `20240211000000_initial_schema.sql` - Initial database schema with tables, indexes, RLS policies, and seed data

## Database Schema

### Tables Created:

1. **categories** - Product categories (Living Room, Bedroom, Lighting, Decor)
2. **products** - Product catalog with images, prices, and details
3. **orders** - Customer orders (optional)
4. **coming_soon_items** - Upcoming collections display

### Security:

- Row Level Security (RLS) enabled on all tables
- Public read access for products and categories
- Admin-only write access (can be customized based on your auth setup)

## After Migration

Once you've run the migration, update your React components to fetch data from Supabase instead of using mock data.

### Environment Variables Required:

Make sure your `.env` file has:

```
VITE_SUPABASE_URL=https://asopeqpwwwxwdgyanvih.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

## Storage Bucket

Don't forget to create the storage bucket for product images:

1. Go to **Storage** in Supabase Dashboard
2. Create a bucket named `product-images`
3. Make it **Public** for easy access
