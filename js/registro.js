const form = document.getElementById('registerForm')

const name = document.getElementById('name')
const email = document.getElementById('email')
const GMIN = document.getElementById('GMIN')
const password = document.getElementById('password')
const confirmPassword = document.getElementById('confirmPassword')

const nameError = document.getElementById('nameError')
const emailError = document.getElementById('emailError')
const GMINError = document.getElementById('GMINError')
const passwordError = document.getElementById('passwordError')
const confirmPasswordError = document.getElementById('confirmPasswordError')

// URL backend real
const API_URL = 'http://localhost:4000/api/usuarios/create';

form.addEventListener('submit', function (e) {
    e.preventDefault();

    let valid = true;

    //Limpiar errores
    nameError.textContent = '';
    emailError.textContent = '';
    GMINError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';

    name.classList.remove('error-input');
    email.classList.remove('error-input')
    GMIN.classList.remove('error-input');
    password.classList.remove('error-input');
    confirmPassword.classList.remove('error-input');

    //document.querySelectorAll('.error').forEach(e => e.textContent = '');

    // Validar nombre
    if (name.value.trim() === "") {
        nameError.textContent = 'Se requiere el nombre completo';
        name.classList.add('error-input');
        valid = false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === "") {
        emailError.textContent = 'El email es obligatorio';
        email.classList.add('error-input');
        valid = false;
    } else if (!emailRegex.test(email.value)) {
        emailError.textContent = 'Email inválido';
        email.classList.add('error-input');
        valid = false;
    }

    // Validar GMIN
    if(GMIN.value.trim() === '') {
        GMINError.textContent = 'El GMIN es obligatorio';
        GMIN.classList.add('error-input');
        valid = false;
    } else if (GMIN.value.length < 9) {
        GMINError.textContent = "Mínimo 9 caracteres";
        GMIN.classList.add('error-input');
        valid = false;
    }

    // Validar password
    if (password.value.trim() === '') {
        passwordError.textContent = 'La contraseña es obligatoria';
        password.classList.add('error-input');
        valid = false;
    } else if (password.value.length < 8) {
        passwordError.textContent = 'Mínimo 8 caracteres';
        password.classList.add('error-input');
        valid = false;
    }

    // Validar confirmación
    if(confirmPassword.value.trim() == '') {
        confirmPasswordError.textContent = 'Las contraseñas no coinciden';
        confirmPassword.classList.add('error-input');
        valid = false;
    } else if (confirmPassword.value !== password.value) {
        confirmPasswordError.textContent = 'Las contraseñas no coinciden';
        confirmPassword.classList.add('error-input');
        valid = false;
    }

    // Si hay errores, no enviamos nada al backend
    if (!valid) {
        return;
    }

    // Datos a enviar al backend
    const userData = {
        GMIN: GMIN.value.trim(),
        nombre: name.value.trim(),
        email: email.value.trim(),
        password: password.value,
        confirmPassword: confirmPassword.value
    };

    // Llamada al backend para guardar en la db
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al registrar usuario');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Usuario creado en DB:', data);

            alert('Registro exitoso. Serás dirigida al login.');
            window.location.href = '../index.html';
        })
        .catch((error) => {
            console.error('Error en registro:', error);
            alert('Hubo un error al registrar el usuario. Intenta de nuevo.');
        });
});