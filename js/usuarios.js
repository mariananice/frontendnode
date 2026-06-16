const BASE_URL = 'http://localhost:3300';

let modal = null;
let form = null;
let passwordGroup = null;
let userPasswordInput = null;

let editMode = false;
let editUserId = null;

// Navegación entre secciones (sidebar)
function initSidebarNavigation() {
    const menuItems = document.querySelectorAll('.menu li');
    const sections = document.querySelectorAll('.section');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const sectionId = item.getAttribute('data-section');

            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// Abrir modal para agregar usuario
function openAddUserModal() {
    editMode = false;
    editUserId = null;

    if (!form || !modal) return;

    form.reset();

    const modalTitle = document.getElementById('modalTittle');
    if (modalTitle) modalTitle.innerText = 'Agregar Usuario';

    if (passwordGroup) passwordGroup.style.display = '';
    if (userPasswordInput) {
        userPasswordInput.required = true;
        userPasswordInput.value = '';
    }

    modal.classList.add('show');
}

// Cerrar modal
function closeUserModal() {
    if (modal) {
        modal.classList.remove('show');
    }
}

// Abrir panel lateral/central
function abrirPanel(panel) {
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

    const nombre = document.getElementById('perfilUsuariosNombre');
    const correo = document.getElementById('perfilUsuariosCorreo');
    const rol = document.getElementById('perfilUsuariosRol');
    const gmin = document.getElementById('perfilUsuariosGmin');

    if (nombre) nombre.textContent = user?.nombre || 'Usuario';
    if (correo) correo.textContent = user?.email || 'correo@ejemplo.com';
    if (rol) rol.textContent = user?.rol || 'usuario';
    if (gmin) gmin.textContent = user?.GMIN || 'GMIN';
}

// Notificaciones de ejemplo
function llenarNotificacionesUsuarios() {
    const contenedor = document.getElementById('listaNotificacionesUsuarios');
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

// Cargar usuarios
async function cargarUsuarios() {
    const tbody = document.getElementById('usuariosTableBody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6">Cargando usuarios...</td></tr>';

    try {
        const token = localStorage.getItem('token');

        const res = await fetch(`${BASE_URL}/api/usuarios`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            tbody.innerHTML = '<tr><td colspan="6">Error al cargar usuarios</td></tr>';
            console.error('Error HTTP:', res.status);
            return;
        }

        const usuarios = await res.json();

        if (!Array.isArray(usuarios) || usuarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No hay usuarios registrados</td></tr>';
            return;
        }

        tbody.innerHTML = '';

        usuarios.forEach(user => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', user.id_usuario);

            tr.innerHTML = `
                <td>${user.id_usuario}</td>
                <td>${user.nombre ?? ''}</td>
                <td>${user.GMIN ?? ''}</td>
                <td>${user.email ?? ''}</td>
                <td>${user.rol ?? ''}</td>
                <td class="actions-cell">
                    <button class="btn btn-edit" type="button" data-action="edit" data-id="${user.id_usuario}">
                        <i class="bi bi-pencil-square"></i> Editar
                    </button>
                    <button class="btn btn-delete" type="button" data-action="delete" data-id="${user.id_usuario}">
                        <i class="bi bi-trash3-fill"></i> Eliminar
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        tbody.innerHTML = '<tr><td colspan="6">Error de conexión</td></tr>';
    }
}

// Filtrar tabla de usuarios
function filterUsersTable(query) {
    const rows = document.querySelectorAll('#usuariosTableBody tr');

    rows.forEach(row => {
        if (row.children.length < 5) return;

        const id = row.children[0].textContent.toLowerCase();
        const nombre = row.children[1].textContent.toLowerCase();
        const gmin = row.children[2].textContent.toLowerCase();
        const email = row.children[3].textContent.toLowerCase();
        const rol = row.children[4].textContent.toLowerCase();

        const text = `${id} ${nombre} ${gmin} ${email} ${rol}`;

        row.style.display = text.includes(query) ? '' : 'none';
    });
}

// Guardar usuario (editar o crear)
async function saveUser(event) {
    event.preventDefault();

    const name = document.getElementById('userName')?.value.trim();
    const email = document.getElementById('userEmail')?.value.trim();
    const GMIN = document.getElementById('userGMIN')?.value.trim();
    const rol = document.getElementById('userRol')?.value.trim();

    if (!name || !email || !GMIN || !rol) {
        alert('Completa todos los campos obligatorios');
        return;
    }

    if (editMode) {
        try {
            const token = localStorage.getItem('token');

            const res = await fetch(`${BASE_URL}/api/usuarios/${editUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: name,
                    email: email,
                    rol: rol,
                    GMIN: GMIN
                })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Error al actualizar usuario');
            }

            const row = document.querySelector(`#usuariosTableBody tr[data-id="${editUserId}"]`);
            if (row) {
                row.children[1].innerText = name;
                row.children[2].innerText = GMIN;
                row.children[3].innerText = email;
                row.children[4].innerText = rol;
            }

            alert('Usuario actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            alert(error.message || 'Error al actualizar usuario');
            return;
        }
    } else {
        alert('Crear usuario desde esta pantalla aún no está implementado');
    }

    closeUserModal();
    editMode = false;
    editUserId = null;
    form.reset();
}

// Editar usuario
function editUser(id) {
    const row = document.querySelector(`#usuariosTableBody tr[data-id="${id}"]`);
    if (!row) {
        console.error('No se encontró la fila del usuario con id:', id);
        return;
    }

    editMode = true;
    editUserId = id;

    if (passwordGroup) passwordGroup.style.display = 'none';
    if (userPasswordInput) {
        userPasswordInput.required = false;
        userPasswordInput.value = '';
    }

    const userName = document.getElementById('userName');
    const userGMIN = document.getElementById('userGMIN');
    const userEmail = document.getElementById('userEmail');
    const userRol = document.getElementById('userRol');
    const modalTitle = document.getElementById('modalTittle');

    if (userName) userName.value = row.children[1].textContent.trim();
    if (userGMIN) userGMIN.value = row.children[2].textContent.trim();
    if (userEmail) userEmail.value = row.children[3].textContent.trim();
    if (userRol) userRol.value = row.children[4].textContent.trim();
    if (modalTitle) modalTitle.innerText = 'Editar Usuario';

    if (modal) modal.classList.add('show');
}

// Eliminar usuario
async function deleteUser(id) {
    const confirmDelete = confirm('¿Estás seguro que deseas eliminar este usuario?');
    if (!confirmDelete) return;

    try {
        const token = localStorage.getItem('token');

        const res = await fetch(`${BASE_URL}/api/usuarios/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || 'Error al eliminar usuario');
        }

        const row = document.querySelector(`#usuariosTableBody tr[data-id="${id}"]`);
        if (row) row.remove();

        alert('Usuario eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert(error.message || 'Error al eliminar usuario');
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    modal = document.getElementById('userModal');
    form = document.querySelector('#userModal form');
    passwordGroup = document.getElementById('passwordGroup');
    userPasswordInput = document.getElementById('userPassword');

    initSidebarNavigation();
    cargarUsuarios();

    const btnPerfil = document.getElementById('btnPerfil');
    const btnNotificaciones = document.getElementById('btnNotificaciones');
    const panelPerfil = document.getElementById('panelPerfil');
    const panelNotificaciones = document.getElementById('panelNotificaciones');
    const btnLogout = document.getElementById('btnLogout');
    const searchInput = document.getElementById('searchUsers');
    const tbody = document.getElementById('usuariosTableBody');
    const btnAddUser = document.getElementById('btnAddUser');

    const user = JSON.parse(localStorage.getItem('user'));

    if (user?.rol !== 'admin') {
        window.location.href = './dashboard.html';
        return;
    }

    initSidebarNavigation();
    cargarUsuarios();

    if (btnPerfil && panelPerfil) {
        btnPerfil.addEventListener('click', () => {
            llenarPerfil();
            abrirPanel(panelPerfil);
        });
    }

    if (btnNotificaciones && panelNotificaciones) {
        btnNotificaciones.addEventListener('click', () => {
            llenarNotificacionesUsuarios();
            abrirPanel(panelNotificaciones);
        });
    }

    document.querySelectorAll('[data-close-panel]').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.closest('.center-modal');
            if (panel) panel.classList.remove('open');
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            filterUsersTable(query);
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', logout);
    }

    if (btnAddUser) {
        btnAddUser.addEventListener('click', openAddUserModal);
    }

    if (form) {
        form.addEventListener('submit', saveUser);
    }

    if (tbody) {
        tbody.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (!button) return;

            const action = button.dataset.action;
            const id = button.dataset.id;

            if (!action || !id) return;

            if (action === 'edit') {
                editUser(id);
            } else if (action === 'delete') {
                deleteUser(id);
            }
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeUserModal();
        }
    });
});

const btnCloseUserModal = document.getElementById('btnCloseUserModal');
const btnCancelUserModal = document.getElementById('btnCancelUserModal');

if (btnCloseUserModal) {
    btnCloseUserModal.addEventListener('click', closeUserModal);
}

if (btnCancelUserModal) {
    btnCancelUserModal.addEventListener('click', closeUserModal);
}