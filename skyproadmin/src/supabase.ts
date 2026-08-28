import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://ompmgysuoisdyiateovg.supabase.co'
export const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_XQ2t2Fs2CjNjS3f9JrXLpA_IZE6O2W6'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

export interface SiteSettings {
  id: string
  whatsapp_number: string
  whatsapp_url: string
  instagram_name: string
  instagram_url: string
  footer_domain: string
  support_number_1?: string
  support_number_2?: string
  banner_1_url?: string
  banner_2_url?: string
  updated_at?: string
}
