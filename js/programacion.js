'use strict';

const BASE_URL = 'http://localhost:3300';

const DEFAULT_WEEK = 1;
const DEFAULT_YEAR = 2026;
const PAGE_SIZE = 50;
const FECHA_BASE_OPERATIVA = '2026-01-05';

let programacionData = [];
let resumenData = [];

let programacionPage = 1;
let resumenPage = 1;
let programacionTotalPages = 1;
let resumenTotalPages = 1;

const DAY_LAYOUT = [
    { key: 'miercoles', columns: 7 },
    { key: 'jueves', columns: 8 },
    { key: 'viernes', columns: 8 },
    { key: 'sabado', columns: 8 },
    { key: 'domingo', columns: 8 },
    { key: 'lunes', columns: 8 },
    { key: 'martes', columns: 8 }
];

document.addEventListener(
    'DOMContentLoaded',
    iniciarProgramacion
);

function iniciarProgramacion() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    inicializarBotonActualizar();
    inicializarControlesSemana();
    inicializarMenu();
    inicializarModales();
    inicializarFiltros();
    inicializarLogout();
    asegurarTablaResumen();

    cargarProgramacion();
}

// CARGA PRINCIPAL
async function cargarProgramacion() {
    await Promise.all([
        loadProgramacionBase(),
        loadResumenProgramacion()
    ]);
}

async function loadProgramacionBase() {
    const tbody = document.getElementById(
        'tbodyProgramacion'
    );

    if (!tbody) return;

    mostrarMensajeTabla(
        tbody,
        'Cargando programación...'
    );

    const filtros = obtenerFiltros();

    try {
        const params = new URLSearchParams({
            semana: String(filtros.semana),
            anio: String(filtros.anio),
            page: String(programacionPage),
            pageSize: String(PAGE_SIZE)
        });

        if (filtros.cspc) {
            params.append('cspc', filtros.cspc);
        }

        if (filtros.linea) {
            params.append('linea', filtros.linea);
        }

        const result = await apiFetch(
            `/api/programacion/anual?${params.toString()}`
        );

        console.log(
            'Respuesta programación:',
            result
        );

        programacionData = Array.isArray(result)
            ? result
            : result.data || [];

        programacionTotalPages =
            result.pagination?.totalPages || 1;

        actualizarPeriodo(
            filtros.semana,
            filtros.anio
        );

        const fechaInicio =
            result.range?.from ||
            obtenerInicioSemanaOperativa(
                FECHA_BASE_OPERATIVA,
                filtros.semana
            );

        actualizarFechasTabla(fechaInicio);
        renderProgramacionTable();

        renderPaginacionPrincipal(
            result.pagination || {}
        );
    } catch (error) {
        console.error(
            'Error cargando programación:',
            error
        );

        mostrarMensajeTabla(
            tbody,
            error.message
        );
    }
}

// RESUMEN SEMANAL
async function loadResumenProgramacion() {
    const tbody = document.getElementById(
        'tbodyResumenProgramacion'
    );

    if (!tbody) return;

    mostrarMensajeTabla(
        tbody,
        'Cargando resumen semanal...',
        7
    );

    const filtros = obtenerFiltros();

    try {
        const params = new URLSearchParams({
            semana: String(filtros.semana),
            anio: String(filtros.anio),
            page: String(resumenPage),
            pageSize: String(PAGE_SIZE)
        });

        if (filtros.cspc) {
            params.append('cspc', filtros.cspc);
        }

        if (filtros.linea) {
            params.append('linea', filtros.linea);
        }

        const result = await apiFetch(
            `/api/programacion/resumen-semanal?${params.toString()}`
        );

        resumenData = Array.isArray(result)
            ? result
            : result.data || [];

        resumenTotalPages =
            result.pagination?.totalPages || 1;

        renderResumenProgramacion();

        renderPaginacionResumen(
            result.pagination || {}
        );
    } catch (error) {
        console.error(
            'Error cargando resumen semanal:',
            error
        );

        mostrarMensajeTabla(
            tbody,
            error.message,
            7
        );
    }
}

function renderResumenProgramacion() {
    const tbody = document.getElementById(
        'tbodyResumenProgramacion'
    );

    if (!tbody) return;

    tbody.innerHTML = '';

    if (!resumenData.length) {
        mostrarMensajeTabla(
            tbody,
            'No hay datos para esta semana.',
            7
        );
        return;
    }

    resumenData.forEach(row => {
        const tr = document.createElement('tr');

        agregarCelda(
            tr,
            row.cspc || 'SIN CSPC',
            'resumen-cspc'
        );

        agregarCelda(
            tr,
            row.linea || 'SIN LÍNEA',
            'resumen-linea'
        );

        agregarCelda(
            tr,
            formatearNumero(row.capacidad_total)
        );

        agregarCelda(
            tr,
            formatearNumero(
                row.requerimiento_reqbody
            )
        );

        agregarCelda(
            tr,
            formatearNumero(
                row.requerimiento_semanal
            )
        );

        agregarCelda(
            tr,
            formatearNumero(
                row.cantidad_programada
            )
        );

        agregarCelda(
            tr,
            formatearNumero(
                row.diferencia_reqbody
            ),
            claseDiferencia(
                row.diferencia_reqbody
            )
        );

        tbody.appendChild(tr);
    });
}

// TABLA PRINCIPAL
function renderProgramacionTable() {
    const tbody = document.getElementById(
        'tbodyProgramacion'
    );

    if (!tbody) return;

    tbody.innerHTML = '';

    if (!programacionData.length) {
        mostrarMensajeTabla(
            tbody,
            'No hay registros para esta semana.'
        );
        return;
    }

    programacionData.forEach(row => {
        const tr = document.createElement('tr');

        agregarCelda(
            tr,
            row.cspc || 'SIN CSPC',
            'col-cspc'
        );

        agregarCelda(
            tr,
            row.linea || 'SIN LÍNEA',
            obtenerClaseLinea(row.linea)
        );

        agregarCelda(
            tr,
            formatearNumero(
                row.capacidad_total
            ),
            'col-capacidad'
        );

        const fechaInicial =
            obtenerFechaInicial(row);

        const programadoPorDia =
            distribuirCantidadSemanal(
                row.cantidad_programada,
                7
            );

        let stockProyectado = obtenerNumero(
            row.stock_inicial ??
            row.cbal ??
            row.total_disponible ??
            0
        );

        DAY_LAYOUT.forEach((dia, diaIndex) => {
            const fecha = sumarDias(
                fechaInicial,
                diaIndex
            );

            const requerimiento =
                obtenerNumero(
                    obtenerCantidadDiaria(
                        row,
                        fecha
                    )
                );

            const programado =
                programadoPorDia[diaIndex];

            const cambios =
                programado - requerimiento;

            stockProyectado += cambios;

            const doh =
                row.doh_excel ??
                row.doh ??
                '';

            if (dia.columns === 7) {
                /*
                 * Miércoles:
                 * STOCK, REQ, CAMBIOS, PARTES,
                 * CAMBIOS DE PARTES, REAL, DOH
                 */

                agregarCelda(
                    tr,
                    formatearNumero(
                        stockProyectado
                    ),
                    'bg-blue-light'
                );

                agregarCelda(
                    tr,
                    formatearNumero(
                        requerimiento
                    ),
                    'bg-gray'
                );

                agregarCelda(
                    tr,
                    formatearNumero(
                        cambios
                    ),
                    claseDiferencia(cambios)
                );

                agregarCelda(
                    tr,
                    formatearNumero(
                        programado
                    ),
                    'bg-blue-light'
                );

                agregarCelda(
                    tr,
                    '',
                    'bg-blue'
                );

                agregarCelda(
                    tr,
                    '',
                    ''
                );

                agregarCelda(
                    tr,
                    formatearNumero(doh),
                    obtenerClaseDoh(doh)
                );
            } else {
                /*
                 * Días restantes:
                 * STOCK, INVENTA, REQ, CAMBIOS,
                 * PARTES, CAMBIOS DE PARTES,
                 * REAL, DOH
                 */

                agregarCelda(
                    tr,
                    formatearNumero(
                        stockProyectado
                    ),
                    'bg-blue-light'
                );

                agregarCelda(
                    tr,
                    formatearNumero(
                        row.in_transit
                    ),
                    'bg-blue'
                );

                agregarCelda(
                    tr,
                    formatearNumero(
                        requerimiento
                    ),
                    'bg-gray'
                );

                agregarCelda(
                    tr,
                    formatearNumero(
                        cambios
                    ),
                    claseDiferencia(cambios)
                );

                agregarCelda(
                    tr,
                    formatearNumero(
                        programado
                    ),
                    'bg-blue-light'
                );

                agregarCelda(
                    tr,
                    '',
                    'bg-blue'
                );

                agregarCelda(
                    tr,
                    '',
                    ''
                );

                agregarCelda(
                    tr,
                    formatearNumero(doh),
                    obtenerClaseDoh(doh)
                );
            }
        });

        tbody.appendChild(tr);
    });
}

// Divide SCHDWK entre los siete días.
//
// Ejemplo:
// 10 -> 2, 2, 2, 1, 1, 1, 1
//
function distribuirCantidadSemanal(
    cantidad,
    dias = 7
) {
    const total = Math.round(
        obtenerNumero(cantidad)
    );

    const base = Math.floor(
        total / dias
    );

    const sobrante =
        total - base * dias;

    return Array.from(
        { length: dias },
        (_, index) =>
            base +
            (index < sobrante ? 1 : 0)
    );
}

// BOTÓN ACTUALIZAR
function inicializarBotonActualizar() {
    const boton = document.getElementById(
        'btnActualizarProgramacion'
    );

    if (!boton) return;

    boton.addEventListener(
        'click',
        async () => {
            const textoOriginal =
                boton.innerHTML;

            boton.disabled = true;
            boton.innerHTML = `
                <i class="bi bi-arrow-repeat"></i>
                Actualizando...
            `;

            programacionPage = 1;
            resumenPage = 1;

            try {
                await cargarProgramacion();
            } catch (error) {
                console.error(
                    'Error al actualizar:',
                    error
                );
            } finally {
                boton.disabled = false;
                boton.innerHTML =
                    textoOriginal;
            }
        }
    );
}

// PAGINACIÓN
function renderPaginacionPrincipal(
    pagination = {}
) {
    const tbody = document.getElementById(
        'tbodyProgramacion'
    );

    const tableContainer =
        tbody?.closest('.table-container');

    if (!tableContainer) return;

    let container = document.getElementById(
        'paginacionProgramacion'
    );

    if (!container) {
        container = document.createElement('div');
        container.id = 'paginacionProgramacion';
        container.className =
            'programacion-paginacion';

        tableContainer.after(container);
    }

    const page = pagination.page || 1;
    const totalPages =
        pagination.totalPages || 1;
    const total = pagination.total || 0;

    container.innerHTML = `
        <button
            type="button"
            id="btnPaginaAnteriorProgramacion"
            ${page <= 1 ? 'disabled' : ''}
        >
            Anterior
        </button>

        <span>
            Página ${page} de ${totalPages}
            · Total: ${total}
        </span>

        <button
            type="button"
            id="btnPaginaSiguienteProgramacion"
            ${page >= totalPages ? 'disabled' : ''}
        >
            Siguiente
        </button>
    `;

    document
        .getElementById(
            'btnPaginaAnteriorProgramacion'
        )
        ?.addEventListener('click', () => {
            if (programacionPage > 1) {
                programacionPage--;
                loadProgramacionBase();
            }
        });

    document
        .getElementById(
            'btnPaginaSiguienteProgramacion'
        )
        ?.addEventListener('click', () => {
            if (
                programacionPage <
                programacionTotalPages
            ) {
                programacionPage++;
                loadProgramacionBase();
            }
        });
}

function renderPaginacionResumen(
    pagination = {}
) {
    const container = document.getElementById(
        'paginacionResumenProgramacion'
    );

    if (!container) return;

    const page = pagination.page || 1;
    const totalPages =
        pagination.totalPages || 1;
    const total = pagination.total || 0;

    container.innerHTML = `
        <button
            type="button"
            id="btnResumenAnterior"
            ${page <= 1 ? 'disabled' : ''}
        >
            Anterior
        </button>

        <span>
            Página ${page} de ${totalPages}
            · Total: ${total}
        </span>

        <button
            type="button"
            id="btnResumenSiguiente"
            ${page >= totalPages ? 'disabled' : ''}
        >
            Siguiente
        </button>
    `;

    document
        .getElementById('btnResumenAnterior')
        ?.addEventListener('click', () => {
            if (resumenPage > 1) {
                resumenPage--;
                loadResumenProgramacion();
            }
        });

    document
        .getElementById('btnResumenSiguiente')
        ?.addEventListener('click', () => {
            if (
                resumenPage <
                resumenTotalPages
            ) {
                resumenPage++;
                loadResumenProgramacion();
            }
        });
}

// CONTROLES DE SEMANA
function inicializarControlesSemana() {
    const contenedor = document.querySelector(
        '.programacion-filtros, ' +
        '.programacion-controls, ' +
        '.filter-container'
    );

    if (!contenedor) return;

    let filtroSemana = document.getElementById(
        'filtroSemana'
    );

    if (!filtroSemana) {
        const grupo =
            document.createElement('div');

        grupo.className = 'filter-group';

        grupo.innerHTML = `
            <label for="filtroSemana">
                Semana
            </label>
            <select id="filtroSemana"></select>
        `;

        contenedor.prepend(grupo);

        filtroSemana =
            document.getElementById(
                'filtroSemana'
            );
    }

    let filtroAnio = document.getElementById(
        'filtroAnio'
    );

    if (!filtroAnio) {
        const grupo =
            document.createElement('div');

        grupo.className = 'filter-group';

        grupo.innerHTML = `
            <label for="filtroAnio">
                Año
            </label>
            <input
                id="filtroAnio"
                type="number"
                min="2020"
                max="2100"
            >
        `;

        contenedor.prepend(grupo);

        filtroAnio =
            document.getElementById(
                'filtroAnio'
            );
    }

    const guardado =
        obtenerSemanaGuardada();

    filtroSemana.innerHTML = '';

    for (let semana = 1; semana <= 41; semana++) {
        const option =
            document.createElement('option');

        option.value = String(semana);
        option.textContent =
            `Semana ${semana}`;

        filtroSemana.appendChild(option);
    }

    filtroSemana.value =
        String(guardado.semana);

    filtroAnio.value =
        String(guardado.anio);

    filtroSemana.addEventListener(
        'change',
        cargarPorFiltro
    );

    filtroAnio.addEventListener(
        'change',
        cargarPorFiltro
    );
}

function cargarPorFiltro() {
    const filtros = obtenerFiltros();

    guardarSemana(
        filtros.semana,
        filtros.anio
    );

    programacionPage = 1;
    resumenPage = 1;

    cargarProgramacion();
}

function obtenerFiltros() {
    return {
        semana: Number(
            document.getElementById(
                'filtroSemana'
            )?.value || DEFAULT_WEEK
        ),

        anio: Number(
            document.getElementById(
                'filtroAnio'
            )?.value || DEFAULT_YEAR
        ),

        cspc: document.getElementById(
            'filtroCspc'
        )?.value.trim() || '',

        linea: document.getElementById(
            'filtroLinea'
        )?.value || ''
    };
}

function guardarSemana(semana, anio) {
    localStorage.setItem(
        'programacion_ultima_semana',
        JSON.stringify({
            semana: Number(semana),
            anio: Number(anio)
        })
    );
}

function obtenerSemanaGuardada() {
    try {
        const guardada = JSON.parse(
            localStorage.getItem(
                'programacion_ultima_semana'
            )
        );

        if (
            guardada &&
            Number.isInteger(
                Number(guardada.semana)
            ) &&
            Number.isInteger(
                Number(guardada.anio)
            )
        ) {
            return {
                semana: Number(
                    guardada.semana
                ),
                anio: Number(
                    guardada.anio
                )
            };
        }
    } catch (error) {
        console.warn(
            'No se pudo recuperar la semana guardada.'
        );
    }

    return {
        semana: DEFAULT_WEEK,
        anio: DEFAULT_YEAR
    };
}

// FECHAS
function obtenerFechaInicial(row) {
    if (row.fecha_inicio) {
        return String(row.fecha_inicio)
            .slice(0, 10);
    }

    const filtros = obtenerFiltros();

    return obtenerInicioSemanaOperativa(
        FECHA_BASE_OPERATIVA,
        filtros.semana
    );
}

function obtenerInicioSemanaOperativa(
    fechaBase,
    semana
) {
    const fecha = new Date(
        `${String(fechaBase).slice(0, 10)}T00:00:00Z`
    );

    fecha.setUTCDate(
        fecha.getUTCDate() +
        2 +
        ((semana - 1) * 7)
    );

    return fecha.toISOString().slice(0, 10);
}

function sumarDias(fechaString, dias) {
    const fecha = new Date(
        `${fechaString}T00:00:00Z`
    );

    fecha.setUTCDate(
        fecha.getUTCDate() + dias
    );

    return fecha.toISOString().slice(0, 10);
}

function actualizarFechasTabla(fechaInicio) {
    if (!fechaInicio) return;

    const headers = document.querySelectorAll(
        '#theadProgramacion .header-date, ' +
        '.header-date'
    );

    headers.forEach((header, index) => {
        const fecha = sumarDias(
            fechaInicio,
            index
        );

        const [anio, mes, dia] =
            fecha.split('-');

        header.textContent =
            `${dia}/${mes}/${anio}`;
    });
}

// TABLA RESUMEN
function asegurarTablaResumen() {
    if (
        document.getElementById(
            'tbodyResumenProgramacion'
        )
    ) {
        return;
    }

    const tbodyPrincipal =
        document.getElementById(
            'tbodyProgramacion'
        );

    const tableContainer =
        tbodyPrincipal?.closest(
            '.table-container'
        );

    if (!tableContainer) return;

    const wrapper =
        document.createElement('div');

    wrapper.className =
        'programacion-resumen';

    wrapper.innerHTML = `
        <h2>Resumen semanal</h2>

        <div class="table-container">
            <table class="tabla-resumen-programacion">
                <thead>
                    <tr>
                        <th>CSPC</th>
                        <th>LÍNEA</th>
                        <th>CAPACIDAD TOTAL</th>
                        <th>REQ BODY</th>
                        <th>WREQ</th>
                        <th>SCHDWK</th>
                        <th>DIFERENCIA</th>
                    </tr>
                </thead>

                <tbody id="tbodyResumenProgramacion"></tbody>
            </table>
        </div>

        <div
            id="paginacionResumenProgramacion"
            class="programacion-paginacion"
        ></div>
    `;

    tableContainer.after(wrapper);
}

// FILTROS Y BÚSQUEDA
function inicializarFiltros() {
    document
        .getElementById(
            'btnBuscarProgramacion'
        )
        ?.addEventListener('click', () => {
            programacionPage = 1;
            resumenPage = 1;
            cargarProgramacion();
        });

    document
        .getElementById(
            'btnLimpiarProgramacion'
        )
        ?.addEventListener('click', () => {
            const cspc =
                document.getElementById(
                    'filtroCspc'
                );

            const linea =
                document.getElementById(
                    'filtroLinea'
                );

            if (cspc) cspc.value = '';
            if (linea) linea.value = '';

            programacionPage = 1;
            resumenPage = 1;

            cargarProgramacion();
        });

    document
        .getElementById(
            'searchProgramacion'
        )
        ?.addEventListener('input', event => {
            filtrarTablasLocales(
                event.target.value
                    .trim()
                    .toLowerCase()
            );
        });
}

function filtrarTablasLocales(query) {
    document
        .querySelectorAll(
            '#tbodyProgramacion tr, ' +
            '#tbodyResumenProgramacion tr'
        )
        .forEach(row => {
            row.style.display =
                row.textContent
                    .toLowerCase()
                    .includes(query)
                    ? ''
                    : 'none';
        });
}

// MENÚ
function inicializarMenu() {
    document
        .querySelectorAll('.menu li')
        .forEach(item => {
            item.addEventListener('click', () => {
                document
                    .querySelectorAll('.menu li')
                    .forEach(li =>
                        li.classList.remove(
                            'active'
                        )
                    );

                item.classList.add('active');

                const section =
                    document.getElementById(
                        item.dataset.section
                    );

                if (section) {
                    document
                        .querySelectorAll('.section')
                        .forEach(element =>
                            element.classList.remove(
                                'active'
                            )
                        );

                    section.classList.add('active');
                }
            });
        });
}

// MODALES
function inicializarModales() {
    const btnPerfil =
        document.getElementById('btnPerfil');

    const btnNotificaciones =
        document.getElementById(
            'btnNotificaciones'
        );

    const panelPerfil =
        document.getElementById('panelPerfil');

    const panelNotificaciones =
        document.getElementById(
            'panelNotificaciones'
        );

    btnPerfil?.addEventListener('click', () => {
        llenarPerfil();
        abrirPanel(panelPerfil);
    });

    btnNotificaciones?.addEventListener(
        'click',
        () => {
            llenarNotificaciones();
            abrirPanel(panelNotificaciones);
        }
    );

    document
        .querySelectorAll('[data-close-panel]')
        .forEach(button => {
            button.addEventListener('click', () => {
                button
                    .closest('.center-modal')
                    ?.classList.remove('open');
            });
        });

    document
        .querySelectorAll('.center-modal')
        .forEach(panel => {
            panel.addEventListener('click', event => {
                if (event.target === panel) {
                    panel.classList.remove(
                        'open'
                    );
                }
            });
        });
}

function abrirPanel(panel) {
    if (!panel) return;

    document
        .querySelectorAll('.center-modal.open')
        .forEach(element =>
            element.classList.remove('open')
        );

    panel.classList.add('open');
}

function llenarPerfil() {
    let user = {};

    try {
        user = JSON.parse(
            localStorage.getItem('user') || '{}'
        );
    } catch {
        user = {};
    }

    establecerTexto(
        'perfilProgramacionNombre',
        user.nombre || 'Usuario'
    );

    establecerTexto(
        'perfilProgramacionCorreo',
        user.email || 'correo@ejemplo.com'
    );

    establecerTexto(
        'perfilProgramacionRol',
        user.rol || 'usuario'
    );

    establecerTexto(
        'perfilProgramacionGmin',
        user.GMIN || 'GMIN'
    );
}

function llenarNotificaciones() {
    const lista = document.getElementById(
        'listaNotificacionesProgramacion'
    );

    if (!lista) return;

    lista.innerHTML = `
        <div class="notificacion-item">
            <div class="notificacion-titulo">
                Programación actualizada
            </div>

            <div class="notificacion-fecha">
                ${new Date().toLocaleString('es-MX')}
            </div>

            <div class="notificacion-detalle">
                Se consultó la información de la semana seleccionada.
            </div>
        </div>
    `;
}

//API
async function apiFetch(url, options = {}) {
    const token = localStorage.getItem('token');

    const separator = url.includes('?')
        ? '&'
        : '?';

    const urlSinCache =
        `${url}${separator}_ts=${Date.now()}`;

    const response = await fetch(
        `${BASE_URL}${urlSinCache}`,
        {
            ...options,
            method: options.method || 'GET',
            cache: 'no-store',
            headers: {
                ...(options.headers || {}),
                ...(token
                    ? {
                        Authorization:
                            `Bearer ${token}`
                    }
                    : {})
            }
        }
    );

    const text = await response.text();

    let result = {};

    try {
        result = text
            ? JSON.parse(text)
            : {};
    } catch {
        result = {
            message: text
        };
    }

    if (
        !response.ok ||
        result.ok === false
    ) {
        throw new Error(
            result.message ||
            `Error HTTP ${response.status}`
        );
    }

    return result;
}

// UTILIDADES
function obtenerCantidadDiaria(row, fecha) {
    const valor = row.daily?.[fecha];

    if (
        valor &&
        typeof valor === 'object'
    ) {
        return valor.cantidad ?? 0;
    }

    return valor ?? 0;
}

function obtenerNumero(valor) {
    const numero = Number(valor);

    return Number.isFinite(numero)
        ? numero
        : 0;
}

function agregarCelda(
    fila,
    valor,
    clase = ''
) {
    const td = document.createElement('td');

    td.textContent =
        valor === null ||
        valor === undefined
            ? ''
            : String(valor);

    if (clase) {
        td.className = clase;
    }

    fila.appendChild(td);
}

function mostrarMensajeTabla(
    tbody,
    mensaje,
    columnas = 58
) {
    tbody.innerHTML = '';

    const tr = document.createElement('tr');
    const td = document.createElement('td');

    td.colSpan = columnas;
    td.textContent = mensaje;

    tr.appendChild(td);
    tbody.appendChild(tr);
}

function formatearNumero(valor) {
    if (
        valor === null ||
        valor === undefined ||
        valor === ''
    ) {
        return '';
    }

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return String(valor);
    }

    return numero.toLocaleString('es-MX');
}

function obtenerClaseLinea(linea) {
    const valor = String(
        linea || ''
    ).toUpperCase();

    if (valor === 'XL1') {
        return 'col-linea-xl1';
    }

    if (valor === 'XL2') {
        return 'col-linea-xl2';
    }

    if (valor === '0') {
        return 'col-linea-0';
    }

    return 'col-linea';
}

function obtenerClaseDoh(valor) {
    const doh = Number(valor);

    if (!Number.isFinite(doh)) {
        return '';
    }

    if (doh >= 2) return 'doh-green';
    if (doh >= 1.5) return 'doh-yellow';
    if (doh >= 1) return 'doh-orange';

    return 'doh-red';
}

function claseDiferencia(valor) {
    const numero = Number(valor || 0);

    if (numero < 0) {
        return 'diferencia-negativa';
    }

    if (numero > 0) {
        return 'diferencia-positiva';
    }

    return '';
}

function establecerTexto(id, valor) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = valor;
    }
}

function actualizarPeriodo(semana, anio) {
    const elemento = document.getElementById(
        'periodoProgramacion'
    );

    if (!elemento) return;

    elemento.textContent =
        `Semana ${semana} · Año ${anio}`;
}

function inicializarLogout() {
    document
        .getElementById('btnLogout')
        ?.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            window.location.href =
                '../index.html';
        });
}