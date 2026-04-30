// Variables globales
let planeacionData = {
    xl1: []
};

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
    loadPlaneacionData();
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
            llenarNotificacionesPlaneacion();
            abrirPanel(panelNotificaciones);
        });
    }

    document.querySelectorAll('[data-close-panel]').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.closest('.center-modal');
            if (panel) panel.classList.remove('open');
        });
    });

    const searchInput = document.getElementById('searchPlaneacion');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            filterPlaneacionTable(query);
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

    document.getElementById('perfilPlaneacionNombre').textContent = user?.nombre || 'Usuario';
    document.getElementById('perfilPlaneacionCorreo').textContent = user?.email || 'correo@ejemplo.com';
    document.getElementById('perfilPlaneacionRol').textContent = user?.rol || 'usuario';
    document.getElementById('perfilPlaneacionGmin').textContent = user?.GMIN || 'GMIN';
}

// Notificaciones en Usuarios (ejemplo estático)
function llenarNotificacionesPlaneacion() {
    const contenedor = document.getElementById('listaNotificacionesPlaneacion');
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

//Sistema de navegación entre secciones
function initializeMenu() {
    const menuItems = document.querySelectorAll('.menu li');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(li => li.classList.remove('active')); //Remover clase active de todos

            this.classList.add('active'); // Agregar clase al clickeado

            // Obtener la sección a mostrar
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });
}

function showSection(sectionId) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar la sección selecionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Cargar datos de planeación
function loadPlaneacionData() {
    // Datos de ejemplo para XL1
    planeacionData.xl1 = [
        {
            hora: '06:00:00 a. m.',
            tiempoProd: 114,
            cambios: '',
            utilizacion: 0.08,
            part: '84666755',
            cspc: 'C4088',
            doh6am: 2.55,
            conteoHoras: '02:00:00',
            horasTurno: 2.00,
            piezasConsideradas: 128,
            dohSecuencia: 2.5,
            descripcion: 'C4088PNL-DASH EXT LWR STL 1UB',
            cantidad: 2000,
            strokes: 1000,
            partes: 2000,
            capRacks: 1900,
            dif: -100,
            velocidad: 64,
            hrsRecuperar: 1.5625,
            cobertura: 54.69
        },
        {
            hora: '07:54:00 a. m.',
            tiempoProd: 168,
            cambios: 168,
            utilizacion: 0.21,
            part: '85655552',
            csp: 'C4242',
            doh6am: 2.22,
            conteoHoras: '3:54:00',
            horasTurno: 3.90,
            piezasConsideradas: 215,
            dohSecuencia: 1.9,
            descripcion: 'C4242PNL-PUBX INR UPR L STL 2ST',
            cantidad: 1200,
            strokes: 1200,
            partes: 2400,
            capRacks: 1048,
            dif: -152,
            velocidad: 55,
            hrsRecuperar: 2.76363636,
            cobertura: 44.95,
            highlight: 'yellow'
        },
        {
            hora: '10:42:00 a. m.',
            tiempoProd: 83,
            cambios: '',
            utilizacion: 0.27,
            part: '23399998',
            csp: 'C4246',
            doh6am: 2.71,
            conteoHoras: '6:42:00',
            horasTurno: 6.70,
            piezasConsideradas: 19,
            dohSecuencia: 4.4,
            descripcion: 'C4246PNL-PUBX INR UPR L STL 2ST',
            cantidad: 600,
            strokes: 600,
            partes: 1200,
            capRacks: 600,
            dif: 0,
            velocidad: '',
            hrsRecuperar: '',
            cobertura: 95.00,
            highlight: 'yellow'
        },
        {
            hora: '12:04:00 p. m.',
            tiempoProd: 240,
            cambios: 240,
            utilizacion: 0.45,
            part: '#N/A',
            csp: '#N/A',
            doh6am: 0.00,
            conteoHoras: '8:04:00',
            horasTurno: 8.07,
            piezasConsideradas: '#N/A',
            dohSecuencia: '#N/A',
            descripcion: 'NS',
            cantidad: 0,
            strokes: 0,
            partes: 0,
            capRacks: '#N/A',
            dif: '#N/A',
            velocidad: '#N/A',
            hrsRecuperar: '#N/A',
            cobertura: '#N/A',
            tipo: 'ns'
        },
        {
            hora: '04:04:00 p. m.',
            tiempoProd: 116,
            cambios: 116,
            utilizacion: 0.53,
            part: '#N/A',
            csp: '#N/A',
            doh6am: 0.00,
            conteoHoras: '12:04:00',
            horasTurno: 12.07,
            piezasConsideradas: '#N/A',
            dohSecuencia: '#N/A',
            descripcion: 'NS',
            cantidad: 0,
            strokes: 0,
            partes: 0,
            capRacks: '#N/A',
            dif: '#N/A',
            velocidad: '#N/A',
            hrsRecuperar: '#N/A',
            cobertura: '#N/A',
            tipo: 'ns'
        },
        {
            hora: '06:00:00 p. m.',
            tiempoProd: 103,
            cambios: '',
            utilizacion: 0.61,
            part: '85560226',
            csp: 'C4087',
            doh6am: 2.80,
            conteoHoras: '14:00:00',
            horasTurno: 14.00,
            piezasConsideradas: 896,
            dohSecuencia: 2.1,
            descripcion: 'C4087PNL-DASH STL 1UB',
            cantidad: 1680,
            strokes: 840,
            partes: 1680,
            capRacks: 720,
            dif: -960,
            velocidad: 64,
            hrsRecuperar: '',
            cobertura: 15
        },
        {
            hora: '07:43:00 p. m.',
            tiempoProd: 71,
            cambios: '',
            utilizacion: 0.66,
            part: '84688122',
            csp: 'C4146',
            doh6am: 2.70,
            conteoHoras: '15:43:00',
            horasTurno: 15.72,
            piezasConsideradas: 618,
            dohSecuencia: 1.7,
            descripcion: 'C4146PNL-ROOF OTR STL 2ST',
            cantidad: 600,
            strokes: 600,
            partes: 600,
            capRacks: 323,
            dif: -277,
            velocidad: 59,
            hrsRecuperar: 7.1025641,
            cobertura: 52.74358974
        },
        {
            hora: '08:53:00 p. m.',
            tiempoProd: 55,
            cambios: '',
            utilizacion: 0.70,
            part: '84688125',
            csp: 'C4148',
            doh6am: 2.23,
            conteoHoras: '16:53:00',
            horasTurno: 16.88,
            piezasConsideradas: 338,
            dohSecuencia: 1.6,
            descripcion: 'C4148PNL-SUNROOF OTR STL 2ST',
            cantidad: 450,
            strokes: 450,
            partes: 450,
            capRacks: 119,
            dif: -331,
            velocidad: 20,
            hrsRecuperar: 16.55,
            cobertura: 50.15
        },
        {
            hora: '09:47:00 p. m.',
            tiempoProd: 156,
            cambios: 156,
            utilizacion: 0.82,
            part: '84495740',
            csp: 'C4157',
            doh6am: 1.90,
            conteoHoras: '17:47:00',
            horasTurno: 17.78,
            piezasConsideradas: 427,
            dohSecuencia: 2.1,
            descripcion: 'C4157PNL-FDR OTR L STL 1UB',
            cantidad: 960,
            strokes: 960,
            partes: 1920,
            capRacks: 448,
            dif: -512,
            velocidad: '',
            hrsRecuperar: 21.33333333,
            cobertura: 61.83333333
        },
        {
            hora: '12:23:00 a. m.',
            tiempoProd: 336,
            cambios: 336,
            utilizacion: 1.06758496,
            part: '#N/A',
            csp: '#N/A',
            doh6am: 0.00,
            conteoHoras: '20:23:00',
            horasTurno: 20.38,
            piezasConsideradas: '#N/A',
            dohSecuencia: '#N/A',
            descripcion: 'NS',
            cantidad: 0,
            strokes: 0,
            partes: 0,
            capRacks: '#N/A',
            dif: '#N/A',
            velocidad: '#N/A',
            hrsRecuperar: '#N/A',
            cobertura: '#N/A',
            tipo: 'ns'
        }
    ];

    // Agregar filas vacías adicionales
    for (let i = 0; i < 7; i++) {
        planeacionData.xl1.push({
            hora: '05:59:00 a. m.',
            tiempoProd: 0,
            cambios: '',
            utilizacion: i < 6 ? 1.06758496 : 0,
            part: '#N/A',
            csp: '#N/A',
            doh6am: 0.00,
            conteoHoras: '1:59:00',
            horasTurno: 25.98,
            piezasConsideradas: '#N/A',
            dohSecuencia: '#N/A',
            descripcion: 'NS',
            cantidad: 0,
            strokes: 0,
            partes: 0,
            capRacks: '#N/A',
            dif: '#N/A',
            velocidad: '#N/A',
            hrsRecuperar: '#N/A',
            cobertura: '#N/A',
            tipo: 'ns'
        });
    }

    renderPlaneacionTable();
}

//Renderizar tabla de planeación
function renderPlaneacionTable() {
    const tbody = document.querySelector('#planeacion table tbody');

    if (!tbody || planeacionData.xl1) return;

    tbody.innerHTML = '';

    let totalStrokes = 0;
    let totalPartes = 0;

    planeacionData.xl1.forEach((row, index) => {
        const tr = document.createElement('tr');

        // Sumar totales
        if (!isNaN(parseInt(row.strokes))) {
            totalStrokes += parseInt(row.strokes);
        }
        if (!isNaN(parseInt(row.partes))) {
            totalPartes += parseInt(row.partes);
        }

        // Determinar clases para celdas especiales
        const getColorClass = (value, field) => {
            if (field === 'dif') {
                if (value === '#N/A') return 'cell-na';
                const num = parseFloat(value);
                return num < 0 ? 'text-red' : 'text-green';
            }
            if (value === '#N/A') return 'cell-na';
            return '';
        };

        const highlightClass = row.highlight === 'yellow' ? 'bg-yellow' : '';
        const isNS = row.tipo === 'ns';

        tr.innerHTML = `
            <td>${row.hora}</td>
            <td>${row.tiempoProd}</td>
            <td>${row.cambios}</td>
            <td>${row.utilizacion}</td>
            <td class="${row.part === '#N/A' ? 'cell-na' : ''}">${row.part}</td>
            <td class="${row.cspc === '#N/A' ? 'cell-na' : ''}">${row.cspc}</td>
            <td>${row.doh6am}</td>
            <td>${row.conteoHoras}</td>
            <td>${row.horasTurno}</td>
            <td class="${highlightClass}">${row.piezasConsideradas}</td>
            <td class="${row.dohSecuencia === '#N/A' ? 'cell-na' : ''}">${row.dohSecuencia}</td>
            <td class="${isNS ? 'bg-yellow' : ''} text-left">${isNS ? '<strong>' + row.descripcion + '</strong>' : row.descripcion}</td>
            <td>${row.cantidad}</td>
            <td>${row.strokes}</td>
            <td>${row.partes}</td>
            <td class="${row.capRacks === '#N/A' ? 'cell-na' : ''}">${row.capRacks}</td>
            <td class="${getColorClass(row.dif, 'dif')}">${row.dif}</td>
            <td class="${row.velocidad === '#N/A' ? 'cell-na' : ''}">${row.velocidad}</td>
            <td class="${row.hrsRecuperar === '#N/A' ? 'cell-na' : ''}">${row.hrsRecuperar}</td>
            <td class="${row.cobertura === '#N/A' ? 'cell-na' : ''}">${row.cobertura}</td>
            `;

            tbody.appendChild(tr);
    })

    // Actualizar totales
    const totalCells = document.querySelectorAll('#planeacion tfoot .footer-total');
    if (totalCells[0]) totalCells[0].textContent = totalStrokes;
    if (totalCells[1]) totalCells[1].textContent = totalPartes;
}

// Renderizar tabla de planeación
/*function renderPlaneacionTable() {
    // Actualizar totales
    const totalCells = document.querySelectorAll('#planeación tfoot .footer-total');
    if(totalCells[0]) totalCells[0].textContent = totalStrokes;
    if(totalCells[1]) totalCells[1].textContent = totalPartes;
}*/

function filterPlaneacionTable(query) {
    const rows = document.querySelectorAll('#planeacion table tbody tr');

    rows.forEach(row => {
        // ajusta índices según el orden de tus columnas
        // (después de XL!, la primera celda visible es hora)
        const hora = row.children[1]?.textContent.toLowerCase() || '';
        const tiempoProd = row.children[2]?.textContent.toLowerCase() || '';
        const cambios = row.children[4]?.textContent.toLowerCase() || '';
        const part = row.children[5]?.textContent.toLowerCase() || '';
        const cspc = row.children[6]?.textContent.toLowerCase() || '';
        const descripcion = row.children[12]?.textContent.toLowerCase() || '';

        const text = `${hora} ${tiempoProd} ${cambios} ${part} ${cspc} ${descripcion}`;

        row.style.display = text.includes(query) ? '' :  'none';
    });
}

// Configurar botones de acción
function setupActionButtons() {
    const section = document.getElementById('planeacion');

    /*
    // Crear contenedor de botones si no existe
    if (!section,querySelector('.action-buttons')) {
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'action-buttons';
        buttonsDiv.innerHTML = `
            <button class="btn btn-primary" onclick="addRow()">
                <i class="bi bi-plus-circle"></i> Agregar Fila
            </button>
            <button class="btn btn-danger" onclick="deleteLastRow()">
                <i class="bi bi-trash"></i> Eliminar Última Fila
            </button>
            <button class="btn btn-success" onclick="saveData()">
                <i class="bi bi-save"></i> Guardar
            </button>
            <button class="btn btn-warning" onclick="exportToExcel()">
                <i class="bi bi-file-earmark-excel"></i> Exportar a Excel
            </button>
            <button class="btn btn-info" onclick="printTable()">
                <i class="bi bi-printer"></i> Imprimir
            </button>
            `;

            const h1 = section.querySelector('h1');
            h1.after(buttonsDiv);
    }*/
}

// Funciones de botones
function addRow() {
    const newRow = {
        hora: '06:00:00 a.m.',
        tiempoProd: 0,
        cambios: '',
        utilizacion: 0,
        part: '',
        csp: '',
        doh6am: 0,
        conteoHoras: '0:00:00',
        horasTurno: 0,
        piezasConsideradas: 0,
        dohSecuencia: 0,
        descripcion: '',
        cantidad: 0,
        strokes: 0,
        partes: 0,
        capRacks: 0,
        dif: 0,
        velocidad: 0,
        hrsRecuperar: 0,
        cobertura: 0
    };

    planeacionData.xl1.push(newRow);
    renderPlaneacionTable();
}

function deleteLastRow() {
    if (planeacionData.xl1.length > 0) {
        if (confirm('¿Estás seguro de eliminar la última fila?')) {
            planeacionData.xl1.pop();
            renderPlaneacionTable();
        }
    }
}

function saveData() {
    localStorage.setItem('planeacionData', JSON.stringify(planeacionData));
    alert('Datos guardados correctamente en el navegador');
}


function exportToExcel() {
    const dataStr = 'data:text/csv;charset=utf-8,' +
        encodeURIComponent(convertToCSV(planeacionData.xl1));
    const downloadLink= document.createElement('a');
    downloadLink.href = dataStr;
    downloadLink.download = 'planeacion_xl1.csv';
    downloadLink.click();    
}

function convertToCSV(data) {
    const headers = [
        'Hora', 'Tiempo Prod', 'Cambios', 'Utilización', 'Part', 'CSPC',
        'DOH 6am', 'Conteo Horas', 'Horas Turno', 'Piezas consideradas',
        'DOH Secuencia', 'Descripción', 'Cantidad', 'Strokes', 'Partes',
        'Cap Racks', 'DIF', 'Velocidad', 'Hrs Recuperar', 'Cobertura'
    ];

    let csv =headers.join(',') + '\n';

    data.forEach(row => {
        const values = [
            row.hora, row.tiempoProd, row.cambios, row.utilizacion, row.part,
            row.cspc, row.doh6am, row.conteoHoras, row.horasTurno,
            row.piezasConsideradas, row.dohSecuencia, row.descripcion,
            row.cantidad, row.strokes, row.partes, row.capRacks, row.dif,
            row.velocidad, row.hrsRecuperar, row.cobertura
        ];

        return csv;
    })
}

function printTable() {
    window.print();
}

// Función de logout
function logout() {
    //if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('token');
        window.location.href = '../index.html';
    //}
}

// Cargar datos guardados al inicio
window.addEventListener('load', function() {
    const savedData = this.localStorage.getItem('planeacionData');
    if (savedData) {
        const shouldLoad = confirm('Se encontraron datos guardados, ¿Deseas cargarlos?');
        if (shouldLoad) {
            planeacionData = JSON.parse(savedData);
            renderPlaneacionTable();
        }
    }
});