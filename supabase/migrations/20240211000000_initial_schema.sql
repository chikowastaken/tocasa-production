-- ============================================
-- TOCASA Showroom Database Schema
-- Migration: Initial Schema Setup
-- Created: 2024-02-11
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT NOT NULL,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 2. PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  category TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  image TEXT NOT NULL,
  images TEXT[],
  description TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  is_new BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  FOREIGN KEY (category_slug) REFERENCES categories(slug) ON DELETE CASCADE
);

-- ============================================
-- 3. ORDERS TABLE (Optional)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  items_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 4. COMING SOON ITEMS TABLE (Optional)
-- ============================================
CREATE TABLE IF NOT EXISTS coming_soon_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- INDEXES for better query performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category_slug ON products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE coming_soon_items ENABLE ROW LEVEL SECURITY;

-- Categories: Public read access, admin write access
CREATE POLICY "Allow public read access to categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Allow admin write access to categories"
  ON categories FOR ALL
  USING (true);

-- Products: Public read access, admin write access
CREATE POLICY "Allow public read access to products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Allow admin write access to products"
  ON products FOR ALL
  USING (true);

-- Orders: Admin only access (you can customize this later)
CREATE POLICY "Allow admin access to orders"
  ON orders FOR ALL
  USING (true);

-- Coming Soon Items: Public read access, admin write access
CREATE POLICY "Allow public read access to coming_soon_items"
  ON coming_soon_items FOR SELECT
  USING (true);

CREATE POLICY "Allow admin write access to coming_soon_items"
  ON coming_soon_items FOR ALL
  USING (true);

-- ============================================
-- SEED DATA (Insert your initial categories)
-- ============================================
INSERT INTO categories (name, slug, image, product_count) VALUES
  ('Living Room', 'living-room', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', 24),
  ('Bedroom', 'bedroom', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80', 18),
  ('Lighting', 'lighting', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80', 32),
  ('Decor', 'decor', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', 45)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED DATA (Insert your initial products)
-- ============================================
INSERT INTO products (name, price, original_price, category, category_slug, image, description, in_stock, is_new, is_featured) VALUES
  ('Minimalist Ceramic Vase', 89, NULL, 'Decor', 'decor', 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80', 'Handcrafted ceramic vase with a minimalist design. Perfect for modern interiors and fresh flower arrangements.', true, true, true),
  ('Scandinavian Floor Lamp', 245, 295, 'Lighting', 'lighting', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80', 'Elegant floor lamp inspired by Scandinavian design principles. Warm ambient lighting for any room.', true, false, true),
  ('Velvet Accent Chair', 420, NULL, 'Living Room', 'living-room', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', 'Luxurious velvet accent chair with brass legs. A statement piece for sophisticated living spaces.', true, false, true),
  ('Woven Throw Blanket', 65, NULL, 'Bedroom', 'bedroom', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80', 'Soft woven throw blanket made from organic cotton. Adds warmth and texture to any bedroom.', true, true, false),
  ('Marble Side Table', 189, NULL, 'Living Room', 'living-room', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 'Elegant marble side table with a gold metal frame. Timeless design meets modern luxury.', true, false, true),
  ('Pendant Light Cluster', 320, NULL, 'Lighting', 'lighting', 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80', 'Modern pendant light cluster with three glass globes. Creates stunning focal point in dining areas.', false, false, false),
  ('Linen Cushion Set', 75, NULL, 'Decor', 'decor', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', 'Set of two premium linen cushions with hidden zippers. Natural texture for cozy interiors.', true, true, false),
  ('Oak Bedside Table', 195, NULL, 'Bedroom', 'bedroom', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', 'Solid oak bedside table with soft-close drawer. Crafted for durability and timeless appeal.', true, false, false),
  ('Abstract Wall Art', 150, 180, 'Decor', 'decor', 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800&q=80', 'Contemporary abstract print on premium canvas. Adds artistic flair to any wall space.', true, false, true),
  ('Brass Table Lamp', 125, NULL, 'Lighting', 'lighting', 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=800&q=80', 'Vintage-inspired brass table lamp with fabric shade. Perfect for reading corners and desks.', true, false, false),
  ('Modular Sofa Section', 850, NULL, 'Living Room', 'living-room', 'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=800&q=80', 'Customizable modular sofa section in premium fabric. Build your perfect seating arrangement.', true, false, false),
  ('Ceramic Plant Pot Set', 45, NULL, 'Decor', 'decor', 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80', 'Set of three ceramic plant pots in varying sizes. Minimalist design for modern plant lovers.', true, true, false);

-- ============================================
-- SEED DATA (Insert coming soon items)
-- ============================================
INSERT INTO coming_soon_items (title, image) VALUES
  ('Spring Collection', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80'),
  ('Outdoor Living', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80'),
  ('Artisan Ceramics', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80'),
  ('Vintage Finds', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80');

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coming_soon_items_updated_at BEFORE UPDATE ON coming_soon_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
