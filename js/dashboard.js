// Vairbales globales
let currentMonth = 0; // Enero
let currentYear = 2026;

const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
    //generateCalendar(currentMonth, currentYear);
});

// Sistema de navegación entre secciones
function initializeMenu() {
    const menuItems = document.querySelectorAll('.menu li');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(li => li.classList.remove('active')); //Remover clase active de todos

            this.classList.add('active'); //Agregar clase active clikeado

            // Obtener la sección mostrar
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId); //
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

/*
// Generar calendario
function generateCalendar(month, year) {
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthElement = document.getElementById('currentMonth');

    // Actualiza título del mes
    currentMonthElement.textContent = `${monthNames[month]} ${year}`;

    calendarDays.innerHTML = ''; // Limpiar calendario

    const firstDay = new Date(year, month, 1).getDay(); // Primer día del mes

    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Días del mes

    // Fecha actual
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
    const currentDay = today.getDate();

    // Agregar días vacíos al inicio 
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day', 'empty');
        calendarDays.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = day;

        // Marcar día actual
        if (isCurrentMonth && day === currentDay) {
            dayDiv.classList.add('today');
        }

        // Agragar evento click
        dayDiv.addEventListener('click', function() {
            alert(`Seleccionaste: ${day} de ${monthNames[month]} ${year}`);
        });

        calendarDays.appendChild(dayDiv);
    }
}

// Navegación del calendario
function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
}*/

function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('registredUser');
        window.location.href = 'idex.html';
    }
}