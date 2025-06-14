import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pqmjxfacehbbsfoc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWp0eGZhY2NlamhoYnNiZm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5Mjg3MTMsImV4cCI6MjA2NTUwNDcxM30.suoithZYw6RJfqL7g5YeZxNaTbNHVuqO27kkR-kEABY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)