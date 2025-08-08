/*
  # Schema para Loja de Ovos

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, nome do produto)
      - `description` (text, descrição do produto)
      - `price` (decimal, preço do produto)
      - `image` (text, URL da imagem)
      - `type` (text, tipo: estojo, palhao, caixa, codorna)
      - `classification` (text, classificação do ovo: P, M, G, XL, Jumbo)
      - `quantity` (integer, quantidade por embalagem)
      - `is_active` (boolean, se o produto está ativo)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `store_settings`
      - `id` (uuid, primary key)
      - `store_name` (text, nome da loja)
      - `address` (text, endereço)
      - `phone` (text, telefone)
      - `whatsapp` (text, número do WhatsApp)
      - `hours` (text, horário de funcionamento)
      - `logo_url` (text, URL do logo)
      - `banner_text` (text, texto do banner)
      - `banner_active` (boolean, se o banner está ativo)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated admin access
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  image text DEFAULT '',
  type text NOT NULL CHECK (type IN ('estojo', 'palhao', 'caixa', 'codorna')),
  classification text CHECK (classification IN ('P', 'M', 'G', 'XL', 'Jumbo')),
  quantity integer NOT NULL DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create store_settings table
CREATE TABLE IF NOT EXISTS store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name text NOT NULL DEFAULT 'Ovos da Granja',
  address text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  hours text NOT NULL DEFAULT '',
  logo_url text DEFAULT '',
  banner_text text DEFAULT '',
  banner_active boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for store_settings
CREATE POLICY "Anyone can read store settings"
  ON store_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update store settings"
  ON store_settings
  FOR ALL
  TO authenticated
  USING (true);

-- Insert initial store settings
INSERT INTO store_settings (store_name, address, phone, whatsapp, hours, banner_text, banner_active)
VALUES (
  'Ovos da Granja',
  'Rua das Galinhas, 123 - Centro - São Paulo/SP',
  '(11) 1234-5678',
  '5511987654321',
  'Segunda a Sábado: 7h às 18h',
  '🎉 PROMOÇÃO ESPECIAL: Compre 2 estojos e ganhe 10% de desconto!',
  true
) ON CONFLICT DO NOTHING;

-- Insert initial products
INSERT INTO products (name, description, price, image, type, classification, quantity, is_active) VALUES
-- Estojos/Caixas Filmadas
('OVO GRANDE FILMADO C20', 'Ovos grandes selecionados em embalagem filmada com 20 dúzias. Qualidade premium direto da granja.', 137.00, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=400', 'estojo', 'G', 20, true),
('OVO GRANDE FILMADO C30', 'Ovos grandes selecionados em embalagem filmada com 30 dúzias. Ideal para estabelecimentos comerciais.', 165.00, 'https://images.pexels.com/photos/3650647/pexels-photo-3650647.jpeg?auto=compress&cs=tinysrgb&w=400', 'caixa', 'G', 30, true),
('OVO DE CODORNA', 'Ovos de codorna frescos e selecionados. Rico em nutrientes e sabor diferenciado.', 110.00, 'https://images.pexels.com/photos/1556707/pexels-photo-1556707.jpeg?auto=compress&cs=tinysrgb&w=400', 'codorna', 'P', 1, true),
('OVO EXTRA VERMELHO', 'Ovos extra vermelhos premium com 30 dúzias. Casca resistente e gema mais consistente.', 200.00, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=400', 'caixa', 'XL', 30, true),
('OVO EXTRA TOP BRANCO', 'Ovos extra top brancos com 30 dúzias. Qualidade superior para culinária profissional.', 190.00, 'https://images.pexels.com/photos/3650647/pexels-photo-3650647.jpeg?auto=compress&cs=tinysrgb&w=400', 'caixa', 'XL', 30, true),
('OVO JUMBO C20', 'Ovos jumbo com 20 dúzias. Os maiores ovos disponíveis, ideais para receitas especiais.', 150.00, 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=400', 'caixa', 'Jumbo', 20, true),

-- Palhões
('PALHÃO EXTRA C30', 'Ovos extra em embalagem tradicional de papelão com 30 unidades. Qualidade garantida.', 23.00, 'https://images.pexels.com/photos/1556707/pexels-photo-1556707.jpeg?auto=compress&cs=tinysrgb&w=400', 'palhao', 'XL', 30, true),
('PALHÃO JUMBO C30', 'Ovos jumbo em embalagem de papelão com 30 unidades. Tamanho diferenciado.', 25.00, 'https://images.pexels.com/photos/1556707/pexels-photo-1556707.jpeg?auto=compress&cs=tinysrgb&w=400', 'palhao', 'Jumbo', 30, true),
('PALHÃO EXTRA C20', 'Ovos extra em embalagem de papelão com 20 unidades. Perfeito para uso doméstico.', 14.00, 'https://images.pexels.com/photos/1556707/pexels-photo-1556707.jpeg?auto=compress&cs=tinysrgb&w=400', 'palhao', 'XL', 20, true),
('PALHÃO JUMBO C20', 'Ovos jumbo em embalagem de papelão com 20 unidades. Qualidade premium.', 18.00, 'https://images.pexels.com/photos/1556707/pexels-photo-1556707.jpeg?auto=compress&cs=tinysrgb&w=400', 'palhao', 'Jumbo', 20, true),
('CODORNA C30', 'Ovos de codorna em embalagem especial com 30 unidades. Sabor único e nutritivo.', 7.00, 'https://images.pexels.com/photos/1556707/pexels-photo-1556707.jpeg?auto=compress&cs=tinysrgb&w=400', 'codorna', 'P', 30, true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_store_settings_updated_at BEFORE UPDATE ON store_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();