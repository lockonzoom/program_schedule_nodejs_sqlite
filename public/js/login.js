(() => {
  const toggle = document.getElementById('togglePassword');
  const password = document.getElementById('password');
  toggle?.addEventListener('click', () => {
    const showing = password.type === 'text';
    password.type = showing ? 'password' : 'text';
    toggle.textContent = showing ? 'แสดง' : 'ซ่อน';
    toggle.setAttribute('aria-label', showing ? 'แสดงรหัสผ่าน' : 'ซ่อนรหัสผ่าน');
  });
})();
