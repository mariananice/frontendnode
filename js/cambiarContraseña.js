const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const confirmBtn = document.getElementById('confirmBtn');
const message = document.getElementById('message');

confirmBtn.addEventListener('click', function () {
    if (password.value === '' || confirmPassword.value === '') {
        message.textContent = 'Todos los campos son obligatorios.';
        message.style.color = 'red';
        return;
    }

    if (password.value.length < 6) {
        message.textContent = 'La contraseña debe tener al menos 6 caracteres.';
        message.style.color = 'red';
        return;
    }

    if (password.value !== confirmPassword.value) {
        message.textContent = 'Las contraseñas no coinciden.';
        message.style.color = 'red';
        return;
    }

    message.textContent = 'Contraseña actualizada correctamente.';
    message.style.color = 'green';

    password.value = '';
    confirmPassword.value = '';
});