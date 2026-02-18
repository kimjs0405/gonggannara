import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 환경변수가 설정되지 않았습니다. .env 파일을 확인하세요.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// 데이터베이스 타입 정의
export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price: number
  discount: number
  category: string
  image_url: string
  badge?: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  icon: string
  slug: string
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled'
  total_amount: number
  shipping_address: string
  created_at: string
}

