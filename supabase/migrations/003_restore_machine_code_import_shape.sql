-- Keep the existing Supabase machines table shape used in production:
-- id is a generated UUID primary key, and Machine_List.csv upserts by machine_code.
create extension if not exists "pgcrypto";

alter table machines add column if not exists id uuid default gen_random_uuid();
alter table machines add column if not exists machine_code text;
alter table machines add column if not exists name text;
alter table machines add column if not exists manufacturer text;
alter table machines add column if not exists model text;
alter table machines add column if not exists serial_number text;
alter table machines add column if not exists range text;
alter table machines add column if not exists operation_date date;
alter table machines add column if not exists status machine_status not null default 'Active';

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'machines' and column_name = 'machine_id'
  ) then
    execute 'update machines set machine_code = machine_id where machine_code is null and machine_id is not null';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'machines' and column_name = 'machine_name'
  ) then
    execute 'update machines set name = machine_name where name is null and machine_name is not null';
  end if;
end $$;

alter table machines alter column id set default gen_random_uuid();
update machines set id = gen_random_uuid() where id is null;

alter table machines drop constraint if exists machines_machine_code_key;
alter table machines add constraint machines_machine_code_key unique (machine_code);
