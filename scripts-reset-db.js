const fs = require('node:fs');
const path = require('node:path');

const rootDir = __dirname;
const configuredPath = process.env.DATABASE_PATH || './data/program_schedule.sqlite';
const databasePath = path.isAbsolute(configuredPath)
  ? configuredPath
  : path.resolve(rootDir, configuredPath);

for (const suffix of ['', '-shm', '-wal']) {
  const target = `${databasePath}${suffix}`;
  if (fs.existsSync(target)) fs.unlinkSync(target);
}

require('./src/db');
console.log(`สร้างฐานข้อมูลใหม่แล้ว: ${databasePath}`);
