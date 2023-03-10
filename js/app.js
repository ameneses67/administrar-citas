// campos del formulario
const mascotaInput = document.querySelector("#mascota");
const propietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");

// UI
const formulario = document.querySelectorAll(
  "#nueva-cita input, #nueva-cita textarea"
);
const contenedorCitas = document.querySelector("#citas");

let editando;

// se van a crear 2 clases, una para administrar las citas y otra para la interfaz del usuario
class Citas {
  constructor() {
    this.citas = [];
  }

  agregarCita(cita) {
    this.citas = [...this.citas, cita];
  }

  eliminarCita(id) {
    this.citas = this.citas.filter((cita) => cita.id !== id);
  }

  editarCita(citaActualizada) {
    this.citas = this.citas.map((cita) =>
      cita.id === citaActualizada.id ? citaActualizada : cita
    );
  }
}

class UI {
  imprimirAlerta(mensaje, tipo) {
    // crear el div
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert", "d-block", "col-12");

    // agregar clase en base al tipo de error
    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    // mensaje de error
    divMensaje.textContent = mensaje;

    // agregar al dom
    document
      .querySelector("#contenido")
      .insertBefore(divMensaje, document.querySelector(".agregar-cita"));

    // quitar alerta después de 3 seg
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
  imprimirCitas({ citas }) {
    // const { citas } = citas; //destructuring de esta forma causa error, por eso usar el destructuring desde el parámetro

    this.limpiarHTML();

    citas.forEach((cita) => {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } =
        cita;

      const divCita = document.createElement("div");
      divCita.classList.add("cita", "p-3");
      divCita.dataset.id = id;

      // scripting de los elementos de la cita
      const mascotaParrafo = document.createElement("h2");
      mascotaParrafo.classList.add("card-title", "font-weight-bolder");
      mascotaParrafo.textContent = mascota;

      const propietarioParrafo = document.createElement("p");
      propietarioParrafo.innerHTML = `
        <span class="font-weight-bolder">Propietario: </span> ${propietario}
      `;

      const telefonoParrafo = document.createElement("p");
      telefonoParrafo.innerHTML = `
        <span class="font-weight-bolder">Teléfono: </span> ${telefono}
      `;

      const fechaParrafo = document.createElement("p");
      fechaParrafo.innerHTML = `
        <span class="font-weight-bolder">Fecha: </span> ${fecha}
      `;

      const horaParrafo = document.createElement("p");
      horaParrafo.innerHTML = `
        <span class="font-weight-bolder">Hora: </span> ${hora}
      `;

      const sintomasParrafo = document.createElement("p");
      sintomasParrafo.innerHTML = `
        <span class="font-weight-bolder">Síntomas: </span> ${sintomas}
      `;

      // botón para eliminar cita
      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("btn", "btn-danger", "mr-2");
      btnEliminar.innerHTML = "Eliminar";

      btnEliminar.onclick = () => eliminarCita(id);

      // butón para editar cita
      const btnEditar = document.createElement("button");
      btnEditar.classList.add("btn", "btn-info");
      btnEditar.innerHTML = "Editar";

      btnEditar.onclick = () => cargarEdicion(cita);

      // agregar los párrafos al divCita
      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEliminar);
      divCita.appendChild(btnEditar);

      // agregar las citas al html
      contenedorCitas.appendChild(divCita);
    });
  }
  // limpiar html
  limpiarHTML() {
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
  }
}

// instanciar clases de forma global
const ui = new UI();
const administrarCitas = new Citas();

// registrar eventos
eventListeners();
function eventListeners() {
  // registrar cuando cambia el valor de cada input
  formulario.forEach((input) => {
    // agregar los datos de cada input a citaObj
    input.addEventListener("change", (e) => {
      citaObj[e.target.name] = e.target.value;
    });
  });

  // registrar el submit del formulario
  document.querySelector("#nueva-cita").addEventListener("submit", nuevaCita);
}

// ir lleando el objeto con lo que se va llenando del formulario
const citaObj = {};

// validar y agregar una nueva cita a la clase de citas
function nuevaCita(e) {
  e.preventDefault();

  // extraer información de citaObj
  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

  // validar la entrada de cada input
  if (
    mascota === "" ||
    propietario === "" ||
    telefono === "" ||
    fecha === "" ||
    hora === "" ||
    sintomas === ""
  ) {
    ui.imprimirAlerta("Todos los campos son obligatorios", "error");

    return;
  }

  if (editando) {
    ui.imprimirAlerta("Editado correctamente");

    // pasar objeto de la cita a edición
    administrarCitas.editarCita({ ...citaObj });

    // regresar texto botón a estado original
    document.querySelector('button[type="submit"]').textContent = "Crear Cita";

    // desahibilitar modo edición
    editando = false;
  } else {
    // generar id único para cada cita
    citaObj.id = Date.now();

    // crear nueva cita
    administrarCitas.agregarCita({ ...citaObj }); // pasamos copia del objeto para no pasar el objeto global y evitar que se vaya sobreescribiendo cada vez que se añade una cita

    // mensaje agregado correctamente
    ui.imprimirAlerta("Se agregó correctamente");
  }

  // reiniciar citaObj
  reiniciarObjeto();

  // reiniciar formulario
  document.querySelector("#nueva-cita").reset();

  // mostrar citas en el html
  ui.imprimirCitas(administrarCitas);
}

function reiniciarObjeto() {
  citaObj.mascota = "";
  citaObj.propietario = "";
  citaObj.telefono = "";
  citaObj.fecha = "";
  citaObj.hora = "";
  citaObj.sintoms = "";
}

function eliminarCita(id) {
  // eliminar cita
  administrarCitas.eliminarCita(id);

  // notificación
  ui.imprimirAlerta("La cita se eliminó correctamente");

  // refrescar las citas
  ui.imprimirCitas(administrarCitas);
}

// cargar los datos y el modo edición
function cargarEdicion(cita) {
  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

  // llenar los inputs
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  // llenar citaObj
  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;

  // cambiar texto del botón
  document.querySelector('button[type="submit"]').textContent =
    "Guardar Cambios";

  editando = true;
}
