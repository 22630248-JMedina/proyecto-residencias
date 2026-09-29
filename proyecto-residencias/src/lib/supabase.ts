import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tu-proyecto.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'tu-anon-key'
);