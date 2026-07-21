# Program Schedule — Node.js + SQLite

โปรเจกต์นี้แปลงจาก `program_schedule` เดิมที่ใช้ PHP + MySQL เป็น Node.js + Express + SQLite โดยย้ายข้อมูลเดิมครบทั้ง:

- ผู้ใช้งาน 3 บัญชีจาก MySQL dump
- รายการ 99 รายการจาก MySQL dump
- ผังออกอากาศ 312 ช่วงจาก `tv_schedule.json`

## ความต้องการของระบบ

- Node.js 22.5 ขึ้นไป (ใช้ `node:sqlite` ที่มากับ Node.js)
- npm

## เริ่มใช้งาน

```bash
npm install
cp .env.example .env
npm start
```

เปิด <http://localhost:3000>

บัญชีเริ่มต้น:

- อีเมล: `admin@example.com`
- รหัสผ่าน: `admin1234`

ควรเปลี่ยน `SESSION_SECRET` และ `ADMIN_PASSWORD` ใน `.env` ก่อนรีเซ็ตฐานข้อมูลสำหรับการใช้งานจริง

## คำสั่งที่ใช้บ่อย

```bash
npm run dev       # รันแบบ reload เมื่อแก้ไฟล์
npm test          # ตรวจข้อมูลนำเข้าและฟังก์ชันหลัก
npm run db:reset  # สร้าง SQLite ใหม่จากข้อมูลใน seed/
```

ไฟล์ฐานข้อมูลอยู่ที่ `data/program_schedule.sqlite` และเปลี่ยนตำแหน่งได้ด้วย `DATABASE_PATH`

## ฟังก์ชันที่ย้ายแล้ว

- Login / Logout และ session หมดอายุอัตโนมัติ
- Dashboard สรุปรายการ สัญญา และจำนวนช่วงออกอากาศ
- เพิ่ม ดู แก้ไข ลบ และค้นหารายการ
- ดูผังรายการ 7 วัน เรียงตาม Broadcast Day (04:00–03:59)
- เพิ่มรายการลงหลายวัน แก้ไข และลบช่วงออกอากาศ
- API ใช้ prepared statements, validation และ CSRF protection

## โครงสร้างสำคัญ

```text
server.js             Express server และ routes
src/db.js             SQLite schema และตัวนำเข้าข้อมูลเดิม
src/auth.js           ตรวจ session
src/helpers.js        รูปแบบวันที่/ป้ายชื่อภาษาไทย
views/                หน้า EJS
public/               CSS และ JavaScript ฝั่งหน้าเว็บ
seed/                 MySQL dump และ JSON ต้นฉบับสำหรับสร้างฐานข้อมูล
data/                  ไฟล์ SQLite ขณะรัน
```

หมายเหตุ: เนื่องจากไม่ทราบรหัสผ่านเดิมจากค่า hash ใน MySQL ระบบจะตั้งรหัสผ่านบัญชี `admin@example.com` ใหม่จาก `ADMIN_PASSWORD` เฉพาะตอนสร้างฐานข้อมูลครั้งแรกหรือสั่ง `npm run db:reset`
