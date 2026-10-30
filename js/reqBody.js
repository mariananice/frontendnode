const BASE_URL = 'http://localhost:3300';

let currentPage = 1;
let currentLimit = 50;
let totalPages = 1;
let totalRecords = 0;
let reqbodyData = [];
let activeView = 'estampado';

let weeklyData = [];
let weeklyDates = []; // fechas para las 12 columnas (YYYY-MM-DD)

const REQBODY_LAST_WEEK_KEY = 'reqbody_ultima_semana';
let lastSemana = null;
let lastAnio = null;

let resumenSemanaData = [];

function guardarUltimaSemana(semana, anio) {
    lastSemana = Number(semana);
    lastAnio = Number(anio);

    localStorage.setItem(
        REQBODY_LAST_WEEK_KEY,
        JSON.stringify({
            semana: lastSemana,
            anio: lastAnio
        })
    );
}

function recuperarUltimaSemana() {
    try {
        const guardada = JSON.parse(
            localStorage.getItem(REQBODY_LAST_WEEK_KEY)
        );

        if (
            guardada &&
            Number.isInteger(Number(guardada.semana)) &&
            Number.isInteger(Number(guardada.anio))
        ) {
            lastSemana = Number(guardada.semana);
            lastAnio = Number(guardada.anio);

            return {
                semana: lastSemana,
                anio: lastAnio
            };
        }
    } catch (error) {
        console.warn(
            'No se pudo recuperar la última semana:',
            error
        );
    }

    return null;
}

function cargarInputsUltimaSemana() {
    const ultima = recuperarUltimaSemana();

    if (!ultima) return;

    const inputSemana =
        document.getElementById('semanaEstampado');

    const inputAnio =
        document.getElementById('anioEstampado');

    if (inputSemana) {
        inputSemana.value = ultima.semana;
    }

    if (inputAnio) {
        inputAnio.value = ultima.anio;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initializeMenu();
    setActiveView('estampado');
    //loadWeeklyData();
    //renderEstampadoTable();

    const btnPerfil = document.getElementById('btnPerfil');
    const btnNotificaciones = document.getElementById('btnNotificaciones');
    const panelPerfil = document.getElementById('panelPerfil');
    const panelNotificaciones = document.getElementById('panelNotificaciones');
    const btnLogout = document.getElementById('btnLogout');

    const btnVistaEstampado = document.getElementById('btnVistaEstampado');
    const btnVistaImportado = document.getElementById('btnVistaImportado');

    const searchInput = document.getElementById('searchReqbody');
    const btnBuscarReqbody = document.getElementById('btnBuscarReqbody');
    const btnLimpiarReqbody = document.getElementById('btnLimpiarReqbody');
    const btnPrevPage = document.getElementById('btnPrevPage');
    const btnNextPage = document.getElementById('btnNextPage');
    const tipoReqbody = document.getElementById('tipoReqbody');
    const filtroNumeroParte = document.getElementById('filtroNumeroParte');
    const btnGenerarReqbody = document.getElementById('btnGenerarReqbody');

    const inputSemanaEstampado = document.getElementById('semanaEstampado');
    const inputAnioEstampado = document.getElementById('anioEstampado');
    const btnVerSemanaEstampado = document.getElementById('btnVerSemanaEstampado');

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

    if (btnLogout) {
        btnLogout.addEventListener('click', logout);
    }

    if (btnVistaEstampado) {
        btnVistaEstampado.addEventListener('click', () => {
            setActiveView('estampado');
        });
    }

    if (btnVistaImportado) {
        btnVistaImportado.addEventListener('click', () => {
            setActiveView('importado');
            loadReqbodyFromApi();
        });
    }

    if (btnBuscarReqbody) {
        btnBuscarReqbody.addEventListener('click', () => {
            if (searchInput && filtroNumeroParte) {
                filtroNumeroParte.value = searchInput.value.trim();
            }
            currentPage = 1;
            loadReqbodyFromApi();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();

            if (activeView === 'estampado') {
                filterEstampadoTable(query);
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && activeView === 'importado') {
                if (filtroNumeroParte) {
                    filtroNumeroParte.value = searchInput.value.trim();
                }
                currentPage = 1;
                loadReqbodyFromApi();
            }
        });
    }

    if (btnLimpiarReqbody) {
        btnLimpiarReqbody.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (filtroNumeroParte) filtroNumeroParte.value = '';
            if (tipoReqbody) tipoReqbody.value = 'DREQ';
            currentPage = 1;
            loadReqbodyFromApi();
        });
    }

    if (tipoReqbody) {
        tipoReqbody.addEventListener('change', () => {
            currentPage = 1;
            loadReqbodyFromApi();
        });
    }

    if (btnPrevPage) {
        btnPrevPage.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                loadReqbodyFromApi();
            }
        });
    }

    if (btnNextPage) {
        btnNextPage.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                loadReqbodyFromApi();
            }
        });
    }

    if (btnGenerarReqbody) {
        btnGenerarReqbody.addEventListener('click', async () => {
            const semana = prompt('Semana (ej. 30):', '');
            const anio = prompt('Año (ej. 2026):', '');

            if (!semana || !anio) return;

            try {
                const token = localStorage.getItem('token');

                const res = await fetch(`${BASE_URL}/api/reqbody/generar-diario`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify({
                        semana: parseInt(semana, 10),
                        anio: parseInt(anio, 10)
                    })
                });

                const data = await res.json();

                // Solo mostramos éxito si el backend responde OK
                if (!res.ok) throw new Error(data.message || 'Error al generar reqbody');

                alert(`ReqBody diario generado para semana ${semana}, año ${anio}`);

                guardarUltimaSemana(
                    parseInt(semana, 10),
                    parseInt(anio, 10)
                );

                await loadEstampadoFromApi(
                    lastSemana,
                    lastAnio
                );

                //lastSemana = parseInt(semana, 10);
                //lastAnio = parseInt(anio, 10);

                //await loadEstampadoFromApi(lastSemana, lastAnio);

                //if (activeView === 'estampado') {
                    //await loadEstampadoFromApi(semana, anio);
                //}
            } catch (error) {
                console.error(error);
                alert(error.message || 'Error al generar reqbody');
            }
        });
    }

    if (btnVerSemanaEstampado) {
        btnVerSemanaEstampado.addEventListener('click', () => {
            const semanaVal = parseInt(inputSemanaEstampado?.value, 10);
            const anioVal = parseInt(inputAnioEstampado?.value, 10);

            if (!semanaVal || !anioVal) {
                alert('Debes capturar semana y año para ver Estampado');
                return;
            }

            // Solo CONSULTA: no regenera, solo lee reqbody
            lastSemana = semanaVal;
            lastAnio = anioVal;
            loadEstampadoFromApi(lastSemana, lastAnio);
        });
    }

    cargarInputsUltimaSemana();

    const ultimaSemana = recuperarUltimaSemana();

    setActiveView('estampado');

    if (ultimaSemana) {
        loadEstampadoFromApi(
            ultimaSemana.semana,
            ultimaSemana.anio
        );
    }

    //setActiveView('estampado');

    // SOLO PARA PROBAR: cargar Estampado directamente con datos reales
    //loadEstampadoFromApi(1, 2026);
});

function setActiveView(view) {
    activeView = view;

    const vistaEstampado = document.getElementById('vistaEstampado');
    const vistaImportado = document.getElementById('vistaImportado');
    const btnVistaEstampado = document.getElementById('btnVistaEstampado');
    const btnVistaImportado = document.getElementById('btnVistaImportado');
    const searchInput = document.getElementById('searchReqbody');

    if (vistaEstampado) vistaEstampado.classList.toggle('active', view === 'estampado');
    if (vistaImportado) vistaImportado.classList.toggle('active', view === 'importado');

    if (btnVistaEstampado) btnVistaEstampado.classList.toggle('active', view === 'estampado');
    if (btnVistaImportado) btnVistaImportado.classList.toggle('active', view === 'importado');

    if (searchInput) {
        searchInput.placeholder = view === 'estampado'
            ? 'Buscar PTR, CSPC o línea...'
            : 'Buscar número de parte...';
    }

    // Si cambiamos a Estampado y ya hay semana/año generados, recargar esa semana
    if (view === 'estampado' && lastSemana && lastAnio) {
        loadEstampadoFromApi(lastSemana, lastAnio);
    }
}

function abrirPanel(panel) {
    document.querySelectorAll('.center-modal.open').forEach(p => p.classList.remove('open'));
    panel.classList.add('open');
}

// Perfil
function llenarPerfil() {
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        user = null;
    }

    const nombre = document.getElementById('perfilReqBodyNombre');
    const correo = document.getElementById('perfilReqBodyCorreo');
    const rol = document.getElementById('perfilReqBodyRol');
    const gmin = document.getElementById('perfilReqBodyGmin');

    if (nombre) nombre.textContent = user?.nombre || 'Usuario';
    if (correo) correo.textContent = user?.email || 'correo@ejemplo.com';
    if (rol) rol.textContent = user?.rol || 'usuario';
    if (gmin) gmin.textContent = user?.GMIN || 'GMIN';
}

// Notificaciones
/*function llenarNotificacionesProgramacion() {
    const container = document.getElementById(
        'listaNotificacionesProgramacion'
    );

    if (!container) return;

    container.innerHTML = `
        <div class="notificacion-item">
            <div class="notificacion-titulo">
                Programación cargada
            </div>
            <div class="notificacion-fecha">
                ${new Date().toLocaleString('es-MX')}
            </div>
            <div class="notificacion-detalle">
                Los datos fueron consultados desde el backend.
            </div>
        </div>
    `;
}*/
function llenarNotificacionesReqBody() {
    const contenedor = document.getElementById('listaNotificacionesReqBody');
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

// Sidebar
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

// VISTA ESTAMPADO (dummy)
/*function loadWeeklyData() {
    weeklyData = [
        { numero_parte: '85560226', cspc: 'C4087', linea: 'XL1', dias: [1371, 1403, 1371, 1398, 1, 1371, 1403, 1371, 1403, 1371, 1398, 1], total: 1386 },
        { numero_parte: '84666755', cspc: 'C4088', linea: 'XL1', dias: [1371, 1403, 1371, 1398, 1, 1371, 1403, 1371, 1403, 1371, 1398, 1], total: 1386 },
        { numero_parte: '84652941', cspc: 'C4106', linea: 'XL2', dias: [1202, 1283, 1256, 1241, 1, 1221, 1233, 1236, 1323, 1221, 1308, 1], total: 1257 },
        { numero_parte: '84652942', cspc: 'C4109', linea: 'XL2', dias: [1202, 1283, 1256, 1241, 1, 1221, 1233, 1236, 1323, 1221, 1308, 1], total: 1257 },
        { numero_parte: '84652981', cspc: 'C4118', linea: 'XL2', dias: [169, 120, 110, 128, 1, 150, 170, 135, 80, 150, 90, 1], total: 129 },
        { numero_parte: '84652982', cspc: 'C4119', linea: 'XL2', dias: [169, 120, 110, 128, 1, 150, 170, 135, 80, 150, 90, 1], total: 129 },
        { numero_parte: '23381632', cspc: 'C4144', linea: 'XL1', dias: [752, 917, 814, 775, 1, 770, 767, 691, 688, 770, 814, 1], total: 750 },
        { numero_parte: '23381639', cspc: 'C4145', linea: 'XL1', dias: [169, 120, 110, 140, 1, 142, 170, 135, 88, 142, 105, 1], total: 130 },
        { numero_parte: '84688122', cspc: 'C4146', linea: 'XL1', dias: [761, 927, 833, 781, 1, 751, 769, 699, 699, 751, 827, 1], total: 749 },
        { numero_parte: '84688125', cspc: 'C4148', linea: 'XL1', dias: [450, 375, 412, 469, 1, 751, 467, 533, 636, 457, 484, 1], total: 555 },
        { numero_parte: '23507633', cspc: 'C4149', linea: 'XL1', dias: [450, 375, 412, 469, 1, 457, 467, 533, 636, 457, 484, 1], total: 506 },
        { numero_parte: '84688126', cspc: 'C4152', linea: 'XL2', dias: [169, 91, 139, 120, 1, 144, 170, 155, 60, 144, 91, 1], total: 127 },
        { numero_parte: '84496738', cspc: 'C4155', linea: 'XL2', dias: [401, 744, 730, 601, 1, 651, 725, 751, 697, 651, 747, 1], total: 704 },
        { numero_parte: '84496739', cspc: 'C4156', linea: '0', dias: [401, 744, 730, 601, 1, 651, 725, 751, 697, 651, 747, 1], total: 704 },
        { numero_parte: '84496740', cspc: 'C4157', linea: 'XL1', dias: [780, 523, 509, 639, 1, 601, 540, 470, 571, 601, 513, 1], total: 549 },
        { numero_parte: '84496741', cspc: 'C4158', linea: '0', dias: [780, 523, 509, 639, 1, 601, 540, 470, 571, 601, 513, 1], total: 549 },
        { numero_parte: '23393591', cspc: 'C4159', linea: 'XL2', dias: [159, 475, 497, 461, 1, 269, 304, 346, 240, 269, 314, 1], total: 290 },
        { numero_parte: '84340140', cspc: 'C4160', linea: 'XL1', dias: [162, 480, 495, 455, 1, 337, 309, 342, 245, 273, 308, 1], total: 302 },
        { numero_parte: '23393592', cspc: 'C4162', linea: 'XL1', dias: [869, 610, 559, 698, 1, 635, 575, 500, 611, 635, 566, 1], total: 587 },
        { numero_parte: '84512891', cspc: 'C4163', linea: '0', dias: [862, 606, 559, 702, 1, 635, 575, 500, 611, 635, 566, 1], total: 587 }
    ];
}*/

function renderEstampadoTable() {
     console.log('Render Estampado con filas:', weeklyData.length);
    const tbody = document.getElementById('tbodyEstampado');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!weeklyData.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="16">No hay datos para mostrar.</td>
            </tr>
        `;
        return;
    }

    weeklyData.forEach((row) => {
        let lineaClass = 'col-linea-xl2';
        if (row.linea === 'XL1') lineaClass = 'col-linea-xl1';
        if (row.linea === '0') lineaClass = 'col-linea-0';

        const tr = document.createElement('tr');

        let cells = `
            <td class="col-part">${row.numero_parte || ''}</td>
            <td class="col-cspc">${row.cspc}</td>
            <td class="${lineaClass}">${row.linea}</td>
        `;

        row.dias.forEach((value, dayIndex) => {
            const isDomingo = dayIndex === 4 || dayIndex === 11;
            const cellClass = isDomingo ? 'col-sunday' : '';
            cells += `<td class="${cellClass}">${value}</td>`;
        });

        cells += `<td class="col-total">${row.total}</td>`;

        tr.innerHTML = cells;
        tbody.appendChild(tr);
    });
}

function renderResumenSemanaTable() {
    const tbody = document.getElementById('tbodyResumenSemana');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!resumenSemanaData.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4">No hay datos de resumen para esta semana.</td>
            </tr>
        `;
        return;
    }

    resumenSemanaData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="col-part">${row.numero_parte || ''}</td>
            <td class="col-cspc">${row.nombre_cspc || ''}</td>
            <td>${row.linea || ''}</td>
            <td>${row.cantidad_semanal ?? 0}</td>
        `;
        tbody.appendChild(tr);
    });
}

async function loadResumenSemanaFromApi(semana, anio) {
    const tbody = document.getElementById('tbodyResumenSemana');
    if (!tbody) return;

    const token = localStorage.getItem('token');

    const sem = semana || lastSemana;
    const year = anio || lastAnio;

    if (!sem || !year) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4">Debes indicar semana y año para ver el resumen.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = `
        <tr>
            <td colspan="4">Cargando resumen semanal...</td>
        </tr>
    `;

    try {
        const res = await fetch(
            `${BASE_URL}/api/reqbody/resumen?semana=${sem}&anio=${year}`,
            {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Error al cargar el resumen semanal');

        resumenSemanaData = Array.isArray(data) ? data : [];
        renderResumenSemanaTable();
    } catch (error) {
        console.error('Error en loadResumenSemanaFromApi:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="4">${error.message || 'Error al cargar el resumen semanal'}</td>
            </tr>
        `;
    }
}

function buildWeeklyDataFromDiario(rows) {
    console.log('Filas desde /diario:', rows.length, rows);
    // rows: array de objetos { fecha, cantidad, numero_parte, nombre_cspc, linea, ... }

    if (!Array.isArray(rows) || !rows.length) {
        weeklyData = [];
        weeklyDates = [];
        return;
    }

    // 1) Obtener todas las fechas únicas y ordenarlas (tomamos las primeras 12)
    const fechasUnicas = Array.from(
        new Set(rows.map(r => r.fecha))
    ).sort(); // orden ascendente por fecha (YYYY-MM-DD)

    const maxCols = 12;
    const fechasCols = fechasUnicas.slice(0, maxCols);

    // Guardamos fechasCols para el header
    weeklyDates = fechasCols;

    // 2) Agrupar por parte + CSPC + línea
    const grupos = new Map();

    rows.forEach(r => {
        const key = `${r.numero_parte}|${r.nombre_cspc}|${r.linea}`;
        if (!grupos.has(key)) {
            grupos.set(key, {
                numero_parte: r.numero_parte,
                cspc: r.nombre_cspc,
                linea: r.linea,
                // inicializamos array de 12 días en 0
                dias: Array(maxCols).fill(0)
            });
        }
        const grupo = grupos.get(key);
        const idx = fechasCols.indexOf(r.fecha);
        if (idx !== -1) {
            grupo.dias[idx] += Number(r.cantidad) || 0;
        }
    });

    // 3) Convertir a arreglo y calcular total
    weeklyData = Array.from(grupos.values()).map(g => {
        const total = g.dias.reduce((acc, n) => acc + n, 0);
        //const total = g.dias.reduce((acc, n, idx) => {
            // si quieres excluir domingos (ej. índices 4 y 11), ajusta aquí
            // if (idx === 4 || idx === 11) return acc;
            //return acc + n;
        //}, 0);
        return {
            numero_parte: g.numero_parte,
            cspc: g.cspc,
            linea: g.linea,
            dias: g.dias,
            total
        };
    });
}

function renderEstampadoHeaderDates() {
    const headerRow = document.querySelector('#vistaEstampado .reqbody-table thead tr.header-dates');
    if (!headerRow) return;

    const cells = headerRow.querySelectorAll('.header-date');
    if (!cells.length) return;

    // weeklyDates contiene las fechas 'YYYY-MM-DD' para cada columna
    cells.forEach((cell, index) => {
        if (index === cells.length - 1) {
            // última celda es la de TOTAL, la dejamos vacía
            cell.textContent = '';
            return;
        }

        const fechaStr = weeklyDates[index];
        if (!fechaStr) {
            cell.textContent = '';
            return;
        }

        // Convertir 'YYYY-MM-DD' a 'dd/MM/yyyy'
        const d = new Date(fechaStr);
        if (isNaN(d)) {
            cell.textContent = fechaStr;
            return;
        }

        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const anio = d.getFullYear();

        cell.textContent = `${dia}/${mes}/${anio}`;
    });
}

function filterEstampadoTable(query) {
    const rows = document.querySelectorAll('#tbodyEstampado tr');

    rows.forEach(row => {
        const numeroParte = row.children[0]?.textContent.toLowerCase() || '';
        const cspc = row.children[1]?.textContent.toLowerCase() || '';
        const linea = row.children[2]?.textContent.toLowerCase() || '';
        const text = `${numeroParte} ${cspc} ${linea}`;

        row.style.display = text.includes(query) ? '' : 'none';
    });
}

// =========================
// VISTA IMPORTADO
// =========================
async function loadReqbodyFromApi() {
    const tbody = document.getElementById('tbodyImportado');
    const tipo = document.getElementById('tipoReqbody')?.value || 'DREQ';
    const numeroParte = document.getElementById('filtroNumeroParte')?.value?.trim() || '';
    const token = localStorage.getItem('token');

    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10">Cargando datos...</td>
            </tr>
        `;
    }

    try {
        const params = new URLSearchParams({
            tipo,
            page: currentPage,
            limit: currentLimit
        });

        if (numeroParte) {
            params.append('numero_parte', numeroParte);
        }

        const res = await fetch(`${BASE_URL}/api/reqbody?${params.toString()}`, {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || 'Error al cargar reqbody');
        }

        if (Array.isArray(result)) {
            reqbodyData = result;
            totalPages = 1;
            totalRecords = result.length;
            currentPage = 1;
        } else {
            reqbodyData = result.data || [];
            totalPages = result.pagination?.totalPages || 1;
            totalRecords = result.pagination?.total || 0;
            currentPage = result.pagination?.page || 1;
        }

        renderImportedTable();
        updatePaginationInfo();
    } catch (error) {
        console.error('Error cargando reqbody:', error);

        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10">${error.message || 'Error al cargar los datos'}</td>
                </tr>
            `;
        }

        totalPages = 1;
        totalRecords = 0;
        updatePaginationInfo();
    }
}

function renderImportedTable() {
    const tbody = document.getElementById('tbodyImportado');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!reqbodyData.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10">No se encontraron registros.</td>
            </tr>
        `;
        return;
    }

    reqbodyData.forEach((row) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td class="col-part">${row.numero_parte ?? ''}</td>
            <td class="col-cspc">${row.descripcion ?? ''}</td>
            <td>${row.uloc ?? ''}</td>
            <td>${row.buy_cantidad ?? ''}</td>
            <td>${row.doh ?? ''}</td>
            <td>${row.in_transit ?? ''}</td>
            <td>${row.cbal ?? ''}</td>
            <td>${row.tipo_req ?? ''}</td>
            <td>${row.periodo ?? ''}</td>
            <td>${row.cantidad ?? ''}</td>
        `;

        tbody.appendChild(tr);
    });
}

function updatePaginationInfo() {
    const info = document.getElementById('paginationInfo');
    const btnPrevPage = document.getElementById('btnPrevPage');
    const btnNextPage = document.getElementById('btnNextPage');

    if (info) {
        info.textContent = `Página ${currentPage} de ${totalPages} · Total: ${totalRecords}`;
    }

    if (btnPrevPage) {
        btnPrevPage.disabled = currentPage <= 1;
    }

    if (btnNextPage) {
        btnNextPage.disabled = currentPage >= totalPages;
    }
}

// leer Estampado desde /api/reqbody/diario
async function loadEstampadoFromApi(semana, anio) {
    console.log('loadEstampadoFromApi llamado con:', semana, anio);
    const tbody = document.getElementById('tbodyEstampado');
    if (!tbody) return;

    const token = localStorage.getItem('token');

    const sem = semana || prompt('Semana para Estampado:', '');
    const year = anio || prompt('Año para Estampado:', '');

    if (!sem || !year) {
        tbody.innerHTML = '<tr><td colspan="16">Debes indicar semana y año</td></tr>';
        return;
    }

    tbody.innerHTML = `
        <tr>
            <td colspan="16">Cargando datos de Estampado...</td>
        </tr>
    `;

    try {
        const res = await fetch(
            `${BASE_URL}/api/reqbody/diario?semana=${sem}&anio=${year}`,
            {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Error al cargar reqbody diario');

        // Transformar data (una fila por fecha) a formato weeklyData (12 días)
        buildWeeklyDataFromDiario(data);

        // Pintar fechas en el header según weeklyDates
        renderEstampadoHeaderDates();

        // Pintar tabla
        renderEstampadoTable();

        // Cargar también el resumen semanal para la misma semana/año
        loadResumenSemanaFromApi(sem, year);

        //console.log('Datos diarios desde reqbody:', data);
        // Aquí luego mapearás "data" a tu tabla de 12 días; por ahora solo lo dejamos impreso.
    } catch (error) {
        console.error(error);
        tbody.innerHTML = `
            <tr>
                <td colspan="16">${error.message || 'Error al cargar datos de Estampado'}</td>
            </tr>
        `;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}