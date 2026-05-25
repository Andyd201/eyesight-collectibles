-- ============================================================
-- EYESIGHT COLLECTIBLES — SEED DATA
-- Supabase Dashboard → SQL Editor → New query → Paste → Run ▶
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- SINGLES
-- ────────────────────────────────────────────────────────────
INSERT INTO singles
  (pokemon_name, set_name, set_code, card_number, rarity, language, condition, is_foil, price, market_price, stock, images)
VALUES
  ('Charizard ex',  'Obsidian Flames',  'OBF', '223/197', 'Special Art Rare',           'english', 'near_mint',      true,  149.99, 165.00, 2, '{}'),
  ('Charizard ex',  'Obsidian Flames',  'OBF', '196/197', 'Hyper Rare',                 'english', 'near_mint',      true,   89.99,  98.00, 1, '{}'),
  ('Umbreon VMAX',  'Evolving Skies',   'EVS', '215/203', 'Alt Art',                    'english', 'near_mint',      true,  119.99, 130.00, 1, '{}'),
  ('Rayquaza VMAX', 'Evolving Skies',   'EVS', '218/203', 'Alt Art',                    'english', 'near_mint',      true,  199.99, 220.00, 1, '{}'),
  ('Mew ex',        '151',              'MEW', '205/165', 'Special Art Rare',            'english', 'near_mint',      true,   44.99,  50.00, 3, '{}'),
  ('Alakazam ex',   '151',              'MEW', '201/165', 'Special Art Rare',            'english', 'near_mint',      true,   29.99,  33.00, 2, '{}'),
  ('Gardevoir ex',  'Scarlet & Violet', 'SVI', '205/198', 'Special Art Rare',            'english', 'near_mint',      true,   59.99,  65.00, 2, '{}'),
  ('Miraidon ex',   'Scarlet & Violet', 'SVI', '193/198', 'Special Art Rare',            'english', 'near_mint',      true,   44.99,  48.00, 2, '{}'),
  ('Pikachu ex',    'Paldean Fates',    'PAF', 'SIR 228', 'Special Illustration Rare',   'english', 'near_mint',      true,   79.99,  88.00, 2, '{}'),
  ('Gengar VMAX',   'Fusion Strike',    'FST', '271/264', 'Alt Art',                    'english', 'near_mint',      true,   54.99,  60.00, 1, '{}'),
  ('Lugia V',       'Silver Tempest',   'SIT', '138/195', 'Alt Art',                    'english', 'near_mint',      true,   69.99,  75.00, 3, '{}'),
  ('Mewtwo V',      'Crown Zenith',     'CRZ', 'GG68/70', 'Galarian Gallery',           'english', 'near_mint',      true,   24.99,  28.00, 4, '{}'),
  ('Iono',          'Paldea Evolved',   'PAL', '269/193', 'Special Art Rare',            'english', 'near_mint',      true,   34.99,  38.00, 5, '{}'),
  ('Arcanine ex',   'Obsidian Flames',  'OBF', '227/197', 'Special Art Rare',            'english', 'near_mint',      true,   19.99,  22.00, 3, '{}'),
  ('Baxcalibur',    'Paldea Evolved',   'PAL', '060/193', 'Rare Holo',                  'english', 'near_mint',      true,    4.99,   6.00, 8, '{}'),
  ('Sylveon VMAX',  'Eevee Heroes',     'S6A', '093/069', 'Hyper Rare',                 'japanese','near_mint',      true,   39.99,  45.00, 2, '{}'),
  ('Eevee',         'Eevee Heroes',     'S6A', '069/069', 'Holo Rare',                  'japanese','near_mint',      true,   12.99,  15.00, 4, '{}'),
  ('Charizard ex',  'Obsidian Flames',  'OBF', '223/197', 'Special Art Rare',            'english', 'lightly_played', true,  119.99, 165.00, 1, '{}'),
  ('Umbreon VMAX',  'Evolving Skies',   'EVS', '215/203', 'Alt Art',                    'english', 'lightly_played', true,   89.99, 130.00, 1, '{}');


-- ────────────────────────────────────────────────────────────
-- GRADED CARDS
-- grader enum: 'PSA' | 'CGC' | 'BGS' | 'CGC_PRISTINE' | 'other'
-- ────────────────────────────────────────────────────────────
INSERT INTO graded_cards
  (pokemon_name, set_name, card_number, language, grader, grade, cert_number, price, in_stock, images)
VALUES
  ('Charizard ex',  'Obsidian Flames',  '223/197', 'english', 'PSA', 10,  '87654321', 349.99, true, '{}'),
  ('Umbreon VMAX',  'Evolving Skies',   '215/203', 'english', 'PSA', 10,  '76543210', 599.99, true, '{}'),
  ('Rayquaza VMAX', 'Evolving Skies',   '218/203', 'english', 'PSA',  9,  '65432109', 349.99, true, '{}'),
  ('Mew ex',        '151',             '205/165', 'english', 'BGS',  9.5,'98712345', 149.99, true, '{}'),
  ('Pikachu',       'Base Set',        '58/102',  'english', 'CGC',  7.5,'11223344',1499.99, true, '{}'),
  ('Charizard',     'Base Set',        '4/102',   'english', 'PSA',  8,  '55667788',4999.99, true, '{}'),
  ('Mewtwo',        'Base Set',        '10/102',  'english', 'CGC',  9,  '99001122', 599.99, true, '{}'),
  ('Pikachu ex',    'Paldean Fates',   'SIR 228', 'english', 'PSA', 10,  '44556677', 249.99, true, '{}'),
  ('Charizard ex',  'Obsidian Flames', '223/197', 'english', 'PSA',  9,  '33445566', 199.99, true, '{}'),
  ('Gardevoir ex',  'Scarlet & Violet','205/198', 'english', 'BGS',  9,  '22334455', 169.99, true, '{}');


-- ────────────────────────────────────────────────────────────
-- PRODUCTS (sealed & accessories)
-- category enum: 'sealed' | 'single' | 'graded' | 'accessory' | 'merchandise'
-- language enum: 'english' | 'japanese' | 'korean' | 'chinese' | 'other'
-- images is TEXT[] → use '{}'
-- ────────────────────────────────────────────────────────────
INSERT INTO products
  (name, slug, description, category, subcategory, set_name, set_code, language, price, original_price, stock, badge, featured, is_active, images)
VALUES
  (
    'Pokémon TCG: 151 Booster Box',
    'pokemon-151-booster-box',
    '36 booster packs from the iconic 151 set featuring the original 151 Pokémon. High pull rate for Special Art Rares and Hyper Rares.',
    'sealed', 'booster_box', '151', 'MEW', 'english',
    179.99, 219.99, 5, 'Hot', true, true, '{}'
  ),
  (
    'Obsidian Flames Elite Trainer Box',
    'obsidian-flames-etb',
    '9 booster packs + 65 card sleeves, 45 Energy cards, player''s guide, dice, and collector''s box.',
    'sealed', 'etb', 'Obsidian Flames', 'OBF', 'english',
    54.99, 59.99, 8, 'Sale', false, true, '{}'
  ),
  (
    'Evolving Skies Booster Box',
    'evolving-skies-booster-box',
    '36 booster packs. Home to Umbreon VMAX, Rayquaza VMAX, and Eevee-lutions — one of the most popular sets ever printed.',
    'sealed', 'booster_box', 'Evolving Skies', 'EVS', 'english',
    349.99, NULL, 3, 'Rare', true, true, '{}'
  ),
  (
    'Paldean Fates Elite Trainer Box',
    'paldean-fates-etb',
    '9 booster packs featuring Shiny Pokémon from Paldea. Includes Shiny Charizard ex and Shiny Pikachu ex as potential pulls.',
    'sealed', 'etb', 'Paldean Fates', 'PAF', 'english',
    69.99, NULL, 6, 'New', true, true, '{}'
  ),
  (
    'Crown Zenith Galarian Gallery Tin — Morpeko',
    'crown-zenith-tin-morpeko',
    '1 Galarian Gallery booster pack + 3 Crown Zenith booster packs + a Morpeko coin.',
    'sealed', 'tin', 'Crown Zenith', 'CRZ', 'english',
    24.99, 29.99, 10, 'Sale', false, true, '{}'
  ),
  (
    'Dragon Shield Matte Sleeves — Black (100ct)',
    'dragon-shield-matte-black-100',
    'The gold standard for card protection. Acid-free, archival-safe, tournament-legal. Pack of 100.',
    'accessory', 'sleeves', NULL, NULL, 'english',
    12.99, NULL, 25, NULL, false, true, '{}'
  ),
  (
    'Ultimate Guard Zipfolio 480 — Black',
    'ultimate-guard-zipfolio-480-black',
    '480-card binder with 4-pocket pages, premium zipper closure, D-ring mechanism. Perfect for displaying your best singles.',
    'accessory', 'binder', NULL, NULL, 'english',
    44.99, NULL, 12, NULL, false, true, '{}'
  );
