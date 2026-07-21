const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcryptjs');

const rootDir = path.resolve(__dirname, '..');
const configuredPath = process.env.DATABASE_PATH || './data/program_schedule.sqlite';
const databasePath = path.isAbsolute(configuredPath)
  ? configuredPath
  : path.resolve(rootDir, configuredPath);

fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new DatabaseSync(databasePath);
db.exec(`
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;
  PRAGMA busy_timeout = 5000;
`);

function createSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      full_name TEXT NOT NULL,
      position TEXT,
      department TEXT,
      phone TEXT,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      program_name TEXT NOT NULL,
      producer_type TEXT,
      company_name TEXT,
      program_type TEXT,
      broadcast_start TEXT,
      broadcast_end TEXT,
      summary TEXT,
      rating_color TEXT,
      contract_status TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS schedule_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      program_id INTEGER,
      program_name TEXT NOT NULL,
      day TEXT NOT NULL CHECK (day IN ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun')),
      time_start TEXT NOT NULL,
      time_end TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'database',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL ON UPDATE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_schedule_day ON schedule_entries(day);
    CREATE INDEX IF NOT EXISTS idx_schedule_program_id ON schedule_entries(program_id);
    CREATE INDEX IF NOT EXISTS idx_program_name ON programs(program_name COLLATE NOCASE);
  `);
}

function parseMysqlInsert(sql, tableName) {
  const marker = `INSERT INTO \`${tableName}\``;
  const start = sql.indexOf(marker);
  if (start === -1) return { columns: [], rows: [] };

  const columnsStart = sql.indexOf('(', start);
  const columnsEnd = sql.indexOf(')', columnsStart);
  const columns = sql
    .slice(columnsStart + 1, columnsEnd)
    .split(',')
    .map((column) => column.trim().replaceAll('`', ''));

  const valuesKeyword = sql.indexOf('VALUES', columnsEnd);
  let end = valuesKeyword + 6;
  let inQuote = false;
  let escaped = false;
  for (; end < sql.length; end += 1) {
    const char = sql[end];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\' && inQuote) {
      escaped = true;
      continue;
    }
    if (char === "'") inQuote = !inQuote;
    if (char === ';' && !inQuote) break;
  }

  return { columns, rows: parseMysqlTuples(sql.slice(valuesKeyword + 6, end)) };
}

function parseMysqlTuples(source) {
  const rows = [];
  let row = null;
  let token = '';
  let quoted = false;
  let tokenWasQuoted = false;

  const pushToken = () => {
    const trimmed = token.trim();
    let value = tokenWasQuoted ? token : trimmed;
    if (!tokenWasQuoted && /^NULL$/i.test(trimmed)) value = null;
    if (!tokenWasQuoted && /^-?\d+(?:\.\d+)?$/.test(trimmed)) value = Number(trimmed);
    row.push(value);
    token = '';
    tokenWasQuoted = false;
  };

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (row === null) {
      if (char === '(') row = [];
      continue;
    }

    if (quoted) {
      if (char === '\\') {
        const next = source[index + 1];
        const escapedChars = { n: '\n', r: '\r', t: '\t', '0': '\0' };
        token += escapedChars[next] ?? next;
        index += 1;
      } else if (char === "'" && source[index + 1] === "'") {
        token += "'";
        index += 1;
      } else if (char === "'") {
        quoted = false;
      } else {
        token += char;
      }
      continue;
    }

    if (char === "'") {
      if (token.trim() === '') token = '';
      quoted = true;
      tokenWasQuoted = true;
    } else if (char === ',') {
      pushToken();
    } else if (char === ')') {
      pushToken();
      rows.push(row);
      row = null;
    } else {
      token += char;
    }
  }

  return rows;
}

function seedEmployees(sql) {
  const count = db.prepare('SELECT COUNT(*) AS total FROM employees').get().total;
  if (count > 0) return;

  const parsed = parseMysqlInsert(sql, 'tb_employees');
  const insert = db.prepare(`
    INSERT INTO employees
      (id, username, password_hash, email, full_name, position, department, phone, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const defaultPassword = process.env.ADMIN_PASSWORD || 'admin1234';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

  for (const values of parsed.rows) {
    const employee = Object.fromEntries(parsed.columns.map((column, index) => [column, values[index]]));
    const isAdmin = Number(employee.em_id) === 1;
    insert.run(
      employee.em_id,
      employee.em_username,
      isAdmin ? bcrypt.hashSync(defaultPassword, 12) : employee.em_password_hash,
      isAdmin ? adminEmail : employee.em_email,
      employee.em_full_name,
      employee.em_position,
      employee.em_department,
      employee.em_phone,
      employee.em_status,
      employee.created_at
    );
  }
}

function seedPrograms(sql) {
  const count = db.prepare('SELECT COUNT(*) AS total FROM programs').get().total;
  if (count > 0) return;

  const parsed = parseMysqlInsert(sql, 'tb_programs');
  const insert = db.prepare(`
    INSERT INTO programs
      (id, program_name, producer_type, company_name, program_type, broadcast_start,
       broadcast_end, summary, rating_color, contract_status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const values of parsed.rows) {
    const program = Object.fromEntries(parsed.columns.map((column, index) => [column, values[index]]));
    insert.run(
      program.id,
      program.program_name,
      program.producer_type,
      program.company_name,
      program.program_type,
      program.broadcast_start,
      program.broadcast_end,
      program.summary,
      program.rating_color,
      program.contract_status,
      program.created_at
    );
  }
}

function seedSchedule() {
  const count = db.prepare('SELECT COUNT(*) AS total FROM schedule_entries').get().total;
  if (count > 0) return;

  const jsonPath = path.join(rootDir, 'seed', 'tv_schedule.json');
  const schedule = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const dayMapping = {
    monday: 'mon',
    tuesday: 'tue',
    wednesday: 'wed',
    thursday: 'thu',
    friday: 'fri',
    saturday: 'sat',
    sunday: 'sun'
  };
  const programs = db.prepare('SELECT id, program_name FROM programs').all();
  const programByName = new Map(programs.map((program) => [program.program_name.trim().toLocaleLowerCase('th'), program.id]));
  const insert = db.prepare(`
    INSERT INTO schedule_entries
      (program_id, program_name, day, time_start, time_end, source)
    VALUES (?, ?, ?, ?, ?, 'json-import')
  `);

  for (const [sourceDay, entries] of Object.entries(schedule)) {
    const day = dayMapping[sourceDay];
    if (!day || !Array.isArray(entries)) continue;
    for (const entry of entries) {
      const key = entry.program.trim().toLocaleLowerCase('th');
      insert.run(programByName.get(key) || null, entry.program, day, entry.time_start, entry.time_end);
    }
  }
}

function initializeDatabase() {
  createSchema();
  const seedSqlPath = path.join(rootDir, 'seed', 'db_schedule.sql');
  const seedSql = fs.readFileSync(seedSqlPath, 'utf8');

  db.exec('BEGIN');
  try {
    seedEmployees(seedSql);
    seedPrograms(seedSql);
    seedSchedule();
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

if (process.env.SKIP_DB_INIT !== '1') initializeDatabase();

module.exports = {
  db,
  databasePath,
  initializeDatabase,
  parseMysqlInsert
};
