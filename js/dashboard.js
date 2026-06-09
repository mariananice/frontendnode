const BASE_URL = 'http://localhost:3300';

// Variables globales
let currentMonth = 0;
let currentYear = 2026;

const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    // Proteger dashboard
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    initializeMenu();

    const btnPerfil = document.getElementById('btnPerfil');
    const btnNotificaciones = document.getElementById('btnNotificaciones');
    const panelPerfil = document.getElementById('panelPerfil');
    const panelNotificaciones = document.getElementById('panelNotificaciones');
    const searchInput = document.getElementById('searchDashboard');
    const btnSubirExcel = document.getElementById('btnSubirExcel');
    const btnLogout = document.getElementById('btnLogout');

    if (btnPerfil && panelPerfil) {
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

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            filterDashboard(query);
        });
    }

    if (btnSubirExcel) {
        btnSubirExcel.addEventListener('click', subirExcel);
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', logout);
    }
});

function abrirPanel(panel) {
    document.querySelectorAll('.center-modal.open').forEach(p => p.classList.remove('open'));
    panel.classList.add('open');
}

function llenarPerfil() {
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        user = null;
    }

    const nombre = document.getElementById('perfilDashboardNombre');
    const correo = document.getElementById('perfilDashboardCorreo');
    const rol = document.getElementById('perfilDashboardRol');
    const gmin = document.getElementById('perfilDashboardGmin');

    if (nombre) nombre.textContent = user?.nombre || 'Usuario';
    if (correo) correo.textContent = user?.email || 'correo@ejemplo.com';
    if (rol) rol.textContent = user?.rol || 'usuario';
    if (gmin) gmin.textContent = user?.GMIN || 'GMIN';
}

function llenarNotificacionesDashboard() {
    const contenedor = document.getElementById('listaNotificacionesDashboard');
    if (!contenedor) return;

    const notificaciones = [
        { titulo: 'Usuario actualizado', fecha: '2026-04-03 09:15', detalle: 'Se actualizó el perfil de C4087.' },
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

function initializeMenu() {
    const menuItems = document.querySelectorAll('.menu li');

    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            menuItems.forEach(li => li.classList.remove('active'));
            this.classList.add('active');

            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function filterDashboard(query) {
    const cards = document.querySelectorAll('.dashboard-grid .card');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? '' : 'none';
    });
}

async function subirExcel() {
    const fileInput = document.getElementById('excelFile');
    const file = fileInput?.files?.[0];

    if (!file) {
        alert('Selecciona un archivo Excel');
        return;
    }

    const formData = new FormData();
    formData.append('archivo', file);

    try {
        const token = localStorage.getItem('token');

        const res = await fetch(`${BASE_URL}/api/dashboard/upload-excel`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const data = await res.json();
        console.log('Respuesta del backend:', data);

        if (!res.ok) {
            throw new Error(data.message || 'Error al subir archivo');
        }

        alert('Archivo subido correctamente');
        pintarTablaExcel(data.datos || []);
    } catch (error) {
        console.error('Error al subir Excel:', error);
        alert(error.message || 'Error al subir archivo');
    }
}

function pintarTablaExcel(datos) {
    const section = document.getElementById('dashboard');
    if (!section) return;

    let container = document.getElementById('excelPreviewContainer');

    if (!container) {
        container = document.createElement('div');
        container.id = 'excelPreviewContainer';
        container.style.marginTop = '30px';
        section.appendChild(container);
    }

    if (!Array.isArray(datos) || datos.length === 0) {
        container.innerHTML = '<p>No hay datos para mostrar.</p>';
        return;
    }

    const columnas = Object.keys(datos[0]);

    let html = `
        <div class="card">
            <h2 class="card-title">Vista previa del Excel</h2>
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            ${columnas.map(col => `<th>${col}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${datos.map(fila => `
                            <tr>
                                ${columnas.map(col => `<td>${fila[col] ?? ''}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}