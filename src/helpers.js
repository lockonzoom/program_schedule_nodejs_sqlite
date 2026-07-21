const thaiMonthsShort = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

const dayLabels = {
  mon: 'จันทร์',
  tue: 'อังคาร',
  wed: 'พุธ',
  thu: 'พฤหัสบดี',
  fri: 'ศุกร์',
  sat: 'เสาร์',
  sun: 'อาทิตย์'
};

const producerLabels = {
  tv5hd: 'ททบ.',
  producer: 'ผู้จัด'
};

const programTypeLabels = {
  renttime: 'เช่าเวลา',
  revenuesharing: 'Revenue Sharing',
  timesharing: 'Time Sharing',
  other: 'อื่น ๆ'
};

const contractLabels = {
  success: 'เสร็จสิ้น',
  inprogress: 'กำลังดำเนินการ',
  debt: 'มีหนี้สิน'
};

const ratingLabels = {
  green: 'Top 10',
  yellow: 'อันดับทั่วไป',
  red: 'Bottom 10'
};

function thaiDate(value) {
  if (!value) return '—';
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value;
  const [, year, month, day] = match;
  return `${Number(day)} ${thaiMonthsShort[Number(month) - 1]} ${Number(year) + 543}`;
}

function timeToSortValue(value) {
  const [hours, minutes] = String(value).split(':').map(Number);
  const normalizedHours = hours < 4 ? hours + 24 : hours;
  return normalizedHours * 60 + minutes;
}

function groupSchedule(entries) {
  const groups = Object.fromEntries(Object.keys(dayLabels).map((day) => [day, []]));
  for (const entry of entries) groups[entry.day]?.push(entry);
  for (const items of Object.values(groups)) {
    items.sort((a, b) => timeToSortValue(a.time_start) - timeToSortValue(b.time_start));
  }
  return groups;
}

module.exports = {
  thaiDate,
  dayLabels,
  producerLabels,
  programTypeLabels,
  contractLabels,
  ratingLabels,
  timeToSortValue,
  groupSchedule
};
