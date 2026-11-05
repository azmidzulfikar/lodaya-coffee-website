-- Run this in Supabase SQL Editor. Create the first admin user in Authentication > Users.
create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  tagline text not null default 'A journey through Indonesian coffee.',
  whatsapp text not null default '6281234567890',
  maps_url text not null default '',
  instagram text not null default '',
  tiktok text not null default '',
  shop_url text not null default '',
  about text not null default 'We bring carefully selected Indonesian coffee closer to people who appreciate its origin, character, and craft.'
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  origin text not null default '',
  description text not null default '',
  image_url text not null default '',
  price text not null default '',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.click_events (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  created_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
alter table public.products enable row level security;
alter table public.click_events enable row level security;
-- Public can read published settings/products; only authenticated admins can change them.
create policy "public read settings" on public.site_settings for select using (true);
create policy "authenticated manage settings" on public.site_settings for all to authenticated using (true) with check (true);
create policy "public read active products" on public.products for select using (active = true or auth.role() = 'authenticated');
create policy "authenticated manage products" on public.products for all to authenticated using (true) with check (true);
create policy "public insert click events" on public.click_events for insert with check (true);
create policy "authenticated read click events" on public.click_events for select to authenticated using (true);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;
