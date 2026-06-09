// Variables globales
let cumplimientoData = [];

// Inicializar cuando carga la página 
document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
    loadCumplimientoData();
    // checkUserLogin(); // ya usas auth.js para validar sesión

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
            llenarNotificacionesCumplimiento();
            abrirPanel(panelNotificaciones);
        });
    }

    document.querySelectorAll('[data-close-panel]').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.closest('.center-modal');
            if (panel) panel.classList.remove('open');
        });
    });

    const searchInput = document.getElementById('searchCumplimiento');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            filterCumplimientoTable(query);
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

    document.getElementById('perfilCumplimientoNombre').textContent = user?.nombre || 'Usuario';
    document.getElementById('perfilCumplimientoCorreo').textContent = user?.email || 'correo@ejemplo.com';
    document.getElementById('perfilCumplimientoRol').textContent = user?.rol || 'usuario';
    document.getElementById('perfilCumplimientoGmin').textContent = user?.GMIN || 'GMIN';
}

// Notificaciones en Usuarios (ejemplo estático)
function llenarNotificacionesCumplimiento() {
    const contenedor = document.getElementById('listaNotificacionesCumplimiento');
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

// Verificar si el usuario está logueado (ya no se usa, pero lo dejo por si luego lo necesitas)
function checkUserLogin() {
    const user = localStorage.getItem('registeredUser');
    if (!user) {
        window.location.href = 'index.html';
    }
}

// Sistema de navegación entre secciones
function initializeMenu() {
    const menuItems = document.querySelectorAll('.menu li');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(li => li.classList.remove('active')); // Remover clase active de todos

            this.classList.add('active'); // Agregar clase active al clickeado

            // Obtener la sección a mostrar
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
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

// Cargar datos de cumplimiento
function loadCumplimientoData() {
    cumplimientoData = [
        { cscp: 'C4087', numero: '85560226', nombre: 'PNL-DASH STL 1UB', prog: 1680, totalProd: 1680, perdidas: 0, cumplimiento: 100, progStrokes: 1680, totalStrokes: 1680, ganados: 0 },
        { cscp: 'C4210', numero: '84443402', nombre: 'PNL-PUBX OTR L STL 1UB', prog: 785, totalProd: 785, perdidas: 0, cumplimiento: 100, progStrokes: 785, totalStrokes: 785, ganados: 0 },
        { cscp: 'C4242', numero: '85654552', nombre: 'PNL-PUBX INR UPR L STL 2ST', prog: 800, totalProd: 892, perdidas: 92, cumplimiento: 112, progStrokes: 800, totalStrokes: 892, ganados: 92 },
        { cscp: 'C4243', numero: '85654553', nombre: 'PNL-PUBX INR UPR R STL 2ST', prog: 800, totalProd: 892, perdidas: 92, cumplimiento: 112, progStrokes: 0, totalStrokes: 0, ganados: 92 },
        { cscp: 'C4162', numero: '23393592', nombre: 'PNL-HOOD OTR ALM 3CL', prog: 900, totalProd: 900, perdidas: 0, cumplimiento: 100, progStrokes: 900, totalStrokes: 900, ganados: 0 },
        { cscp: 'C4163', numero: '84512891', nombre: 'PNL-HOOD INR ALM 3CL', prog: 900, totalProd: 900, perdidas: 0, cumplimiento: 100, progStrokes: 900, totalStrokes: 900, ganados: 0 },
        { cscp: 'C4088', numero: '84666755', nombre: 'PNL-DASH EXT LWR STL 1UB', prog: 2000, totalProd: 2002, perdidas: 2, cumplimiento: 100, progStrokes: 2000, totalStrokes: 2002, ganados: 2 },
        { cscp: 'C4146', numero: '84688122', nombre: 'PNL-ROOF OTR STL 2ST', prog: 900, totalProd: 901, perdidas: 1, cumplimiento: 100, progStrokes: 900, totalStrokes: 901, ganados: 1 },
        { cscp: 'C4148', numero: '84688125', nombre: 'PNL-SUNROOF OTR STL 2ST', prog: 500, totalProd: 498, perdidas: 2, cumplimiento: 100, progStrokes: 500, totalStrokes: 498, ganados: 2 },
        { cscp: 'C4144', numero: '23381632', nombre: 'PNL-BDY OTR RR STL 2ST', prog: 1000, totalProd: 1014, perdidas: 14, cumplimiento: 101, progStrokes: 1000, totalStrokes: 1014, ganados: 14 }
    ];

    renderCumplimientoTable();
}

// Renderizar tabla de cumplimiento
function renderCumplimientoTable() {
    const tbody = document.querySelector('#cumplimiento tbody');

    if (!tbody || !cumplimientoData) return;

    tbody.innerHTML = '';

    let totalProg = 0;
    let totalProd = 0;
    let totalProgStrokes = 0;
    let totalStrokes = 0; // ← ESTA VARIABLE FALTABA

    cumplimientoData.forEach((row) => {
        const tr = document.createElement('tr');

        // sumar totales
        totalProg += row.prog;
        totalProd += row.totalProd;
        totalProgStrokes += row.progStrokes;
        totalStrokes += row.totalStrokes;

        // Determinar clase de cumplimiento
        const cumplimientoClass = row.cumplimiento === 100 ? 'cumplimiento-100' : 'cumplimiento-over';

        tr.innerHTML = `
            <td class="col-cscp">${row.cscp}</td>
            <td class="col-numero">${row.numero}</td>
            <td class="col-nombre">${row.nombre}</td>
            <td>${row.prog}</td>
            <td class="col-green">${row.totalProd}</td>
            <td>${row.perdidas}</td>
            <td class="${cumplimientoClass}">${row.cumplimiento}%</td>
            <td>${row.progStrokes}</td>
            <td class="col-green">${row.totalStrokes}</td>
            <td>${row.ganados}</td>
            <td></td>
        `;

        tbody.appendChild(tr);
    });

    // Actualizar totales en el tfoot (una sola vez, fuera del forEach)
    const cumplimientoGlobal = Math.round((totalProd / (totalProg || 1)) * 100);
    const diferenciaProd = totalProd - totalProg;
    const diferenciaStrokes = totalStrokes - totalProgStrokes;

    const tfoot = document.querySelector('#cumplimiento tfoot');
    if (tfoot) {
        tfoot.innerHTML = `
            <tr class="row-total">
                <td colspan="3">TOTAL</td>
                <td class="total-beige">${totalProg}</td>
                <td class="total-beige">${totalProd}</td>
                <td></td>
                <td class="total-green">${cumplimientoGlobal}%</td>
                <td class="total-beige">${totalProgStrokes}</td>
                <td class="total-beige">${totalStrokes}</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td colspan="3"></td>
                <td colspan="2" class="extra-cell">${diferenciaProd}</td>
                <td colspan="3"></td>
                <td colspan="2" class="extra-cell">${diferenciaStrokes}</td>
                <td colspan="2"></td>
            </tr>
        `;
    }
}

function filterCumplimientoTable(query) {
    const rows = document.querySelectorAll('#cumplimiento table tbody tr');

    rows.forEach(row => {
        const cspc = row.children[0]?.textContent.toLowerCase() || '';
        const numero = row.children[1]?.textContent.toLowerCase() || '';
        const nombre = row.children[2]?.textContent.toLowerCase() || '';

        const text = `${cspc} ${numero} ${nombre}`;

        row.style.display = text.includes(query) ? '' : 'none';
    });
}

// Función de logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

document.getElementById('btnLogout').addEventListener('click', logout);

/*function logout() {
    //if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('token');
        window.location.href = '../index.html';
    //}
}*/

// Funciones para otras tablas (pueden ser expandidas según necesidad)
function addCumplimientoRow() {
    const newRow = {
        cscp: 'C0000',
        numero: '00000000',
        nombre: 'NUEVO PARTE',
        prog: 0,
        totalProd: 0,
        perdidas: 0,
        cumplimiento: 100,
        progStrokes: 0,
        totalStrokes: 0,
        ganados: 0
    };

    cumplimientoData.push(newRow);
    renderCumplimientoTable();
}

function deleteLastCumplimientoRow() {
    if (cumplimientoData.length > 0) {
        if (confirm('¿Estás seguro de eliminar la última fila?')) {
            cumplimientoData.pop();
            renderCumplimientoTable();
        }
    }
}

function saveCumplimientoData() {
    localStorage.setItem('cumplimientoData', JSON.stringify(cumplimientoData));
    alert('Datos guardados correctamente');
}

function exportCumplimientoToExcel() {
    const dataStr = 'data:text/csv;charset=utf-8,' +
        encodeURIComponent(convertCumplimientoToCSV(cumplimientoData));
    const downloadLink = document.createElement('a');
    downloadLink.href = dataStr;
    downloadLink.download = 'cumplimiento.csv';
    downloadLink.click();
}

function convertCumplimientoToCSV(data) {
    const headers = [
        'CSPC', 'N° Parte', 'Nombre', 'Prog', 'Total Prod', 'Perdidas',
        'Cumplimiento', 'Prog Strokes', 'Total Strokes', 'Ganados'
    ];

    let csv = headers.join(',') + '\n';

    data.forEach(row => {
        const values = [
            row.cscp,           // corregido
            row.numero,
            row.nombre,
            row.prog,           // corregido (antes orig)
            row.totalProd,
            row.perdidas,
            row.cumplimiento + '%',
            row.progStrokes,
            row.totalStrokes,
            row.ganados
        ];
        csv += values.join(',') + '\n';
    });

    return csv;
}

function printCumplimientoTable() {
    window.print();
}

// Calcular estadísticas de cumplimiento
function calculateCumplimientoStats() {
    let totalCumplimiento = 0;
    let countAbove100 = 0;
    let countAt100 = 0;

    cumplimientoData.forEach(row => {
        totalCumplimiento += row.cumplimiento;
        if (row.cumplimiento > 100) countAbove100++;
        if (row.cumplimiento === 100) countAt100++;
    });

    return {
        promedioCumplimiento: (totalCumplimiento / cumplimientoData.length).toFixed(2),
        partidasAbove100: countAbove100,
        partidasAt100: countAt100,
        totalPartidas: cumplimientoData.length
    };
}

// Cargar datos guardados al inicio
window.addEventListener('load', function() {
    const savedData = localStorage.getItem('cumplimientoData');
    if (savedData) {
        const shouldLoad = confirm('Se encontraron datos guardados, ¿Deseas cargarlos?');
        if (shouldLoad) {
            cumplimientoData = JSON.parse(savedData);
            renderCumplimientoTable();
        }
    }
});