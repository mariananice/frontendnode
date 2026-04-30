// Variables globales
let dohData = [];

// Inizializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    inializeMenu();
    loadDOHData();
    setupActionButtons();

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
            llenarNotificacionesProgramacion();
            abrirPanel(panelNotificaciones);
        });
    }

    document.querySelectorAll('[data-close-panel]').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.closest('.center-modal');  // buscar por clase
            if (panel) panel.classList.remove('open');
        });
    });

    const searchInput = document.getElementById('searchProgramacion');
    //console.log('searchInput:', searchInput); // para depurar

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            //console.log('Filtrando con:', query);
            filterProgramacionTable(query);
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

    document.getElementById('perfilProgramacionNombre').textContent = user?.nombre || 'Usuario';
    document.getElementById('perfilProgramacionCorreo').textContent = user?.email || 'correo@ejemplo.com';
    document.getElementById('perfilProgramacionRol').textContent = user?.rol || 'usuario';
    document.getElementById('perfilProgramacionGmin').textContent = user?.GMIN || 'GMIN';
}

// Notificaciones en Usuarios (ejemplo estático)
function llenarNotificacionesProgramacion() {
    const contenedor = document.getElementById('listaNotificacionesProgramacion');
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
function inializeMenu() {
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


// Cargar datos DOH
function loadDOHData() {
    // Datos de ejemplo para la tabla DOH
    dohData = [
        { cspc: 'C4087', linea: 'XL1', capTotal: 4560, stockMier: 3840, reqMier: 1184, cambiMier: 1184, reaMier: 1680, cambMier: 1680, dohMier: 2.8, stockJue: 4336, inventaJue: 4340, reqJue: 1403, cambJue: '', partiJue: 0, cambicJue: 0, reJue: '', dohJue: 3.1 },
        { cspc: 'C4088', linea: 'XL1', capTotal: 5400, stockMier: 3500, reqMier: 1184, cambiMier: 1184, reaMier: 2000, cambMier: 2000, dohMier: 2.6, stockJue: 4316, inventaJue: 4200, reqJue: 1403, cambJue: '', partiJue: 0, cambicJue: 0, reJue: '', dohJue: 3.0 },
        { cspc: 'C4106', linea: 'XL2', capTotal: 2760, stockMier: 1732, reqMier: 1054, cambiMier: 1054, reaMier: 1200, cambMier: 1200, dohMier: 1.4, stockJue: 1878, inventaJue: 1917, reqJue: 1283, cambJue: '', partiJue: 1200, cambicJue: 1200, reJue: '', dohJue: 1.5 },
        { cspc: 'C4109', linea: 'XL2', capTotal: 2990, stockMier: 2570, reqMier: 1054, cambiMier: 1054, reaMier: 1200, cambMier: 1200, dohMier: 2.1, stockJue: 2716, inventaJue: 2770, reqJue: 1283, cambJue: '', partiJue: 1200, cambicJue: 1200, reJue: '', dohJue: 2.2 },
        { cspc: 'C4118', linea: 'XL2', capTotal: 850, stockMier: 710, reqMier: 148, cambiMier: 148, reaMier: 0, cambMier: 0, dohMier: 4.2, stockJue: 562, inventaJue: 541, reqJue: 120, cambJue: '', partiJue: 500, cambicJue: 500, reJue: '', dohJue: 4.5 },
        { cspc: 'C4119', linea: 'XL2', capTotal: 850, stockMier: 1000, reqMier: 148, cambiMier: 148, reaMier: 0, cambMier: 0, dohMier: 5.9, stockJue: 852, inventaJue: 842, reqJue: 120, cambJue: '', partiJue: 0, cambicJue: 0, reJue: '', dohJue: 7.0 },
        { cspc: 'C4144', linea: 'XL1', capTotal: 2792, stockMier: 3612, reqMier: 666, cambiMier: 666, reaMier: 0, cambMier: 0, dohMier: 4.9, stockJue: 2946, inventaJue: 2894, reqJue: 917, cambJue: '', partiJue: 1100, cambicJue: 1100, reJue: '', dohJue: 3.2 },
        { cspc: 'C4145', linea: 'XL1', capTotal: 1720, stockMier: 1376, reqMier: 148, cambiMier: 148, reaMier: 0, cambMier: 0, dohMier: 8.1, stockJue: 1228, inventaJue: 1204, reqJue: 120, cambJue: '', partiJue: 0, cambicJue: 0, reJue: '', dohJue: 10.0 },
        { cspc: 'C4146', linea: 'XL1', capTotal: 2380, stockMier: 2057, reqMier: 666, cambiMier: 666, reaMier: 600, cambMier: 600, dohMier: 2.7, stockJue: 1991, inventaJue: 2011, reqJue: 927, cambJue: '', partiJue: 600, cambicJue: 600, reJue: '', dohJue: 2.2 },
        { cspc: 'C4148', linea: 'XL1', capTotal: 1122, stockMier: 1003, reqMier: 407, cambiMier: 407, reaMier: 450, cambMier: 450, dohMier: 2.2, stockJue: 1046, inventaJue: 1246, reqJue: 375, cambJue: '', partiJue: 450, cambicJue: 450, reJue: '', dohJue: 3.3 },
        { cspc: 'C4149', linea: 'XL1', capTotal: 2520, stockMier: 1770, reqMier: 407, cambiMier: 407, reaMier: 0, cambMier: 0, dohMier: 3.9, stockJue: 1363, inventaJue: 1345, reqJue: 375, cambJue: '', partiJue: 1308, cambicJue: 1308, reJue: '', dohJue: 3.6 },
        { cspc: 'C4152', linea: 'XL2', capTotal: 1380, stockMier: 913, reqMier: 148, cambiMier: 148, reaMier: 0, cambMier: 0, dohMier: 5.4, stockJue: 765, inventaJue: 751, reqJue: 91, cambJue: '', partiJue: 0, cambicJue: 0, reJue: '', dohJue: 8.3 },
        { cspc: 'C4155', linea: 'XL2', capTotal: 2352, stockMier: 1904, reqMier: 351, cambiMier: 351, reaMier: 0, cambMier: 0, dohMier: 4.7, stockJue: 1553, inventaJue: 1660, reqJue: 744, cambJue: '', partiJue: 900, cambicJue: 900, reJue: '', dohJue: 2.2 },
        { cspc: 'C4156', linea: '0', capTotal: 2352, stockMier: 2016, reqMier: 351, cambiMier: 351, reaMier: 0, cambMier: 0, dohMier: 5.0, stockJue: 1665, inventaJue: 1561, reqJue: 744, cambJue: '', partiJue: 900, cambicJue: 900, reJue: '', dohJue: 2.1 },
        { cspc: 'C4157', linea: 'XL1', capTotal: 1932, stockMier: 1484, reqMier: 684, cambiMier: 684, reaMier: 960, cambMier: 960, dohMier: 1.9, stockJue: 1760, inventaJue: 1695, reqJue: 523, cambJue: '', partiJue: 0, cambicJue: 0, reJue: '', dohJue: 3.2 },
        { cspc: 'C4158', linea: '0', capTotal: 1932, stockMier: 1484, reqMier: 684, cambiMier: 684, reaMier: 960, cambMier: 960, dohMier: 1.9, stockJue: 1760, inventaJue: 1695, reqJue: 523, cambJue: '', partiJue: 0, cambicJue: 0, reJue: '', dohJue: 3.2 },
        { cspc: 'C4159', linea: 'XL2', capTotal: 1640, stockMier: 1480, reqMier: 148, cambiMier: 148, reaMier: 0, cambMier: 0, dohMier: 9.3, stockJue: 1332, inventaJue: 1557, reqJue: 475, cambJue: '', partiJue: 0, cambicJue: 0, reJue: '', dohJue: 3.3 },
        { cspc: 'C4160', linea: 'XL1', capTotal: 3000, stockMier: 2485, reqMier: 148, cambiMier: 148, reaMier: 0, cambMier: 0, dohMier: 15.3, stockJue: 2337, inventaJue: 2300, reqJue: 480, cambJue: '', partiJue: 0, cambicJue: 0, reJue: '', dohJue: 4.8 },
        { cspc: 'C4162', linea: 'XL1', capTotal: 2080, stockMier: 1960, reqMier: 758, cambiMier: 758, reaMier: 0, cambMier: 0, dohMier: 2.3, stockJue: 1202, inventaJue: 1120, reqJue: 610, cambJue: '', partiJue: 900, cambicJue: 900, reJue: '', dohJue: 1.8 },
        { cspc: 'C4163', linea: '0', capTotal: 2400, stockMier: 1970, reqMier: 758, cambiMier: 758, reaMier: 0, cambMier: 0, dohMier: 2.3, stockJue: 1212, inventaJue: 1400, reqJue: 606, cambJue: '', partiJue: 900, cambicJue: 900, reJue: '', dohJue: 2.3 },
        { cspc: 'C4207', linea: 'XL2', capTotal: 4480, stockMier: 4115, reqMier: 1184, cambiMier: 1184, reaMier: 1344, cambMier: 1344, dohMier: 3.0, stockJue: 4275, inventaJue: 4320, reqJue: 1403, cambJue: '', partiJue: 1344, cambicJue: 1344, reJue: '', dohJue: 3.1 }
    ];

    renderDOHTable();
}

// Renderizar tabla DOH
function renderDOHTable() {
    const tbody = document.querySelector('#programacion table tbody');

    if (!tbody || !dohData) return;

    tbody.innerHTML = '';

    dohData.forEach((row) => {
        const tr = document.createElement('tr');

        const getDOHClass = (value) => {
            if (value === '' || value === null || value === undefined) return '';
            const num = parseFloat(value);
            if (isNaN(num)) return '';
            if (num >= 2.0 && num <= 10.0) return 'doh-green';
            if (num > 1.4 && num < 2.0) return 'doh-yellow';
            if (num > 10.0) return 'doh-orange';
            if (num > 15.0) return 'doh-red';
            return '';
        };

        tr.innerHTML = `
            <td class="col-cspc">${row.cspc}</td>
            <td class="col-linea">${row.linea}</td>
            <td>${row.capTotal}</td>
            <td class="bg-blue-light">${row.stockMier}</td>
            <td class="bg-gray">${row.reqMier}</td>
            <td class="bg-blue">${row.cambiMier}</td>
            <td class="bg-blue-light">${row.reaMier}</td>
            <td class="bg-blue">${row.cambMier}</td>
            <td></td>
            <td class="${getDOHClass(row.dohMier)}">${row.dohMier}</td>
            <td class="bg-blue-light">${row.stockJue}</td>
            <td class="bg-blue">${row.inventaJue}</td>
            <td class="bg-gray">${row.reqJue}</td>
            <td class="bg-blue-light">${row.cambJue}</td>
            <td class="bg-blue-light">${row.partiJue}</td>
            <td class="bg-gray">${row.cambicJue}</td>
            <td class="bg-blue-light">${row.reJue}</td>
            <td class="${getDOHClass(row.dohJue)}">${row.dohJue}</td>
        `;

        tbody.appendChild(tr);
    });
}

function filterProgramacionTable(query) {
    const rows = document.querySelectorAll('#programacion tbody tr');

    rows.forEach(row => {
        const cspc   = row.children[0]?.textContent.toLowerCase() || '';
        const linea  = row.children[1]?.textContent.toLowerCase() || '';
        const cap    = row.children[2]?.textContent.toLowerCase() || '';
        const stockM = row.children[3]?.textContent.toLowerCase() || '';
        const reqM   = row.children[4]?.textContent.toLowerCase() || '';
        const stockJ = row.children[10]?.textContent.toLowerCase() || '';
        const reqJ   = row.children[12]?.textContent.toLowerCase() || '';

        const text = `${cspc} ${linea} ${cap} ${stockM} ${reqM} ${stockJ} ${reqJ}`;

        row.style.display = text.includes(query) ? '' : 'none';
    });
}

// Configurar botones de acción
function setupActionButtons() {
    const section = document.getElementById('programacion');

    if (!section) return;

    /*
    // Crear contenedor de botones si no existe
    if (!section.querySelector('.action-buttons')) {
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'action-buttons';
        buttonsDiv.innerHTML = `
            <button class="btn btn-primary" onclick="addDOHRow()">
                <i class="bi bi-plus-circle"></i> Agregar Fila
            </button>
            <button class="btn btn-danger" onclick="deleteLastDOHRow()">
                <i class="bi bi-trash"></i> Eliminar Última Fila
            </button>
            <button class="btn btn-success" onclick="saveDOHRow()">
                <i class="bi bi-save"></i> Guardar
            </button>
            <button class="btn btn-warning" onclick="exportDOHToExcel()">
                <i class="bi bi-file-earmark-excel"></i> Exportar a Excel
            </button>
            <button class="btn btn-info" onclick="printDOHTable()">
                <i class="bi bi-printer"></i> Imprimir
            </button>
            `;

            const h1 = section.querySelector('h1');
            h1.after(buttonsDiv);
    }*/
}

// Funciones de botones
function addDOHRow() {
    const newRow = {
        cspc: 'C0000',
        linea: 'XL1',
        capTotal: 0,
        stock: 0,
        reqMier: 0,
        cambiMier: 0,
        reaMier: 0,
        cambMier: 0,
        dohMier: 0,
        stockJue: 0,
        inventaJue: 0,
        reqJue: 0,
        cambJue: '',
        partiJue: 0,
        cambJue: 0,
        reJue: '',
        dohJue: 0
    };

    dohData.push(newRow);
    renderDOHTable();
}

function deleteLastDOHRow() {
    if (dohData.length > 0) {
        if (confirm('¿Estás seguro de eliminar la última fila?')) {
            dohData.pop();
            renderDOHTable();
        }
    }
}

function saveDOHData() {
    localStorage.setItem('dohData', JSON.stringify(dohData));
    alert('Datos guardados correctamente en el navegador');
}

function exportDOHToExcel() {
    const dataStr = 'data:text/csv;charset=utf-8' +
        encodeURIComponent(convertDOHToCSV(dohData));
    const downloadLink = document.createElement('a');
    downloadLink.href = dataStr;
    downloadLink.download = 'doh_programacion.csv';
    downloadLink.click();
}

function convertDOHToCSV(data) {
    const headers = [
        'CSPC', 'LINEA', 'CAP TOTAL', 'STOCK MIER', 'REQ MIER', 'CAMBI MIER',
        'REA MIER', 'CAMB MIER', 'DOH MIER', 'STOCK JUE', 'INVENTA JUE',
        'REQ JUE', 'CAMB JUE', 'PARTI JUE', 'CAMBIC JUE', 'RE JUE', 'DOH JUE'
    ];

    let csv = headers.join(',') + '\n';

    data.forEach(row => {
        const values = [
            row.cspc, row.linea, row.capTotal, row.stockMier, row.reqMier,
            row.cambiMier, row.reaMier, row.cambMier, row.dohMier,
            row.stockJue, row.inventaJue, row.reqJue, row.cambJue,
            row.partiJue, row.cambicJue, row.reJue, row.dohJue
        ];
        csv += values.join(',') + '\n';
    });

    return csv;
}


function printDOHTable() {
    window.print();
}

// Función de logout
function logout() {
    //if(confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('token');
        window.location.href = '../index.html';
    //}
}

// Cargar datos guardados al inicio
window.addEventListener('load', function() {
    const savedData = this.localStorage.getItem('dohData');
    if (savedData) {
        const shouldLoad = confirm('Se encontraron datos guardados, ¿Deseas cargarlos?');
        if (shouldLoad) {
            dohData = JSON.parse(savedData);
            renderDOHTable();
        }
    }
});

// Filtrar tabla por línea
function filterByLine(line) {
    const rows = document.querySelectorAll('#programacion tbody tr');

    rows.forEach(row => {
        const lineCell = row.querySelector('.col-linea');
        if (line === 'all' || lineCell.textContent === line) {
            row.computedStyleMap.display = '';
        } else {
            row.computedStyleMap.display = 'none';
        }
    });
}

// Ordenar tabla por columna
function sortTableByColumn(columnIndex, ascending = true) {
    const tbody = document.querySelector('#programacion tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();

        // Intentar convertir a número
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);

        if (!isNaN(aNum) && !isNaN(bNum)) {
            return ascending ? aNum - bNum : bNum - aNum;
        }

        // Comparar como texto
        return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

    // Limpiar y volver a agregar las filas ordenadas
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

// Resaltar filas con DOH crítico
function highlightCriticalDOH() {
    const cells = document.querySelectorAll('#programacion tbody td[class*="doh-"]');

    cells.forEach(cell => {
        const value = parseFloat(cell.textContent);
        if (!isNaN(value) && (value < 1.5 || value > 10)) {
            cell.computedStyleMap.fontWeight = 'bold';
            cell.computedStyleMap.fontSize = '13px';
        }
    });
}

// Calcular estadísticas DOH
function calculateDOHStats() {
    const dohValues = dohData
      .flatMap(row => [row.dohMier, row.dohJue])
      .map(val => parseFloat(val))
      .filter(val => !isNaN(val));

    //if (dohValues.length === 0) return null;

    const sum = dohValues.reduce((a, b) => a + b, 0);
    const avg = sum / dohValues.length;
    const min = Math.min(...dohValues);
    const max = Math.max(...dohValues);

    return {
        promedio: avg.toFixed(2),
        minimo: min.toFixed(2),
        maximo: max.toFixed(2),
        total: dohValues.length
    };
}