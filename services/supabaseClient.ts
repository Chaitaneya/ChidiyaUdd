import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uporrgxqtdqlibwnxcax.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb3JyZ3hxdGRxbGlid254Y2F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NzI4NDIsImV4cCI6MjA4MDE0ODg0Mn0.mDeEpodm9AkqP2loo8MZaWvEhYpHpR4Kufgw_wEOUoc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);