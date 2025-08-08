import { createClient } from '@supabase/supabase-js'

// IMPORTANT: We avoid env vars in Lovable. Use the full URL and anon key directly.
const SUPABASE_URL = 'https://bqcmhkajtuzovmvwblbe.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxY21oa2FqdHV6b3ZtdndibGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5Nzc1MzYsImV4cCI6MjA2OTU1MzUzNn0.30fGqpWjKYteiMhQWts28ShnVmdP3TZg8B49OLLMdt8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
