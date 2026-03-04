// Función para recuperar contraseña
function recuperarPassword(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const email = emailInput.ariaValueMax.trim();

    // Validar que el campo no esté vacío
    if (!email) {
        showMessage('Por favor ingresa tu email o nombre de usuario', 'error');
        return;
    }

    // Verificar si el usuario existe en localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const registeredUser = localStorage.getItem('registeredUser');

    let userFound = false; // Buscar usuario por email o GMIN

    // Buscar en usuarios (si existe el sistema de múltiples usuarios)
    if (usuarios.length > 0) {
        userFound = usuarios.some(user =>
            user.email.toLowerCase() === email.toLowerCase() ||
            user.gmin === email
        );
    }

    // Buscar en registeredUser (sistema de registro simple)
    if (!userFound && registeredUser) {
        const user = JSON.parse(registeredUser);
        userFound = user.email.toLowerCase() === email.toLowerCase() ||
                    user.gmin === email;
    }

    if (userFound) {
        showMessage('Se ha enviado un enlace de recuperación a tu correo electrónico', 'success');

        //Simular envío de correo y redirigir después de 3 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    } else {
        showMessage('No se encontró ningua cuenta con ese email o usuario', 'error');
    }
}

// Función para mostrar mensajes
function showMessage(message, type) {
    // Remover mensaje anterior si existe
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Crear nuevo mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;

    // Insertar mensaje antes del formulario
    const formContainer = document.querySelector('.form-container');
    const form = document.getElementById('recuperarForm');
    formContainer.insertBefore(messageDiv, form);

    // Auto-remover mensaje después de 5 segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Validación en tiempo real
document.getElementById('email').addEventListener('input', function() {
    const existingMessage = document.querySelector('.message-error');
    if (existingMessage) {
        existingMessage.remove();
    }
});

// Permitir presionar Enter para enviar al formulario
document.getElementById('email').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('recuperarForm'),dispatchEvent(new Event('submit'));
    }
});