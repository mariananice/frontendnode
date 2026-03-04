const form = document.getElementById('registerForm')

const name = document.getElementById('name')
const email = document.getElementById('email')
const gmin = document.getElementById('gmin')
const password = document.getElementById('password')
const confirmPassword = document.getElementById('confirmPassword')

const nameError = document.getElementById('nameError')
const emailError = document.getElementById('emailError')
const gminError = document.getElementById('gminError')
const passwordError = document.getElementById('confirmError')
const confirmError = document.getElementById('confirmError')

form.addEventListener('submit', function (e) {
    e.preventDefault();

    let valid = true;

    //Limpiar errores
    nameError.textContent = '';
    emailError.textContent = '';
    gminError.textContent = '';
    passwordError.textContent = '';
    confirmError.textContent = '';

    name.classList.remove('error-input');
    email.classList.remove('error-input')
    gmin.classList.remove('error-input');
    password.classList.remove('error-input');
    confirmPassword.classList.remove('error-input');

    //document.querySelectorAll('.error').forEach(e => e.textContent = '');

    // Validar nombre
    if (name.value.trim() === "") {
        nameError.textContent = 'Se requiere el nombre completo';
        name.classList.add('error-input');
        isValid = false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === "") {
        emailError.textContent = 'El email es obligatorio';
        email.classList.add('error-input');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        emailError.textContent = 'Email inválido';
        email.classList.add('error-input');
        isValid = false;
    }

    // Validar GMIN
    if(gmin.value.trim() === '') {
        gminError.textContent = 'El GMIN es obligatorio';
        gmin.classList.add('error-input');
        valid = false;
    } else if (gmin.value.length < 9) {
        gminError.textContent = "Mínimo 9 caracteres";
        gmin.classList.add('error-input');
        isValid = false;
    }

    // Validar password
    if (password.value.trim() === '') {
        passwordError.textContent = 'La contraseña es obligatoria';
        password.classList.add('error-input');
        isValid = false;
    } else if (password.value.length < 8) {
        passwordError.textContent = 'Mínimo 8 caracteres';
        password.classList.add('error-input');
        isValid = false;
    }

    // Validar confirmación
    if(confirmPassword.value.trim() == '') {
        confirmError.textContent = 'Las contraseñas no coinciden';
        confirmPassword.classList.add('error-input');
        isValid = false;
    }

    if (valid) {
        // Guardar datos del usuario en localStorage
        const userData = {
            name: name.value.trim(),
            email: email.value.trim(),
            gmin: gmin.value.trim(),
            password: password.value
        };

        // Guardar en localStorage
        localStorage.setItem('registeredUser',  JSON.stringify(userData));

        alert('Registro exitoso. Serás dirigido al login.');

        window.location.href = 'index.html';
    }
});