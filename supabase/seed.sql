-- Seed initial data for development 

INSERT INTO public.drops (
    id, 
    title, 
    description, 
    flute_name, 
    wood_type, 
    tuning_key, 
    starting_bid, 
    current_bid, 
    status,
    image_url
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'The Spirit Breath',
    'A one-of-a-kind handcrafted cedar flute, charred and finished with sacred resin. This instrument was used to record the exclusive digital track accompanying this auction.',
    'The Cedar Solace',
    'Aromatic Red Cedar',
    'Key of F# Minor',
    0.50,
    4.85,
    'LIVE',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBpRxxLUDpfWVeyGU7K-E91Iqu8Qdlal-PBa_ZbqyE4bMbm4-QRnkGnKkkge8SkDGvVg5MAij2wMAWQxSUHr82xBXhviKDyq2TmaQxTKzzsYHGe8cwXTDClYW8ig6rtu3ie0ScaP8C9Dxs4aA0X9ptHWln0o0tCDr5nP7Je6XsaXCrBSVlI7K-sLL8hydOgCS9jR7TsXnt6MS6aXVeYQ_iqq-5eD3UkfH5LJDBV7U5HIrnALixWuLp4aBPI5zqT_d8XEK4PUOyH3Wg'
);

INSERT INTO public.bids (drop_id, bidder_name, bidder_email, amount, status) VALUES 
('11111111-1111-1111-1111-111111111111', 'Luna_Echoes', 'luna@example.com', 0.50, 'OUTBID'),
('11111111-1111-1111-1111-111111111111', 'DeepRoot_Collector', 'deeproot@example.com', 2.00, 'OUTBID'),
('11111111-1111-1111-1111-111111111111', 'WindWalker_99', 'windwalker@example.com', 4.85, 'VALID');
