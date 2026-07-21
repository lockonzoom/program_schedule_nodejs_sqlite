(() => {
  const { api, showToast } = window.programScheduleApp;
  const dialog = document.getElementById('programDialog');
  const detailDialog = document.getElementById('programDetailDialog');
  const form = document.getElementById('programForm');
  const formError = document.getElementById('programFormError');
  const search = document.getElementById('programSearch');
  const rows = [...document.querySelectorAll('#programTable tbody tr')];

  function openCreate() {
    form.reset();
    form.elements.id.value = '';
    formError.textContent = '';
    document.getElementById('programDialogTitle').textContent = 'เพิ่มรายการ';
    dialog.showModal();
  }

  async function openEdit(id) {
    try {
      const program = await api(`/api/programs/${id}`);
      form.reset();
      for (const [key, value] of Object.entries(program)) {
        if (form.elements[key]) form.elements[key].value = value ?? '';
      }
      formError.textContent = '';
      document.getElementById('programDialogTitle').textContent = 'แก้ไขรายการ';
      dialog.showModal();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  const labelMaps = {
    producer_type: { tv5hd: 'ททบ.', producer: 'ผู้จัด' },
    program_type: { renttime: 'เช่าเวลา', revenuesharing: 'Revenue Sharing', timesharing: 'Time Sharing', other: 'อื่น ๆ' },
    rating_color: { green: 'Top 10', yellow: 'อันดับทั่วไป', red: 'Bottom 10' },
    contract_status: { success: 'เสร็จสิ้น', inprogress: 'กำลังดำเนินการ', debt: 'มีหนี้สิน' }
  };

  function dateLabel(value) {
    if (!value) return '—';
    const [year, month, day] = value.slice(0, 10).split('-').map(Number);
    return new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium' }).format(new Date(year, month - 1, day));
  }

  function detailItem(label, value, full = false) {
    const div = document.createElement('div');
    if (full) div.className = 'span-2';
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = label;
    dd.textContent = value || '—';
    div.append(dt, dd);
    return div;
  }

  async function openDetail(id) {
    try {
      const program = await api(`/api/programs/${id}`);
      document.getElementById('detailProgramName').textContent = program.program_name;
      const container = document.getElementById('programDetail');
      container.replaceChildren(
        detailItem('ผู้ผลิต', labelMaps.producer_type[program.producer_type]),
        detailItem('บริษัท', program.company_name),
        detailItem('ประเภทใช้เวลา', labelMaps.program_type[program.program_type]),
        detailItem('Rating', labelMaps.rating_color[program.rating_color]),
        detailItem('เริ่มออกอากาศ', dateLabel(program.broadcast_start)),
        detailItem('สิ้นสุด', dateLabel(program.broadcast_end)),
        detailItem('สถานะสัญญา', labelMaps.contract_status[program.contract_status]),
        detailItem('เนื้อหาโดยย่อ', program.summary, true)
      );
      detailDialog.showModal();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  document.querySelector('[data-open-program]')?.addEventListener('click', openCreate);
  document.querySelectorAll('[data-edit-program]').forEach((button) => button.addEventListener('click', () => openEdit(button.dataset.editProgram)));
  document.querySelectorAll('[data-view-program]').forEach((button) => button.addEventListener('click', () => openDetail(button.dataset.viewProgram)));
  document.querySelectorAll('[data-delete-program]').forEach((button) => button.addEventListener('click', async () => {
    if (!window.confirm(`ยืนยันการลบ “${button.dataset.programName}” หรือไม่?\nข้อมูลในผังเดิมจะยังอยู่ แต่จะยกเลิกการเชื่อมกับรายการนี้`)) return;
    try {
      const result = await api(`/api/programs/${button.dataset.deleteProgram}`, { method: 'DELETE' });
      showToast(result.message);
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      showToast(error.message, 'error');
    }
  }));

  search?.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase('th');
    let visible = 0;
    for (const row of rows) {
      const matches = row.dataset.search.includes(query);
      row.hidden = !matches;
      if (matches) visible += 1;
    }
    document.getElementById('visibleCount').textContent = visible;
    document.getElementById('programEmpty').hidden = visible !== 0;
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    formError.textContent = '';
    const payload = Object.fromEntries(new FormData(form).entries());
    const id = payload.id;
    delete payload.id;
    try {
      const result = await api(id ? `/api/programs/${id}` : '/api/programs', {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
      });
      dialog.close();
      showToast(result.message);
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      formError.textContent = error.message;
    }
  });
})();
