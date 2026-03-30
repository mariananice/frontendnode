const BASE_URL = 'http://localhost:4000';

const form = document.getElementById('loginForm')
const gmin = document.getElementById('gmin')
const password = document.getElementById('password')

const gminError = document.getElementById('gminError')
const passwordError = document.getElementById('passwordError')

form.addEventListener('submit', handleSubmit);
    
async function handleSubmit(e) {
    e.preventDefault();

    let isValid = true;

    gminError.textContent = '';
    passwordError.textContent = '';

    gmin.classList.remove('error-input');
    password.classList.remove('error-input');

    // Validación de GMIN
    if (gmin.value.trim() === '') {
        gminError.textContent = 'Se requiere GMIN';
        gmin.classList.add('error-input');
        isValid = false;
    } else if (gmin.value.length < 9) {
        gminError.textContent = 'GMIN debe tener al menos 9 caracteres';
        gmin.classList.add('error-input');
        isValid = false;
    }

    // Validación de password
    if (password.value.trim() === "") {
        passwordError.textContent = 'Se requiere password';
        password.classList.add('error-input');
        isValid = false;
    } else if (password.value.length < 8) {
        passwordError.textContent = 'El password debe tener al menos 8 caracteres';
        password.classList.add('error-input');
        isValid = false;
    }

    if (!isValid) return;

    try {
        const res = await fetch(`${BASE_URL}/api/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                GMIN: gmin.value.trim(),
                password: password.value.trim(),
            }),
        });

        if (!res.ok) {
            let msg = 'GMIN o contraseña incorrectos';
            try {
                const dataError = await res.json();
                if (dataError.message) msg = dataError.message;
            } catch (_) {}
            passwordError.textContent = msg;
            password.classList.add('error-input');
            return;
        }

        const data = await res.json();

        // Si tu backend devuelve token / usuario, puedes guardarki
        if (data.token) {
            localStorage.setItem('token', data.token);
        }

        // Redirección al dashboard (relativo a index.html)
        window.location.href = './pages/dashboard.html';
    } catch (err) {
        console.error(err);
        passwordError.textContent = 'Error de conexión con el servidor';
        password.classList.add('error-input');
    }
};