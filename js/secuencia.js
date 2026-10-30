'use strict';

const BASE_URL = 'http://localhost:3300';
const DEFAULT_WEDNESDAY = '2026-01-07';

let secuenciaData = [];
let semanaFechas = [];

document.addEventListener(
    'DOMContentLoaded',
    iniciarSecuencia
);

function iniciarSecuencia() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    inicializarFecha();
    inicializarMenu();
    inicializarModales();
    inicializarBusqueda();
    inicializarLogout();

    document
        .getElementById('btnConsultarSecuencia')
        ?.addEventListener(
            'click',
            cargarSemana
        );

    document
        .getElementById('btnActualizarSecuencia')
        ?.addEventListener(
            'click',
            cargarSemana
        );

    cargarSemana();
}

// CARGA DE LA SEMANA
async function cargarSemana() {
    const tbody = document.getElementById(
        'tbodySecuencia'
    );

    if (!tbody) return;

    const fechaCapturada =
        document.getElementById(
            'fechaSecuencia'
        )?.value || DEFAULT_WEDNESDAY;

    const fechaInicio =
        normalizarAInicioMiercoles(
            fechaCapturada
        );

    const linea =
        document.getElementById(
            'lineaSecuencia'
        )?.value || '';

    const inputFecha =
        document.getElementById(
            'fechaSecuencia'
        );

    if (inputFecha) {
        inputFecha.value = fechaInicio;
    }

    localStorage.setItem(
        'secuencia_fecha',
        fechaInicio
    );

    semanaFechas =
        obtenerFechasSemana(
            fechaInicio
        );

    actualizarEncabezados(
        semanaFechas
    );

    mostrarMensaje(
        tbody,
        'Cargando secuencia semanal...'
    );

    try {
        const respuesta =
            await consultarSecuenciaSemana(
                fechaInicio,
                linea
            );

        if (
            Array.isArray(respuesta.fechas) &&
            respuesta.fechas.length === 7
        ) {
            semanaFechas =
                respuesta.fechas.map(
                    normalizarFechaClave
                );

            actualizarEncabezados(
                semanaFechas
            );
        }

        secuenciaData =
            adaptarDatosSemana(
                respuesta.data,
                semanaFechas
            );

        renderSecuenciaTable();

        const textoSemana =
            document.getElementById(
                'semanaTexto'
            );

        if (
            textoSemana &&
            semanaFechas.length === 7
        ) {
            textoSemana.textContent =
                `Semana del ${formatearFecha(
                    semanaFechas[0]
                )} al ${formatearFecha(
                    semanaFechas[6]
                )}`;
        }
    } catch (error) {
        console.error(
            'Error cargando secuencia:',
            error
        );

        mostrarMensaje(
            tbody,
            error.message ||
                'Error al cargar la secuencia.'
        );
    }

    const respuesta =
    await consultarSecuenciaSemana(
        fechaInicio,
        linea
    );

    console.log(
        '[Secuencia] Respuesta API:',
        respuesta
    );

    console.log(
        '[Secuencia] Filas recibidas:',
        respuesta.data?.length
    );

    secuenciaData =
        adaptarDatosSemana(
            respuesta.data,
            semanaFechas
        );

    console.log(
        '[Secuencia] Filas adaptadas:',
        secuenciaData
    );

    renderSecuenciaTable();
}

async function consultarSecuenciaSemana(
    fecha,
    linea
) {
    const params = new URLSearchParams({
        fecha
    });

    if (linea) {
        params.set('linea', linea);
    }

    return await apiFetch(
        `/api/secuencia/semana?${params.toString()}`
    );
}

// ADAPTACIÓN DE RESPUESTA
function adaptarDatosSemana(
    filas,
    fechas
) {
    if (!Array.isArray(filas)) {
        return [];
    }

    return filas.map(row => {
        const diasFuente =
            row.dias || {};

        const dias = {};
        let banco = '';

        fechas.forEach(fecha => {
            const dia =
                buscarDia(
                    diasFuente,
                    fecha
                );

            const planeada =
                obtenerNumeroNulo(
                    dia.cantidad_planeada
                );

            const requerida =
                obtenerNumero(
                    dia.cantidad_requerida
                );

            const cantidad =
                planeada !== null
                    ? planeada
                    : requerida;

            const duracion =
                dia.duracion_min !== null &&
                dia.duracion_min !== undefined
                    ? dia.duracion_min
                    : planeada !== null
                        ? calcularDuracion(
                            planeada,
                            row.sph
                        )
                        : '';

            if (
                !banco &&
                dia.banco !== null &&
                dia.banco !== undefined
            ) {
                banco = dia.banco;
            }

            dias[fecha] = {
                cantidad,
                duracion,

                secuencia:
                    dia.orden_planeado ?? '',

                cambios:
                    dia.cambios || 'N/D',

                estado:
                    dia.estado ||
                    obtenerEstado(
                        cantidad,
                        dia.orden_planeado
                    )
            };
        });

        const totalPlaneado =
            obtenerNumeroNulo(
                row.total_planeado
            );

        const totalRequerido =
            obtenerNumero(
                row.total_requerido
            );

        return {
            numero:
                String(
                    row.numero ?? ''
                ).trim(),

            cspc:
                String(
                    row.cspc ?? ''
                ).trim(),

            linea:
                String(
                    row.linea ?? ''
                ).trim(),

            sph:
                row.sph ?? '',

            banco,

            dias,

            total:
                totalPlaneado !== null &&
                totalPlaneado > 0
                    ? totalPlaneado
                    : totalRequerido
        };
    });
}

function buscarDia(
    dias,
    fechaBuscada
) {
    if (dias[fechaBuscada]) {
        return dias[fechaBuscada];
    }

    const encontrado =
        Object.entries(dias).find(
            ([clave]) =>
                normalizarFechaClave(
                    clave
                ) === fechaBuscada
        );

    return encontrado
        ? encontrado[1]
        : {};
}

function normalizarFechaClave(
    valor
) {
    if (!valor) {
        return '';
    }

    const texto = String(valor);

    const fechaISO =
        texto.match(
            /^(\d{4}-\d{2}-\d{2})/
        );

    if (fechaISO) {
        return fechaISO[1];
    }

    const fecha = new Date(valor);

    if (Number.isNaN(fecha.getTime())) {
        return '';
    }

    return fecha
        .toISOString()
        .slice(0, 10);
}

/* =========================
   RENDERIZADO
========================= */

function renderSecuenciaTable() {
    const tbody = document.getElementById(
        'tbodySecuencia'
    );

    if (!tbody) return;

    tbody.innerHTML = '';

    if (!secuenciaData.length) {
        mostrarMensaje(
            tbody,
            'No hay datos para la semana seleccionada.'
        );

        return;
    }

    secuenciaData.forEach(row => {
        const tr = document.createElement('tr');

        agregarCelda(
            tr,
            row.numero,
            'col-numero'
        );

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
            formatearNumero(row.sph),
            'col-sph'
        );

        agregarCelda(
            tr,
            formatearDecimal(row.banco),
            'col-banco'
        );

        semanaFechas.forEach(fecha => {
            const dia =
                row.dias[fecha] || {};

            agregarCelda(
                tr,
                formatearNumero(
                    dia.cantidad
                ),
                'col-cantidad'
            );

            agregarCelda(
                tr,
                formatearDecimal(
                    dia.duracion
                ),
                'col-duracion'
            );

            agregarCelda(
                tr,
                formatearNumero(
                    dia.secuencia
                ),
                'planned-cell'
            );

            agregarCelda(
                tr,
                dia.cambios || 'N/D',
                'change-cell'
            );

            agregarCelda(
                tr,
                dia.estado || 'SIN DEMANDA',
                obtenerClaseEstado(
                    dia.estado
                )
            );
        });

        agregarCelda(
            tr,
            formatearNumero(row.total),
            'total-cell'
        );

        tbody.appendChild(tr);
    });
}

// FECHAS
function inicializarFecha() {
    const input = document.getElementById(
        'fechaSecuencia'
    );

    if (!input) return;

    const guardada =
        localStorage.getItem(
            'secuencia_fecha'
        );

    input.value =
        guardada || DEFAULT_WEDNESDAY;
}

function normalizarAInicioMiercoles(
    fechaString
) {
    const fecha = new Date(
        `${fechaString}T00:00:00Z`
    );

    if (Number.isNaN(fecha.getTime())) {
        return DEFAULT_WEDNESDAY;
    }

    const dia = fecha.getUTCDay();
    const diferencia = (dia + 4) % 7;

    fecha.setUTCDate(
        fecha.getUTCDate() - diferencia
    );

    return fecha
        .toISOString()
        .slice(0, 10);
}

function obtenerFechasSemana(
    fechaInicio
) {
    return Array.from(
        { length: 7 },
        (_, index) =>
            sumarDias(
                fechaInicio,
                index
            )
    );
}

function sumarDias(
    fechaString,
    dias
) {
    const fecha = new Date(
        `${fechaString}T00:00:00Z`
    );

    fecha.setUTCDate(
        fecha.getUTCDate() + dias
    );

    return fecha
        .toISOString()
        .slice(0, 10);
}

function actualizarEncabezados(
    fechas
) {
    document
        .querySelectorAll(
            '.day-header'
        )
        .forEach((header, index) => {
            const fecha = fechas[index];

            if (!fecha) return;

            const label =
                header.querySelector(
                    '.date-label'
                );

            if (label) {
                label.textContent =
                    formatearFecha(fecha);
            }
        });
}

function formatearFecha(
    fechaString
) {
    const fecha =
        normalizarFechaClave(
            fechaString
        );

    if (!fecha) {
        return '';
    }

    const [anio, mes, dia] =
        fecha.split('-');

    return `${dia}/${mes}/${anio}`;
}

// ESTADOS Y CÁLCULOS
function obtenerEstado(
    cantidad,
    secuencia
) {
    if (cantidad <= 0) {
        return 'SIN DEMANDA';
    }

    if (
        secuencia !== null &&
        secuencia !== undefined &&
        secuencia !== ''
    ) {
        return 'PLANEADA';
    }

    return 'SIN SECUENCIA';
}

function calcularDuracion(
    cantidad,
    sph
) {
    const cantidadNumero =
        obtenerNumero(cantidad);

    const sphNumero =
        obtenerNumero(sph);

    if (
        cantidadNumero <= 0 ||
        sphNumero <= 0
    ) {
        return '';
    }

    return (
        cantidadNumero /
        sphNumero *
        60
    ).toFixed(2);
}

// API
async function apiFetch(url) {
    const token = localStorage.getItem(
        'token'
    );

    const separador = url.includes('?')
        ? '&'
        : '?';

    const response = await fetch(
        `${BASE_URL}${url}${separador}_ts=${Date.now()}`,
        {
            cache: 'no-store',
            headers: token
                ? {
                    Authorization:
                        `Bearer ${token}`
                }
                : {}
        }
    );

    const texto =
        await response.text();

    let resultado = {};

    try {
        resultado = texto
            ? JSON.parse(texto)
            : {};
    } catch {
        resultado = {
            message: texto
        };
    }

    if (
        !response.ok ||
        resultado.ok === false
    ) {
        throw new Error(
            resultado.message ||
                `Error HTTP ${response.status}`
        );
    }

    return resultado;
}

// BÚSQUEDA
function inicializarBusqueda() {
    document
        .getElementById(
            'searchSecuencia'
        )
        ?.addEventListener(
            'input',
            event => {
                const query =
                    event.target.value
                        .trim()
                        .toLowerCase();

                document
                    .querySelectorAll(
                        '#tbodySecuencia tr'
                    )
                    .forEach(row => {
                        row.style.display =
                            row.textContent
                                .toLowerCase()
                                .includes(
                                    query
                                )
                                ? ''
                                : 'none';
                    });
            }
        );
}

// MENÚ
function inicializarMenu() {
    document
        .querySelectorAll('.menu li')
        .forEach(item => {
            item.addEventListener(
                'click',
                () => {
                    document
                        .querySelectorAll(
                            '.menu li'
                        )
                        .forEach(li =>
                            li.classList.remove(
                                'active'
                            )
                        );

                    item.classList.add('active');
                }
            );
        });
}

// MODALES
function inicializarModales() {
    const btnPerfil =
        document.getElementById(
            'btnPerfil'
        );

    const btnNotificaciones =
        document.getElementById(
            'btnNotificaciones'
        );

    const panelPerfil =
        document.getElementById(
            'panelPerfil'
        );

    const panelNotificaciones =
        document.getElementById(
            'panelNotificacionesSecuencia'
        );

    btnPerfil?.addEventListener(
        'click',
        () => {
            llenarPerfil();
            abrirPanel(panelPerfil);
        }
    );

    btnNotificaciones?.addEventListener(
        'click',
        () => {
            llenarNotificaciones();

            abrirPanel(
                panelNotificaciones
            );
        }
    );

    document
        .querySelectorAll(
            '[data-close-panel]'
        )
        .forEach(button => {
            button.addEventListener(
                'click',
                () => {
                    button
                        .closest(
                            '.center-modal'
                        )
                        ?.classList.remove(
                            'open'
                        );
                }
            );
        });
}

function abrirPanel(panel) {
    if (!panel) return;

    document
        .querySelectorAll(
            '.center-modal.open'
        )
        .forEach(item =>
            item.classList.remove(
                'open'
            )
        );

    panel.classList.add('open');
}

function llenarPerfil() {
    let user = {};

    try {
        user = JSON.parse(
            localStorage.getItem(
                'user'
            ) || '{}'
        );
    } catch {
        user = {};
    }

    establecerTexto(
        'perfilSecuenciaNombre',
        user.nombre || 'Usuario'
    );

    establecerTexto(
        'perfilSecuenciaCorreo',
        user.email ||
            'correo@ejemplo.com'
    );

    establecerTexto(
        'perfilSecuenciaRol',
        user.rol || 'usuario'
    );

    establecerTexto(
        'perfilSecuenciaGmin',
        user.GMIN || 'GMIN'
    );
}

function llenarNotificaciones() {
    const contenedor =
        document.getElementById(
            'listaNotificacionesSecuencia'
        );

    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="notificacion-item">
            <div class="notificacion-titulo">
                Consulta de secuencia
            </div>

            <div class="notificacion-fecha">
                ${new Date().toLocaleString('es-MX')}
            </div>

            <div class="notificacion-detalle">
                La secuencia es de referencia y no modifica producción.
            </div>
        </div>
    `;
}

// LOGOUT Y UTILIDADES
function inicializarLogout() {
    document
        .getElementById('btnLogout')
        ?.addEventListener(
            'click',
            () => {
                localStorage.removeItem(
                    'token'
                );

                localStorage.removeItem(
                    'user'
                );

                window.location.href =
                    '../index.html';
            }
        );
}

function agregarCelda(
    fila,
    valor,
    clase = ''
) {
    const td =
        document.createElement('td');

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

function mostrarMensaje(
    tbody,
    mensaje
) {
    tbody.innerHTML = `
        <tr>
            <td colspan="41">
                ${escapeHtml(mensaje)}
            </td>
        </tr>
    `;
}

function obtenerNumero(valor) {
    const numero = Number(valor);

    return Number.isFinite(numero)
        ? numero
        : 0;
}

function obtenerNumeroNulo(valor) {
    if (
        valor === null ||
        valor === undefined ||
        valor === ''
    ) {
        return null;
    }

    const numero = Number(valor);

    return Number.isFinite(numero)
        ? numero
        : null;
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

function formatearDecimal(valor) {
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

    return numero.toFixed(2);
}

function obtenerClaseLinea(linea) {
    const valor = String(
        linea || ''
    ).toUpperCase();

    if (valor === 'XL1') {
        return 'linea-xl1';
    }

    if (valor === 'XL2') {
        return 'linea-xl2';
    }

    return 'linea-0';
}

function obtenerClaseEstado(estado) {
    if (estado === 'PLANEADA') {
        return 'status-cell planned-cell';
    }

    if (estado === 'SIN SECUENCIA') {
        return 'status-cell warning-cell';
    }

    return 'status-cell';
}

function establecerTexto(
    id,
    valor
) {
    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
}

function escapeHtml(valor) {
    return String(valor ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}