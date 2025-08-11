const validarForm = document.getElementById('form-validar');
const loginSection = document.getElementById('login-section');
const cambiarSection = document.getElementById('cambiar-section');
const cambiarForm = document.getElementById('form-cambiar');
const cambiarBtn = document.getElementById('cambiarBtn');
const resetForm = document.getElementById('form-reset');
const criteriosDiv = document.getElementById('criterios');
const loader = document.getElementById('loader');
const toast = document.getElementById('toast');

const nuevaPassInput = document.getElementById('nuevaPassword');
const confirmPassInput = document.getElementById('confirmPassword');
const sugerirBtn = document.getElementById('sugerirBtn');
const sugerenciaDiv = document.getElementById('sugerencia');
const sugeridaTexto = document.getElementById('sugeridaTexto');
const usarSugeridaBtn = document.getElementById('usarSugerida');
const copiarSugeridaBtn = document.getElementById('copiarSugerida');

const params = window.location.pathname.split('/');
const hash = params[params.length - 1];

console.log('Hash:', hash);

let usuarioValidado = '';

function showLoader() {
  loader.classList.remove('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

if (validarForm) {
  validarForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    showLoader();

    try {
      const res = await fetch('/hash/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
      });

      const data = await res.json();
      hideLoader();

      showToast(data.message);

      if (res.ok) {
        usuarioValidado = usuario;
        loginSection.classList.add('hidden');
        cambiarSection.classList.remove('hidden');
      }
    } catch (err) {
      hideLoader();
      showToast('Error de conexión');
    }
  });
}

function validarCamposPassword() {
  const pass = nuevaPassInput.value;
  const confirm = confirmPassInput.value;

  const longitud = pass.length >= 12;
  const mayuscula = /[A-Z]/.test(pass);
  const minuscula = /[a-z]/.test(pass);
  const numero = /\d/.test(pass);
  const especial = /[^A-Za-z0-9]/.test(pass);
  const coincide = pass === confirm && pass.length > 0;

  const cumpleTodo = longitud && mayuscula && minuscula && numero && especial;

  criteriosDiv.innerHTML = `
    <ul class="space-y-1">
      <li class="${longitud ? 'text-green-500' : 'text-red-500'}">${longitud ? '✅' : '❌'} Mínimo 12 caracteres</li>
      <li class="${mayuscula ? 'text-green-500' : 'text-red-500'}">${mayuscula ? '✅' : '❌'} Contiene mayúsculas</li>
      <li class="${minuscula ? 'text-green-500' : 'text-red-500'}">${minuscula ? '✅' : '❌'} Contiene minúsculas</li>
      <li class="${numero ? 'text-green-500' : 'text-red-500'}">${numero ? '✅' : '❌'} Contiene números</li>
      <li class="${especial ? 'text-green-500' : 'text-red-500'}">${especial ? '✅' : '❌'} Contiene caracteres especiales</li>
      <li class="${coincide ? 'text-green-500' : 'text-red-500'}">${coincide ? '✅' : '❌'} Coinciden las contraseñas</li>
    </ul>
  `;

  cambiarBtn.disabled = !(cumpleTodo && coincide);
}

if (nuevaPassInput && confirmPassInput) {
  nuevaPassInput.addEventListener('input', validarCamposPassword);
  confirmPassInput.addEventListener('input', validarCamposPassword);
}

if (cambiarForm) {
  cambiarForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nuevaPassword = nuevaPassInput.value;
    showLoader();

    try {
      const res = await fetch('/hash/cambiar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: usuarioValidado, nuevaPassword })
      });

      const data = await res.json();
      hideLoader();
      showToast(data.message);
      usuarioValidado = '';
      cambiarSection.classList.add('hidden');
      loginSection.classList.remove('hidden');
    } catch (err) {
      hideLoader();
      showToast('Error al cambiar contraseña');
    }
  });
}

if (sugerirBtn) {
  sugerirBtn.addEventListener('click', async () => {
    showLoader();
    try {
      const res = await fetch('/hash/sugerir');
      const data = await res.json();
      hideLoader();

      sugeridaTexto.textContent = data.password;
      sugerenciaDiv.classList.remove('hidden');
    } catch (err) {
      hideLoader();
      showToast('Error al generar contraseña');
    }
  });
}

if (usarSugeridaBtn) {
  usarSugeridaBtn.addEventListener('click', () => {
    nuevaPassInput.value = sugeridaTexto.textContent;
    confirmPassInput.value = sugeridaTexto.textContent;
    validarCamposPassword();
  });
}

if (copiarSugeridaBtn) {
  copiarSugeridaBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(sugeridaTexto.textContent);
      showToast('Contraseña copiada al portapapeles');
    } catch (err) {
      showToast('No se pudo copiar');
    }
  });
}

if (resetForm) {
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/hash/chpsw/${hash}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevaPassword: nuevaPassInput.value })
      });

      const data = await res.json();
      showToast(data.message);
      if (res.ok) {
        resetForm.reset();
        criteriosDiv.innerHTML = '';
      }
    } catch {
      showToast('Error al cambiar la contraseña');
    }
  });
}
