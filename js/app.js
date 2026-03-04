const form = document.getElementById('loginForm')
const gmin = document.getElementById('gmin')
const password = document.getElementById('password')

const gminError = document.getElementById('gminError')
const passwordError = document.getElementById('passwordError')

form.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;

    gminError.textContent = '';
    passwordError.textContent = '';
    gmin.classList.remove('error-input');
    password.classList.remove('error-input');

    if (gmin.value.trim() === '') {
        gminError.textContent = 'Se requiere GMIN';
        gmin.classList.add('error-input');
        isValid = false;
    } else if (gmin.value.length < 9) {
        gminError.textContent = 'GMIN debe tener al menos 9 caracteres';
        gmin.classList.add('error-input');
        isValid = false;
    }

    if (password.value.trim() === "") {
        passwordError.textContent = 'Se requiere password';
        password.classList.add('error-input');
        isValid = false;
    } else if (password.value.length < 8) {
        passwordError.textContent = 'El password debe tener al menos 8 caracteres';
        password.classList.add('error-input');
        isValid = false;
    }

    if (isValid) {
        // Verificar si hay un usuario registrado
        const registeredUser = localStorage.getItem('registeredUser');

        if (registeredUser) {
            const userData = JSON.parse(registeredUser);

            // Verificar credenciales
            if (gmin.value == userData.gmin && password.value === userData.password) {
                alert(`¡Bienvenido ${userData.name}! Has iniciado sesión exitosamente.`);
                // window.location.href = 'dashboard.html';
            } else {
                alert('GMIN o contraseña incorrectos');
            }
        } else {
            alert('No hay usuarios registrados. Por favor registrame primero.')
        }
    }
});

// Pagina registro
function registro() {
    window.location.href = 'registro.html'
}

// Recuperar contraseña
function recuperarContraseña() {
    window.location.href = 'recuperarContraseña.html'
}