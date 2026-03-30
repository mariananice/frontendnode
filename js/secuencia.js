// Variables globales
let secuenciaData = [];

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    intializeMenu();
    loadSecuenciaData();
    setupActionButtons();
    setupFilters();
});

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
    })

    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Cargar datos de secuencia
function loadSecuenciaData() {
    // Datos de ejemplo
    secuenciaData = [
        { numero: '85560226', csp: 'C4087', linea: 'XL1', sph: 519, cantidad: 1680, duracion: 103.109827, banco: 2.8, secuencia: 6, cambios: 6, secuencia2: '', cambios2: '' },
        { numero: '84666755', csp: 'C4088', linea: 'XL1', sph: 555, cantidad: 2000, duracion: 114.108108, banco: 2.6, secuencia: 1, cambios: 1, secuencia2: '', cambios2: '' },
        { numero: '84652941', csp: 'C4106', linea: 'XL2', sph: 514, cantidad: 1200, duracion: 146.077821, banco: 1.4, secuencia: '', cambios: '', secuencia2: 2, cambios2: 2 },
        { numero: '84652942', csp: 'C4109', linea: 'XL2', sph: 515, cantidad: 1200, duracion: 145.805825, banco: 2.1, secuencia: '', cambios: '', secuencia2: 7, cambios2: 7 },
        { numero: '84652981', csp: 'C4118', linea: 'XL2', sph: 430, cantidad: 0, duracion: '', banco: 4.2, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '84652982', csp: 'C4119', linea: 'XL2', sph: 430, cantidad: 0, duracion: '', banco: 5.9, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '23381632', csp: 'C4144', linea: 'XL1', sph: 554, cantidad: 0, duracion: '', banco: 4.8, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '23381639', csp: 'C4145', linea: 'XL1', sph: 460, cantidad: 0, duracion: '', banco: 8.1, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '84688122', csp: 'C4146', linea: 'XL1', sph: 555, cantidad: 600, duracion: 70.8648649, banco: 2.7, secuencia: 7, cambios: 7, secuencia2: '', cambios2: '' },
        { numero: '84688125', csp: 'C4148', linea: 'XL1', sph: 556, cantidad: 450, duracion: 54.5611511, banco: 2.2, secuencia: 8, cambios: 8, secuencia2: '', cambios2: '' },
        { numero: '23507633', csp: 'C4149', linea: 'XL1', sph: 569, cantidad: 0, duracion: '', banco: 3.9, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '84688126', csp: 'C4152', linea: 'XL2', sph: 500, cantidad: 0, duracion: '', banco: 5.4, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '84496738', csp: 'C4155', linea: 'XL2', sph: 484, cantidad: 0, duracion: '', banco: 4.7, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '84496739', csp: 'C4156', linea: '0', sph: 484, cantidad: 0, duracion: '', banco: 5.0, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '84496740', csp: 'C4157', linea: 'XL1', sph: 479, cantidad: 960, duracion: 126.250522, banco: 1.9, secuencia: 9, cambios: 9, secuencia2: '', cambios2: '' },
        { numero: '84496741', csp: 'C4158', linea: '0', sph: 479, cantidad: 960, duracion: 0, banco: 1.9, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '23393591', csp: 'C4159', linea: 'XL2', sph: 536, cantidad: 0, duracion: '', banco: 9.3, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '84340140', csp: 'C4160', linea: 'XL1', sph: 536, cantidad: 0, duracion: '', banco: 15.3, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '23393592', csp: 'C4162', linea: 'XL1', sph: 460, cantidad: 0, duracion: '', banco: 2.3, secuencia: '', cambios: '', secuencia2: '', cambios2: '' },
        { numero: '84512891', csp: 'C4163', linea: '0', sph: 460, cantidad: 0, duracion: '', banco: 2.3, secuencia: '', cambios: '', secuencia2: '', cambios2: '' }
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

        // Determinar clase de línea
        let lineaClass = 'col-linea-xl2';
        if (row.linea === 'XL1') lineaClass = 'col-linea-xl1';
        if (row.linwa === '0') lineaClass = 'col-linea-0';

        tr.innerHTML = `
            <td class="col-numero">${row.numero}</td>
            <td class="col-cspc">${row.cscp}</td>
            <td class="col-numero">${row.numero}</td>
            <td class="${lineaClass}">${row.linea}</td>
            <td class="col-sph">${row.sph}</td>
            <td class="col-cantidad editable-cell" data-row"${index}" data-field="cantidad">${row.cantidad}</td>
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

// Configurar celdas editables
function setupEditableCells() {
    const editableCells = document.querySelectorAll('.editable-cell');

    editableCells.forEach(cell => {
        cell.addEventListener('dbclick', function() {
            const currentValue = this.textContent;
            const rowIndex = this.getAttribute('data-row');
            const field = this.getAttribute('data-row');
            
            const input = document.createElement('input');
            input.type = 'number';
            input.value = currentValue;

            this.textContent = '';
            this.appendChild(input);
            input.focus();
            input.select();

            input.addEventListener('blur', function() {
                const newValue = parseInt(this.value) || 0;
                secuenciaData[rowIndex][field] = newValue;
                cell.textContent = newValue;

                // Recalcular duración si es necesario
                if (field === 'cantidad') {
                    this.blur();
                }
            });
        });
    });
}

// Configurar celdas editables
function setupEditableCells() {
    editableCells.forEach(cell => {
        cell.addEventListener('dblclick', function() {

            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    this.blur();
                }
            });
        });
    });
}


// Recalcular duración
function recalculateDuration(rowIndex) {
    const row = secuenciaData[rowIndex];
    if (row.cantidad > 0 && row.sph > 0) {
        row.duracion = (row.cantidad / row.sph * 60).toFixed(6);
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
        buttonsDiv.innerHTML = `
            <button class="btn btn-primary" onclick="addSecuenciaRow()">
                <i class="bi bi-plus-circle"></i> Agregar Fila
            </button>
            <button class="btn btn-danger" onclick="deleteLastSecuenciaRow()">
                <i class="bi bi-trash"></i> Eliminar Última Fila
            </button>
            <button class="btn btn-success" onclick="saveSecuenciaData()">
                <i class="bi bi-save"></i> Guardar
            </button>
            <button class="btn btn-warning" onclick="exportSecuenciaToExcel()">
                <i class="bi bi-file-earmark-excel"></i> Exportar a Excel
            </button>
            <button class="btn btn-info" onclick="printSecuenciaTable()">
                <i class="bi bi-printer"></i> Imprimir
            </button>
        `;

        const h1 = section.querySelector('h1');
            h1.after(buttonsDiv);
    }
}

// Configurar filtros
function setupFilters() {
    const section = document.getElementById('secuencia');

    if (!section) return;

    if (!section.querySelector('.filter-container')) {
        const filtersDiv = document.createElement('div');
        filtersDiv.className = 'filter-container';
        filtersDiv.innerHTML = `
            <div class="filter-group">
                <label>Filtrar por Línea:</label>
                <select id="filterLinea" onchange="filterByLine()">
                    <option value="all">Todas</option>
                    <option value="XL1">XL1</option>
                    <option value="XL2">XL2</option>
                    <option value="0">0</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Buscar por CSPC:</label>
                <input type="text" id="searchCspc" placeholder="Ej: C4087" oninput="searchByCspc()">
            </div>
            <div class="filter-group">
                <label>Filtrar por Secuencia:</label>
                <select id="filterSecuencia" onchange="filterBySecuencia()">
                    <option value="all">Todas</option>
                    <option value="withSeq">Con Secuencia</option>
                    <option value="withoutSeq">Sin Secuencia</option>
                </select>
            </div>
        `;

        const actionButtons = section.querySelectorAll('action-buttons');
        actionButtons.after(filtersDiv);
    }
}

// Funciones de filtrado
function filterByLine() {
    const line = DocumentTimeline.getElementById('filterLinea').value;
    const rows = document.getSelectorAll('#secuencia tbody tr');

    rows.forEach(row => {
        const lineCell = row.children[2];
        if (line === 'all' || lineCell.textContent === line) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function searchByCspc() {
    const query = document.getElementById('searchCspc').vsalue.toLowerCase();
    const rows = document.querySelectorAll('#secuencia tbody tr');

    rows.forEach(row => {
        const cspcCell =  row.children[1].textContent.toLowerCase();
        if (cspcCell.includes(query)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function filterBySecuencia() {
    const filter = document.getElementById('filterSecuencia').value;
    const rows = document.querySelectorAll('#secuencia tbody tr');

    rows.forEach(row => {
        const secCell = row.children[7].textContent.trim();
        if (filter === 'all') {
            row.style.display = '';
        } else if (filter === 'withSeq' && secCell !== '') {
            row.style.display = '';
        } else if (filter === 'withoutSeq' && secCell === '') {
            row.style.display = '';
        } else {
            row.style.diaplay = 'none';
        }
    });
}

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
    const dataStr = 'data:text/csv;charset=utf-8' +
        encodeURIComponent(convertSecuencuaToCSV(secuenciaData));
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
    if (confirm('¿Estás seguro de que quieres cerras sesión?')) {
        localStorage.removeItem('token');
        window.location.href = '../index.html';
    }
}

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
function sortTable(columnIndex, ascending =  true) {
    const tbody = document.querySelector('#secuencia tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.celss[columnIndex].textContent.trim();

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