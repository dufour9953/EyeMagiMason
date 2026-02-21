-- iMagiMason Core Schema: Drops and Bids

-- 1. Drops Table (The Ceremonial Artifacts)
CREATE TABLE public.drops (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,                 -- e.g., "The Cedar Solace"
    description TEXT,                    -- Artist statement
    flute_name TEXT,
    wood_type TEXT,
    tuning_key TEXT,
    starting_bid NUMERIC NOT NULL DEFAULT 0,
    current_bid NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('DRAFT', 'SCHEDULED', 'LIVE', 'ENDED')) DEFAULT 'DRAFT',
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    image_url TEXT,
    audio_url TEXT,
    winner_email TEXT,                   -- Lightweight bidder tracking
    stripe_payment_url TEXT
);

-- 2. Bids Table (The Action Engine)
CREATE TABLE public.bids (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    drop_id UUID NOT NULL REFERENCES public.drops(id) ON DELETE CASCADE,
    bidder_name TEXT NOT NULL,
    bidder_email TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'VALID' -- VALID, OUTBID, WINNER
);

-- Realtime Configuration
-- This allows WebSockets to instantly stream new bids to all Connected clients on the Auction Drop Page
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.bids, public.drops;
COMMIT;
