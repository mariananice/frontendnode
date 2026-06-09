const BASE_URL = 'http://localhost:3300';

const form = document.getElementById('loginForm')
const GMIN = document.getElementById('GMIN')
const password = document.getElementById('password')

const GMINError = document.getElementById('GMINError')
const passwordError = document.getElementById('passwordError')

form.addEventListener('submit', handleSubmit);
    
async function handleSubmit(e) {
    e.preventDefault();

    let isValid = true;

    GMINError.textContent = '';
    passwordError.textContent = '';

    GMIN.classList.remove('error-input');
    password.classList.remove('error-input');

    // Validación de GMIN
    if (GMIN.value.trim() === '') {
        GMINError.textContent = 'Se requiere GMIN';
        GMIN.classList.add('error-input');
        isValid = false;
    } else if (GMIN.value.length < 9) {
        GMINError.textContent = 'GMIN debe tener al menos 9 caracteres';
        GMIN.classList.add('error-input');
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
                GMIN: GMIN.value.trim(),
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
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Redirección al dashboard (relativo a index.html)
        window.location.href = './pages/dashboard.html';
    } catch (err) {
        console.error(err);
        passwordError.textContent = 'Error de conexión con el servidor';
        password.classList.add('error-input');
    }
};