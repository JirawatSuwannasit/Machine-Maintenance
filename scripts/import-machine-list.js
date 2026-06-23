#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { createClient } = require('@supabase/supabase-js');

const CSV_PATH = path.join(process.cwd(), 'Machine_List.csv');
const SUPABASE_SCHEMA = 'public';
const MACHINES_TABLE = 'machines';
const REQUIRED_COLUMNS = ['Machine_ID', 'SCOPE', 'Machine_Name', 'Manufacturer', 'Model', 'SN', 'Range'];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(value);
      value = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(value);
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      value = '';
    } else {
      value += char;
    }
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }

  return rows;
}

function trimToNull(value) {
  const trimmed = String(value ?? '').trim();
  return trimmed === '' ? null : trimmed;
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the environment. In GitHub Actions, configure them as repository secrets.');
  }

  const csv = fs.readFileSync(CSV_PATH, 'utf8').replace(/^\uFEFF/, '');
  const [headerRow, ...dataRows] = parseCsv(csv);

  if (!headerRow) {
    throw new Error(`No header row found in ${CSV_PATH}.`);
  }

  const headers = headerRow.map((header) => header.trim().replace(/^\uFEFF/, ''));
  const missingColumns = REQUIRED_COLUMNS.filter((column) => !headers.includes(column));

  if (missingColumns.length > 0) {
    throw new Error(`Missing CSV columns: ${missingColumns.join(', ')}`);
  }

  const skippedRows = [];
  const machines = dataRows.map((row, index) => {
    const record = Object.fromEntries(headers.map((header, columnIndex) => [header, row[columnIndex] ?? '']));
    const machineCode = trimToNull(record.Machine_ID);
    const name = trimToNull(record.Machine_Name);

    if (!machineCode || !name) {
      skippedRows.push({ row: index + 2, reason: 'Machine_ID and Machine_Name are required.' });
      return null;
    }

    return {
      machine_code: machineCode,
      scope: trimToNull(record.SCOPE),
      name,
      manufacturer: trimToNull(record.Manufacturer),
      model: trimToNull(record.Model),
      serial_number: trimToNull(record.SN),
      range: trimToNull(record.Range),
    };
  }).filter(Boolean);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .schema(SUPABASE_SCHEMA)
    .from(MACHINES_TABLE)
    .upsert(machines, { onConflict: 'machine_code' })
    .select('machine_code');

  const summary = {
    rowsRead: dataRows.length,
    rowsInsertedOrUpdated: data?.length ?? machines.length,
    skippedRows,
    errors: error ? [error.message] : [],
  };

  if (error) {
    console.error(JSON.stringify(summary, null, 2));
    throw error;
  }

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
