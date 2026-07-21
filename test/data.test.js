const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const { db, parseMysqlInsert } = require('../src/db');
const { thaiDate, groupSchedule } = require('../src/helpers');

const rootDir = path.resolve(__dirname, '..');

test('imports all employees and programs from the MySQL dump', () => {
  const sql = fs.readFileSync(path.join(rootDir, 'seed', 'db_schedule.sql'), 'utf8');
  const employees = parseMysqlInsert(sql, 'tb_employees');
  const programs = parseMysqlInsert(sql, 'tb_programs');

  assert.equal(employees.rows.length, 3);
  assert.equal(programs.rows.length, 99);
  assert.equal(programs.rows[87][1], 'เฉลิมพระเกียรติ "น้ำพระไทยในหลวง"');
});

test('SQLite database contains the complete migrated seed data', () => {
  assert.equal(db.prepare('SELECT COUNT(*) AS total FROM employees').get().total, 3);
  assert.equal(db.prepare('SELECT COUNT(*) AS total FROM programs').get().total, 99);
  assert.equal(db.prepare('SELECT COUNT(*) AS total FROM schedule_entries').get().total, 312);
});

test('default administrator can authenticate', () => {
  const admin = db.prepare("SELECT password_hash FROM employees WHERE email = 'admin@example.com'").get();
  assert.equal(bcrypt.compareSync('admin1234', admin.password_hash), true);
});

test('Thai date formatter and broadcast-day ordering are correct', () => {
  assert.equal(thaiDate('2026-07-21'), '21 ก.ค. 2569');
  const grouped = groupSchedule([
    { id: 1, day: 'mon', time_start: '01:00' },
    { id: 2, day: 'mon', time_start: '05:00' },
    { id: 3, day: 'mon', time_start: '24:00' }
  ]);
  assert.deepEqual(grouped.mon.map((entry) => entry.id), [2, 3, 1]);
});
