-- Generieke prijstracker: een codebase, meerdere verticals (lego, later parfum).
-- Elke rij hoort bij een vertical. De site en de worker draaien met VERTICAL=<id>.

create extension if not exists pgcrypto;

create table shops (
  id        smallint primary key generated always as identity,
  vertical  text not null,
  slug      text not null,
  name      text not null,
  country   char(2) not null check (country in ('BE', 'NL', 'FR', 'DE')),
  network   text not null,                 -- 'bol', 'awin', 'daisycon', 'direct'
  active    boolean not null default true, -- NL staat voorlopig uit
  unique (vertical, slug)
);

create table products (
  id                bigint primary key generated always as identity,
  vertical          text not null,
  sku               text not null,         -- lego: setnummer, parfum: bv. merk-naam-ml
  name              text not null,
  brand             text,
  category          text,
  attrs             jsonb not null default '{}'::jsonb,  -- lego: stukjes en jaar, parfum: volume en geurfamilie
  ean               text,
  rrp_eur           numeric(8,2),
  image_source_url  text,                  -- officiele afbeelding uit de feed
  image_path        text,                  -- kopie in eigen opslag (bucket product-images)
  created_at        timestamptz not null default now(),
  unique (vertical, sku),
  unique (vertical, ean)
);

create index products_category_idx on products (vertical, category);

create table offers (
  id            bigint primary key generated always as identity,
  product_id    bigint not null references products (id) on delete cascade,
  shop_id       smallint not null references shops (id),
  product_url   text not null,
  affiliate_url text,
  price_eur     numeric(8,2) not null,
  in_stock      boolean not null default true,
  last_seen_at  timestamptz not null default now(),
  unique (product_id, shop_id)
);

create index offers_product_idx on offers (product_id);

create table price_history (
  id          bigint primary key generated always as identity,
  offer_id    bigint not null references offers (id) on delete cascade,
  price_eur   numeric(8,2) not null,
  in_stock    boolean not null,
  recorded_at timestamptz not null default now()
);

create index price_history_offer_time_idx on price_history (offer_id, recorded_at desc);

-- Verlanglijst zonder account: een anoniem token in een cookie
create table wishlists (
  token      uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table wishlist_items (
  token      uuid not null references wishlists (token) on delete cascade,
  product_id bigint not null references products (id) on delete cascade,
  added_at   timestamptz not null default now(),
  primary key (token, product_id)
);

create table alerts (
  id                bigint primary key generated always as identity,
  email             text not null,
  product_id        bigint not null references products (id) on delete cascade,
  target_eur        numeric(8,2) not null,
  confirmed_at      timestamptz,
  confirm_token     uuid not null default gen_random_uuid(),
  unsubscribe_token uuid not null default gen_random_uuid(),
  last_notified_at  timestamptz,
  created_at        timestamptz not null default now()
);

create index alerts_product_idx on alerts (product_id) where confirmed_at is not null;

-- Redactionele laag (Google Discover)
create table articles (
  id              bigint primary key generated always as identity,
  vertical        text not null,
  slug            text not null,
  title           text not null,
  summary         text not null,
  body            text not null,                 -- alinea's gescheiden door een lege regel
  hero_image_url  text,                          -- liefst minstens 1200 px breed
  hero_width      integer,
  hero_height     integer,
  kind            text not null default 'deals',
  status          text not null default 'draft' check (status in ('draft', 'published')),
  published_at    timestamptz,
  updated_at      timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  unique (vertical, slug)
);

create index articles_published_idx on articles (vertical, published_at desc) where status = 'published';

-- Laagste huidige prijs per product, alleen bij actieve shops
create view best_offers as
select distinct on (o.product_id)
  p.vertical,
  p.sku,
  o.product_id,
  o.id as offer_id,
  o.shop_id,
  s.country,
  o.price_eur,
  o.product_url,
  o.affiliate_url
from offers o
join shops s on s.id = o.shop_id and s.active
join products p on p.id = o.product_id
where o.in_stock
  and o.last_seen_at > now() - interval '3 days'
order by o.product_id, o.price_eur asc;

create view all_time_low as
select o.product_id, min(h.price_eur) as low_eur
from price_history h
join offers o on o.id = h.offer_id
join shops s on s.id = o.shop_id and s.active
group by o.product_id;

create view daily_deals as
select
  p.vertical,
  p.id as product_id,
  p.sku,
  p.name,
  p.brand,
  p.category,
  p.image_path,
  p.image_source_url,
  p.rrp_eur,
  b.price_eur,
  b.shop_id,
  b.country,
  b.affiliate_url,
  b.product_url,
  round((1 - b.price_eur / nullif(p.rrp_eur, 0)) * 100, 1) as discount_pct,
  (b.price_eur <= coalesce(l.low_eur, b.price_eur)) as is_all_time_low
from best_offers b
join products p on p.id = b.product_id
left join all_time_low l on l.product_id = b.product_id
where p.rrp_eur is not null
  and b.price_eur < p.rrp_eur
order by discount_pct desc;

-- Alleen lezen voor de website; schrijven doen worker en server actions met de service key
alter table shops enable row level security;
alter table products enable row level security;
alter table offers enable row level security;
alter table price_history enable row level security;
alter table wishlists enable row level security;
alter table wishlist_items enable row level security;
alter table alerts enable row level security;
alter table articles enable row level security;

create policy "shops lezen" on shops for select using (true);
create policy "products lezen" on products for select using (true);
create policy "offers lezen" on offers for select using (true);
create policy "history lezen" on price_history for select using (true);
create policy "gepubliceerde artikels lezen" on articles for select using (status = 'published');

-- Publieke bucket voor de gekopieerde productafbeeldingen
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Shops voor de vertical lego. Nederland staat uit en gaat later aan met: update shops set active = true where country = 'NL';
insert into shops (vertical, slug, name, country, network, active) values
  ('lego', 'lego-be',       'LEGO.com (BE)',   'BE', 'awin',     true),
  ('lego', 'bol-be',        'bol (BE)',        'BE', 'bol',      true),
  ('lego', 'mediamarkt-be', 'MediaMarkt BE',   'BE', 'awin',     true),
  ('lego', 'dreamland',     'Dreamland',       'BE', 'awin',     true),
  ('lego', 'fun',           'Fun',             'BE', 'awin',     true),
  ('lego', 'smyths-be',     'Smyths Toys BE',  'BE', 'awin',     true),
  ('lego', 'amazon-be',     'Amazon.com.be',   'BE', 'direct',   true),
  ('lego', 'bol-nl',        'bol (NL)',        'NL', 'bol',      false),
  ('lego', 'mediamarkt-nl', 'MediaMarkt NL',   'NL', 'awin',     false),
  ('lego', 'intertoys',     'Intertoys',       'NL', 'daisycon', false),
  ('lego', 'bart-smit',     'Bart Smit',       'NL', 'daisycon', false),
  ('lego', 'amazon-nl',     'Amazon.nl',       'NL', 'direct',   false);
