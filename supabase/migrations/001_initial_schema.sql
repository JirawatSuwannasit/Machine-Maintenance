create extension if not exists "pgcrypto";

create type machine_status as enum ('Active','Inactive','Maintenance','Down');
create type defect_severity as enum ('Low','Medium','High','Critical');
create type defect_status as enum ('Pending','Resolved','Closed');
create type maintenance_action as enum ('Repair','Part Replacement','PM','Inspection');

create table departments (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz not null default now()
);

create table areas (
  id uuid primary key default gen_random_uuid(),
  department_id uuid references departments(id) on delete set null,
  name text not null,
  unique(department_id, name)
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'viewer' check (role in ('admin','technician','viewer')),
  created_at timestamptz not null default now()
);

create table machines (
  machine_id text primary key,
  scope text,
  machine_name text not null,
  manufacturer text,
  model text,
  serial_number text,
  range text,
  operation_date date,
  status machine_status not null default 'Active',
  department_id uuid references departments(id),
  area_id uuid references areas(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table machine_status_logs (
  id uuid primary key default gen_random_uuid(),
  machine_id text not null references machines(machine_id) on delete cascade,
  old_status machine_status,
  new_status machine_status not null,
  reason text,
  changed_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table spare_parts (
  id uuid primary key default gen_random_uuid(),
  part_code text unique not null,
  name text not null,
  lifetime_months int not null check (lifetime_months > 0),
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create sequence defect_code_seq start 1;
create table breakdown_records (
  id uuid primary key default gen_random_uuid(),
  defect_code text unique not null default ('DF-' || lpad(nextval('defect_code_seq')::text, 4, '0')),
  machine_id text not null references machines(machine_id) on delete cascade,
  date_found date not null,
  symptom text not null,
  severity defect_severity not null,
  reported_by text not null,
  status defect_status not null default 'Pending',
  root_cause text,
  corrective_action text,
  resolved_by text,
  resolved_at timestamptz,
  downtime_minutes int check (downtime_minutes is null or downtime_minutes >= 0),
  linked_maintenance_id uuid,
  created_at timestamptz not null default now()
);

create table maintenance_logs (
  id uuid primary key default gen_random_uuid(),
  machine_id text not null references machines(machine_id) on delete cascade,
  action_type maintenance_action not null,
  spare_part_id uuid references spare_parts(id),
  linked_breakdown_id uuid references breakdown_records(id),
  maintenance_date date not null,
  details text,
  root_cause text,
  corrective_action text,
  operator_name text not null,
  created_at timestamptz not null default now(),
  constraint part_required_for_replacement check (action_type <> 'Part Replacement' or spare_part_id is not null)
);

alter table breakdown_records add constraint breakdown_linked_maintenance_fk foreign key (linked_maintenance_id) references maintenance_logs(id) on delete set null;

create table spare_part_replacement_records (
  id uuid primary key default gen_random_uuid(),
  machine_id text not null references machines(machine_id) on delete cascade,
  spare_part_id uuid not null references spare_parts(id),
  replacement_date date not null,
  next_due_date date,
  operator_name text not null,
  notes text,
  created_at timestamptz not null default now(),
  unique(machine_id, spare_part_id, replacement_date)
);

create table preventive_maintenance_plans (
  id uuid primary key default gen_random_uuid(),
  machine_id text not null references machines(machine_id) on delete cascade,
  name text not null,
  frequency_days int not null check (frequency_days > 0),
  checklist text,
  next_due_date date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table preventive_maintenance_records (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references preventive_maintenance_plans(id) on delete set null,
  machine_id text not null references machines(machine_id) on delete cascade,
  performed_date date not null,
  completed_by text not null,
  result text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

create table settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create index machines_status_idx on machines(status);
create index breakdown_records_machine_status_idx on breakdown_records(machine_id, status, severity);
create index maintenance_logs_machine_date_idx on maintenance_logs(machine_id, maintenance_date desc);
create index replacement_records_due_idx on spare_part_replacement_records(machine_id, next_due_date);
create index pm_plans_due_idx on preventive_maintenance_plans(machine_id, next_due_date) where is_active;
create index pm_records_machine_date_idx on preventive_maintenance_records(machine_id, performed_date desc);

alter table departments enable row level security;
alter table areas enable row level security;
alter table profiles enable row level security;
alter table machines enable row level security;
alter table machine_status_logs enable row level security;
alter table spare_parts enable row level security;
alter table breakdown_records enable row level security;
alter table maintenance_logs enable row level security;
alter table spare_part_replacement_records enable row level security;
alter table preventive_maintenance_plans enable row level security;
alter table preventive_maintenance_records enable row level security;
alter table audit_logs enable row level security;
alter table settings enable row level security;

create policy "internal read departments" on departments for select to authenticated using (true);
create policy "internal read areas" on areas for select to authenticated using (true);
create policy "own profile read" on profiles for select to authenticated using (auth.uid() = id);
create policy "internal read machines" on machines for select to authenticated using (true);
create policy "internal read status logs" on machine_status_logs for select to authenticated using (true);
create policy "internal read spare parts" on spare_parts for select to authenticated using (true);
create policy "internal read breakdowns" on breakdown_records for select to authenticated using (true);
create policy "internal read maintenance logs" on maintenance_logs for select to authenticated using (true);
create policy "internal read replacements" on spare_part_replacement_records for select to authenticated using (true);
create policy "internal read pm plans" on preventive_maintenance_plans for select to authenticated using (true);
create policy "internal read pm records" on preventive_maintenance_records for select to authenticated using (true);
create policy "internal read settings" on settings for select to authenticated using (true);

create policy "technician write machines" on machines for all to authenticated using (exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','technician'))) with check (exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','technician')));
create policy "technician write parts" on spare_parts for all to authenticated using (exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','technician'))) with check (exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','technician')));
create policy "technician write breakdowns" on breakdown_records for all to authenticated using (exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','technician'))) with check (exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','technician')));
create policy "technician write maintenance" on maintenance_logs for all to authenticated using (exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','technician'))) with check (exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','technician')));
create policy "technician write replacements" on spare_part_replacement_records for all to authenticated using (exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','technician'))) with check (exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','technician')));
create policy "technician write pm plans" on preventive_maintenance_plans for all to authenticated using (exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','technician'))) with check (exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','technician')));
create policy "technician write pm records" on preventive_maintenance_records for all to authenticated using (exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','technician'))) with check (exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','technician')));
