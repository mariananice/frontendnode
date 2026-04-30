// Variables globales
let weeklyData = [];

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
    loadWeeklyData();
    setupActionButtons();
    //checkUserLogin();

    const btnPerfil = document.getElementById('btnPerfil');
    const btnNotificaciones = document.getElementById('btnNotificaciones');
    const panelPerfil = document.getElementById('panelPerfil');
    const panelNotificaciones = document.getElementById('panelNotificaciones');

    if (btnPerfil && panelPerfil) {
        btnPerfil.addEventListener('click', () => {
            llenarPerfil();
            abrirPanel(panelPerfil);
        });
    }

    if (btnNotificaciones && panelNotificaciones) {
        btnNotificaciones.addEventListener('click', () => {
            llenarNotificacionesReqBody();
            abrirPanel(panelNotificaciones);
        });
    }

    document.querySelectorAll('[data-close-panel]').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.closest('.center-modal');
            if (panel) panel.classList.remove('open');
        });
    });


    const searchInput = document.getElementById('searchReqbody');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            filterWeeklyTable(query);
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

    document.getElementById('perfilReqBodyNombre').textContent = user?.nombre || 'Usuario';
    document.getElementById('perfilReqBodyCorreo').textContent = user?.email || 'correo@ejemplo.com';
    document.getElementById('perfilReqBodyRol').textContent = user?.rol || 'usuario';
    document.getElementById('perfilReqBodyGmin').textContent = user?.GMIN || 'GMIN';
}

// Notificaciones en Usuarios (ejemplo estático)
function llenarNotificacionesReqBody() {
    const contenedor = document.getElementById('listaNotificacionesReqBody');
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

// Verificar si el usuario está logueado
/*
function checkUserLogin() {
    const user = localStorage.getItem('registeredUser');
    if (!user) {
        window.location.href = 'index.html';
    }
}*/

// Sistema de navegación entre secciones
function initializeMenu() {
    const menuItems = document.querySelectorAll('.menu li');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remover clase active de todos
            menuItems.forEach(li => li.classList.remove('active'));
            
            // Agregar clase active al clickeado
            this.classList.add('active');
            
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

// Cargar datos semanales
function loadWeeklyData() {
    // Datos de ejemplo para la tabla semanal
    weeklyData = [
        { cspc: 'C4087', linea: 'XL1', dias: [1371, 1403, 1371, 1398, 1, 1371, 1403, 1371, 1403, 1371, 1398, 1], total: 1386 },
        { cspc: 'C4088', linea: 'XL1', dias: [1371, 1403, 1371, 1398, 1, 1371, 1403, 1371, 1403, 1371, 1398, 1], total: 1386 },
        { cspc: 'C4106', linea: 'XL2', dias: [1202, 1283, 1256, 1241, 1, 1221, 1233, 1236, 1323, 1221, 1308, 1], total: 1257 },
        { cspc: 'C4109', linea: 'XL2', dias: [1202, 1283, 1256, 1241, 1, 1221, 1233, 1236, 1323, 1221, 1308, 1], total: 1257 },
        { cspc: 'C4118', linea: 'XL2', dias: [169, 120, 110, 128, 1, 150, 170, 135, 80, 150, 90, 1], total: 129 },
        { cspc: 'C4119', linea: 'XL2', dias: [169, 120, 110, 128, 1, 150, 170, 135, 80, 150, 90, 1], total: 129 },
        { cspc: 'C4144', linea: 'XL1', dias: [752, 917, 814, 775, 1, 770, 767, 691, 688, 770, 814, 1], total: 750 },
        { cspc: 'C4145', linea: 'XL1', dias: [169, 120, 110, 140, 1, 142, 170, 135, 88, 142, 105, 1], total: 130 },
        { cspc: 'C4146', linea: 'XL1', dias: [761, 927, 833, 781, 1, 751, 769, 699, 699, 751, 827, 1], total: 749 },
        { cspc: 'C4148', linea: 'XL1', dias: [450, 375, 412, 469, 1, 751, 467, 533, 636, 457, 484, 1], total: 555 },
        { cspc: 'C4149', linea: 'XL1', dias: [450, 375, 412, 469, 1, 457, 467, 533, 636, 457, 484, 1], total: 506 },
        { cspc: 'C4152', linea: 'XL2', dias: [169, 91, 139, 120, 1, 144, 170, 155, 60, 144, 91, 1], total: 127 },
        { cspc: 'C4155', linea: 'XL2', dias: [401, 744, 730, 601, 1, 651, 725, 751, 697, 651, 747, 1], total: 704 },
        { cspc: 'C4156', linea: '0', dias: [401, 744, 730, 601, 1, 651, 725, 751, 697, 651, 747, 1], total: 704 },
        { cspc: 'C4157', linea: 'XL1', dias: [780, 523, 509, 639, 1, 601, 540, 470, 571, 601, 513, 1], total: 549 },
        { cspc: 'C4158', linea: '0', dias: [780, 523, 509, 639, 1, 601, 540, 470, 571, 601, 513, 1], total: 549 },
        { cspc: 'C4159', linea: 'XL2', dias: [159, 475, 497, 461, 1, 269, 304, 346, 240, 269, 314, 1], total: 290 },
        { cspc: 'C4160', linea: 'XL1', dias: [162, 480, 495, 455, 1, 337, 309, 342, 245, 273, 308, 1], total: 302 },
        { cspc: 'C4162', linea: 'XL1', dias: [869, 610, 559, 698, 1, 635, 575, 500, 611, 635, 566, 1], total: 587 },
        { cspc: 'C4163', linea: '0', dias: [862, 606, 559, 702, 1, 635, 575, 500, 611, 635, 566, 1], total: 587 }
    ];
    
    renderWeeklyTable();
}

// Renderizar tabla semanal
function renderWeeklyTable() {
    const tbody = document.querySelector('#reqbody tbody');
    
    if (!tbody || !weeklyData) return;
    
    tbody.innerHTML = '';
    
    weeklyData.forEach((row, index) => {
        const tr = document.createElement('tr');
        
        // Determinar clase de línea
        let lineaClass = 'col-linea-xl2';
        if (row.linea === 'XL1') lineaClass = 'col-linea-xl1';
        if (row.linea === '0') lineaClass = 'col-linea-0';
        
        // Construir celdas
        let cells = `
            <td class="col-cspc">${row.cspc}</td>
            <td class="${lineaClass}">${row.linea}</td>
        `;
        
        // Agregar días
        row.dias.forEach((value, dayIndex) => {
            const isDomingo = dayIndex === 4 || dayIndex === 11;
            const cellClass = isDomingo ? 'col-sunday' : '';
            cells += `<td class="${cellClass} editable-cell" data-row="${index}" data-day="${dayIndex}">${value}</td>`;
        });
        
        // Agregar total
        cells += `<td class="col-total">${row.total}</td>`;
        
        tr.innerHTML = cells;
        tbody.appendChild(tr);
    });
    
    // Agregar evento de edición
    setupEditableCells();
}

function filterWeeklyTable(query) {
    const rows = document.querySelectorAll('#reqbody tbody tr');

    rows.forEach(row => {
        const cspc = row.children[0].textContent.toLowerCase(); // cspc
        const linea = row.children[1].textContent.toLowerCase(); //linea
        //const dias = row.children[2].textContent.toLowerCase(); // dias

        const text = `${cspc} ${linea}`;

        row.style.display = text.includes(query) ? '' : 'none';
    });
}

// Configurar celdas editables
function setupEditableCells() {
    const editableCells = document.querySelectorAll('.editable-cell');
    
    editableCells.forEach(cell => {
        cell.addEventListener('dblclick', function() {
            const currentValue = this.textContent;
            const rowIndex = this.getAttribute('data-row');
            const dayIndex = this.getAttribute('data-day');
            
            // Crear input
            const input = document.createElement('input');
            input.type = 'number';
            input.value = currentValue;
            input.style.width = '100%';
            
            // Reemplazar contenido
            this.textContent = '';
            this.appendChild(input);
            input.focus();
            input.select();
            
            // Al perder el foco, guardar
            input.addEventListener('blur', function() {
                const newValue = parseInt(this.value) || 0;
                weeklyData[rowIndex].dias[dayIndex] = newValue;
                cell.textContent = newValue;
                
                // Recalcular total
                recalculateTotal(rowIndex);
            });
            
            // Enter para guardar
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    this.blur();
                }
            });
        });
    });
}

// Recalcular total de una fila
function recalculateTotal(rowIndex) {
    const row = weeklyData[rowIndex];
    // Excluir domingos (índices 4 y 11 que tienen valor 1)
    const total = row.dias.reduce((sum, val, idx) => {
        if (idx === 4 || idx === 11) return sum;
        return sum + val;
    }, 0);
    
    row.total = Math.round(total / 10); // Promedio aproximado
    
    // Actualizar en la tabla
    const tbody = document.querySelector('#reqbody tbody');
    const tr = tbody.children[rowIndex];
    const totalCell = tr.querySelector('.col-total');
    totalCell.textContent = row.total;
}

// Configurar botones de acción
function setupActionButtons() {
    const section = document.getElementById('reqbody');
    
    if (!section) return;
    
    /*
    // Crear contenedor de botones si no existe
    if (!section.querySelector('.action-buttons')) {
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'action-buttons';
        buttonsDiv.innerHTML = `
            <button class="btn btn-primary" onclick="addWeeklyRow()">
                <i class="bi bi-plus-circle"></i> Agregar Fila
            </button>
            <button class="btn btn-danger" onclick="deleteLastWeeklyRow()">
                <i class="bi bi-trash"></i> Eliminar Última Fila
            </button>
            <button class="btn btn-success" onclick="saveWeeklyData()">
                <i class="bi bi-save"></i> Guardar
            </button>
            <button class="btn btn-warning" onclick="exportWeeklyToExcel()">
                <i class="bi bi-file-earmark-excel"></i> Exportar a Excel
            </button>
            <button class="btn btn-info" onclick="printWeeklyTable()">
                <i class="bi bi-printer"></i> Imprimir
            </button>
        `;
        
        const h1 = section.querySelector('h1');
        h1.after(buttonsDiv);
    }*/
}

// Funciones de botones
function addWeeklyRow() {
    const newRow = {
        cspc: 'C0000',
        linea: 'XL1',
        dias: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        total: 0
    };
    
    weeklyData.push(newRow);
    renderWeeklyTable();
}

function deleteLastWeeklyRow() {
    if (weeklyData.length > 0) {
        if (confirm('¿Estás seguro de eliminar la última fila?')) {
            weeklyData.pop();
            renderWeeklyTable();
        }
    }
}

function saveWeeklyData() {
    localStorage.setItem('weeklyData', JSON.stringify(weeklyData));
    alert('Datos guardados correctamente en el navegador');
}

function exportWeeklyToExcel() {
    const dataStr = 'data:text/csv;charset=utf-8,' + 
        encodeURIComponent(convertWeeklyToCSV(weeklyData));
    const downloadLink = document.createElement('a');
    downloadLink.href = dataStr;
    downloadLink.download = 'req_body_semanal.csv';
    downloadLink.click();
}

function convertWeeklyToCSV(data) {
    const headers = [
        'CSPC', 'LINEA', 'Mie 05', 'Jue 06', 'Vie 07', 'Sab 08', 'Dom 09',
        'Lun 10', 'Mar 11', 'Mie 12', 'Jue 13', 'Vie 14', 'Sab 15', 'Dom 16', 'Total'
    ];
    
    let csv = headers.join(',') + '\n';
    
    data.forEach(row => {
        const values = [row.cspc, row.linea, ...row.dias, row.total];
        csv += values.join(',') + '\n';
    });
    
    return csv;
}

function printWeeklyTable() {
    window.print();
}

// Filtrar por línea
function filterByLine(line) {
    const rows = document.querySelectorAll('#reqbody tbody tr');
    
    rows.forEach(row => {
        const lineCell = row.children[1];
        if (line === 'all' || lineCell.textContent === line) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
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
    const savedData = localStorage.getItem('weeklyData');
    if (savedData) {
        const shouldLoad = confirm('Se encontraron datos guardados. ¿Deseas cargarlos?');
        if (shouldLoad) {
            weeklyData = JSON.parse(savedData);
            renderWeeklyTable();
        }
    }
});

// Calcular estadísticas
function calculateWeeklyStats() {
    let totalByLine = { XL1: 0, XL2: 0, '0': 0 };
    let countByLine = { XL1: 0, XL2: 0, '0': 0 };
    
    weeklyData.forEach(row => {
        totalByLine[row.linea] += row.total;
        countByLine[row.linea]++;
    });
    
    return {
        XL1: { total: totalByLine.XL1, promedio: (totalByLine.XL1 / countByLine.XL1).toFixed(2) },
        XL2: { total: totalByLine.XL2, promedio: (totalByLine.XL2 / countByLine.XL2).toFixed(2) },
        '0': { total: totalByLine['0'], promedio: (totalByLine['0'] / countByLine['0']).toFixed(2) }
    };
}

// Resaltar valores críticos
function highlightCriticalValues() {
    const cells = document.querySelectorAll('#reqbody tbody td:not(.col-cspc):not([class*="col-linea"]):not(.col-total):not(.col-sunday)');
    
    cells.forEach(cell => {
        const value = parseInt(cell.textContent);
        if (!isNaN(value)) {
            if (value < 100) {
                cell.style.color = '#ff4757';
                cell.style.fontWeight = 'bold';
            } else if (value > 1000) {
   
                cell.style.color = '#00B050';
                cell.style.fontWeight = 'bold';
            }
        }
    });
}

// Buscar en tabla
function searchTable(query) {
    const rows = document.querySelectorAll('#reqbody tbody tr');
    
    rows.forEach(row => {
        const cspc = row.children[0].textContent.toLowerCase();
        if (cspc.includes(query.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}