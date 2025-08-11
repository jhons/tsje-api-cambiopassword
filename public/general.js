// Activar dark mode automático según preferencia
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}
function updateLogo() {
  const logo = document.getElementById('logo-img');
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    logo.src = '/hash/logo-dark.png';
  } else {
    logo.src = '/hash/logo.png';
  }
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateLogo);

document.addEventListener('DOMContentLoaded', updateLogo);


function toggleVisibility(fieldId, btn) {
  const field = document.getElementById(fieldId);
  const svg = btn.querySelector('svg');

  if (field.type === 'password') {
    field.type = 'text';
    svg.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.961 9.961 0 013.038-4.362M9.88 9.88a3 3 0 104.24 4.24" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M15 12a3 3 0 01-3 3m0 0a3 3 0 01-3-3m3 3L4.21 4.21m0 0L19.79 19.79" />
    `;
  } else {
    field.type = 'password';
    svg.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    `;
  }
}
