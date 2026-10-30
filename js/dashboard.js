const BASE_URL = 'http://localhost:3300';

let currentMonth = 0;
let currentYear = 2026;

const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    initializeMenu();
    setupImportacionExcel();
    setupPerfil();
    setupNotificaciones();
    setupBusqueda();
    setupLogout();
    agregarOpcionProgramaAnual();
});

// IMPORTACIÓN

function setupImportacionExcel() {
    const btnSubirExcel = document.getElementById('btnSubirExcel');

    if (btnSubirExcel) {
        btnSubirExcel.addEventListener(
            'click',
            manejarImportacionExcel
        );
    }
}

function agregarOpcionProgramaAnual() {
    const select = document.getElementById('tipoImportacion');

    if (!select) return;

    const existe = [...select.options].some(
        option => option.value === 'programa_anual'
    );

    if (!existe) {
        const option = document.createElement('option');
        option.value = 'programa_anual';
        option.textContent = 'Programa anual';
        select.appendChild(option);
    }

    const input = document.getElementById('excelFile');

    if (input) {
        input.accept = '.xlsx,.xls';
    }
}

async function manejarImportacionExcel() {
    const fileInput = document.getElementById('excelFile');
    const tipoImportacion =
        document.getElementById('tipoImportacion')?.value;

    const file = fileInput?.files?.[0];

    if (!file) {
        alert('Selecciona un archivo Excel.');
        return;
    }

    if (!tipoImportacion) {
        alert('Selecciona un tipo de importación.');
        return;
    }

    const extension = file.name
        .split('.')
        .pop()
        .toLowerCase();

    if (!['xls', 'xlsx'].includes(extension)) {
        alert('Solo se permiten archivos .xls o .xlsx.');
        return;
    }

    if (
        tipoImportacion === 'programa_anual' ||
        tipoImportacion === 'programaAnual'
    ) {
        await importarProgramaAnual(file);
        return;
    }

    await importarCatalogoExistente(
        file,
        tipoImportacion
    );
}

// PROGRAMA ANUAL

async function importarProgramaAnual(file) {
    const formData = new FormData();
    formData.append('archivo', file);

    try {
        mostrarMensajeCarga(
            'Validando el programa anual...'
        );

        const token = localStorage.getItem('token');

        const response = await fetch(
            `${BASE_URL}/api/programacion/anual/validar`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            }
        );

        const data = await leerRespuesta(response);

        console.log(
            'Respuesta validación programa anual:',
            data
        );

        if (!response.ok || data.ok === false) {
            throw new Error(
                data.message ||
                'No se pudo validar el programa anual.'
            );
        }

        const errores = Array.isArray(data.errores)
            ? data.errores
            : [];

        const filasError = Number(
            data.filas_error || errores.length || 0
        );

        if (errores.length > 0) {
            console.warn(
                'Errores de validación:',
                errores
            );

            console.table(errores.slice(0, 20));
        }

        alert(
            `Validación terminada.\n\n` +
            `Archivo: ${data.nombre_archivo || file.name}\n` +
            `Filas totales: ${data.total_filas ?? 0}\n` +
            `Filas válidas: ${data.filas_validas ?? 0}\n` +
            `Filas con error: ${filasError}`
        );

        if (filasError > 0) {
            alert(
                'El archivo no se importará porque contiene errores. ' +
                'Revisa la consola para ver el detalle.'
            );

            return;
        }

        const idCarga =
            data.id_carga ||
            data.id ||
            data.carga_id;

        if (!idCarga) {
            throw new Error(
                'El backend no devolvió el id_carga.'
            );
        }

        const anioSugerido =
            Number(data.anio) ||
            new Date().getFullYear();

        const anioTexto = prompt(
            'Indica el año del programa anual:',
            String(anioSugerido)
        );

        if (!anioTexto) return;

        const anio = Number(anioTexto);

        if (!Number.isInteger(anio) || anio < 2000) {
            alert('El año no es válido.');
            return;
        }

        const fechaInicio = prompt(
            'Indica la fecha inicial de SCHDWK1/WREQ1 (YYYY-MM-DD):',
            `${anio}-01-05`
        );

        if (!fechaInicio) return;

        if (!esFechaValida(fechaInicio)) {
            alert(
                'La fecha debe tener el formato YYYY-MM-DD.'
            );
            return;
        }

        const confirmar = confirm(
            `¿Confirmas importar y activar este archivo?\n\n` +
            `Año: ${anio}\n` +
            `Fecha inicial: ${fechaInicio}`
        );

        if (!confirmar) return;

        const confirmResponse = await fetch(
            `${BASE_URL}/api/programacion/anual/${encodeURIComponent(idCarga)}/confirmar`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    anio,
                    fecha_inicio_programa: fechaInicio
                })
            }
        );

        const confirmData =
            await leerRespuesta(confirmResponse);

        console.log(
            'Respuesta confirmación programa anual:',
            confirmData
        );

        if (
            !confirmResponse.ok ||
            confirmData.ok === false
        ) {
            throw new Error(
                confirmData.message ||
                'No se pudo confirmar la importación.'
            );
        }

        alert(
            `Programa anual importado correctamente.\n\n` +
            `Filas importadas: ${
                confirmData.filas_importadas ?? 0
            }\n` +
            `Valores semanales: ${
                confirmData.valores_importados ?? 0
            }`
        );

        limpiarFormularioImportacion();
    } catch (error) {
        console.error(
            'Error en importarProgramaAnual:',
            error
        );

        alert(
            error.message ||
            'Error al importar el programa anual.'
        );
    }
}

// IMPORTACIONES EXISTENTES

async function importarCatalogoExistente(
    file,
    tipoImportacion
) {
    const endpoints = {
        cspc: '/api/import/cspc/import',
        parte: '/api/import/parte/import',
        doh: '/api/import/doh/import',
        reqbody: '/api/reqbody/import'
    };

    const endpoint = endpoints[tipoImportacion];

    if (!endpoint) {
        alert('Tipo de importación inválido.');
        return;
    }

    const formData = new FormData();
    formData.append('archivo', file);

    try {
        const token = localStorage.getItem('token');

        const response = await fetch(
            `${BASE_URL}${endpoint}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            }
        );

        const data = await leerRespuesta(response);

        console.log(
            'Respuesta importación:',
            data
        );

        if (!response.ok) {
            throw new Error(
                data.message ||
                'Error al importar archivo.'
            );
        }

        if (tipoImportacion === 'reqbody') {
            alert(
                `REQBODY importado correctamente.\n\n` +
                `Registros guardados: ${
                    data.registros ?? 0
                }`
            );
        } else {
            alert(
                `${tipoImportacion.toUpperCase()} importado correctamente.\n\n` +
                `Insertadas: ${data.insertadas ?? 0}\n` +
                `Actualizadas: ${data.actualizadas ?? 0}\n` +
                `Omitidas: ${data.omitidas ?? 0}`
            );
        }

        if (
            Array.isArray(data.errores) &&
            data.errores.length
        ) {
            console.warn(
                'Errores detectados:',
                data.errores
            );

            console.table(data.errores);
        }

        limpiarFormularioImportacion();
    } catch (error) {
        console.error(
            'Error al importar:',
            error
        );

        alert(
            error.message ||
            'Error al importar archivo.'
        );
    }
}

async function leerRespuesta(response) {
    const text = await response.text();

    if (!text) return {};

    try {
        return JSON.parse(text);
    } catch {
        return {
            message: text
        };
    }
}

function mostrarMensajeCarga(mensaje) {
    console.log(mensaje);
}

function limpiarFormularioImportacion() {
    const fileInput =
        document.getElementById('excelFile');

    const tipo =
        document.getElementById('tipoImportacion');

    if (fileInput) {
        fileInput.value = '';
    }

    if (tipo) {
        tipo.value = '';
    }
}

function esFechaValida(fecha) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return false;
    }

    const date = new Date(`${fecha}T00:00:00`);

    return !Number.isNaN(date.getTime());
}

// PERFIL

function setupPerfil() {
    const btnPerfil = document.getElementById('btnPerfil');
    const panelPerfil = document.getElementById('panelPerfil');

    if (btnPerfil && panelPerfil) {
        btnPerfil.addEventListener('click', () => {
            llenarPerfil();
            abrirPanel(panelPerfil);
        });
    }
}

function llenarPerfil() {
    let user = null;

    try {
        user = JSON.parse(
            localStorage.getItem('user') || 'null'
        );
    } catch {
        user = null;
    }

    setText(
        'perfilDashboardNombre',
        user?.nombre || 'Usuario'
    );

    setText(
        'perfilDashboardCorreo',
        user?.email || 'correo@ejemplo.com'
    );

    setText(
        'perfilDashboardRol',
        user?.rol || 'usuario'
    );

    setText(
        'perfilDashboardGmin',
        user?.GMIN || 'GMIN'
    );
}

// NOTIFICACIONES

function setupNotificaciones() {
    const btnNotificaciones =
        document.getElementById('btnNotificaciones');

    const panelNotificaciones =
        document.getElementById('panelNotificaciones');

    if (
        btnNotificaciones &&
        panelNotificaciones
    ) {
        btnNotificaciones.addEventListener(
            'click',
            () => {
                llenarNotificacionesDashboard();
                abrirPanel(panelNotificaciones);
            }
        );
    }

    document
        .querySelectorAll('[data-close-panel]')
        .forEach(button => {
            button.addEventListener('click', () => {
                const panel =
                    button.closest('.center-modal');

                if (panel) {
                    panel.classList.remove('open');
                }
            });
        });
}

function llenarNotificacionesDashboard() {
    const contenedor = document.getElementById(
        'listaNotificacionesDashboard'
    );

    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="notificacion-item">
            <div class="notificacion-titulo">
                Dashboard activo
            </div>

            <div class="notificacion-fecha">
                ${new Date().toLocaleString('es-MX')}
            </div>

            <div class="notificacion-detalle">
                El sistema está listo para cargar información.
            </div>
        </div>
    `;
}

function abrirPanel(panel) {
    document
        .querySelectorAll('.center-modal.open')
        .forEach(item => {
            item.classList.remove('open');
        });

    panel.classList.add('open');
}

// MENÚ

function initializeMenu() {
    const menuItems =
        document.querySelectorAll('.menu li');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(li => {
                li.classList.remove('active');
            });

            item.classList.add('active');

            showSection(
                item.getAttribute('data-section')
            );
        });
    });
}

function showSection(sectionId) {
    document
        .querySelectorAll('.section')
        .forEach(section => {
            section.classList.remove('active');
        });

    const target =
        document.getElementById(sectionId);

    if (target) {
        target.classList.add('active');
    }
}

// BÚSQUEDA

function setupBusqueda() {
    const searchInput =
        document.getElementById('searchDashboard');

    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        filterDashboard(
            searchInput.value.trim().toLowerCase()
        );
    });
}

function filterDashboard(query) {
    document
        .querySelectorAll('.dashboard-grid .card')
        .forEach(card => {
            const texto =
                card.textContent.toLowerCase();

            card.style.display =
                texto.includes(query) ? '' : 'none';
        });
}

// LOGOUT

function setupLogout() {
    const btnLogout =
        document.getElementById('btnLogout');

    if (btnLogout) {
        btnLogout.addEventListener('click', logout);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = '../index.html';
}

// UTILIDADES

function setText(id, value) {
    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}