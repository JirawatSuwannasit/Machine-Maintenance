insert into machines (machine_code, scope, name, manufacturer, model, serial_number, operating_range, operation_date, status) values
('TE1','REL','LOW TEMPERATURE CHAMBER','ESPEC','PU-1ST','13006110','-40°C – +100°C','1998-04-30','Active'),
('TE2','REL','HIGH TEMPERATURE CHAMBER','ESPEC','PH-201','212004863','+20°C – +200°C','1998-04-30','Maintenance'),
('TE3','REL','HIGH TEMPERATURE CHAMBER','ESPEC','PHH-102M','213007740','+20°C – +300°C','2016-04-01','Active');
insert into spare_parts (part_code, name, lifetime_months, description) values ('SP-01','Chiller Pump Seal',12,'Imported from prototype Spare_Parts_Master lifetime years.');
insert into breakdown_records (defect_code, machine_id, date_found, symptom, severity, reported_by, status, downtime_minutes) select 'DF-0001', id, '2026-06-10', 'Temperature recovery is slow after door opening.', 'High', 'QA Operator', 'Pending', 180 from machines where machine_code='TE2';
insert into spare_part_replacement_records (machine_id, spare_part_id, replacement_date, next_due_date, operator_name, notes) select m.id, p.id, '2025-05-01', '2026-05-01', 'Maintenance A', 'Demo replacement schedule' from machines m cross join spare_parts p where m.machine_code='TE1' and p.part_code='SP-01';
insert into preventive_maintenance_plans (machine_id, name, frequency_days, checklist, next_due_date) select id, 'Monthly chamber inspection', 30, 'Clean filter; verify temperature ramp; inspect seals', '2026-06-30' from machines where machine_code='TE1';
