import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hmoodwzpkwblbymzpmxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtb29kd3pwa3dibGJ5bXpwbXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMDYyMTksImV4cCI6MjA4ODY4MjIxOX0.qMY6NY-BeqsrudAK0SwNcQttPBMdLQmv6PGcDUcfOaY'; // Replace with your anon/public key from Supabase Dashboard → Settings → API

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
