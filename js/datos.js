// Variables globales
let datosData = [];

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
    loadDatosData();
    setupActionButtons();
});

// Sistema de navegación entre secciones
function initializeMenu() {
    const menuItems = document.querySelectorAll('.menu li');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(li => li.classList.remove('active')); //Remover clase active de todos

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

// Cargar datos
function loadDatosData() {
    datosData = [
        { part: 'PNL-DASH STL 1UB', numero: '85560226', cspc: 'C4087', modelo: 'IT1', rack: 'MAC32145', linea: 'XL1', golpe: 2, sphAnt: 519, sphObj: 555, stdPallet: 560, stdRack: 40, racksPrograma: 114, loopRacks: 114, capTotal: 4560, danados: 0, invDiario: '', cap: 4560, req: 1440, mezcla: '100%', desocup: 64 },
        { part: 'PNL-DASH EXT LWR STL 1UB', numero: '84666755', cspc: 'C4088', modelo: 'IT1', rack: 'MAC32142', linea: 'XL1', golpe: 2, sphAnt: 555, sphObj: 555, stdPallet: 500, stdRack: 100, racksPrograma: 54, loopRacks: 54, capTotal: 5400, danados: 0, invDiario: '', cap: 5400, req: 1440, mezcla: '100%', desocup: 64 },
        { part: 'PNL-BDY SI OTR L STL 1UB', numero: '84652941', cspc: 'C4106', modelo: 'CREW', rack: 'MAC29931', linea: 'XL2', golpe: 1, sphAnt: 514, sphObj: 514, stdPallet: 400, stdRack: 10, racksPrograma: 276, loopRacks: 276, capTotal: 2760, danados: 0, invDiario: '', cap: 2760, req: 1319, mezcla: '92%', desocup: 59 },
        { part: 'PNL-BDY SI OTR R STL 1UB', numero: '84652942', cspc: 'C4109', modelo: 'CREW', rack: 'MAC29933', linea: 'XL2', golpe: 1, sphAnt: 515, sphObj: 515, stdPallet: 400, stdRack: 10, racksPrograma: 299, loopRacks: 299, capTotal: 2990, danados: 0, invDiario: '', cap: 2990, req: 1319, mezcla: '92%', desocup: 59 },
        { part: 'PNL-BDY SI OTR L STL 1UB', numero: '84652981', cspc: 'C4118', modelo: 'OREG', rack: 'MAC29934', linea: 'XL2', golpe: 1, sphAnt: 430, sphObj: 430, stdPallet: 500, stdRack: 10, racksPrograma: 85, loopRacks: 85, capTotal: 850, danados: 0, invDiario: '', cap: 850, req: 116, mezcla: '8%', desocup: 6 },
        { part: 'PNL-BDY SI OTR R STL 1UB', numero: '84652982', cspc: 'C4119', modelo: 'OREG', rack: 'MAC29936', linea: 'XL2', golpe: 1, sphAnt: 430, sphObj: 430, stdPallet: 500, stdRack: 10, racksPrograma: 85, loopRacks: 85, capTotal: 850, danados: 0, invDiario: '', cap: 850, req: 116, mezcla: '8%', desocup: 6 },
        { part: 'PNL-BDY OTR RR STL 2ST', numero: '23381632', cspc: 'C4144', modelo: 'CC', rack: 'MAC29428', linea: 'XL1', golpe: 2, sphAnt: 554, sphObj: 554, stdPallet: 600, stdRack: 172, racksPrograma: 16, loopRacks: 16, capTotal: 2752, danados: 0, invDiario: '', cap: 2752, req: 855, mezcla: '59%', desocup: 38 },
        { part: 'PNL-BDY OTR RR STL 2ST', numero: '23381639', cspc: 'C4145', modelo: 'MREG', rack: 'MAC30741', linea: 'XL1', golpe: 2, sphAnt: 460, sphObj: 460, stdPallet: 600, stdRack: 172, racksPrograma: 10, loopRacks: 10, capTotal: 1720, danados: 0, invDiario: '', cap: 1720, req: 116, mezcla: '8%', desocup: 6 },
        { part: 'PNL-ROCF OTR STL 2ST', numero: '84688122', cspc: 'C4146', modelo: 'CC', rack: 'MAC28905', linea: 'XL1', golpe: 1, sphAnt: 555, sphObj: 555, stdPallet: 350, stdRack: 17, racksPrograma: 140, loopRacks: 140, capTotal: 2380, danados: 0, invDiario: '', cap: 2380, req: 875, mezcla: '61%', desocup: 39 },
        { part: 'PNL-SUNROOF OTR STL 2ST', numero: '84688125', cspc: 'C4148', modelo: 'CF5', rack: 'MAC32248', linea: 'XL1', golpe: 1, sphAnt: 556, sphObj: 556, stdPallet: 350, stdRack: 17, racksPrograma: 66, loopRacks: 66, capTotal: 1122, danados: 0, invDiario: '', cap: 1122, req: 433, mezcla: '30%', desocup: 20 },
        { part: 'RNF-SUNROOF OPG INR STL 2ST', numero: '23507633', cspc: 'C4149', modelo: 'CF5', rack: 'MAC28908', linea: 'XL1', golpe: 1, sphAnt: 569, sphObj: 569, stdPallet: 654, stdRack: 140, racksPrograma: 18, loopRacks: 24, capTotal: 2520, danados: 6, invDiario: 6, cap: 2520, req: 433, mezcla: '30%', desocup: 20 },
        { part: 'PNL-ROOF OTR STL 2ST', numero: '84688126', cspc: 'C4152', modelo: 'MREG', rack: 'MAC28907', linea: 'XL2', golpe: 2, sphAnt: 430, sphObj: 500, stdPallet: 600, stdRack: 20, racksPrograma: 69, loopRacks: 69, capTotal: 1380, danados: 0, invDiario: '', cap: 1380, req: 146, mezcla: '10%', desocup: 7 },
        { part: 'PNL-FDR OTR L STL 1UB', numero: '84496738', cspc: 'C4155', modelo: 'CHV', rack: 'MAC30067', linea: 'XL2', golpe: 1, sphAnt: 484, sphObj: 484, stdPallet: 500, stdRack: 28, racksPrograma: 84, loopRacks: 84, capTotal: 2352, danados: 0, invDiario: '', cap: 2352, req: 767, mezcla: '53%', desocup: 35 }
    ];

    renderDatosTable();
}

// Renderizar tabla
function renderDatosTable() {
    const tbody = document.querySelector('#datos tbody');

    if (!tbody || !datosData) return;

    tbody.innerHTML = '';

    datosData.forEach((row, index) => {
        const tr = document.createElement('tr');

        const lineaClass = row.linea === 'XL1' ? 'col-linea-xl1' : 'col-linea-xl2';

        tr.innerHTML = `
            <td>${row.part}</td>
            <td class="col-numero">${row.numero}</td>
            <td>${row.cspc}</td>
            <td class="col-modelo">${row.modelo}</td>
            <td class="col-rack">${row.rack}</td>
            <td class="${lineaClass}">${row.linea}</td>
            <td class="col-golpe">${row.golpe}</td>
            <td class="col-sph">${row.sphAnt}</td>
            <td class="col-sph">${row.sphObj}</td>
            <td class="col-std-pallet">${row.stdPallet}</td>
            <td class="col-std-rack">${row.stdRack}</td>
            <td class="col-programa">${row.racksPrograma}</td>
            <td class="col-loop">${row.loopRacks}</td>
            <td class="col-capacidad">${row.capTotal}</td>
            <td class="col-danados">${row.danados}</td>
            <td class="col-inv-diario">${row.invDiario}</td>
            <td class="col-cap">${row.cap}</td>
            <td class="col-req">${row.req}</td>
            <td class="col-mezcla">${row.mezcla}</td>
            <td class="col-desocupabilidad">${row.desocup}</td>
        `;

        tbody.appendChild(tr);
    });
}

// Configurar botones de acción
function setupActionButtons() {
    const section = document.getElementById('datos');

    if (!section) return;

    if (!section.querySelector('.action-buttons')) {
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'action-buttons';
        buttonsDiv.innerHTML = `
            <button class="btn btn-primary" onclick="addDatosRow()">
                <i class="bi bi-plus-circle"></i> Agregar Fila
            </button>
            <button class="btn btn-danger" onclick="deleteLastDatosRow()">
                <i class="bi bi-trash"></i> Eliminar Última Fila
            </button>
            <button class="btn btn-success" onclick="saveDatosData()">
                <i class="bi bi-save"></i> Guardar
            </button>
            <button class="btn btn-warning" onclick="exportDatosToExcel()">
                <i class="bi bi-file-earmark-excel"></i> Exportar a Excel
            </button>
            <button class="btn btn-info" onclick="printDatosTable()">
                <i class="bi bi-printer"></i> Imprimir
            </button>
        `;

        const h1 = section.querySelector('h1');
        h1.after(buttonsDiv);
    }
}

// Funciones de botones
function addDatosRow() {
    const newRow = {
        part: 'NUEVO PARTE',
        numero: '00000000',
        cspc: 'C0000',
        modelo: 'NEW',
        rack: 'MAC00000',
        linea: 'XL1',
        golpe: 0,
        sphAnt: 0,
        phbObj: 0,
        stdPallet: 0,
        stdRack: 0,
        racksPrograma: 0,
        loopRacks: 0,
        capTotal: 0,
        danados: 0,
        invDiario: '',
        cap: 0,
        req: 0,
        mezcla: '0%',
        desocup: 0
    };

    datosData.push(newRow);
    renderDatosTable();
}

function deleteLastDatosRow() {
    if (datosData.length > 0) {
        if (confirm('¿Estás seguro de eliminar la última fila?')) {
            datosData.pop();
            renderDatosTable();
        }
    }
}

function saveDatosData() {
    localStorage.setItem('datosData', JSON.stringify(datosData));
    alert('Datos guardados correctamente');
}

function exportDatosToExcel() {
    const dataStr = 'data:text/csv;charset=utf-8' +
        encodeURIComponent(convertDatosToCSV(datosData));
    const downloadLink = document.createElement('a');
    downloadLink.href = dataStr;
    downloadLink.download = 'datos_produccion.csv';
    downloadLink.click();
}

function convertDatosToCSV(data) {
    const headers = [
        'PART', 'NUMERO', 'CSPC', 'MODELO', 'RACK', 'LINEA', 'GOLPE',
        'SPH ANT', 'SPH OBJ', 'STD PALLET', 'STD RACK', 'RACKS PROGRAMA',
        'LOOP RACKS', 'CAP TOTAL', 'DAÑADOS', 'INV DIARIO', 'CAP', 'REQ', 'MEZCLA', 'DESOCUP'
    ];

    let csv = headers.join(',') + '\n';

    data.forEach(row => {
        const values = [
            row.part, row.numero, row.cspc, row.modelo, row.rack, row.linea,
            row.golpe, row.sphAnt, row.sphObj, row.stdPallet, row.stdRack,
            row.racksPrograma, row.loopRacks, row.capTotal, row.danados,
            row.invDiario, row.cap, row.req, row.mezcla, row.desocup
        ];
        csv += values.join(',') + '\n';
    });

    return csv;
}

function printDatosTable() {
    window.print();
}

// Función de logout
function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('token');
        window.location.href = '../index.html';
    }
}

// Cargar datos guardados
window.addEventListener('load', function() {
    const savedData = this.localStorage.getItem('datosData');
    if (savedData) {
        const shouldLoad = confirm('Se ecnontraron datos guardados, ¿Deseas cargarlos?');
        if (shouldLoad) {
            datosData = JSON.parse(savedData);
            renderDatosTable();
        }
    }
});

// Calcular totales
function calculateTotals() {
    let totalCapacidad = 0;
    let totalReq = 0;

    datosData.forEach(row => {
        totalCapacidad += row.capTotal;
        totalReq += row.req;
    });

    return {
        totalCapacidad,
        totalReq,
        mezclaPromedio: ((totalReq / totalCapacidad) * 100).toFixed(0) + '%'
    };
}