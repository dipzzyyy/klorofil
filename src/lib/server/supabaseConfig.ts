import { proj_url, anon_key } from '$env/static/private'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(proj_url, anon_key)