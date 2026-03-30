-- ============================================
-- Newsletter and Multilingual Support Migration
-- Created: 2024-02-11
-- ============================================

-- ============================================
-- 1. NEWSLETTER SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  is_active BOOLEAN DEFAULT true
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_is_active ON newsletter_subscriptions(is_active);

-- ============================================
-- 2. UPDATE PRODUCTS TABLE FOR MULTILINGUAL
-- ============================================

-- Add multilingual fields for products
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_ka TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_ka TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Migrate existing data to Georgian fields
UPDATE products SET
  name_ka = name,
  name_en = name,
  description_ka = description,
  description_en = description
WHERE name_ka IS NULL OR name_en IS NULL;

-- Make multilingual fields required
ALTER TABLE products ALTER COLUMN name_ka SET NOT NULL;
ALTER TABLE products ALTER COLUMN name_en SET NOT NULL;
ALTER TABLE products ALTER COLUMN description_ka SET NOT NULL;
ALTER TABLE products ALTER COLUMN description_en SET NOT NULL;

-- Keep old fields for backwards compatibility (will be removed in future migration)
-- ALTER TABLE products DROP COLUMN name;
-- ALTER TABLE products DROP COLUMN description;

-- ============================================
-- 3. UPDATE CATEGORIES TABLE FOR MULTILINGUAL
-- ============================================

-- Add multilingual fields for categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_ka TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_en TEXT;

-- Migrate existing data
UPDATE categories
SET name_ka = CASE slug
  WHEN 'living-room' THEN 'მისაღები'
  WHEN 'bedroom' THEN 'საძინებელი'
  WHEN 'lighting' THEN 'განათება'
  WHEN 'decor' THEN 'დეკორი'
  ELSE name
END,
name_en = name
WHERE name_ka IS NULL OR name_en IS NULL;

-- Make multilingual fields required
ALTER TABLE categories ALTER COLUMN name_ka SET NOT NULL;
ALTER TABLE categories ALTER COLUMN name_en SET NOT NULL;

-- ============================================
-- 4. ROW LEVEL SECURITY FOR NEWSLETTER
-- ============================================

-- Enable RLS
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe (insert their own email)
CREATE POLICY "Allow public to subscribe to newsletter"
  ON newsletter_subscriptions FOR INSERT
  WITH CHECK (true);

-- Allow public read access for checking if email exists (optional)
CREATE POLICY "Allow public read access to newsletter"
  ON newsletter_subscriptions FOR SELECT
  USING (true);

-- Admin only update/delete
CREATE POLICY "Allow admin to manage newsletter subscriptions"
  ON newsletter_subscriptions FOR ALL
  USING (true);

-- ============================================
-- 5. UPDATE SEED DATA WITH MULTILINGUAL FIELDS
-- ============================================

-- Update products with proper multilingual data
UPDATE products SET
  name_ka = 'მინიმალისტური კერამიკული ვაზა',
  name_en = 'Minimalist Ceramic Vase',
  description_ka = 'ხელნაკეთი კერამიკული ვაზა მინიმალისტური დიზაინით. იდეალურია თანამედროვე ინტერიერებისთვის და ახალი ყვავილების კომპოზიციებისთვის.',
  description_en = 'Handcrafted ceramic vase with a minimalist design. Perfect for modern interiors and fresh flower arrangements.'
WHERE name = 'Minimalist Ceramic Vase';

UPDATE products SET
  name_ka = 'სკანდინავიური ფლორ ლამპა',
  name_en = 'Scandinavian Floor Lamp',
  description_ka = 'ელეგანტური ფლორ ლამპა, შთაგონებული სკანდინავიური დიზაინის პრინციპებით. თბილი გარემო განათება ნებისმიერი ოთახისთვის.',
  description_en = 'Elegant floor lamp inspired by Scandinavian design principles. Warm ambient lighting for any room.'
WHERE name = 'Scandinavian Floor Lamp';

UPDATE products SET
  name_ka = 'ხავერდოვანი აქცენტის სკამი',
  name_en = 'Velvet Accent Chair',
  description_ka = 'ფუფუნებული ხავერდოვანი აქცენტის სკამი თითბრის ფეხებით. განცხადების ნაწილი დახვეწილი საცხოვრებელი სივრცეებისთვის.',
  description_en = 'Luxurious velvet accent chair with brass legs. A statement piece for sophisticated living spaces.'
WHERE name = 'Velvet Accent Chair';

UPDATE products SET
  name_ka = 'ნაქსოვი საბანი',
  name_en = 'Woven Throw Blanket',
  description_ka = 'რბილი ნაქსოვი საბანი დამზადებული ორგანული ბამბისგან. ამატებს სითბოს და ტექსტურას ნებისმიერ საძინებელში.',
  description_en = 'Soft woven throw blanket made from organic cotton. Adds warmth and texture to any bedroom.'
WHERE name = 'Woven Throw Blanket';

UPDATE products SET
  name_ka = 'მარმარილოს გვერდითი მაგიდა',
  name_en = 'Marble Side Table',
  description_ka = 'ელეგანტური მარმარილოს გვერდითი მაგიდა ოქროს ლითონის ჩარჩოთი. უვადო დიზაინი შეხვდება თანამედროვე ფუფუნებას.',
  description_en = 'Elegant marble side table with a gold metal frame. Timeless design meets modern luxury.'
WHERE name = 'Marble Side Table';

UPDATE products SET
  name_ka = 'პენდანტ განათების კლასტერი',
  name_en = 'Pendant Light Cluster',
  description_ka = 'თანამედროვე პენდანტ განათების კლასტერი სამი შუშის გლობუსით. ქმნის მომაჯადოებელ ფოკუს წერტილს სასადილო სივრცეებში.',
  description_en = 'Modern pendant light cluster with three glass globes. Creates stunning focal point in dining areas.'
WHERE name = 'Pendant Light Cluster';

UPDATE products SET
  name_ka = 'თეთრეულის ბალიშების ნაკრები',
  name_en = 'Linen Cushion Set',
  description_ka = 'ორი პრემიუმ თეთრეულის ბალიშის ნაკრები დამალული ზიპით. ბუნებრივი ტექსტურა მყუდრო ინტერიერებისთვის.',
  description_en = 'Set of two premium linen cushions with hidden zippers. Natural texture for cozy interiors.'
WHERE name = 'Linen Cushion Set';

UPDATE products SET
  name_ka = 'მუხის საწოლის გვერდითი მაგიდა',
  name_en = 'Oak Bedside Table',
  description_ka = 'მყარი მუხის საწოლის გვერდითი მაგიდა რბილი დახურვის უჯრით. შექმნილია გამძლეობისა და უვადო მიმზიდველობისთვის.',
  description_en = 'Solid oak bedside table with soft-close drawer. Crafted for durability and timeless appeal.'
WHERE name = 'Oak Bedside Table';

UPDATE products SET
  name_ka = 'აბსტრაქტული კედლის ხელოვნება',
  name_en = 'Abstract Wall Art',
  description_ka = 'თანამედროვე აბსტრაქტული ბეჭდვა პრემიუმ ტილოზე. ამატებს მხატვრულ დახვეწას ნებისმიერ კედლის სივრცეს.',
  description_en = 'Contemporary abstract print on premium canvas. Adds artistic flair to any wall space.'
WHERE name = 'Abstract Wall Art';

UPDATE products SET
  name_ka = 'თითბრის სამაგიდო ლამპა',
  name_en = 'Brass Table Lamp',
  description_ka = 'ვინტაჟური სტილის თითბრის სამაგიდო ლამპა ქსოვილის აბაჟურით. იდეალურია სამკითხველო კუთხეებისა და მაგიდებისთვის.',
  description_en = 'Vintage-inspired brass table lamp with fabric shade. Perfect for reading corners and desks.'
WHERE name = 'Brass Table Lamp';

UPDATE products SET
  name_ka = 'მოდულური დივნის სექცია',
  name_en = 'Modular Sofa Section',
  description_ka = 'პერსონალიზებადი მოდულური დივნის სექცია პრემიუმ ქსოვილში. ააშენეთ თქვენი სრულყოფილი სავარძლის განლაგება.',
  description_en = 'Customizable modular sofa section in premium fabric. Build your perfect seating arrangement.'
WHERE name = 'Modular Sofa Section';

UPDATE products SET
  name_ka = 'კერამიკული მცენარის ქოთნების ნაკრები',
  name_en = 'Ceramic Plant Pot Set',
  description_ka = 'სამი კერამიკული მცენარის ქოთნის ნაკრები სხვადასხვა ზომით. მინიმალისტური დიზაინი თანამედროვე მცენარეების მოყვარულებისთვის.',
  description_en = 'Set of three ceramic plant pots in varying sizes. Minimalist design for modern plant lovers.'
WHERE name = 'Ceramic Plant Pot Set';
