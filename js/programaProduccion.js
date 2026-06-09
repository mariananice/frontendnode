import { obtenerProduccion } from './api.js';

const BASE_URL = 'http://localhost:3300';

// Variables globales
let productionData = {
    xl1: [],
    xl2: []
};

let currentMonth = 0;
let currentYear = 2026;

const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await obtenerProduccion();
        console.log('Respuesta backend:', data);
    } catch (error) {
        console.error('Error backend:', error);
    }

    initializeMenu();
    loadProductionData();

    const btnPerfil = document.getElementById('btnPerfil');
    const btnNotificaciones = document.getElementById('btnNotificaciones');
    const panelPerfil = document.getElementById('panelPerfil');
    const panelNotificaciones = document.getElementById('panelNotificaciones');
    const btnLogout = document.getElementById('btnLogout');

    if (btnPerfil && panelPerfil) {
        btnPerfil.addEventListener('click', () => {
            llenarPerfil();
            abrirPanel(panelPerfil);
        });
    }

    if (btnNotificaciones && panelNotificaciones) {
        btnNotificaciones.addEventListener('click', () => {
            llenarNotificacionesProduccion();
            abrirPanel(panelNotificaciones);
        });
    }

    document.querySelectorAll('[data-close-panel]').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.closest('.center-modal');
            if (panel) panel.classList.remove('open');
        });
    });

    const searchInput = document.getElementById('searchProduccion');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            filterProductionTable(query);
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', logout);
    }

    cargarProduccion();
});

async function cargarProduccion() {
    try {
        const fecha = '2025-05-04';
        const datos = await obtenerProduccion(fecha);
        console.log('Datos producción:', datos);
    } catch (error) {
        console.error('Error cargando producción:', error);
    }
}

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

    document.getElementById('perfilProduccionNombre').textContent = user?.nombre || 'Usuario';
    document.getElementById('perfilProduccionCorreo').textContent = user?.email || 'correo@ejemplo.com';
    document.getElementById('perfilProduccionRol').textContent = user?.rol || 'usuario';
    document.getElementById('perfilProduccionGmin').textContent = user?.GMIN || 'GMIN';
}

function llenarNotificacionesProduccion() {
    const contenedor = document.getElementById('listaNotificacionesProduccion');
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

function loadProductionData() {
    productionData.xl1 = [
        // deja aquí tus datos mock
    ];

    productionData.xl2 = [
        // deja aquí tus datos mock o los que te regrese el backend
    ];

    renderProductionTable('xl1');
    renderProductionTable('xl2');
}

function renderProductionTable(prensa) {
    const data = productionData[prensa];
    const tbody = document.querySelector(
        `#produccion table:nth-of-type(${prensa === 'xl1' ? 1 : 2}) tbody`
    );

    if (!tbody || !data || data.length === 0) return;

    tbody.innerHTML = '';

    let totalStrokes = 0;

    data.forEach(row => {
        const tr = document.createElement('tr');

        if (row.tipo === 'tryout') {
            tr.classList.add('row-green');
        } else if (row.tipo === 'ns') {
            tr.classList.add('row-yellow');
        }

        if (row.strokes && !isNaN(parseInt(row.strokes))) {
            totalStrokes += parseInt(row.strokes);
        }

        tr.innerHTML = `
            <td class="time-cell">${row.hora}</td>
            <td>${row.tProd}</td>
            <td>${row.tipo !== 'normal' ? '<strong>' + row.descripcion + '</strong>' : row.descripcion}</td>
            <td>${row.cantidad}</td>
            <td class="${row.nonLoad === 'TO' ? 'cell-to' : row.nonLoad === 'NS' ? 'cell-ns' : ''}">${row.nonLoad}</td>
            <td>${row.strokes}</td>
            <td>${row.doH}</td>
            <td class="${row.tipo === 'ns' || row.tipo === 'tryout' ? 'comment-red' : ''}">${row.comentarios}</td>
        `;

        tbody.appendChild(tr);
    });

    const totalCell = document.querySelector(
        `#produccion table:nth-of-type(${prensa === 'xl1' ? 1 : 2}) tfoot .footer-total:last-child`
    );

    if (totalCell) {
        totalCell.textContent = totalStrokes;
    }
}

function filterProductionTable(query) {
    const rows = document.querySelectorAll('#produccion table tbody tr');

    rows.forEach(row => {
        const hora = row.children[0]?.textContent.toLowerCase() || '';
        const tProd = row.children[1]?.textContent.toLowerCase() || '';
        const descripcion = row.children[2]?.textContent.toLowerCase() || '';
        const cantidad = row.children[3]?.textContent.toLowerCase() || '';
        const nonLoad = row.children[4]?.textContent.toLowerCase() || '';
        const strokes = row.children[5]?.textContent.toLowerCase() || '';
        const doH = row.children[6]?.textContent.toLowerCase() || '';

        const text = `${hora} ${tProd} ${descripcion} ${cantidad} ${nonLoad} ${strokes} ${doH}`;
        row.style.display = text.includes(query) ? '' : 'none';
    });
}

function addProductionRow(prensa) {
    const newRow = {
        hora: '06:00:00 a. m.',
        tProd: '0',
        descripcion: '',
        cantidad: '0',
        nonLoad: '',
        strokes: '0',
        doH: '',
        comentarios: '',
        tipo: 'normal'
    };

    productionData[prensa].push(newRow);
    renderProductionTable(prensa);
}

function deleteLastRow(prensa) {
    if (productionData[prensa].length > 0) {
        productionData[prensa].pop();
        renderProductionTable(prensa);
    }
}

function exportData() {
    const dataStr = JSON.stringify(productionData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'programa_produccion.json';
    link.click();
    URL.revokeObjectURL(url);
}

function saveData() {
    localStorage.setItem('productionData', JSON.stringify(productionData));
    alert('Datos guardados correctamente');
}

function loadSavedData() {
    const saved = localStorage.getItem('productionData');
    if (saved) {
        productionData = JSON.parse(saved);
        renderProductionTable('xl1');
        renderProductionTable('xl2');
        alert('Datos cargados correctamente');
    } else {
        alert('No hay datos guardados');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

function calculateTotalStrokes(prensa) {
    const data = productionData[prensa];
    let total = 0;

    data.forEach(row => {
        if (row.strokes && !isNaN(parseInt(row.strokes))) {
            total += parseInt(row.strokes);
        }
    });

    return total;
}

function changeRowType(prensa, rowIndex, newType) {
    if (productionData[prensa][rowIndex]) {
        productionData[prensa][rowIndex].tipo = newType;

        if (newType === 'tryout') {
            productionData[prensa][rowIndex].descripcion = 'Try out';
            productionData[prensa][rowIndex].nonLoad = 'TO';
            productionData[prensa][rowIndex].cantidad = '0';
            productionData[prensa][rowIndex].strokes = '0';
            productionData[prensa][rowIndex].doH = '###';
        } else if (newType === 'ns') {
            productionData[prensa][rowIndex].descripcion = 'NS';
            productionData[prensa][rowIndex].nonLoad = 'NS';
            productionData[prensa][rowIndex].cantidad = '0';
            productionData[prensa][rowIndex].strokes = '0';
            productionData[prensa][rowIndex].doH = '###';
        }

        renderProductionTable(prensa);
    }
}

function printTable() {
    window.print();
}
