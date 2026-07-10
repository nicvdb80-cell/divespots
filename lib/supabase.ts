import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://flhsqerpikhihtirfutu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsaHNxZXJwaWtoaWh0aXJmdXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNTg4NTEsImV4cCI6MjA5MjkzNDg1MX0.Q0RO8O_i7fBbDZTS6ZGyQ3NqrraxtRK3UG5PDITGYsU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
