(() => {
  const { api, showToast } = window.programScheduleApp;
  const dialog = document.getElementById('scheduleDialog');
  const form = document.getElementById('scheduleForm');
  const errorText = document.getElementById('scheduleFormError');
  const multiDay = document.getElementById('multiDayField');
  const singleDay = document.getElementById('singleDayField');
  const importedHint = document.getElementById('importedHint');

  function openCreate() {
    form.reset();
    form.elements.id.value = '';
    form.elements.time_start.value = '09:00';
    form.elements.time_end.value = '10:00';
    multiDay.hidden = false;
    singleDay.hidden = true;
    importedHint.hidden = true;
    errorText.textContent = '';
    document.getElementById('scheduleDialogTitle').textContent = 'เพิ่มรายการลงผัง';
    dialog.showModal();
  }

  function openEdit(button) {
    form.reset();
    form.elements.id.value = button.dataset.editSchedule;
    form.elements.program_id.value = button.dataset.programId;
    form.elements.day.value = button.dataset.day;
    form.elements.time_start.value = button.dataset.start;
    form.elements.time_end.value = button.dataset.end;
    multiDay.hidden = true;
    singleDay.hidden = false;
    importedHint.hidden = Boolean(button.dataset.programId);
    errorText.textContent = '';
    document.getElementById('scheduleDialogTitle').textContent = `แก้ไข: ${button.dataset.name}`;
    dialog.showModal();
  }

  document.querySelector('[data-open-schedule]')?.addEventListener('click', openCreate);
  document.querySelectorAll('[data-edit-schedule]').forEach((button) => button.addEventListener('click', () => openEdit(button)));
  document.querySelectorAll('[data-delete-schedule]').forEach((button) => button.addEventListener('click', async () => {
    if (!window.confirm(`ยืนยันการลบ “${button.dataset.name}” ออกจากผังหรือไม่?`)) return;
    try {
      const result = await api(`/api/schedule/${button.dataset.deleteSchedule}`, { method: 'DELETE' });
      showToast(result.message);
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      showToast(error.message, 'error');
    }
  }));

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorText.textContent = '';
    const data = new FormData(form);
    const id = data.get('id');
    const payload = {
      program_id: data.get('program_id'),
      time_start: data.get('time_start'),
      time_end: data.get('time_end')
    };
    if (id) {
      payload.day = data.get('day');
    } else {
      payload.days = data.getAll('days');
    }

    try {
      const result = await api(id ? `/api/schedule/${id}` : '/api/schedule', {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
      });
      dialog.close();
      showToast(result.message);
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      errorText.textContent = error.message;
    }
  });
})();
