const API_URL = 'https://webservices.mx/escolares/test/alumnos/';

let alumnos = [];
let deleteID = null;

window.addEventListener('DOMContentLoaded', () => {
    getAlumnos();
});

const getAlumnos = () => {
    fetch(API_URL + "listar")
        .then(Response => Response.json())
        .catch(error => {
            alertManager('error', 'Ocurrió un problema al cargar los alumnos');
        })
        .then(data => {
            alumnos = data.response;
            renderResult(alumnos);
        });
};

const getAlumno = () => {
    var id = document.getElementById('alumno_id').value;
    console.log(id);
    fetch(API_URL + "obtener?alumno_id=" + id)
        .then(Response => Response.json())
        .catch(error => {
            alertManager('error', 'Ocurrió un problema al cargar los alumnos');
        })
        .then(data => {
            alumnos = [data.response];
            console.log(alumnos);
            renderResult(alumnos);
        });
};

const alumnoslist = document.querySelector('#listaAlumnos');

const renderResult = (alumnos) => {
    let listHTML = "";
    alumnos.forEach(alumnos => {
        listHTML += `
        <tr>
            <td class="aId">${alumnos.id}</td>
            <td class="aClave">${alumnos.clave}</td>
            <td class="aMatricula">${alumnos.matricula}</td>
            <td>${alumnos.nombre}</td>
            <td>${alumnos.paterno}</td>
            <td>${alumnos.materno}</td>
            <td class="btnAcciones">
                <button id="btnEdit" type="button" onclick="EditAlumno (${alumnos.id})">Editar</button>
                <button class="btnDelet" type="button" onclick="openModalConfirm (${alumnos.id})">Eliminar</button>
            </td>
        </tr>
        `;
    });
    alumnoslist.innerHTML = listHTML;
};


const createAlumno = () => {
    const formData = new FormData(document.querySelector('#formAdd'));

    const clave = formData.get('clave').trim();
    const matricula = formData.get('matricula').trim();
    const paterno = formData.get('paterno').trim();
    const materno = formData.get('materno').trim();
    const nombre = formData.get('nombre').trim();

    const claveRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;
    const matriculaRegex = /^[A-Z0-9]{1,20}$/;
    const nombreRegex = /^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]{0,49}$/i;

    const claveError = document.getElementById('claveError');
    const matriculaError = document.getElementById('matriculaError');
    const paternoError = document.getElementById('paternoError');
    const maternoError = document.getElementById('maternoError');
    const nombreError = document.getElementById('nombreError');

    let valid = true;

    if (!claveRegex.test(clave)) {
        claveError.textContent = 'Clave inválida (CURP).';
        valid = false;
    } else {
        claveError.textContent = '';
    }

    if (!matriculaRegex.test(matricula)) {
        matriculaError.textContent = 'Matrícula inválida.';
        valid = false;
    } else {
        matriculaError.textContent = '';
    }

    if (!nombreRegex.test(paterno)) {
        paternoError.textContent = 'Apellido paterno inválido.';
        valid = false;
    } else {
        paternoError.textContent = '';
    }

    if (materno !== "" && !nombreRegex.test(materno)) {
        maternoError.textContent = 'Apellido materno inválido.';
        valid = false;
    } else {
        maternoError.textContent = '';
    }

    if (!nombreRegex.test(nombre)) {
        nombreError.textContent = 'Nombre inválido.';
        valid = false;
    } else {
        nombreError.textContent = '';
    }

    if (!valid) {
        setTimeout(() => {
            claveError.textContent = '';
            matriculaError.textContent = '';
            paternoError.textContent = '';
            maternoError.textContent = '';
            nombreError.textContent = '';
        }, 5000);
        return;
    }

    const Alumno = {
        clave: clave,
        matricula: matricula,
        paterno: paterno,
        materno: materno,
        nombre: nombre
    };

    fetch(API_URL + 'agregar?', {
        method: 'POST',
        body: JSON.stringify(Alumno),
    })
        .then(res => res.json())
        .catch(error => {
            alertManager('error', error);
            document.querySelector('#formAdd').reset();
        })
        .then(response => {
            alertManager('success', response.message);
            closeModalAdd();
            getAlumnos();
        });
};


const EditAlumno = (id) => {
    let Alumno = {};
    alumnos.filter(alum => {
        if (alum.id == id) {
            Alumno = alum;
        }
    });

    document.querySelector('#formEdit #id').value = Alumno.id;
    document.querySelector('#formEdit #clave').value = Alumno.clave;
    document.querySelector('#formEdit #matricula').value = Alumno.matricula;
    document.querySelector('#formEdit #paterno').value = Alumno.paterno;
    document.querySelector('#formEdit #materno').value = Alumno.materno;
    document.querySelector('#formEdit #nombre').value = Alumno.nombre;

    openModalEdit();
};

const UpdateAlumno = () => {
    const alumno = {
        alumno_id: document.querySelector('#formEdit #id').value,
        clave: document.querySelector('#formEdit #clave').value.trim(),
        matricula: document.querySelector('#formEdit #matricula').value.trim(),
        paterno: document.querySelector('#formEdit #paterno').value.trim(),
        materno: document.querySelector('#formEdit #materno').value.trim(),
        nombre: document.querySelector('#formEdit #nombre').value.trim()
    };

    const claveRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;
    const matriculaRegex = /^[A-Z0-9]{1,20}$/;
    const nombreRegex = /^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]{0,49}$/i;

    const claveError = document.getElementById('claveErrorEdit');
    const matriculaError = document.getElementById('matriculaErrorEdit');
    const paternoError = document.getElementById('paternoErrorEdit');
    const maternoError = document.getElementById('maternoErrorEdit');
    const nombreError = document.getElementById('nombreErrorEdit');

    let valid = true;

    if (!claveRegex.test(alumno.clave)) {
        claveError.textContent = 'Clave inválida (CURP).';
        valid = false;
    } else {
        claveError.textContent = '';
    }

    if (!matriculaRegex.test(alumno.matricula)) {
        matriculaError.textContent = 'Matrícula inválida.';
        valid = false;
    } else {
        matriculaError.textContent = '';
    }

    if (!nombreRegex.test(alumno.paterno)) {
        paternoError.textContent = 'Apellido paterno inválido.';
        valid = false;
    } else {
        paternoError.textContent = '';
    }

    if (alumno.materno !== "" && !nombreRegex.test(alumno.materno)) {
        maternoError.textContent = 'Apellido materno inválido.';
        valid = false;
    } else {
        maternoError.textContent = '';
    }

    if (!nombreRegex.test(alumno.nombre)) {
        nombreError.textContent = 'Nombre inválido.';
        valid = false;
    } else {
        nombreError.textContent = '';
    }

    if (!valid) {
        setTimeout(() => {
            claveError.textContent = '';
            matriculaError.textContent = '';
            paternoError.textContent = '';
            maternoError.textContent = '';
            nombreError.textContent = '';
        }, 5000);
        return;
    }

    fetch(API_URL + 'guardar?', {
        method: 'PUT',
        body: JSON.stringify(alumno)
    })
        .then(res => res.json())
        .catch(error => {
            alertManager('error', error);
        })
        .then(response => {
            alertManager('success', response.message);
            closeModalEdit();
            getAlumnos();
        });
    document.querySelector('#formEdit').reset();
};

const DeleteAlumno = (id) => {
    fetch(API_URL + 'eliminar?alumno_id=' + id, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(response => {
            alertManager('success', response.message);
            closeModalConfirm();
            getAlumnos();
            deleteID = null;
        });
};

const confirmDelete = (res) => {
    if (res) {
        DeleteAlumno(deleteID);
    } else {
        closeModalConfirm();
    }
};

const btnAdd = document.querySelector('#btnAdd');
const modalAdd = document.querySelector('#modalAdd');

btnAdd.onclick = () => openModalAdd();

window.onclick = function (event) {
    if (event.target == modalAdd) {

    }
};

const closeModalAdd = () => {
    modalAdd.style.display = 'none';
};

const openModalAdd = () => {
    modalAdd.style.display = 'block';
};

const modalEdit = document.querySelector('#modalEdit');

const openModalEdit = () => {
    modalEdit.style.display = 'block';
};

const closeModalEdit = () => {
    modalEdit.style.display = 'none';
};

window.onclick = function (event) {
    if (event.target == modalEdit) {

    }
};

const modalConfirm = document.getElementById('modalConfirm');

window.onclick = function (event) {
    if (event.target == modalConfirm) {
        modalConfirm.style.display = "none";
    }
};

const closeModalConfirm = () => {
    modalConfirm.style.display = 'none';
};

const openModalConfirm = (id) => {
    deleteID = id;
    modalConfirm.style.display = 'block';
};


const alertManager = (typeMsg, message) => {
    const alert = document.querySelector('#alert');

    alert.innerHTML = message || 'Se produjo cambios';
    alert.classList.add(typeMsg);
    alert.style.display = 'block';

    setTimeout(() => {
        alert.style.display = 'none';
        alert.classList.remove(typeMsg);
    }, 3500);
};
