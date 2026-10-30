'use strict';

const BASE_URL = 'http://localhost:3300';

const API_PLANEACION =
    `${BASE_URL}/api/planeacion`;

const API_PARTES =
    `${API_PLANEACION}/partes`;

let fechaInicioSemana = '2026-01-07';

const LINEAS = ['XL1', 'XL2'];

const DIAS = [
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
    'Lunes',
    'Martes'
];

const COLUMNAS = [
    ['hora', 'Hora'],
    ['tiempoProd', 'Tiempo de prod. (min)'],
    ['cambios', 'Cambios'],
    ['utilizacion', 'Utilización de línea'],
    ['part', 'Part'],
    ['cspc', 'CSPC'],
    ['doh6am', 'DOH 6 a.m'],
    ['conteoHoras', 'Conteo horas'],
    ['horasTurno', 'Horas en num'],
    ['piezasConsideradas', 'Piezas consumidas'],
    ['dohSecuencia', 'DOH en secuencia'],
    ['descripcion', 'Descripción de la parte'],
    ['cantidad', 'Cantidad'],
    ['strokes', 'Strokes'],
    ['partes', 'Partes'],
    ['capRacks', 'Cap en racks'],
    ['dif', 'DIF'],
    ['velocidad', 'Velocidad en piezas'],
    ['hrsRecuperar', 'Hrs para recuperar racks'],
    ['cobertura', 'Cobertura aprox.']
];

const ALIAS = {
    hora: ['hora', 'hora_inicio'],
    tiempoProd: [
        'tiempoProd',
        'tiempo_prod',
        'duracion_minutos'
    ],
    cambios: ['cambios', 'cambio'],
    utilizacion: [
        'utilizacion',
        'utilizacion_linea'
    ],
    part: [
        'part',
        'id_parte',
        'numero_parte'
    ],
    cspc: [
        'cspc',
        'id_cspc',
        'nombre_cspc'
    ],
    doh6am: [
        'doh6am',
        'doh_6am',
        'doh'
    ],
    conteoHoras: [
        'conteoHoras',
        'conteo_horas'
    ],
    horasTurno: [
        'horasTurno',
        'horas_turno'
    ],
    piezasConsideradas: [
        'piezasConsideradas',
        'piezas_consumidas'
    ],
    dohSecuencia: [
        'dohSecuencia',
        'doh_en_secuencia'
    ],
    descripcion: [
        'descripcion',
        'descripcion_parte',
        'nombre_parte'
    ],
    cantidad: [
        'cantidad',
        'cantidad_planeada'
    ],
    strokes: [
        'strokes',
        'golpes'
    ],
    partes: [
        'partes',
        'cantidad_partes'
    ],
    capRacks: [
        'capRacks',
        'cap_racks',
        'capacidad_racks'
    ],
    dif: [
        'dif',
        'diferencia'
    ],
    velocidad: [
        'velocidad',
        'velocidad_piezas',
        'sph_cspc'
    ],
    hrsRecuperar: [
        'hrsRecuperar',
        'hrs_recuperar'
    ],
    cobertura: [
        'cobertura',
        'cobertura_aprox'
    ]
};

let datosSemana = new Map();
let cargaActual = 0;

document.addEventListener('DOMContentLoaded', () => {
    configurarEventos();
    configurarControlSemana();
    actualizarEncabezadoSemana();
    cargarPartes();
    cargarPlaneacion();
});

function configurarEventos() {
    document
        .getElementById('btnRecargarPlaneacion')
        ?.addEventListener(
            'click',
            cargarPlaneacion
        );

    document
        .getElementById('formPlaneacion')
        ?.addEventListener(
            'submit',
            guardarPlaneacion
        );

    document
        .getElementById('searchPlaneacion')
        ?.addEventListener('input', event => {
            filtrarTabla(
                event.target.value.toLowerCase()
            );
        });

    document
        .getElementById('btnLogout')
        ?.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            window.location.href =
                '../index.html';
        });

    document
        .getElementById('btnPerfil')
        ?.addEventListener('click', () => {
            cargarPerfil();
            abrirModal('panelPerfil');
        });

    document
        .getElementById('btnNotificaciones')
        ?.addEventListener('click', () => {
            cargarNotificaciones();
            abrirModal('panelNotificaciones');
        });

    document
        .querySelectorAll('[data-close-panel]')
        .forEach(button => {
            button.addEventListener('click', () => {
                button
                    .closest('.center-modal')
                    ?.classList.remove('open');
            });
        });
}

function configurarControlSemana() {
    document
        .getElementById('btnSemanaAnterior')
        ?.addEventListener('click', () => {
            fechaInicioSemana =
                sumarDias(fechaInicioSemana, -7);

            actualizarEncabezadoSemana();
            cargarPlaneacion();
        });

    document
        .getElementById('btnSemanaSiguiente')
        ?.addEventListener('click', () => {
            fechaInicioSemana =
                sumarDias(fechaInicioSemana, 7);

            actualizarEncabezadoSemana();
            cargarPlaneacion();
        });

    document
        .getElementById('selectorSemana')
        ?.addEventListener('change', event => {
            fechaInicioSemana =
                obtenerInicioSemana(
                    event.target.value
                );

            actualizarEncabezadoSemana();
            cargarPlaneacion();
        });
}

function obtenerInicioSemana(fechaISO) {
    if (!fechaISO) {
        return fechaInicioSemana;
    }

    const fecha =
        new Date(`${fechaISO}T00:00:00`);

    const diaSemana =
        fecha.getDay();

    const diferencia =
        (diaSemana - 3 + 7) % 7;

    return sumarDias(
        fechaISO,
        -diferencia
    );
}

function actualizarEncabezadoSemana() {
    const fechaFinal =
        sumarDias(fechaInicioSemana, 6);

    const caption =
        document.getElementById(
            'rangoSemana'
        );

    const selector =
        document.getElementById(
            'selectorSemana'
        );

    const fechaCaptura =
        document.getElementById(
            'capturaFecha'
        );

    if (caption) {
        caption.textContent =
            `Semana del miércoles ${mostrarFecha(fechaInicioSemana)} ` +
            `al martes ${mostrarFecha(fechaFinal)}`;
    }

    if (selector) {
        selector.value =
            fechaInicioSemana;
    }

    if (fechaCaptura) {
        fechaCaptura.value =
            fechaInicioSemana;
    }
}

function abrirModal(id) {
    document
        .getElementById(id)
        ?.classList.add('open');
}

function crearFechas() {
    return DIAS.map((dia, indice) => ({
        dia,
        fecha: sumarDias(
            fechaInicioSemana,
            indice
        )
    }));
}

function sumarDias(fechaISO, cantidad) {
    const [anio, mes, dia] =
        fechaISO.split('-').map(Number);

    const fecha =
        new Date(anio, mes - 1, dia);

    fecha.setDate(
        fecha.getDate() + cantidad
    );

    return [
        fecha.getFullYear(),
        String(
            fecha.getMonth() + 1
        ).padStart(2, '0'),
        String(
            fecha.getDate()
        ).padStart(2, '0')
    ].join('-');
}

function mostrarFecha(fechaISO) {
    const [anio, mes, dia] =
        fechaISO.split('-');

    return `${dia}/${mes}/${anio}`;
}

async function cargarPartes() {
    const selector =
        document.getElementById(
            'capturaIdParte'
        );

    if (!selector) {
        return;
    }

    try {
        const token =
            localStorage.getItem('token');

        const headers = {
            Accept: 'application/json'
        };

        if (token) {
            headers.Authorization =
                `Bearer ${token}`;
        }

        const response =
            await fetch(API_PARTES, {
                method: 'GET',
                headers,
                cache: 'no-store'
            });

        const data =
            await response.json();

        if (!response.ok || data.ok === false) {
            throw new Error(
                data.mensaje ||
                'No fue posible cargar las partes'
            );
        }

        const partes =
            Array.isArray(data.partes)
                ? data.partes
                : [];

        selector.innerHTML = '';

        const opcionInicial =
            document.createElement('option');

        opcionInicial.value = '';
        opcionInicial.textContent =
            'Selecciona una parte';
        opcionInicial.disabled = true;
        opcionInicial.selected = true;

        selector.appendChild(
            opcionInicial
        );

        partes.forEach(parte => {
            const opcion =
                document.createElement('option');

            const numero =
                parte.numero_parte ||
                'Sin número';

            const nombre =
                parte.nombre_parte ||
                'Sin descripción';

            const cspc =
                parte.nombre_cspc ||
                'Sin CSPC';

            opcion.value =
                parte.id_parte;

            opcion.textContent =
                `${numero} - ${nombre} - CSPC: ${cspc}`;

            selector.appendChild(
                opcion
            );
        });

        if (partes.length === 0) {
            selector.innerHTML = `
                <option value="">
                    No hay partes disponibles
                </option>
            `;
        }
    } catch (error) {
        console.error(
            'Error al cargar partes:',
            error
        );

        selector.innerHTML = `
            <option value="">
                No se pudieron cargar las partes
            </option>
        `;
    }
}

async function cargarPlaneacion() {
    const contenedor =
        document.getElementById(
            'planeacionSemana'
        );

    const estado =
        document.getElementById(
            'planeacionEstado'
        );

    const boton =
        document.getElementById(
            'btnRecargarPlaneacion'
        );

    if (!contenedor || !estado) {
        return;
    }

    const idCarga = ++cargaActual;

    if (boton) {
        boton.disabled = true;
    }

    estado.textContent =
        'Consultando la planeación semanal.';

    estado.classList.remove('error');

    datosSemana.clear();

    try {
        const solicitudes = [];

        crearFechas().forEach(({ fecha }) => {
            LINEAS.forEach(linea => {
                solicitudes.push(
                    consultarFechaLinea(
                        fecha,
                        linea
                    )
                );
            });
        });

        const resultados =
            await Promise.all(solicitudes);

        if (idCarga !== cargaActual) {
            return;
        }

        resultados.forEach(resultado => {
            datosSemana.set(
                `${resultado.fecha}|${resultado.linea}`,
                deduplicarFilas(
                    resultado.filas
                )
            );
        });

        renderizarSemana();

        if (
            resultados.some(
                resultado => resultado.error
            )
        ) {
            estado.textContent =
                'No fue posible consultar todas las tablas.';

            estado.classList.add('error');
        } else {
            estado.textContent =
                'Planeación cargada correctamente.';
        }
    } catch (error) {
        console.error(
            'Error general al cargar Planeación:',
            error
        );

        estado.textContent =
            'No fue posible cargar la planeación.';

        estado.classList.add('error');
    } finally {
        if (boton) {
            boton.disabled = false;
        }
    }
}

async function consultarFechaLinea(
    fecha,
    linea
) {
    const url =
        `${API_PLANEACION}?fecha=${encodeURIComponent(fecha)}&linea=${encodeURIComponent(linea)}`;

    const token =
        localStorage.getItem('token');

    const headers = {
        Accept: 'application/json'
    };

    if (token) {
        headers.Authorization =
            `Bearer ${token}`;
    }

    try {
        const response =
            await fetch(url, {
                method: 'GET',
                headers,
                cache: 'no-store'
            });

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const data =
            await response.json();

        return {
            fecha,
            linea,
            filas: deduplicarFilas(
                normalizarRespuesta(data)
            ),
            error: false
        };
    } catch (error) {
        console.error(
            `Error en ${fecha} ${linea}:`,
            error
        );

        return {
            fecha,
            linea,
            filas: [],
            error: true
        };
    }
}

function normalizarRespuesta(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.filas)) {
        return data.filas;
    }

    if (Array.isArray(data?.rows)) {
        return data.rows;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (Array.isArray(data?.planeacion)) {
        return data.planeacion;
    }

    return [];
}

function deduplicarFilas(filas) {
    if (!Array.isArray(filas)) {
        return [];
    }

    const filasVistas = new Set();

    return filas.filter(fila => {
        const normalizada =
            normalizarFila(fila);

        const clave =
            COLUMNAS
                .map(([campo]) => {
                    return normalizarClave(
                        normalizada[campo]
                    );
                })
                .join('|');

        if (filasVistas.has(clave)) {
            return false;
        }

        filasVistas.add(clave);

        return true;
    });
}

function normalizarClave(valor) {
    if (
        valor === null ||
        valor === undefined
    ) {
        return '';
    }

    return String(valor)
        .trim()
        .toUpperCase();
}

function renderizarSemana() {
    const contenedor =
        document.getElementById(
            'planeacionSemana'
        );

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML =
        LINEAS
            .map(linea => {
                return renderizarLinea(linea);
            })
            .join('');
}

function renderizarLinea(linea) {
    const grupos =
        crearFechas().map(({ dia, fecha }) => {
            const filas =
                datosSemana.get(
                    `${fecha}|${linea}`
                ) || [];

            return {
                dia,
                fecha,
                filas: deduplicarFilas(filas)
            };
        });

    const maxFilas =
        Math.max(
            1,
            ...grupos.map(grupo => {
                return grupo.filas.length;
            })
        );

    const filasHTML =
        Array.from({
            length: maxFilas
        })
            .map((_, indice) => {
                const logo =
                    indice === 0
                        ? `
                            <td
                                class="logo-cell"
                                rowspan="${maxFilas}"
                            >
                                ${escapeHTML(linea)}
                            </td>
                        `
                        : '';

                const diasHTML =
                    grupos
                        .map(grupo => {
                            return renderizarFilaDia(
                                grupo.filas[indice],
                                indice
                            );
                        })
                        .join('');

                return `
                    <tr>
                        ${logo}
                        ${diasHTML}
                    </tr>
                `;
            })
            .join('');

    const encabezadosDias =
        grupos
            .map(grupo => {
                return `
                    <th
                        class="day-title"
                        colspan="${COLUMNAS.length}"
                    >
                        ${escapeHTML(grupo.dia)}
                    </th>
                `;
            })
            .join('');

    const fechasDias =
        grupos
            .map(grupo => {
                return `
                    <th
                        class="day-date"
                        colspan="${COLUMNAS.length}"
                    >
                        ${mostrarFecha(grupo.fecha)}
                    </th>
                `;
            })
            .join('');

    const columnasDias =
        grupos
            .map(() => {
                return COLUMNAS
                    .map(columna => {
                        return `
                            <th class="column-title">
                                ${escapeHTML(columna[1])}
                            </th>
                        `;
                    })
                    .join('');
            })
            .join('');

    const totalesDias =
        grupos
            .map(grupo => {
                return renderizarTotales(
                    grupo.filas
                );
            })
            .join('');

    return `
        <section class="bloque-linea">

            <div class="bloque-linea-heading">
                Planeación ${escapeHTML(linea)}
            </div>

            <div class="linea-table-scroll">
                <table class="weekly-table">

                    <thead>
                        <tr>
                            <th rowspan="3"></th>
                            ${encabezadosDias}
                        </tr>

                        <tr>
                            ${fechasDias}
                        </tr>

                        <tr>
                            ${columnasDias}
                        </tr>
                    </thead>

                    <tbody>
                        ${filasHTML}
                    </tbody>

                    <tfoot>
                        <tr>
                            <td></td>
                            ${totalesDias}
                        </tr>
                    </tfoot>

                </table>
            </div>

        </section>
    `;
}

function renderizarFilaDia(fila, indice) {
    if (!fila) {
        return `
            <td
                colspan="${COLUMNAS.length}"
                class="empty-day"
            >
                ${indice === 0 ? 'Sin datos' : ''}
            </td>
        `;
    }

    const datos =
        normalizarFila(fila);

    const id =
        Number(fila.id_planeacion);

    const puedeEliminar =
        Number.isSafeInteger(id) &&
        id > 0;

    const esNS =
        String(datos.descripcion)
            .toUpperCase() === 'NS';

    return COLUMNAS
        .map(([campo]) => {
            const valor =
                datos[campo];

            const clases = [];

            if (campo === 'descripcion') {
                clases.push('text-left');
            }

            if (campo === 'dif') {
                clases.push(
                    claseDiferencia(valor)
                );
            }

            if (
                esNS &&
                campo === 'descripcion'
            ) {
                clases.push('bg-yellow');
            }

            if (esNA(valor)) {
                clases.push('cell-na');
            }

            const botonEliminar =
                campo === 'hora' &&
                puedeEliminar
                    ? `
                        <button
                            type="button"
                            class="btn-eliminar-planeacion"
                            data-eliminar-planeacion="${id}"
                            title="Eliminar planeación"
                            aria-label="Eliminar planeación ${id}"
                            style="margin-left:6px;padding:3px 6px;cursor:pointer;"
                        >
                            <i class="bi bi-trash"></i>
                            Eliminar
                        </button>
                    `
                    : '';

            return `
                <td class="${clases.filter(Boolean).join(' ')}">
                    ${escapeHTML(formatear(valor))}
                    ${botonEliminar}
                </td>
            `;
        })
        .join('');
}

function renderizarTotales(filas) {
    const filasUnicas =
        deduplicarFilas(filas);

    const cantidad =
        sumar(filasUnicas, 'cantidad');

    const strokes =
        sumar(filasUnicas, 'strokes');

    return `
        <td colspan="12"></td>

        <td class="footer-total">
            ${formatearNumero(cantidad)}
        </td>

        <td class="footer-total">
            ${formatearNumero(strokes)}
        </td>

        <td colspan="6"></td>
    `;
}

function normalizarFila(fila) {
    const datos = {};

    COLUMNAS.forEach(([campo]) => {
        datos[campo] =
            obtenerCampo(
                fila,
                ALIAS[campo]
            );
    });

    return datos;
}

function obtenerCampo(objeto, campos) {
    if (
        !objeto ||
        !Array.isArray(campos)
    ) {
        return null;
    }

    for (const campo of campos) {
        if (
            objeto[campo] !== undefined &&
            objeto[campo] !== null
        ) {
            return objeto[campo];
        }
    }

    return null;
}

function sumar(filas, campo) {
    return filas.reduce((total, fila) => {
        const valor =
            Number(
                obtenerCampo(
                    fila,
                    ALIAS[campo]
                )
            );

        return Number.isFinite(valor)
            ? total + valor
            : total;
    }, 0);
}

function formatear(valor) {
    if (
        valor === null ||
        valor === undefined ||
        valor === ''
    ) {
        return '';
    }

    if (typeof valor === 'number') {
        return formatearNumero(valor);
    }

    return String(valor);
}

function formatearNumero(valor) {
    const numero =
        Number(valor);

    if (!Number.isFinite(numero)) {
        return valor ?? '';
    }

    return numero.toLocaleString('en-US', {
        maximumFractionDigits: 6
    });
}

function esNA(valor) {
    return String(valor)
        .toUpperCase() === '#N/A';
}

function claseDiferencia(valor) {
    if (esNA(valor)) {
        return 'cell-na';
    }

    const numero =
        Number(valor);

    if (!Number.isFinite(numero)) {
        return '';
    }

    return numero < 0
        ? 'text-red'
        : 'text-green';
}

function filtrarTabla(texto) {
    document
        .querySelectorAll(
            '.weekly-table tbody tr'
        )
        .forEach(fila => {
            const visible =
                !texto ||
                fila.textContent
                    .toLowerCase()
                    .includes(texto);

            fila.style.display =
                visible ? '' : 'none';
        });
}

async function guardarPlaneacion(event) {
    event.preventDefault();

    const formulario =
        event.currentTarget;

    const boton =
        document.getElementById(
            'btnGuardarPlaneacion'
        );

    const datosFormulario =
        new FormData(formulario);

    const semanaSeleccionada =
        fechaInicioSemana;

    const body = {
        id_parte: Number(
            datosFormulario.get('id_parte')
        ),

        linea: String(
            datosFormulario.get('linea')
        ).trim().toUpperCase(),

        hora: String(
            datosFormulario.get('hora')
        ).trim(),

        cantidad_planeada: Number(
            datosFormulario.get(
                'cantidad_planeada'
            )
        ),

        fecha: String(
            datosFormulario.get('fecha')
        ).trim()
    };

    if (
        !body.id_parte ||
        !body.linea ||
        !body.hora ||
        !body.cantidad_planeada ||
        !body.fecha
    ) {
        mostrarMensajeFormulario(
            'Completa todos los campos.',
            true
        );

        return;
    }

    if (boton) {
        boton.disabled = true;
    }

    mostrarMensajeFormulario(
        'Guardando planeación...',
        false
    );

    const token =
        localStorage.getItem('token');

    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };

    if (token) {
        headers.Authorization =
            `Bearer ${token}`;
    }

    try {
        const response =
            await fetch(API_PLANEACION, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

        const data =
            await response
                .json()
                .catch(() => ({}));

        if (
            !response.ok ||
            data.ok === false
        ) {
            throw new Error(
                data.mensaje ||
                data.error ||
                `HTTP ${response.status}`
            );
        }

        mostrarMensajeFormulario(
            'Planeación guardada correctamente.',
            false
        );

        formulario.reset();

        fechaInicioSemana =
            semanaSeleccionada;

        actualizarEncabezadoSemana();

        document.getElementById(
            'capturaHora'
        ).value = '06:00';

        await cargarPlaneacion();
    } catch (error) {
        console.error(
            'Error al guardar planeación:',
            error
        );

        mostrarMensajeFormulario(
            error.message ||
            'No fue posible guardar la planeación.',
            true
        );
    } finally {
        if (boton) {
            boton.disabled = false;
        }
    }
}

function mostrarMensajeFormulario(
    texto,
    esError
) {
    const mensaje =
        document.getElementById(
            'mensajeFormularioPlaneacion'
        );

    if (!mensaje) {
        return;
    }

    mensaje.textContent = texto;

    mensaje.classList.toggle(
        'error',
        esError
    );

    mensaje.classList.toggle(
        'success',
        !esError
    );
}

function cargarPerfil() {
    let usuario = null;

    try {
        usuario = JSON.parse(
            localStorage.getItem('user')
        );
    } catch {
        usuario = null;
    }

    const nombre =
        document.getElementById(
            'perfilPlaneacionNombre'
        );

    const correo =
        document.getElementById(
            'perfilPlaneacionCorreo'
        );

    const rol =
        document.getElementById(
            'perfilPlaneacionRol'
        );

    const gmin =
        document.getElementById(
            'perfilPlaneacionGmin'
        );

    if (nombre) {
        nombre.textContent =
            usuario?.nombre || 'Usuario';
    }

    if (correo) {
        correo.textContent =
            usuario?.email ||
            'correo@ejemplo.com';
    }

    if (rol) {
        rol.textContent =
            usuario?.rol || 'usuario';
    }

    if (gmin) {
        gmin.textContent =
            usuario?.GMIN || 'GMIN';
    }
}

function cargarNotificaciones() {
    const contenedor =
        document.getElementById(
            'listaNotificacionesPlaneacion'
        );

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = `
        <div class="notificacion-item">
            <strong>Planeación semanal</strong>
            <br>
            Semana del 07/01/2026 al 13/01/2026
        </div>
    `;
}

function escapeHTML(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

document.addEventListener(
    'DOMContentLoaded',
    () => {
        document
            .getElementById('planeacionSemana')
            ?.addEventListener(
                'click',
                async event => {
                    const boton =
                        event.target.closest(
                            'button[data-eliminar-planeacion]'
                        );

                    if (
                        !boton ||
                        boton.disabled
                    ) {
                        return;
                    }

                    const id =
                        Number(
                            boton.dataset
                                .eliminarPlaneacion
                        );

                    if (
                        !Number.isSafeInteger(id) ||
                        id <= 0
                    ) {
                        return;
                    }

                    const confirmado =
                        window.confirm(
                            '¿Eliminar esta planeación? ' +
                            'Esta acción no se puede deshacer.'
                        );

                    if (!confirmado) {
                        return;
                    }

                    boton.disabled = true;

                    try {
                        const headers = {
                            Accept: 'application/json'
                        };

                        const token =
                            localStorage.getItem(
                                'token'
                            );

                        if (token) {
                            headers.Authorization =
                                `Bearer ${token}`;
                        }

                        const response =
                            await fetch(
                                `${API_PLANEACION}/${id}`,
                                {
                                    method: 'DELETE',
                                    headers
                                }
                            );

                        const data =
                            await response
                                .json()
                                .catch(() => ({}));

                        if (
                            !response.ok ||
                            data.ok === false
                        ) {
                            throw new Error(
                                data.mensaje ||
                                'No fue posible eliminar la planeación'
                            );
                        }

                        mostrarMensajeFormulario(
                            data.mensaje ||
                            'Planeación eliminada correctamente.',
                            false
                        );

                        // Recarga la semana que está seleccionada.
                        await cargarPlaneacion();
                    } catch (error) {
                        console.error(
                            'Error al eliminar planeación:',
                            error
                        );

                        mostrarMensajeFormulario(
                            error.message ||
                            'No fue posible eliminar la planeación.',
                            true
                        );

                        boton.disabled = false;
                    }
                }
            );
    }
);