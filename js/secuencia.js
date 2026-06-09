// Variables globales
let secuenciaData = [];

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
    loadSecuenciaData();
    setupActionButtons();
    // setupFilters(); // actívalo solo cuando tengas los filtros completos

    const btnPerfil = document.getElementById('btnPerfil');
    const btnNotificaciones = document.getElementById('btnNotificaciones');
    const panelPerfil = document.getElementById('panelPerfil');
    const panelNotificaciones = document.getElementById('panelNotificacionesSecuencia');

    if (btnPerfil && panelPerfil) {
        btnPerfil.addEventListener('click', () => {
            llenarPerfil();
            abrirPanel(panelPerfil);
        });
    }

    if (btnNotificaciones && panelNotificaciones) {
        btnNotificaciones.addEventListener('click', () => {
            llenarNotificacionesSecuencia();
            abrirPanel(panelNotificaciones);
        });
    }

    document.querySelectorAll('[data-close-panel]').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.closest('.center-modal');
            if (panel) panel.classList.remove('open');
        });
    });

    const searchInput = document.getElementById('searchSecuencia');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            filterSecuenciaTable(query);
        });
    }
});

function abrirPanel(panel) {
    // Cerrar otros paneles si hubiera
    document.querySelectorAll('.center-modal.open').forEach(p => p.classList.remove('open'));
    panel.classList.add('open');
}

// Perfil de usuario en Secuencia
function llenarPerfil() {
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        user = null;
    }

    document.getElementById('perfilSecuenciaNombre').textContent = user?.nombre || 'Usuario';
    document.getElementById('perfilSecuenciaCorreo').textContent = user?.email || 'correo@ejemplo.com';
    document.getElementById('perfilSecuenciaRol').textContent = user?.rol || 'usuario';
    document.getElementById('perfilSecuenciaGmin').textContent = user?.GMIN || 'GMIN';
}

// Notificaciones para Secuencia
function llenarNotificacionesSecuencia() {
    const contenedor = document.getElementById('listaNotificacionesSecuencia');
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
            menuItems.forEach(li => li.classList.remove('active'));

            this.classList.add('active');

            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Cargar datos de secuencia
function loadSecuenciaData() {
    secuenciaData = [
        { numero: '85560226', cspc: 'C4087', linea: 'XL1', sph: 519, cantidad: 1680, duracion: 103.109827, banco: 2.8, secuencia: 6, cambios: 6, secuencia2: '', cambios2: '' },
        { numero: '84666755', cspc: 'C4088', linea: 'XL1', sph: 555, cantidad: 2000, duracion: 114.108108, banco: 2.6, secuencia: 1, cambios: 1, secuencia2: '', cambios2: '' },
        { numero: '84652941', cspc: 'C4106', linea: 'XL2', sph: 514, cantidad: 1200, duracion: 146.077821, banco: 1.4, secuencia: '', cambios: '', secuencia2: 2, cambios2: 2 },
        { numero: '84652942', cspc: 'C4109', linea: 'XL2', sph: 515, cantidad: 1200, duracion: 145.805825, banco: 2.1, secuencia: '', cambios: '', secuencia2: 7, cambios2: 7 },
        { numero: '84652981', cspc: 'C4118', linea: 'XL2', sph: 430, cantidad: 0, duracion: '', banco: 4.2, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '84652982', cspc: 'C4119', linea: 'XL2', sph: 430, cantidad: 0, duracion: '', banco: 5.9, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '23381632', cspc: 'C4144', linea: 'XL1', sph: 554, cantidad: 0, duracion: '', banco: 4.8, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '23381639', cspc: 'C4145', linea: 'XL1', sph: 460, cantidad: 0, duracion: '', banco: 8.1, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '84688122', cspc: 'C4146', linea: 'XL1', sph: 555, cantidad: 600, duracion: 70.8648649, banco: 2.7, secuencia: 7, cambios: 7, secuencia2: '', cambios2: '' },
        { numero: '84688125', cspc: 'C4148', linea: 'XL1', sph: 556, cantidad: 450, duracion: 54.5611511, banco: 2.2, secuencia: 8, cambios: 8, secuencia2: '', cambios2: '' },
        { numero: '23507633', cspc: 'C4149', linea: 'XL1', sph: 569, cantidad: 0, duracion: '', banco: 3.9, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '84688126', cspc: 'C4152', linea: 'XL2', sph: 500, cantidad: 0, duracion: '', banco: 5.4, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '84496738', cspc: 'C4155', linea: 'XL2', sph: 484, cantidad: 0, duracion: '', banco: 4.7, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '84496739', cspc: 'C4156', linea: '0', sph: 484, cantidad: 0, duracion: '', banco: 5.0, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '84496740', cspc: 'C4157', linea: 'XL1', sph: 479, cantidad: 960, duracion: 126.250522, banco: 1.9, secuencia: 9, cambios: 9, secuencia2: '', cambios2: '' },
        { numero: '84496741', cspc: 'C4158', linea: '0', sph: 479, cantidad: 960, duracion: 0, banco: 1.9, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '23393591', cspc: 'C4159', linea: 'XL2', sph: 536, cantidad: 0, duracion: '', banco: 9.3, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '84340140', cspc: 'C4160', linea: 'XL1', sph: 536, cantidad: 0, duracion: '', banco: 15.3, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '23393592', cspc: 'C4162', linea: 'XL1', sph: 460, cantidad: 0, duracion: '', banco: 2.3, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '84512891', cspc: 'C4163', linea: '0', sph: 460, cantidad: 0, duracion: '', banco: 2.3, secuencia: '', cambios: '', secuencia2: '', cambios2: '' }
    ];

    renderSecuenciaTable();
}

// Renderizar tabla de secuencia
function renderSecuenciaTable() {
    const tbody = document.querySelector('#secuencia tbody');
    if (!tbody || !secuenciaData) return;

    tbody.innerHTML = '';

    secuenciaData.forEach((row, index) => {
        const tr = document.createElement('tr');

        let lineaClass = 'col-linea-xl2';
        if (row.linea === 'XL1') lineaClass = 'col-linea-xl1';
        if (row.linea === '0') lineaClass = 'col-linea-0';

        tr.innerHTML = `
            <td class="col-numero">${row.numero}</td>
            <td class="col-cspc">${row.cspc}</td>
            <td class="${lineaClass}">${row.linea}</td>
            <td class="col-sph">${row.sph}</td>
            <td class="col-cantidad editable-cell" data-row="${index}" data-field="cantidad">${row.cantidad}</td>
            <td class="col-duracion">${row.duracion}</td>
            <td class="col-banco">${row.banco}</td>
            <td class="col-secuencia">${row.secuencia}</td>
            <td class="col-cambios">${row.cambios}</td>
            <td class="col-secuencia-2">${row.secuencia2}</td>
            <td class="col-cambios-2">${row.cambios2}</td>
        `;

        tbody.appendChild(tr);
    });

    setupEditableCells();
}

function filterSecuenciaTable(query) {
    const rows = document.querySelectorAll('#secuencia tbody tr');

    rows.forEach(row => {
        const numero = row.children[0].textContent.toLowerCase(); // numero de parte
        const cspc = row.children[1].textContent.toLowerCase(); // cspc
        const linea = row.children[2].textContent.toLowerCase(); // linea

        const text = `${numero} ${cspc} ${linea}`;

        row.style.display = text.includes(query) ? '' : 'none';
    })
}

// Configurar celdas editables
function setupEditableCells() {
    const editableCells = document.querySelectorAll('.editable-cell');

    editableCells.forEach(cell => {
        cell.addEventListener('dblclick', function() {
            const currentValue = this.textContent.trim();
            const rowIndex = this.getAttribute('data-row');
            const field = this.getAttribute('data-field');

            const input = document.createElement('input');
            input.type = 'number';
            input.value = currentValue;
            input.style.width = '100%';

            this.textContent = '';
            this.appendChild(input);
            input.focus();
            input.select();

            function save() {
                const newValue = parseInt(input.value) || 0;
                secuenciaData[rowIndex][field] = newValue;
                cell.textContent = newValue;

                if (field === 'cantidad') {
                    recalculateDuracion(rowIndex);
                }
            }

            input.addEventListener('blur', save);
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });
        });
    });
}

// Recalcular duración
function recalculateDuracion(rowIndex) {
    const row = secuenciaData[rowIndex];
    if (row.cantidad > 0 && row.sph > 0) {
        row.duracion = ((row.cantidad / row.sph) * 60).toFixed(6);
        renderSecuenciaTable();
    }
}

// Configurar botones de acción
function setupActionButtons() {
    const section = document.getElementById('secuencia');
    if (!section) return;

    if (!section.querySelector('.action-buttons')) {
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'action-buttons';
        // agrega botones si quieres aquí

        const h1 = section.querySelector('h1');
        h1.after(buttonsDiv);
    }
}

// --- Filtros opcionales: actívalos cuando los uses de verdad ---
// function setupFilters() { ... }

// Funciones de botones
function addSecuenciaRow() {
    const newRow = {
        numero: '00000000',
        cspc: 'C00000',
        linea: 'XL1',
        sph: 0,
        cantidad: 0,
        duracion: '',
        banco: 0,
        secuencia: '',
        cambios: '',
        secuencia2: '',
        cambios2: ''
    };

    secuenciaData.push(newRow);
    renderSecuenciaTable();
}

function deleteLastSecuenciaRow() {
    if (secuenciaData.length > 0) {
        if (confirm('¿Estás seguro de eliminar la última fila?')) {
            secuenciaData.pop();
            renderSecuenciaTable();
        }
    }
}

function saveSecuenciaData() {
    localStorage.setItem('secuenciaData', JSON.stringify(secuenciaData));
    alert('Datos guardados correctamente');
}

function exportSecuenciaToExcel() {
    const dataStr = 'data:text/csv;charset=utf-8,' +
        encodeURIComponent(convertSecuenciaToCSV(secuenciaData));
    const downloadLink = document.createElement('a');
    downloadLink.href = dataStr;
    downloadLink.download = 'secuencia.csv';
    downloadLink.click();
}

function convertSecuenciaToCSV(data) {
    const headers = [
        'NUMERO', 'CSPC', 'LINEA', 'SPH', 'CANTIDAD', 'DURACION',
        'BANCO', 'SECUENCIA', 'CAMBIOS', 'SECUENCIA2',  'CAMBIOS2'
    ];

    let csv = headers.join(',') + '\n';

    data.forEach(row => {
        const values = [
            row.numero, row.cspc, row.linea, row.sph, row.cantidad,
            row.duracion, row.banco, row.secuencia, row.cambios,
            row.secuencia2, row.cambios2
        ];
        csv += values.join(',') + '\n';
    });

    return csv;
}

function printSecuenciaTable() {
    window.print();
}

// Función de logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

document.getElementById('btnLogout').addEventListener('click', logout);

/*function logout() {
    localStorage.removeItem('token');
    window.location.href = '../index.html';
} */

// Cargar datos guardados
window.addEventListener('load', function() {
    const savedData = localStorage.getItem('secuenciaData');
    if (savedData) {
        const shouldLoad = confirm('Se encontraron datos guardados, ¿Deseas cargarlos?');
        if (shouldLoad) {
            secuenciaData = JSON.parse(savedData);
            renderSecuenciaTable();
        }
    }
});

// Calcular estadísticas
function calculateSecuenciaStats() {
    let totalCantidad = 0;
    let totalDuracion = 0;
    let countWithSeq = 0;

    secuenciaData.forEach(row => {
        totalCantidad += parseInt(row.cantidad) || 0;
        if (row.duracion) {
            totalDuracion += parseFloat(row.duracion);
        }
        if (row.secuencia) {
            countWithSeq++;
        }
    });

    return {
        totalCantidad,
        totalDuracion: totalDuracion.toFixed(2),
        countWithSeq,
        totalRows: secuenciaData.length
    };
}

// Ordenar tabla
function sortTable(columnIndex, ascending = true) {
    const tbody = document.querySelector('#secuencia tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();

        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);

        if (!isNaN(aNum) && !isNaN(bNum)) {
            return ascending ? aNum - bNum : bNum - aNum;
        }

        return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}