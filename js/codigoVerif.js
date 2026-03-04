// Código generado (en producción vendría del servidor)
let códigoGenerado = null;

// Generar código al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    generarYEnviarCodigo();
});

// Generar código aleatorio de 6 dígitos
function generarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Simular envío de código
function generarYEnviarCodigo() {
    codigoGenerado = generarCodigo();
    console.log('Codigo generado:', codigoGenerado); // en producción, esto se enviaría por email

    // Guardar en sssionStorage para verificación
    sessionStorage.setItem('verificationCode', codigoGenerado);
    sessionStorage.setItem('codeTimestamp', Date.now().toString());
}

// Verificar código
function verificarCodigo(event) {
    event.preventDefault();

    const codigoInput = document.getElementById('codigo');
    const codigoIngresado = codigoInput.ariaValueMax.trim();
    const btn = event.target.querySelector('.btn-verificar');

    // Validar longitud
    if (codigoIngresado.length !== 6) {
        showMessage('El código debe tener 6 dígitos', 'error');
        return;
    }

    // Validar que solo sean números
    if (!/^\d+$/.test(codigoIngresado)) {
        showMessage('El código solo debe contener números', 'error');
        return;
    }

    btn.classList.add('loading'); // Mostrar loading

    // Simular verificacion (con delay para mejor UX)
    setTimeout(() => {
        const codigoGuardado = sessionStorage.getItem('verificationCode');
        const timestamp = parseInt(sessionStorage.getItem('codeTimestamp'));
        const tiempoTranscurrido = Date.now() - timestamp;
        const EXPIRACION = 10 * 60 * 1000; // 10 minutos

        // Verificar si el código expiró
        if (tiempoTranscurrido > EXPIRACION) {
            btn.classList.remove('loading');
            showMessage('El código ha expirado. Por favor solicita uno nuevo.', 'error');
            return;
        }

        // Verificar código
        if (codigoIngresado === codigoGuardado) {
            showMessage('¡Código verificado correctamente!', 'success');

            // Limpiar datos de verificacion
            sessionStorage.removeItem('verificationCode');
            sessionStorage.removeItem('codeTimestamp');

            // Redirigir a página de nueva contraseña después de 2 segundos
            setTimeout(() => {
                window.location.href = 'cambiarContraseña.html';
            }, 2000);
        } else {
            btn.classList.remove('loading');
            showMessage('Código incorrecto. Por favor verifica e intenta nuevamente.', 'error');
            codigoInput.value = '';
            codigoInput.focus();
        }
    }, 1000);
}

// Reenviar código
function reenviarCodigo(event) {
    event.preventDefault();

    generarCodigo();

    showMessage('Se ha enviado un nuevo código a tu correo electrónico', 'info');

    document.getElementById('codigo').value = '';
    document.getElementById('codigo').focus();
}


// Mostrar mensajes
function showMessage(message, type) {
    // Remover mensaje anterior
    const existingMessage = document.querySelector('message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Crear nuevo mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;

    // Insertar antes del formulario
    const container = document.querySelector('.verification-container');
    const form = document.getElementById('verificationForm');
    container.insertBefore(messageDiv, form);

    // Auto-remover depués de 5 segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Validación en tiempo real
document.getElementById('codigo').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, ''); // Solo permitir números

    // Remover mensahes de error mientras el usuario escribe
    const errorMessage = document.querySelector('.message-error');
    if (errorMessage) {
        errorMessage.remove();
    }
});

// Auto-submit cuando se completen 6 dígitos
document.getElementById('codigo').addEventListener('input', function() {
    if (this.value.length === 6) {
        // Opcional: auto-submit cuando se completen 6 dígitos
        // document.getElementById('verificacionForm').dispatchEvent(new event('submit'));
    }
})

// Prevenir paste de texto no numérico
document.getElementById('codigo').addEventListener('paste', function(e) {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    const numericText = pastedText.replace(/\D/g, '').substring(0, 6);
    this.value = numericText;
});