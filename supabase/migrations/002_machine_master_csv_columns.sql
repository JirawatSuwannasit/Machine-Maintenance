-- Align existing machine master data with Machine_List.csv.
-- Fresh databases created from 001 already have this shape.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'machines' and column_name = 'machine_code'
  ) then
    alter table machine_status_logs drop constraint if exists machine_status_logs_machine_id_fkey;
    alter table breakdown_records drop constraint if exists breakdown_records_machine_id_fkey;
    alter table maintenance_logs drop constraint if exists maintenance_logs_machine_id_fkey;
    alter table spare_part_replacement_records drop constraint if exists spare_part_replacement_records_machine_id_fkey;
    alter table preventive_maintenance_plans drop constraint if exists preventive_maintenance_plans_machine_id_fkey;
    alter table preventive_maintenance_records drop constraint if exists preventive_maintenance_records_machine_id_fkey;

    alter table machine_status_logs alter column machine_id type text using machine_id::text;
    alter table breakdown_records alter column machine_id type text using machine_id::text;
    alter table maintenance_logs alter column machine_id type text using machine_id::text;
    alter table spare_part_replacement_records alter column machine_id type text using machine_id::text;
    alter table preventive_maintenance_plans alter column machine_id type text using machine_id::text;
    alter table preventive_maintenance_records alter column machine_id type text using machine_id::text;

    alter table machines drop constraint if exists machines_pkey;
    alter table machines rename column machine_code to machine_id;
    alter table machines rename column name to machine_name;
    alter table machines rename column operating_range to range;
    alter table machines drop column if exists id;
    alter table machines add primary key (machine_id);

    alter table machine_status_logs add constraint machine_status_logs_machine_id_fkey foreign key (machine_id) references machines(machine_id) on delete cascade;
    alter table breakdown_records add constraint breakdown_records_machine_id_fkey foreign key (machine_id) references machines(machine_id) on delete cascade;
    alter table maintenance_logs add constraint maintenance_logs_machine_id_fkey foreign key (machine_id) references machines(machine_id) on delete cascade;
    alter table spare_part_replacement_records add constraint spare_part_replacement_records_machine_id_fkey foreign key (machine_id) references machines(machine_id) on delete cascade;
    alter table preventive_maintenance_plans add constraint preventive_maintenance_plans_machine_id_fkey foreign key (machine_id) references machines(machine_id) on delete cascade;
    alter table preventive_maintenance_records add constraint preventive_maintenance_records_machine_id_fkey foreign key (machine_id) references machines(machine_id) on delete cascade;
  end if;
end $$;
