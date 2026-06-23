insert into machines (machine_id, scope, machine_name, manufacturer, model, serial_number, range, operation_date, status) values
('TE1','REL','LOW TEMPERATURE CHAMBER','ESPEC','PU-1ST','13006110','-40°C – +100°C','1998-04-30','Active'),
('TE2','REL','HIGH TEMPERATURE CHAMBER','ESPEC','PH-201','212004863','+20°C – +200°C','1998-04-30','Maintenance'),
('TE3','REL','HIGH TEMPERATURE CHAMBER','ESPEC','PHH-102M','213007740','+20°C – +300°C','2016-04-01','Active')
on conflict (machine_id) do nothing;

insert into spare_parts (id, part_code, name, lifetime_months, description) values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','SP-01','Chiller Pump Seal',12,'Imported from prototype Spare_Parts_Master Lifetime_Years.'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab','SP-02','Door Gasket',24,'Temperature chamber seal.')
on conflict (id) do nothing;

insert into breakdown_records (id, defect_code, machine_id, date_found, symptom, severity, reported_by, status, downtime_minutes) values
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','DF-0001','TE2','2026-06-10','Temperature recovery is slow after door opening.','High','QA Operator','Pending',180),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc','DF-0002','TE1','2026-05-20','Abnormal chiller pump noise.','Medium','Production','Resolved',90)
on conflict (id) do nothing;

insert into maintenance_logs (id, machine_id, action_type, spare_part_id, linked_breakdown_id, maintenance_date, details, root_cause, corrective_action, operator_name, created_at) values
('ffffffff-ffff-ffff-ffff-ffffffffffff','TE1','Repair','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc','2026-05-21','Pump seal replacement after abnormal noise report.','Worn pump seal','Replaced seal and observed normal operation.','Maintenance A','2026-05-21T09:30:00Z'),
('ffffffff-ffff-ffff-ffff-fffffffffffe','TE1','PM',null,null,'2026-06-01','Monthly chamber inspection completed.',null,null,'Maintenance A','2026-06-01T08:00:00Z')
on conflict (id) do nothing;

update breakdown_records set linked_maintenance_id = 'ffffffff-ffff-ffff-ffff-ffffffffffff', root_cause = 'Worn pump seal', corrective_action = 'Replaced seal and verified ramp test', resolved_by = 'Maintenance A', resolved_at = '2026-05-21T09:30:00Z' where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc';

insert into spare_part_replacement_records (id, machine_id, spare_part_id, replacement_date, next_due_date, operator_name, notes) values
('cccccccc-cccc-cccc-cccc-cccccccccccc','TE1','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','2026-05-21','2027-05-21','Maintenance A','Created from repair log with selected part.'),
('cccccccc-cccc-cccc-cccc-cccccccccccd','TE2','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab','2024-06-01','2026-06-01','Maintenance B','Due soon/overdue demo schedule.')
on conflict (id) do nothing;

insert into preventive_maintenance_plans (id, machine_id, name, frequency_days, checklist, next_due_date) values
('dddddddd-dddd-dddd-dddd-dddddddddddd','TE1','Monthly chamber inspection',30,'Clean filter; verify temperature ramp; inspect seals','2026-06-30'),
('dddddddd-dddd-dddd-dddd-ddddddddddde','TE2','Quarterly calibration readiness check',90,'Verify sensor reading stability and safety interlocks','2026-06-01')
on conflict (id) do nothing;

insert into preventive_maintenance_records (id, plan_id, machine_id, performed_date, completed_by, result, notes) values
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','dddddddd-dddd-dddd-dddd-dddddddddddd','TE1','2026-06-01','Maintenance A','Pass','No abnormal findings.')
on conflict (id) do nothing;
