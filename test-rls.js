require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data: stories, error: sErr } = await supabase.from('stories').select('*');
  console.log('Stories:', stories?.length, sErr);

  const { data: tracks, error: tErr } = await supabase.from('audio_tracks').select('*');
  console.log('Tracks:', tracks, tErr);
}
check();
