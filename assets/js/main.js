let productos = {};
let alergenosSeleccionados = [];
let globalLanguage = "es";
let actualSection = "entradas";
let langData = {};
if (!localStorage.getItem('language')) {
    localStorage.setItem('language', "es");
}
fetchLanguageData(localStorage.getItem('language'));
document.getElementById('dropdownButton').textContent = localStorage.getItem('language').toUpperCase();
document.getElementById(localStorage.getItem('language')).classList.add('selected');
document.addEventListener("DOMContentLoaded", function () {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            productos = data;
            showSection('entradas');
        });
});


function showSection(section) {
    const content = document.getElementById('content');
    let htmlContent = '';
    actualSection = section;
    document.getElementById('menuBtn').classList.remove('act');
    document.getElementById('mainMenu').classList.remove('act');
    const productosFiltrados = productos[section].filter(producto => {
        if (alergenosSeleccionados.length === 0) {
            return true;
        }
        return !producto.alergenos.some(alergeno => alergenosSeleccionados.includes(alergeno));
    });

    htmlContent = `<div id="sectionWrapper">
        <h3>
            <span data-i18n="${section}"></span>
            <button id="openModalBtn" class="button" onclick="openModal()">
                <img class="icon" src="assets/img/filter.svg"/>
                <span id="allergensTitle"  data-i18n="allergensTitle"></span>
            </button>
        </h3>
        <ul>
            ${productosFiltrados.length > 0 ?
                productosFiltrados.map(producto => `
                    <li>
                        ${producto.nombre[localStorage.getItem('language')]} ${producto.alergenos.map(alergeno => `<img src="assets/img/${alergeno}.png" alt="${alergeno}">`).join('')}  <span class="price">${producto.precio.toFixed(2)}€</span>
                        
                    </li>
                `).join('') :
                `<li>No hay productos disponibles para tus selecciones.</li>`
            }
        </ul>
    </div>`;
    content.innerHTML = htmlContent;
    updateContent();
}

async function fetchLanguageData(lang) {
    await fetch(`/lang/${lang}.json`).then(response => response.json())
    .then(response => {
        langData = response
        updateContent()
    });
    
}

function filterProducts() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    alergenosSeleccionados = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            alergenosSeleccionados.push(checkbox.value);
            console.log(checkbox);
        }
    });
    
    
    showSection(actualSection);
}
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function () {
        document.querySelectorAll('nav ul li a').forEach(link => link.classList.remove('active'));
        this.classList.add('active');
        showSection(actualSection);
    });
});
document.getElementById('closeModalBtn').addEventListener('click', function (event) {
    document.getElementById('modal-container').classList.add('out');
    document.body.classList.remove('modal-active');


    setTimeout(function () {
        document.getElementById('modal-container').classList.remove('six');
    }, 100);


});
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

window.addEventListener('click', function (event) {
    var modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.classList.remove('modal-active');
    }
});
const button = document.getElementById('dropdownButton');
const menu = document.getElementById('dropdownMenu');
button.addEventListener('click', () => {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});
menu.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        const selectedValue = event.target.getAttribute('data-value');
        const selectedText = event.target.textContent;
        button.textContent = selectedText;
        document.querySelectorAll('.dropdown-content li').forEach(li => li.classList.remove('selected'));
        event.target.classList.add('selected');
        menu.style.display = 'none';
        localStorage.setItem('language', selectedValue);
        location.reload();
    }
});
window.addEventListener('click', (event) => {
    if (!event.target.matches('.dropdown-button')) {
        if (menu.style.display === 'block') {
            menu.style.display = 'none';
        }
    }
});
function openModal() {
    var modalContainer = document.getElementById('modal-container');
    modalContainer.className = '';
    modalContainer.classList.add('six');


    document.body.classList.add('modal-active');
}
function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');

        element.textContent = langData[key];
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // menu click event
    document.querySelector('.menuBtn').addEventListener('click', function() {
        this.classList.toggle('act');
        if (this.classList.contains('act')) {
            document.querySelector('.mainMenu').classList.add('act');
        } else {
            document.querySelector('.mainMenu').classList.remove('act');
        }
    });
});
