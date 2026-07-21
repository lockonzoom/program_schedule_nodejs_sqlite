const crypto = require('node:crypto');
const path = require('node:path');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const { db } = require('./src/db');
const { requireAuth } = require('./src/auth');
const helpers = require('./src/helpers');

const app = express();
const port = Number(process.env.PORT || 3000);
const rootDir = __dirname;
const isProduction = process.env.NODE_ENV === 'production';

app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'views'));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:'],
      mediaSrc: ["'self'", 'https://639bc5877c5fe.streamlock.net'],
      styleSrc: ["'self'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", 'https://639bc5877c5fe.streamlock.net']
    }
  }
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '100kb' }));
app.use(express.static(path.join(rootDir, 'public'), { maxAge: isProduction ? '1d' : 0 }));
app.use(session({
  name: 'program_schedule_session',
  secret: process.env.SESSION_SECRET || 'local-development-change-this-secret',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 60 * 60 * 1000
  }
}));

function safeTokenMatch(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string' || left.length !== right.length) return false;
  return crypto.timingSafeEqual(Buffer.from(left), Buffer.from(right));
}

app.use((req, res, next) => {
  if (!req.session.csrfToken) req.session.csrfToken = crypto.randomBytes(24).toString('hex');
  res.locals.csrfToken = req.session.csrfToken;
  res.locals.user = req.session.user || null;
  res.locals.currentPath = req.path;
  res.locals.helpers = helpers;
  next();
});

app.use((req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const submittedToken = req.get('x-csrf-token') || req.body?._csrf;
  if (safeTokenMatch(submittedToken, req.session.csrfToken)) return next();
  if (req.path.startsWith('/api/')) return res.status(403).json({ error: 'โทเคนความปลอดภัยไม่ถูกต้อง กรุณาโหลดหน้าใหม่' });
  return res.status(403).render('error', { title: 'คำขอไม่ถูกต้อง', status: 403, message: 'กรุณาโหลดหน้าใหม่แล้วลองอีกครั้ง' });
});

app.get('/health', (req, res) => {
  const result = db.prepare('SELECT 1 AS ok').get();
  res.json({ status: result.ok === 1 ? 'ok' : 'error' });
});

app.get('/', (req, res) => res.redirect(req.session.user ? '/dashboard' : '/login'));

app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  return res.render('login', { title: 'เข้าสู่ระบบ', error: null, email: req.cookies?.remember_email || '' });
});

app.post('/login', (req, res) => {
  const email = String(req.body.email || '').trim();
  const password = String(req.body.password || '');
  const user = db.prepare(`
    SELECT id, username, password_hash, email, full_name, position, department
    FROM employees
    WHERE email = ? COLLATE NOCASE AND status = 'active'
  `).get(email);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).render('login', {
      title: 'เข้าสู่ระบบ',
      error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      email
    });
  }

  req.session.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.full_name,
    position: user.position,
    department: user.department
  };
  if (req.body.remember === '1') req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
  const destination = req.session.returnTo || '/dashboard';
  delete req.session.returnTo;
  return req.session.save(() => res.redirect(destination));
});

app.post('/logout', requireAuth, (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('program_schedule_session');
    res.redirect('/login');
  });
});

app.get('/dashboard', requireAuth, (req, res) => {
  const stats = {
    programs: db.prepare('SELECT COUNT(*) AS total FROM programs').get().total,
    scheduleEntries: db.prepare('SELECT COUNT(*) AS total FROM schedule_entries').get().total,
    activeContracts: db.prepare("SELECT COUNT(*) AS total FROM programs WHERE contract_status = 'success'").get().total,
    endingSoon: db.prepare(`
      SELECT COUNT(*) AS total FROM programs
      WHERE date(broadcast_end) BETWEEN date('now') AND date('now', '+30 days')
    `).get().total
  };
  const scheduleByDay = Object.fromEntries(Object.keys(helpers.dayLabels).map((day) => [day, 0]));
  for (const row of db.prepare('SELECT day, COUNT(*) AS total FROM schedule_entries GROUP BY day').all()) {
    scheduleByDay[row.day] = row.total;
  }
  const recentPrograms = db.prepare('SELECT * FROM programs ORDER BY id DESC LIMIT 6').all();
  res.render('dashboard', { title: 'ภาพรวมระบบ', stats, scheduleByDay, recentPrograms });
});

app.get('/programs', requireAuth, (req, res) => {
  const programs = db.prepare('SELECT * FROM programs ORDER BY id DESC').all();
  res.render('programs', { title: 'รายการทั้งหมด', programs });
});

app.get('/schedule', requireAuth, (req, res) => {
  const entries = db.prepare(`
    SELECT schedule_entries.*, programs.program_name AS current_program_name
    FROM schedule_entries
    LEFT JOIN programs ON programs.id = schedule_entries.program_id
  `).all().map((entry) => ({
    ...entry,
    program_name: entry.current_program_name || entry.program_name
  }));
  const programs = db.prepare('SELECT id, program_name FROM programs ORDER BY program_name COLLATE NOCASE').all();
  res.render('schedule', {
    title: 'ผังรายการทั้งหมด',
    schedule: helpers.groupSchedule(entries),
    programs
  });
});

function textValue(value, maxLength = 1000) {
  return String(value ?? '').trim().slice(0, maxLength);
}

function optionalEnum(value, allowed) {
  const normalized = textValue(value, 50);
  return allowed.includes(normalized) ? normalized : '';
}

function validIsoDate(value) {
  return value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function programPayload(body) {
  return {
    program_name: textValue(body.program_name, 255),
    producer_type: optionalEnum(body.producer_type, ['tv5hd', 'producer']),
    company_name: textValue(body.company_name, 255),
    program_type: optionalEnum(body.program_type, ['renttime', 'revenuesharing', 'timesharing', 'other']),
    broadcast_start: textValue(body.broadcast_start, 10),
    broadcast_end: textValue(body.broadcast_end, 10),
    summary: textValue(body.summary, 5000),
    rating_color: optionalEnum(body.rating_color, ['green', 'yellow', 'red']),
    contract_status: optionalEnum(body.contract_status, ['success', 'inprogress', 'debt'])
  };
}

function validateProgram(program) {
  if (!program.program_name) return 'กรุณาระบุชื่อรายการ';
  if (!validIsoDate(program.broadcast_start) || !validIsoDate(program.broadcast_end)) return 'รูปแบบวันที่ไม่ถูกต้อง';
  if (program.broadcast_start && program.broadcast_end && program.broadcast_end < program.broadcast_start) {
    return 'วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่ม';
  }
  return null;
}

app.get('/api/programs/:id', requireAuth, (req, res) => {
  const program = db.prepare('SELECT * FROM programs WHERE id = ?').get(Number(req.params.id));
  if (!program) return res.status(404).json({ error: 'ไม่พบรายการ' });
  return res.json(program);
});

app.post('/api/programs', requireAuth, (req, res) => {
  const program = programPayload(req.body);
  const validationError = validateProgram(program);
  if (validationError) return res.status(400).json({ error: validationError });

  const result = db.prepare(`
    INSERT INTO programs
      (program_name, producer_type, company_name, program_type, broadcast_start,
       broadcast_end, summary, rating_color, contract_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(...Object.values(program));
  return res.status(201).json({ id: Number(result.lastInsertRowid), message: 'เพิ่มรายการเรียบร้อยแล้ว' });
});

app.put('/api/programs/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const program = programPayload(req.body);
  const validationError = validateProgram(program);
  if (validationError) return res.status(400).json({ error: validationError });

  const result = db.prepare(`
    UPDATE programs SET
      program_name = ?, producer_type = ?, company_name = ?, program_type = ?,
      broadcast_start = ?, broadcast_end = ?, summary = ?, rating_color = ?, contract_status = ?
    WHERE id = ?
  `).run(...Object.values(program), id);
  if (result.changes === 0) return res.status(404).json({ error: 'ไม่พบรายการ' });
  return res.json({ message: 'แก้ไขรายการเรียบร้อยแล้ว' });
});

app.delete('/api/programs/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM programs WHERE id = ?').run(Number(req.params.id));
  if (result.changes === 0) return res.status(404).json({ error: 'ไม่พบรายการ' });
  return res.json({ message: 'ลบรายการเรียบร้อยแล้ว' });
});

const validDays = Object.keys(helpers.dayLabels);

function validTime(value) {
  if (value === '24:00') return true;
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function timeMinutes(value) {
  if (value === '24:00') return 1440;
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function validateScheduleTimes(start, end) {
  if (!validTime(start) || !validTime(end)) return 'รูปแบบเวลาไม่ถูกต้อง';
  let endMinutes = timeMinutes(end);
  const startMinutes = timeMinutes(start);
  if (endMinutes <= startMinutes) endMinutes += 1440;
  if (endMinutes - startMinutes <= 0 || endMinutes - startMinutes > 1440) return 'ช่วงเวลาไม่ถูกต้อง';
  return null;
}

app.post('/api/schedule', requireAuth, (req, res) => {
  const programId = Number(req.body.program_id);
  const days = Array.isArray(req.body.days) ? [...new Set(req.body.days)] : [req.body.days];
  const timeStart = textValue(req.body.time_start, 5);
  const timeEnd = textValue(req.body.time_end, 5);
  const program = db.prepare('SELECT id, program_name FROM programs WHERE id = ?').get(programId);
  if (!program) return res.status(400).json({ error: 'กรุณาเลือกรายการ' });
  if (days.length === 0 || days.some((day) => !validDays.includes(day))) {
    return res.status(400).json({ error: 'กรุณาเลือกวันอย่างน้อย 1 วัน' });
  }
  const timeError = validateScheduleTimes(timeStart, timeEnd);
  if (timeError) return res.status(400).json({ error: timeError });

  const insert = db.prepare(`
    INSERT INTO schedule_entries (program_id, program_name, day, time_start, time_end, source)
    VALUES (?, ?, ?, ?, ?, 'database')
  `);
  db.exec('BEGIN');
  try {
    for (const day of days) insert.run(program.id, program.program_name, day, timeStart, timeEnd);
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
  return res.status(201).json({ message: `เพิ่มรายการลงผัง ${days.length} วันเรียบร้อยแล้ว` });
});

app.put('/api/schedule/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const programId = Number(req.body.program_id);
  const day = textValue(req.body.day, 3);
  const timeStart = textValue(req.body.time_start, 5);
  const timeEnd = textValue(req.body.time_end, 5);
  const program = db.prepare('SELECT id, program_name FROM programs WHERE id = ?').get(programId);
  if (!program) return res.status(400).json({ error: 'กรุณาเลือกรายการ' });
  if (!validDays.includes(day)) return res.status(400).json({ error: 'วันที่ไม่ถูกต้อง' });
  const timeError = validateScheduleTimes(timeStart, timeEnd);
  if (timeError) return res.status(400).json({ error: timeError });

  const result = db.prepare(`
    UPDATE schedule_entries
    SET program_id = ?, program_name = ?, day = ?, time_start = ?, time_end = ?, source = 'database'
    WHERE id = ?
  `).run(program.id, program.program_name, day, timeStart, timeEnd, id);
  if (result.changes === 0) return res.status(404).json({ error: 'ไม่พบรายการในผัง' });
  return res.json({ message: 'แก้ไขผังรายการเรียบร้อยแล้ว' });
});

app.delete('/api/schedule/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM schedule_entries WHERE id = ?').run(Number(req.params.id));
  if (result.changes === 0) return res.status(404).json({ error: 'ไม่พบรายการในผัง' });
  return res.json({ message: 'ลบรายการออกจากผังเรียบร้อยแล้ว' });
});

app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'ไม่พบ API ที่เรียก' });
  return res.status(404).render('error', { title: 'ไม่พบหน้า', status: 404, message: 'ไม่พบหน้าที่คุณต้องการ' });
});

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  if (req.path.startsWith('/api/')) return res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในระบบ' });
  return res.status(500).render('error', { title: 'ระบบขัดข้อง', status: 500, message: 'เกิดข้อผิดพลาดภายในระบบ' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Program Schedule พร้อมใช้งานที่ http://localhost:${port}`);
  });
}

module.exports = app;
