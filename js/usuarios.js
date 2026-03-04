// Navegación entre secciones
const menuItems = document.querySelectorAll('.menu li');
const sections = document.querySelectorAll('.section');

menuItems.forEach(item => {
    item.addEventListener('click', () => {

        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const sectionId = item.getAttribute('data-section');

        sections.forEach(section => {
            section.classList.remove('active');
            if(section.id === sectionId) {
                section.classList.add('active');
            }
        });
    });
});

// Modal
const modal = document.getElementById('userModal');
const form = document.querySelector('form');
let editMode = false;
let editUserId = null;

function openAddUserModal() {
    editMode = false;
    editUserId = null;
    form.reset();
    document.getElementById('modalTittle').innerText = "Agregar Usuario";
    modal.classList.add('show');
}

function closeUserModal() {
    modal.classList.remove('show');
}

window.onclick = function(event) {
    if(event.target === modal) {
        closeUserModal();
    }
}

// Guardar usuario
function saveUser(event) {
    event.preventDefault();

    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const gmin = document.getElementById('userGmin').value;
    const rol = document.getElementById('userRol').value;

    const tableBody = document.getElementById('usuariosTableBody');

    if(editMode) {
        const row = document.querySelector(`tr[data-id'${editUserId}']`);
        row.children[1].innerText = name;
        row.children[2].innerText = gmin;
        row.children[3].innerText = email;
        row.children[4].innerText = rol;
    } else {
        const newId = Date.row();

        const newRow = document.createElement('tr');
        newRow.setAttribute('data-id', newId);

        newRow.innerHTML = `
          <td>${newId}</td>
          <td>${name}</td>
          <td>${gmin}</td>
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

    closeUserModal();
}

// Editar usuario
function editUser(id) {
    const row = document.querySelector(`tr td:first-child:textContent('${id}')`);
    const allRows = document.querySelectorAll('#usuariosTableBody tr');

    allRows.forEach(r => {
        if(r.children[0].innerText == id) {
            editMode = true;
            editUserId = id;

            document.getElementById('userName').value = r.children[1].innerText;
            document.getElementById('userGmin').value = r.children[2].innerText;
            document.getElementById('userEmail').value = r.children[3].innerText;
            document.getElementById('userRol').value = r.children[4].innerText;

            document.getElementById('modalTittle').innerText = "Editar Usuario";
            modal.classList.add("show");
        }
    });
}

// Eliminar usuario
function deleteUser(id) {
    const confirmDelete = confirm('¿Estás seguro que deseas eliminar este usuario?');
    if (!confirmDelete) return;

    const rows = document.querySelectorAll('#usuariosTableBody tr');

    rows.forEach(row => {
        if(row.children[0].innerText == id) {
            row.remove();
        }
    });
}

// Logout
function logout() {
    alert('Sesión cerrada correctamente');
    window.location.href = 'login.html';
}