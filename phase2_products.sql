-- =====================================================================
-- PHASE 2: "products" table for the Silambam Equipment website
--
-- HOW TO RUN: Supabase dashboard > SQL Editor > New query > paste this
-- whole file > Run.
--
-- Safe to run more than once: it never duplicates products and never
-- overwrites prices you have already changed.
-- =====================================================================


-- 1. TABLE ------------------------------------------------------------

create table if not exists public.products (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null check (char_length(btrim(name)) > 0),
  slug               text not null unique
                       check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description        text,
  short_description  text,

  -- Unknown details stay NULL. The website shows "To be confirmed".
  material           text,
  length             text,
  weight             text,

  -- Price per piece in rupees, for each quantity tier.
  retail_price       numeric(10,2) not null check (retail_price  >= 0),  -- 1-19 pieces
  bulk_20_price      numeric(10,2) not null check (bulk_20_price >= 0),  -- 20-49 pieces
  bulk_50_price      numeric(10,2) not null check (bulk_50_price >= 0),  -- 50+ pieces

  -- NULL = stock not tracked yet.
  stock_quantity     integer check (stock_quantity >= 0),

  -- NULL = the website shows its placeholder picture.
  -- Later this can hold a Supabase Storage image URL.
  image_url          text,

  -- Extra rows for the specifications list: [{"label": "...", "value": "..."}]
  extra_specs        jsonb not null default '[]'::jsonb
                       check (jsonb_typeof(extra_specs) = 'array'),

  -- Display order on the home page (lowest first).
  sort_order         integer not null default 0,

  -- false = hidden from the public website, but kept in the database.
  is_active          boolean not null default true,

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);


-- 2. KEEP updated_at CURRENT -----------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();


-- 3. SECURITY: Row Level Security + read-only public access -----------

alter table public.products enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
  on public.products
  for select
  to anon, authenticated
  using (is_active = true);

-- The public website may only READ. No insert, update or delete.
revoke all on public.products from anon, authenticated;
grant select on public.products to anon, authenticated;


-- 4. THE 8 PRODUCTS ---------------------------------------------------
-- PRICES BELOW ARE THE PLACEHOLDERS FROM PHASE 1, NOT FINAL.
-- Change them any time in Table Editor > products.
-- Material, length and weight are NULL until you know the real values.

insert into public.products
  (name, slug, short_description, description,
   retail_price, bulk_20_price, bulk_50_price,
   stock_quantity, image_url, extra_specs, sort_order)
values
  ('Silambam Stick', 'silambam-stick',
   'The traditional Silambam staff for everyday practice and drills.',
   'The Silambam stick is the core piece of equipment for Silambam training. This listing is for practitioners, trainers and academies who need dependable sticks for regular practice. Full product details will be added soon.',
   350, 300, 250, null, null,
   '[{"label":"Intended use","value":"Training and practice"}]'::jsonb, 10),

  ('Silambam Fight Stick', 'silambam-fight-stick',
   'A stick intended for fight and sparring-style practice.',
   'The Silambam fight stick is intended for sparring-style practice. Specifications, including how it differs from the standard stick, will be confirmed and added soon.',
   450, 400, 350, null, null,
   '[{"label":"Intended use","value":"Fight and sparring practice"}]'::jsonb, 20),

  ('Double Stick', 'double-stick',
   'Sticks for double-stick drills and practice.',
   'Double sticks are used for double-stick Silambam practice. Whether this is sold as a single piece or a pair, and its final specifications, will be confirmed and added soon.',
   600, 550, 480, null, null,
   '[{"label":"Sold as","value":"To be confirmed (single piece or pair)"},{"label":"Intended use","value":"Training and practice"}]'::jsonb, 30),

  ('Vel Kombu', 'vel-kombu',
   'Traditional Silambam training equipment for practitioners and academies.',
   'Vel Kombu is a traditional piece of Silambam training equipment. A full description and specifications will be added soon.',
   500, 450, 400, null, null,
   '[{"label":"Intended use","value":"Training and practice"}]'::jsonb, 40),

  ('Maan Kombu', 'maan-kombu',
   'Traditional Silambam training equipment for practitioners and academies.',
   'Maan Kombu is a traditional piece of Silambam training equipment. A full description and specifications will be added soon.',
   800, 720, 650, null, null,
   '[{"label":"Sold as","value":"To be confirmed (single piece or pair)"},{"label":"Intended use","value":"Training and practice"}]'::jsonb, 50),

  ('Sulli Kuchi', 'sulli-kuchi',
   'Traditional Silambam training equipment for practitioners and academies.',
   'Sulli Kuchi is a traditional piece of Silambam training equipment. A full description and specifications will be added soon.',
   300, 260, 220, null, null,
   '[{"label":"Intended use","value":"Training and practice"}]'::jsonb, 60),

  ('Tharasu', 'tharasu',
   'Traditional Silambam training equipment for practitioners and academies.',
   'Tharasu is a traditional piece of Silambam training equipment. A full description and specifications will be added soon.',
   700, 630, 560, null, null,
   '[{"label":"Intended use","value":"Training and practice"}]'::jsonb, 70),

  ('Fight Gloves', 'fight-gloves',
   'Hand protection for sparring and fight practice.',
   'Fight gloves for hand protection during sparring and fight practice. Available sizes, materials and specifications will be confirmed and added soon.',
   900, 820, 740, null, null,
   '[{"label":"Intended use","value":"Sparring and fight practice"}]'::jsonb, 80)
on conflict (slug) do nothing;
