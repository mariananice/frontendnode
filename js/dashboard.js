// Vairbales globales
let currentMonth = 0; // Enero
let currentYear = 2026;

const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Ejecutar cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function () {
    // Proteger el dashboard
    const token = localStorage.getItem('token');
    if (!token) {
        // Si no hay token, no hay sesión -> mandar al login
        window.location.href = '../index.html';
        return;
    }

    initializeMenu(); // Si sí hay sesión, inicializar el menú 

    const btnPerfil = document.getElementById('btnPerfil');
    const btnNotificaciones = document.getElementById('btnNotificaciones');
    const panelPerfil = document.getElementById('panelPerfil');
    const panelNotificaciones = document.getElementById('panelNotificaciones');

    if(btnPerfil && panelPerfil) {
        btnPerfil.addEventListener('click', () => {
            llenarPerfil();
            abrirPanel(panelPerfil);
        });
    }

    if (btnNotificaciones && panelNotificaciones) {
        btnNotificaciones.addEventListener('click', () => {
            llenarNotificacionesDashboard();
            abrirPanel(panelNotificaciones);
        });
    }

    document.querySelectorAll('[data-close-panel]').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.closest('.center-modal');
            if (panel) panel.classList.remove('open');
        });
    });

    const searchInput = document.getElementById('searchDashboard');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            filterDashboard(query);
        });
    }
});

function abrirPanel(panel) {
    // Cerrar otros paneles si hubiera
    document.querySelectorAll('.center-modal.open').forEach(p => p.classList.remove('open'));
    panel.classList.add('open');
}

// Perfil de usuario en Usuarios
function llenarPerfil() {
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        user = null;
    }

    document.getElementById('perfilDashboardNombre').textContent = user?.nombre || 'Usuario';
    document.getElementById('perfilDashboardCorreo').textContent = user?.email || 'correo@ejemplo.com';
    document.getElementById('perfilDashboardRol').textContent = user?.rol || 'usuario';
    document.getElementById('perfilDashboardGmin').textContent = user?.GMIN || 'GMIN';
}

// Notificaciones en Usuarios (ejemplo estático)
function llenarNotificacionesDashboard() {
    const contenedor = document.getElementById('listaNotificacionesDashboard');
    if (!contenedor) return;

    const notificaciones = [
        { titulo: 'Usuario actualizado', fecha: '2026-04-03 09:15', detalle: 'Se actualizó el perfil de C4087.'},
        { titulo: 'Nuevo usuario pendiente', fecha: '2026-04-03 10:30', detalle: 'Hay un usuario nuevo pendiente de revisión.' },
        { titulo: 'Contraseña restablecida', fecha: '2026-04-03 11:05', detalle: 'Se restableció la contraseña de un usuario.' }
    ];

    contenedor.innerHTML = '';

    notificaciones.forEach(n => {
        const div = document.createElement('div');
        div.className = 'notificacion-item';
        div.innerHTML = `
        <div class="notificacion-titulo">${n.titulo}</div>
        <div class="notificacion-fecha">${n.fecha}</div>
        <div class="notificacion-detalle">${n.detalle}</div>
        `;
        contenedor.appendChild(div);
    });
}

// Sistema de navegación entre secciones
function initializeMenu() {
    const menuItems = document.querySelectorAll('.menu li');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(li => li.classList.remove('active')); //Remover clase active de todos

            this.classList.add('active'); //Agregar clase active clikeado

            // Obtener la sección mostrar
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId); //
        });
    });
}

function showSection(sectionId) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

/*
// Generar calendario
function generateCalendar(month, year) {
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthElement = document.getElementById('currentMonth');

    // Actualiza título del mes
    currentMonthElement.textContent = `${monthNames[month]} ${year}`;

    calendarDays.innerHTML = ''; // Limpiar calendario

    const firstDay = new Date(year, month, 1).getDay(); // Primer día del mes

    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Días del mes

    // Fecha actual
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
    const currentDay = today.getDate();

    // Agregar días vacíos al inicio 
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day', 'empty');
        calendarDays.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = day;

        // Marcar día actual
        if (isCurrentMonth && day === currentDay) {
            dayDiv.classList.add('today');
        }

        // Agragar evento click
        dayDiv.addEventListener('click', function() {
            alert(`Seleccionaste: ${day} de ${monthNames[month]} ${year}`);
        });

        calendarDays.appendChild(dayDiv);
    }
}

// Navegación del calendario
function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
}*/

function filterDashboard(query) {
    const cards = document.querySelectorAll('.dashboard-grid .card');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? '' : 'none';
    });
}

function logout() {
    //if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../index.html';
    //}
}