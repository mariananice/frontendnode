'use strict';

const BASE_URL = 'http://localhost:3300';

let datosData = [];
let datosSummary = null;

document.addEventListener(
    'DOMContentLoaded',
    iniciarDatos
);

function iniciarDatos() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    initializeMenu();
    inicializarModales();
    inicializarBusqueda();
    inicializarLogout();
    inicializarImportadorDatos();
    inicializarEdicionDatos();
    inicializarCheckDatos();

    loadDatosData();

    document
        .getElementById('btnCheckDatos')
        ?.addEventListener(
            'click',
            loadDatosData
        );

    loadDatosData();
}

async function loadDatosData() {
    const tbody = document.getElementById(
        'tbodyDatos'
    );

    if (!tbody) return;

    mostrarMensaje(
        tbody,
        'Cargando datos...'
    );

    try {
        const result = await apiFetch(
            '/api/datos?limit=500'
        );

        datosData = result.data || [];
        datosSummary = result.summary || null;

        renderResumen();
        renderDatosTable();
    } catch (error) {
        console.error(
            'Error cargando datos:',
            error
        );

        mostrarMensaje(
            tbody,
            error.message
        );
    }
}

function renderResumen() {
    const summary = datosSummary || {};

    establecerTexto(
        'valorLtExterno',
        summary.ltExterno
    );

    establecerTexto(
        'valorSphObjetivo',
        summary.sphObjetivo
    );

    establecerTexto(
        'valorJph',
        summary.jph
    );

    establecerTexto(
        'valorHorasDisponibles',
        summary.hrsDisponibles
    );

    establecerTexto(
        'valorJpd',
        summary.jpd
    );

    establecerTexto(
        'valorFechaMiercoles',
        formatearFecha(
            summary.fechaMiercoles
        )
    );
}

/*function renderDatosTable() {
    const tbody = document.getElementById(
        'tbodyDatos'
    );

    if (!tbody) return;

    tbody.innerHTML = '';

    if (!datosData.length) {
        mostrarMensaje(
            tbody,
            'No hay datos disponibles.'
        );
        return;
    }

    datosData.forEach(row => {
        const tr = document.createElement('tr');

        agregarCelda(tr, row.part);
        agregarCelda(
            tr,
            row.numero,
            'col-numero'
        );
        agregarCelda(tr, row.cspc);
        agregarCelda(
            tr,
            row.modelo,
            'col-modelo'
        );
        agregarCelda(
            tr,
            row.rack,
            'col-rack'
        );
        agregarCelda(
            tr,
            row.linea,
            obtenerClaseLinea(row.linea)
        );
        agregarCelda(
            tr,
            row.golpe,
            'col-golpe'
        );
        agregarCelda(
            tr,
            row.sphAnt,
            'col-sph'
        );
        agregarCelda(
            tr,
            row.sphObj,
            'col-sph'
        );
        agregarCelda(
            tr,
            row.stdPallet,
            'col-std-pallet'
        );
        agregarCelda(
            tr,
            row.stdRack,
            'col-std-rack'
        );
        agregarCelda(
            tr,
            row.racksPrograma,
            'col-programa'
        );
        agregarCelda(
            tr,
            row.loopRacks,
            'col-loop'
        );
        agregarCelda(
            tr,
            row.capTotal,
            'col-capacidad'
        );
        agregarCelda(
            tr,
            row.danados,
            'col-danados'
        );
        agregarCelda(
            tr,
            row.invDiario,
            'col-inv-diario'
        );
        agregarCelda(
            tr,
            row.cap,
            'col-cap'
        );
        agregarCelda(
            tr,
            row.req,
            'col-req'
        );
        agregarCelda(
            tr,
            formatearMezcla(row.mezcla),
            'col-mezcla'
        );
        agregarCelda(
            tr,
            row.desocup,
            'col-desocupabilidad'
        );

        tbody.appendChild(tr);
    });
}*/

function renderDatosTable() {
    const tbody = document.getElementById('tbodyDatos');

    if (!tbody) return;

    tbody.innerHTML = '';

    if (!datosData.length) {
        mostrarMensaje(tbody, 'No hay datos disponibles.');
        return;
    }

    datosData.forEach(row => {
        const tr = document.createElement('tr');

        tr.dataset.idDatos = row.id_datos;

        agregarCeldaDato(tr, row.part);
        agregarCeldaDato(tr, row.numero, 'col-numero');
        agregarCeldaDato(tr, row.cspc);
        agregarCeldaDato(
            tr,
            row.modelo,
            'col-modelo',
            'modelo'
        );
        agregarCeldaDato(
            tr,
            row.rack,
            'col-rack',
            'rack_mac'
        );
        agregarCeldaDato(
            tr,
            row.linea,
            obtenerClaseLinea(row.linea)
        );
        agregarCeldaDato(
            tr,
            row.golpe,
            'col-golpe',
            'lh_rh_golpe'
        );
        agregarCeldaDato(
            tr,
            row.sphAnt,
            'col-sph',
            'sph_mes_anterior'
        );
        agregarCeldaDato(
            tr,
            row.sphObj,
            'col-sph',
            'sph_obj'
        );
        agregarCeldaDato(
            tr,
            row.stdPallet,
            'col-std-pallet',
            'std_pallet'
        );
        agregarCeldaDato(
            tr,
            row.stdRack,
            'col-std-rack',
            'std_rack'
        );
        agregarCeldaDato(
            tr,
            row.racksPrograma,
            'col-programa',
            'racks_prog'
        );
        agregarCeldaDato(
            tr,
            row.loopRacks,
            'col-loop',
            'loop_racks'
        );
        agregarCeldaDato(
            tr,
            row.capTotal,
            'col-capacidad'
        );
        agregarCeldaDato(
            tr,
            row.danados,
            'col-danados',
            'racks_danados'
        );
        agregarCeldaDato(
            tr,
            row.invDiario,
            'col-inv-diario',
            'racks_inv_danados_diario'
        );
        agregarCeldaDato(
            tr,
            row.cap,
            'col-cap'
        );
        agregarCeldaDato(
            tr,
            row.req,
            'col-req'
        );
        agregarCeldaDato(
            tr,
            formatearMezcla(row.mezcla),
            'col-mezcla'
        );
        agregarCeldaDato(
            tr,
            row.desocup,
            'col-desocupabilidad'
        );

        tbody.appendChild(tr);
    });
}

function inicializarBusqueda() {
    document
        .getElementById('searchDatos')
        ?.addEventListener(
            'input',
            event => {
                const query = event.target.value
                    .trim()
                    .toLowerCase();

                document
                    .querySelectorAll(
                        '#tbodyDatos tr'
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
        );
}

function inicializarModales() {
    const btnPerfil =
        document.getElementById('btnPerfil');

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
            'panelNotificaciones'
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

function initializeMenu() {
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

function abrirPanel(panel) {
    if (!panel) return;

    document
        .querySelectorAll(
            '.center-modal.open'
        )
        .forEach(item =>
            item.classList.remove('open')
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
        'perfilDatosNombre',
        user.nombre || 'Usuario'
    );

    establecerTexto(
        'perfilDatosCorreo',
        user.email ||
            'correo@ejemplo.com'
    );

    establecerTexto(
        'perfilDatosRol',
        user.rol || 'usuario'
    );

    establecerTexto(
        'perfilDatosGmin',
        user.GMIN || 'GMIN'
    );
}

function llenarNotificaciones() {
    const contenedor =
        document.getElementById(
            'listaNotificacionesDatos'
        );

    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="notificacion-item">
            <div class="notificacion-titulo">
                Datos actualizados
            </div>
            <div class="notificacion-fecha">
                ${new Date().toLocaleString('es-MX')}
            </div>
            <div class="notificacion-detalle">
                La información se consulta desde la base de datos.
            </div>
        </div>
    `;
}

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

function mostrarMensaje(
    tbody,
    mensaje
) {
    tbody.innerHTML = '';

    const tr = document.createElement('tr');
    const td = document.createElement('td');

    td.colSpan = 20;
    td.textContent = mensaje;

    tr.appendChild(td);
    tbody.appendChild(tr);
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

    return 'col-linea-0';
}

function formatearMezcla(valor) {
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

    const porcentaje =
        numero <= 1
            ? numero * 100
            : numero;

    return `${porcentaje.toFixed(0)}%`;
}

function formatearFecha(valor) {
    if (!valor) return '—';

    const fecha = String(valor).slice(0, 10);

    const partes = fecha.split('-');

    if (partes.length !== 3) {
        return fecha;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function establecerTexto(id, valor) {
    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.textContent =
            valor === null ||
            valor === undefined ||
            valor === ''
                ? '—'
                : valor;
    }
}

function inicializarImportadorDatos() {
    const input = document.getElementById(
        'archivoDatos'
    );

    const boton = document.getElementById(
        'btnImportarDatos'
    );

    const estado = document.getElementById(
        'estadoImportacionDatos'
    );

    if (!input || !boton) return;

    boton.addEventListener(
        'click',
        async () => {
            const archivo = input.files[0];

            if (!archivo) {
                alert(
                    'Selecciona tablaDatos.xlsx.'
                );
                return;
            }

            const formData = new FormData();

            formData.append(
                'archivo',
                archivo
            );

            const token = localStorage.getItem(
                'token'
            );

            boton.disabled = true;

            if (estado) {
                estado.textContent =
                    'Importando...';
            }

            try {
                const response = await fetch(
                    `${BASE_URL}/api/datos/importar`,
                    {
                        method: 'POST',
                        body: formData,
                        cache: 'no-store',
                        headers: token
                            ? {
                                Authorization:
                                    `Bearer ${token}`
                            }
                            : {}
                    }
                );

                const result =
                    await response.json();

                if (
                    !response.ok ||
                    result.ok === false
                ) {
                    throw new Error(
                        result.message ||
                        'No se pudo importar el archivo.'
                    );
                }

                if (estado) {
                    estado.textContent =
                        `Actualizados: ${result.datos_actualizados || 0} | ` +
                        `Nuevos: ${result.datos_insertados || 0} | ` +
                        `Objetivos actualizados: ${
                            result.objetivos_actualizados || 0
                        } | ` +
                        `Objetivos nuevos: ${
                            result.objetivos_insertados || 0
                        }`;                        
                }

                await loadDatosData();
            } catch (error) {
                console.error(
                    'Error importando datos:',
                    error
                );

                if (estado) {
                    estado.textContent =
                        error.message;
                }
            } finally {
                boton.disabled = false;
            }
        }
    );
}

const CAMPOS_NUMERICOS_DATOS = new Set([
    'sph_mes_anterior',
    'sph_obj',
    'std_pallet',
    'std_rack',
    'racks_prog',
    'loop_racks',
    'racks_danados',
    'racks_inv_danados_diario'
]);

function agregarCeldaDato(fila, valor, clase = '', campo = null) {
    const td = document.createElement('td');

    td.textContent = valor ?? '';

    if (clase) td.className = clase;

    if (campo) {
        td.dataset.field = campo;
        td.classList.add('editable-cell');
        td.title = 'Doble clic para editar';
    }

    fila.appendChild(td);
}

function inicializarEdicionDatos() {
    const tbody = document.getElementById('tbodyDatos');

    if (!tbody) return;

    tbody.addEventListener('dblclick', event => {
        const celda = event.target.closest('.editable-cell');

        if (celda) {
            editarCeldaDatos(celda);
        }
    });
}

function editarCeldaDatos(celda) {
    if (celda.querySelector('input, select')) return;

    const fila = celda.closest('tr');
    const idDatos = fila?.dataset.idDatos;
    const campo = celda.dataset.field;
    const valorOriginal = celda.textContent.trim();

    if (!idDatos || !campo) return;

    const editor = document.createElement(
        campo === 'lh_rh_golpe' || campo === 'parte_golpe'
            ? 'select'
            : 'input'
    );

    if (editor.tagName === 'SELECT') {
        editor.innerHTML = `
            <option value="">Vacío</option>
            <option value="1">1</option>
            <option value="2">2</option>
        `;
        editor.value = valorOriginal;
    } else {
        editor.type = CAMPOS_NUMERICOS_DATOS.has(campo)
            ? 'number'
            : 'text';

        editor.value = valorOriginal;
        editor.step = '1';
    }

    editor.className = 'editor-dato-cell';

    celda.textContent = '';
    celda.appendChild(editor);
    editor.focus();

    const guardar = async () => {
        let valor = editor.value.trim();

        if (valor === '') {
            valor = null;
        } else if (CAMPOS_NUMERICOS_DATOS.has(campo)) {
            valor = Number(valor);
        }

        try {
            await actualizarDatoDesdeFrontend(
                idDatos,
                campo,
                valor
            );

            await loadDatosData();
        } catch (error) {
            celda.textContent = valorOriginal;
            alert(error.message);
        }
    };

    editor.addEventListener('blur', guardar);

    editor.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            editor.blur();
        }

        if (event.key === 'Escape') {
            celda.textContent = valorOriginal;
        }
    });
}

async function actualizarDatoDesdeFrontend(
    idDatos,
    campo,
    valor
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${BASE_URL}/api/datos/${idDatos}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(token
                    ? {
                        Authorization: `Bearer ${token}`
                    }
                    : {})
            },
            body: JSON.stringify({
                [campo]: valor
            })
        }
    );

    const resultado = await response.json();

    if (!response.ok || resultado.ok === false) {
        throw new Error(
            resultado.message ||
            'No se pudo guardar el dato.'
        );
    }

    return resultado;
}

function inicializarCheckDatos() {
    [
        'btnCheckDatos',
        'btnCheckDatosSuperior'
    ].forEach(id => {
        document
            .getElementById(id)
            ?.addEventListener(
                'click',
                ejecutarCheckDatos
            );
    });
}

async function ejecutarCheckDatos() {
    const contenedor = document.getElementById(
        'resultadoCheckDatos'
    );

    if (!contenedor) return;

    contenedor.className =
        'check-result check-loading';

    contenedor.textContent =
        'Validando datos...';

    try {
        const resultado = await apiFetch(
            '/api/datos/check'
        );

        renderResultadoCheck(resultado);
    } catch (error) {
        contenedor.className =
            'check-result check-error';

        contenedor.textContent =
            error.message;
    }
}

function renderResultadoCheck(resultado) {
    const contenedor = document.getElementById(
        'resultadoCheckDatos'
    );

    if (!contenedor) return;

    const resumen = resultado.resumen || {};
    const problemas = resultado.problemas || [];

    contenedor.className =
        resultado.estado === 'OK'
            ? 'check-result check-ok'
            : 'check-result check-warning';

    const lista = problemas.length
        ? problemas
            .map(problema => `<li>${problema}</li>`)
            .join('')
        : '<li>No se encontraron problemas.</li>';

    contenedor.innerHTML = `
        <strong>
            Resultado: ${resultado.estado}
        </strong>

        <div class="check-summary">
            Datos: ${resumen.totalDatos || 0}
            · Partes sin datos:
            ${resumen.partesSinDatos || 0}
            · Sin CSPC:
            ${resumen.registrosSinCspc || 0}
            · Duplicados:
            ${resumen.duplicados || 0}
            · Incompletos:
            ${resumen.camposIncompletos || 0}
        </div>

        <ul>${lista}</ul>
    `;
}