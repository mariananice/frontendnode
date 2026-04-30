// Variables globales
let productionData = {
    xl1: [],
    xl2: []
};

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
    loadProductionData();

    const btnPerfil = document.getElementById('btnPerfil');
    const btnNotificaciones = document.getElementById('btnNotificaciones');
    const panelPErfil = document.getElementById('panelPerfil');
    const panelNotificaciones = document.getElementById('panelNotificaciones');

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

    document.getElementById('perfilProduccionNombre').textContent = user?.nombre || 'Usuario';
    document.getElementById('perfilProduccionCorreo').textContent = user?.email || 'correo@ejemplo.com';
    document.getElementById('perfilProduccionRol').textContent = user?.rol || 'usuario';
    document.getElementById('perfilProduccionGmin').textContent = user?.GMIN || 'GMIN';
}

// Notificaciones en Usuarios (ejemplo estático)
function llenarNotificacionesProduccion() {
    const contenedor = document.getElementById('listaNotificacionesProduccion');
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
    const menuItems = document.querySelectorAll('.menuli'); 

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(li => li.classList.remove('active')); // Remover clase active de todos
            this.classList.add('active'); // Agregar clase active al clikeado

            // Obtener la sección mostrar
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

// Cargar datos de producción de ejemplo
function loadProductionData() {
    // datos ejemplo xl1
    productionData.xl1 = [
        {
            hora: '06:00:00 a. m.',
            tProd: '115',
            descripcion: 'C4088PNL-DASH EXT LWR STL 1UB',
            cantidad: '2000',
            nonLoad: '',
            strokes: '1000',
            doH: '2.5',
            comentarios: '',
            tipo: 'normal'
        },
        {
            hora: '07:55:00 a. m.',
            tProd: '168',
            descripcion: 'C4242PNL-I-PUBX URPL STL 2ST',
            cantidad: '1200',
            nonLoad: '',
            strokes: '1200',
            doH: '1.9',
            comentarios: '',
            tipo: 'normal'
        },
        {
            hora: '10:43:00 a. m.',
            tProd: '83',
            descripcion: 'C424PNL-I-PUBX INR URP L STL 2ST',
            cantidad: '600',
            nonLoad: '',
            strokes: '600',
            doH: '2.5',
            comentarios: '',
            tipo: 'normal'
        },
        {
            hora: '12:06:00 p. m.',
            tProd: '240',
            descripcion: 'Try out C8908',
            cantidad: '0',
            nonLoad: 'TO',
            strokes: '0',
            doH: '###',
            comentarios: 'Tiempo asignado para Try Out',
            tipo: 'tryout'
        },
        {
            hora: '04:06:00 p. m.',
            tProd: '116',
            descripcion: 'NS',
            cantidad: '0',
            nonLoad: 'NS',
            strokes: '0',
            doH: '###',
            comentarios: 'Preparar arranque para el segundo turno',
            tipo: 'ns'
        },
        {
            hora: '06:02:00 p. m.',
            tProd: '104',
            descripcion: 'C4087PNL-DAH STL 1UB',
            cantidad: '1680',
            nonLoad: '',
            strokes: '840',
            doH: '2.1',
            comentarios: '',
            tipo: 'normal'
        },
        {
            hora: '07:46:00 p. m.',
            tProd: '71',
            descripcion: 'C4146PNL-ROOF OTR STL 2ST',
            cantidad: '600',
            nonLoad: '',
            strokes: '600',
            doH: '1.7',
            comentarios: '',
            tipo: 'normal'
        },
        {
            hora: '08:57:00 p. m.',
            tProd: '55',
            descripcion: 'C4148PNL-SUNROOF OTR STL 2ST',
            cantidad: '450',
            nonLoad: '',
            strokes: '450',
            doH: '1.6',
            comentarios: '',
            tipo: 'normal'
        },
        {
            hora: '09:52:00 p. m.',
            tProd: '156',
            descripcion: 'C4157PNL-FDR OTR STL1UB',
            cantidad: '960',
            nonLoad: '',
            strokes: '960',
            doH: '2.1',
            comentarios: '',
            tipo: 'normal'
        },
        {
            hora: '12:28:00 a. m.',
            tProd: '336',
            descripcion: 'NS',
            cantidad: '0',
            nonLoad: 'NS',
            strokes: '0',
            doH: '###',
            comentarios: 'Preparar arranque del jueves',
            tipo: 'ns'
        },
    ];

    // Renderizar las tablas
    renderProductionTable('xl1');
    renderProductionTable('xl2');
}

// Renderizar tabla de producción
function renderProductionTable(prensa) {
    const data = productionData[prensa];
    const  tbody = document.querySelector(`#produccion table:nth-of-type(${prensa === 'xl1' ? 1 : 2}) tbody`);

    if (!tbody || data || data.length === 0) return;

    tbody.innerHTML = '';

    let totalStrokes = 0;

    data.forEach((row, index) => {
        const tr = document.createElement('tr');

        // Aplicar clase según el tipo
        if (row.tipo === 'tryout') {
            tr.classList.add('row-green');
        } else if (row.tipo === 'ns') {
            tr.classList.add('row-yellow')
        }

        // Sumar strokes
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

    //Actualizar total de strokes
    const totalCell = document.querySelector(`#produccion table:nth-of-type(${prensa === 'xl1' ? 1:2}) tfoot .footer-total:last-child`);
    if(totalCell) {
        totalCell.textContent = totalStrokes;
    }
}

function filterProductionTable(query) {
    const rows = document.querySelectorAll('#produccion table tbody tr');

    rows.forEach(row => {
        const hora = row.children[0].textContent.toLowerCase();
        const tProd = row.children[1]?.textContent.toLowerCase() || '';
        const descripcion = row.children[2]?.textContent.toLowerCase() || '';
        const cantidad = row.children[3]?.textContent.toLowerCase() || '';
        const nonLoad = row.children[4]?.textContent.toLowerCase() || '';
        const strokes = row.children[5]?.textContent.toLowerCase() || '';
        const doH = row.children[6]?.textContent.toLowerCase() || '';

        const text = `${hora} ${tProd} ${descripcion} ${cantidad} ${nonLoad} ${strokes} ${doH}`;

        row.style.display = text.includes(query) ? '' : 'none';

    })
}

/*function filterWeeklyTable(query) {
    const rows = document.querySelectorAll('#reqbody tbody tr');

    rows.forEach(row => {

        const text = `${cspc} ${linea}`;

        row.style.display = text.includes(query) ? '' : 'none';
    });
} */

// Función para agregar una nueva fila
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

    productionData[prensa].pop();
    renderProductionTable(prensa);
}

// Función para eliminar la última fila
function deleteLastRow(prensa) {
    if(productionData[prensa].length > 0) {
        productionData[prensa].pop();
        renderProductionTable(prensa);
    }
}

// Función para exportar datos
function exportData() {
    const dataStr = JSON.stringify(productionData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'programa_produccion.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Functión para guardar en localStorage
function saveData() {
    localStorage.setItem('productionData', JSON.stringify(productionData));
    alert('Datos guardados correctamente');
}

// Función para cargar de localStorage
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

// Función de logout 
function logout() {
    //if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('token');
        window.location.href = '../index.html';
    //}
}

// Función para calcular total de strokes
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

// Función para cambiar tipo de fila (normal, tryout, ns)
function changeRowType(prensa, rowIndex, newType) {
    if (productionData[prensa][rowIndex]) {
        productionData[prensa][rowIndex].tipo = newType;

        // Ajustar valores según el tipo
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

// Imprimir tabla
function printTable() {
    window.print();
}