ALTER TABLE drops ADD COLUMN starts_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE drops ADD COLUMN ends_at TIMESTAMP WITH TIME ZONE;

CREATE TABLE audio_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  duration TEXT,
  plays INTEGER DEFAULT 0,
  wood_type TEXT,
  tuning TEXT,
  cover_art TEXT,
  audio_src TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
