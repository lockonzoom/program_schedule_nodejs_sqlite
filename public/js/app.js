(() => {
  const csrfToken = document.body.dataset.csrfToken || '';
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');

  sidebarToggle?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  document.addEventListener('click', (event) => {
    if (window.innerWidth <= 900 && sidebar?.classList.contains('open') &&
        !sidebar.contains(event.target) && !sidebarToggle?.contains(event.target)) {
      sidebar.classList.remove('open');
    }
    const closeButton = event.target.closest('[data-close-dialog]');
    closeButton?.closest('dialog')?.close();
  });

  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  document.querySelectorAll('[data-bar-percent]').forEach((bar) => {
    requestAnimationFrame(() => {
      bar.style.height = `${Number(bar.dataset.barPercent)}%`;
    });
  });

  let toastTimeout;
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  async function api(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        ...(options.headers || {})
      }
    });
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      if (response.redirected || response.status === 401) window.location.href = '/login';
      throw new Error('การเชื่อมต่อหมดอายุ กรุณาเข้าสู่ระบบใหม่');
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'เกิดข้อผิดพลาด');
    return data;
  }

  window.programScheduleApp = { api, showToast };
})();
