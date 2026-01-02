// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
	'https://iridseinqwtshacxampb.supabase.co',
	'sb_publishable_vJCDaapWoVegxNq9hRDkmw_bWfS5nEg',
)
