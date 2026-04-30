const BASE_URL = 'http://localhost:4000';

// Navegación entre secciones (sidebar)
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

// Modal
const modal = document.getElementById('userModal');
const form = document.querySelector('#userModal form');
const passwordGroup = document.getElementById('passwordGroup');
const userPasswordInput = document.getElementById('userPassword');
let editMode = false;
let editUserId =  null;

function openAddUserModal() {
    editMode = false;
    editUserId = null;
    form.reset();
    document.getElementById('modalTittle').innerHTML = 'Agregar Usuario';
    modal.classList.add('show');
}

function closeUserModal() {
    modal.classList.remove('show');
}

window.onclick = function (event) {
    if (event.target === modal) {
        closeUserModal();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios(); 

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
            llenarNotificacionesUsuarios();
            abrirPanel(panelNotificaciones);
        });
    }

    document.querySelectorAll('[data-close-panel]').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.closest('.center-modal');  // buscar por clase
            if (panel) panel.classList.remove('open');
        });
    });

    const searchInput = document.getElementById('searchUsers');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            filterUsersTable(query);
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

    document.getElementById('perfilUsuariosNombre').textContent = user?.nombre || 'Usuario';
    document.getElementById('perfilUsuariosCorreo').textContent = user?.email || 'correo@ejemplo.com';
    document.getElementById('perfilUsuariosRol').textContent = user?.rol || 'usuario';
    document.getElementById('perfilUsuariosGmin').textContent = user?.GMIN || 'GMIN';
}

// Notificaciones en Usuarios (ejemplo estático)
function llenarNotificacionesUsuarios() {
    const contenedor = document.getElementById('listaNotificacionesUsuarios');
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

async function cargarUsuarios() {
    const tbody = document.getElementById('usuariosTableBody');
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
                <td>${user.nombre}</td>
                <td>${user.GMIN}</td>
                <td>${user.email}</td>
                <td>${user.rol}</td>
                <td class="actions-cell">
                    <button class="btn btn-edit" onclick="editUser(${user.id_usuario})">
                        <i class="bi bi-pencil-square"></i>Editar
                    </button>
                    <button class="btn btn-delete" onclick="deleteUser(${user.id_usuario})">
                        <i class="bi bi-trash3-fill"></i>Eliminar
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

function filterUsersTable(query) {
    const rows = document.querySelectorAll('#usuariosTableBody tr');

    rows.forEach(row => {
        const id = row.children[0].textContent.toLowerCase();
        const nombre = row.children[1].textContent.toLowerCase();
        const gmin = row.children[2].textContent.toLowerCase();
        const email = row.children[3].textContent.toLowerCase();
        const rol = row.children[4].textContent.toLowerCase();

        const text = `${id} ${nombre} ${gmin} ${email} ${rol}`;

        if (text.includes(query)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Guardar usuario (de momento solo front, luego se conecta a la API)
async function saveUser(event) {
    event.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const GMIN = document.getElementById('userGMIN').value.trim();
    const rol = document.getElementById('userRol').value.trim();

    const tableBody = document.getElementById('usuariosTableBody');

   if (editMode) {
    // Editar usuario existente en backend
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
                rol: rol
                // Ver si en un futuro se permite editar GMIN,
                // aquí se debe añadir GMIN y modificar el service/repository.
            })
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || 'Error al actualizar usuario');
        }

        // Actualizar la fila en la tabla sin recargar
        const rows = document.querySelectorAll('#usuariosTableBody tr');
        rows.forEach(r => {
            const rowId = Number(r.children[0].innerText);
            if (rowId === Number(editUserId)) {
                r.children[1].innerText = name;
                r.children[2].innerText = GMIN;
                r.children[3].innerText = email;
                r.children[4].innerText = rol;
            }
        });

        alert('Usuario actualizado correctamente');
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        alert(error.message || 'Error al actualizar usuario');
    }
   } else {
        // Aquí irá la lógica de crear usuario (POST) solo si queremos que el admin cree nuevos usuarios,
        // por ahora se deja como antes y solo se muestra un mensaje
        alert('Crear usuario desde esta pantalla aún no está implementado');
    }

    modal.classList.remove('show');
    editMode = false;
    editUserId = null;
    form.reset();

    /*if (editMode) {
        const row = document.querySelector(`tr[data-id='${editUserId}']`);
        if (row) {
            row.children[1].innerText = name;
            row.children[2].innerText = GMIN;
            row.children[3].innerText = email;
            row.children[4].innerText = rol;
        }
    } else {
        // Nota:  esto ahora solo es el front, después conectamos a la DB
        const newId = Date.now();

        const newRow = document.createElement('tr');
        newRow.setAttribute('data-id', newId);

        newRow.innerHTML = `
          <td>${newId}</td>
          <td>${name}</td>
          <td>${GMIN}</td>
          <td>${email}</td>
          <td>${rol}</td>
          <td class="actions-cell">
            <button class="btn btn-edit" onclick="editUser(${newId})">
                <i class="bi bi-pencil-square"></i> Editar
            </button>
            <button class="btn btn-delete" onclick="deleteUser(${newId})">
                <i class="bi bi-trash3-fill"></i> Eliminar
            </button>
          </td>
        `;

        tableBody.appendChild(newRow);
    }

    closeUserModal();*/
}

// Editar usuario (sobre la tabla ya cargada)
function editUser(id) {
    const rows = document.querySelectorAll('#usuariosTableBody tr');

    rows.forEach(r => {
        if (Number(r.children[0].innerText) === Number(id)) {
            editMode = true;
            editUserId = id;

            // ocultar campo contraseña al editar
            passwordGroup.style.display = 'none';
            userPasswordInput.required = false;
            userPasswordInput.value = '';

            document.getElementById('userName').value = r.children[1].innerText;
            document.getElementById('userGMIN').value = r.children[2].innerText;
            document.getElementById('userEmail').value = r.children[3].innerText;
            document.getElementById('userRol').value = r.children[4].innerText;

            document.getElementById('modalTittle').innerText = 'Editar Usuario';
            modal.classList.add('show');
        }
    });
}

function openAddUserModal() {
    editMode = false;
    editUserId = null;
    form.reset();
    document.getElementById('modalTittle').innerText = 'Agregar Usuario';

    // mostrar campo contraseña al crear
    passwordGroup.style.display = '';
    userPasswordInput.required = true;

    modal.classList.add('show');
}

// Eliminar usuario (solo front por ahora)
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
            throw new Error(errData.message || 'Error al aliminar usuario');
        }

        // Eliminar la fila de la tabla
        const rows = document.querySelectorAll('#usuariosTableBody tr');
        rows.forEach(row => {
            const rowId = Number(row.children[0].innerText);
            if (rowId === Number(id)) {
                row.remove();
            }
        });

        alert('Usuario eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert(error.message || 'Error al eliminar usuario');
    }
}

// Función de logout
function logout() {
    //if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../index.html';
    //}
}

