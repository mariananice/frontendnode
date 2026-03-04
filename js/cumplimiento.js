// Variables globales
let cumplimientoData = [];

// Inicializar cuando carga la página 
document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
    loadCumplimientoData();
    checkUserLogin();
});

// Verificar si el usuario está logueado
function checkUserLogin() {
    const user = localStorage.getItem('registeredUser');
    if (!user) {
        // Comentar esta línea si quieres probar sin login
        // window.location.href = 'index.html';
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

    cumplimientoData.forEach((row, index) => {
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

        // Actualizar totales
        const cumplimientoGlobal = Math.round((totalProd / totalProg) * 100);
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
    });
}

// Función de logout
function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('registeredUser');
        window.location.href = 'index.html';
    }
}

// Funciones para otras tablas (pueden ser expandidad según necesidad)
function addCumplimientoRow() {
    const newRow = {
        cspc: 'C0000',
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
    const dataStr = 'data:text/csv;charset=utf-8' +
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
            row.cspc, row.numero, row.nombre, row.orig, row.totalProd,
            row.perdidas, row.cumplimiento + '%', row.progStrokes,
            row.totalStrokes, row.ganados
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
    const savedData = this.localStorage.getItem('cumplimientoData');
    if(savedData) {
        const shouldLoad = confirm('Se encontraron datos guardados, ¿Deseas cargarlos?');
        if (shouldLoad) {
            cumplimientoData = JSON.parse(savedData);
            renderCumplimientoTable();
        }
    }
});