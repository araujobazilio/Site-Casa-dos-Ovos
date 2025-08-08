import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: 'estojo' | 'palhao' | 'caixa' | 'codorna';
  classification: 'P' | 'M' | 'G' | 'XL' | 'Jumbo' | null;
  quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  address: string;
  phone: string;
  whatsapp: string;
  hours: string;
  logo_url: string;
  banner_text: string;
  banner_active: boolean;
  updated_at: string;
}