-- Oli Prod'z: kole sa a nan Supabase > SQL Editor > Run
create table if not exists orders(
  id text primary key, created_at timestamptz default now(),
  customer text, phone text, service text, option text, qty int, total int,
  details text, delivery text, pay_method text, tx text, aff_code text,
  status text default 'An atant');
create table if not exists affiliates(
  code text primary key, name text, phone text, clicks int default 0, created_at timestamptz default now());
create table if not exists withdrawals(
  id text primary key, aff_code text references affiliates(code), amount int,
  status text default 'An atant', created_at timestamptz default now());

alter table orders enable row level security;
alter table affiliates enable row level security;
alter table withdrawals enable row level security;

-- Kliyan (anonim) ka sèlman ENSERE, pa li done lòt moun
create policy "kliyan voye kòmand" on orders for insert to anon with check (status = 'An atant');
create policy "moun vin afilye" on affiliates for insert to anon with check (true);
create policy "afilye mande retrè" on withdrawals for insert to anon with check (status = 'An atant');

-- Admin (itilizatè konekte nan Supabase Auth) wè ak modifye tout bagay
create policy "admin orders" on orders for all to authenticated using (true) with check (true);
create policy "admin affiliates" on affiliates for all to authenticated using (true) with check (true);
create policy "admin withdrawals" on withdrawals for all to authenticated using (true) with check (true);

-- Afilye wè sèlman estatistik pa l ak kòd li
create or replace function affiliate_stats(p_code text)
returns json language sql security definer set search_path = public as $$
  select json_build_object(
    'name', (select name from affiliates where code = p_code),
    'clicks', (select clicks from affiliates where code = p_code),
    'orders', coalesce((select json_agg(json_build_object('id',id,'service',service,'total',total,'status',status))
                        from orders where aff_code = p_code), '[]'::json));
$$;
grant execute on function affiliate_stats(text) to anon;

-- ===== MIZ A JOU (kouri sa a tou) =====
create or replace function affiliate_stats(p_code text)
returns json language sql security definer set search_path = public as $$
  select json_build_object(
    'name', (select name from affiliates where code = p_code),
    'clicks', (select clicks from affiliates where code = p_code),
    'withdrawn', coalesce((select sum(amount) from withdrawals where aff_code = p_code and status <> 'Anile'), 0),
    'orders', coalesce((select json_agg(json_build_object('id',id,'service',service,'total',total,'status',status))
                        from orders where aff_code = p_code), '[]'::json));
$$;
grant execute on function affiliate_stats(text) to anon;

create or replace function add_click(p_code text)
returns void language sql security definer set search_path = public as $$
  update affiliates set clicks = clicks + 1 where code = p_code;
$$;
grant execute on function add_click(text) to anon;
