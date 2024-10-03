document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username"); // Obtener el nombre de usuario desde localStorage
  const role = localStorage.getItem("role"); // Obtener el rol desde localStorage
  const token = localStorage.getItem("token"); // Verificar si hay un token

  // Mostrar el nombre de usuario si está autenticado
  if (username && token) {
    document.getElementById(
      "user-name"
    ).textContent = `Bienvenido, ${username}`;
    document.getElementById("logout-button").style.display = "inline-block";
    // Ocultar los botones de "Registrarme" e "Inicio de Sesión"
    document.getElementById("register-button").style.display = "none";
    document.getElementById("registrarme").style.display = "none";
  }
  // Verificar si el rol es administrador
  if (role === "Admin") {
    // Mostrar el botón de "Agregar Vehículo"
    const agregarButton = document.getElementById("Agregar-Vehiculo");
    const verCitasButton = document.getElementById("Ver-Citas");
    if (agregarButton) {
      agregarButton.style.display = "inline-block";
    }
    if (verCitasButton) {
      verCitasButton.style.display = "inline-block";
    }
  }

  // Manejar el cierre de sesión
  document
    .getElementById("logout-button")
    .addEventListener("click", function () {
      // Eliminar token y rol del localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");

      // Redirigir al usuario a la página de inicio de sesión
      window.location.href = "Paginaprincipal.html";
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  // Inicializar el calendario
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth", // Vista predeterminada
    events: async function (fetchInfo, successCallback, failureCallback) {
      try {
        // Realizar la solicitud GET a tu API para obtener las citas
        const response = await fetch("https://import20240918001333.azurewebsites.net/api/Citas", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener las citas");
        }

        const citas = await response.json();

        // Mapear las citas al formato que FullCalendar necesita
        const events = citas.map((cita) => ({
          title: cita.title,
          start: cita.start,
          end: cita.end,
          allDay: cita.allDay,
          extendedProps: {
            idCede: cita.idCede,
            estado: cita.estado,
            telefono: cita.telefono,
            correo: cita.correo,
            idpedido: cita.idpedido,
          },
        }));

        // Pasar los eventos al calendario
        console.log(citas)
        successCallback(events);
        renderCitasList(citas);
        // Vincular la función actualizaCita al botón "Actualizar" del modal
        document
          .getElementById("guardarCambiosBtn")
          .addEventListener("click", function () {
            actualizaCita(idPedidoActual); // Llama a la función para actualizar la cita
          });
      } catch (error) {
        console.error("Error:", error);
        failureCallback(error);
      }
    },
  });

  // Renderizar el calendario
  calendar.render();
});

function renderCitasList(citas) {
  const citasListEl = document.getElementById("citas-ul"); // Obtener el elemento UL

  citasListEl.innerHTML = ""; // Limpiar la lista de citas antes de agregar nuevas

  // Verificar que las citas se están pasando correctamente
  // console.log("Citas para la lista:", citas);

  // Si no hay citas, puedes mostrar un mensaje
  if (citas.length === 0) {
    citasListEl.innerHTML = "<li>No hay citas disponibles</li>";
    return;
  }

  // Crear cada elemento de la lista para cada cita
  citas.forEach((cita) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <strong>${cita.title}</strong> - ${new Date(
      cita.start
    ).toLocaleDateString()} a ${new Date(cita.end).toLocaleDateString()}
        <button class="delete-btn" data-id="${cita.idpedido}">Eliminar</button>
        <button class="update-btn" data-id="${
          cita.idpedido
        }">Actualizar</button>
        <button class="ver-btn" data-id="${cita.idpedido}">ver</button>
      `;
    citasListEl.appendChild(li);

    // Agregar evento para eliminar
    li.querySelector(".delete-btn").addEventListener("click", function () {
      eliminarCita(cita.idpedido);
    });

    // Agregar evento para actualizar
    li.querySelector(".update-btn").addEventListener("click", function () {
      prellenarFormularioActualizar(cita.idpedido); // Llama a la función para prellenar y mostrar el modal de actualización
    });

    // Ver evento para cita
    li.querySelector(".ver-btn").addEventListener("click", function () {
      verCita(cita.idpedido);
    });
  });
}

// Función para eliminar una cita
async function eliminarCita(idpedido) {
  try {
    const response = await fetch(
      `https://import20240918001333.azurewebsites.net/api/Citas/${idpedido}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      alert("Cita eliminada con éxito");
      calendar.refetchEvents(); // Refrescar el calendario después de eliminar
    } else {
      alert("Error al eliminar la cita");
    }
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
  }
}

// Función para mostrar los detalles de una cita
async function verCita(idpedido) {
  // console.log("Función verCita llamada, idpedido:", idpedido); // Log para depuración

  try {
    const response = await fetch(
      `https://import20240918001333.azurewebsites.net/api/Citas/${idpedido}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) throw new Error("Error al obtener la cita");

    const cita = await response.json();

    // Rellenar los datos del modal
    document.getElementById("cita-titulo").textContent = cita.title;
    document.getElementById("cita-fecha").textContent = new Date(
      cita.start
    ).toLocaleDateString();
    document.getElementById("cita-fecha").textContent = new Date(
      cita.end
    ).toLocaleDateString();
    document.getElementById("cita-telefono").textContent = cita.telefono;
    document.getElementById("cita-correo").textContent = cita.correo;
    document.getElementById("cita-estado").textContent = cita.estado;
    document.getElementById("cita-canal").textContent = cita.nombre_dep;

    console.log("Mostrando el modal"); // Log para depuración antes de mostrar el modal

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById("citaModal"));
    modal.show();
  } catch (error) {
    console.error("Error al obtener la cita:", error);
  }
}

let idPedidoActual = null; // Variable global para almacenar el idpedido
let idVehiculoActual = null;

async function prellenarFormularioActualizar(idpedido) {
  try {
    const response = await fetch(
      `https://import20240918001333.azurewebsites.net/api/Citas/${idpedido}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) throw new Error("Error al obtener la cita");

    const cita = await response.json();

    // Guardar el idpedido en la variable global
    idVehiculoActual = cita.idvehiculo;
    idPedidoActual = idpedido;
    idDepValidosActual = cita.iddep;
  
    // Prellenar los campos del formulario de actualización
    document.getElementById("actualizarTitulo").value = cita.title;
    document.getElementById("actualizarFechaInicio").value = new Date(
      cita.start
    )
      .toISOString()
      .slice(0, 10); // yyyy-mm-dd
    document.getElementById("actualizarFechaFin").value = new Date(cita.end)
      .toISOString()
      .slice(0, 10); // yyyy-mm-dd
    document.getElementById("actualizarTelefono").value = cita.telefono;
    document.getElementById("actualizarCorreo").value = cita.correo;
    document.getElementById("actualizarDepartamento").value = cita.nombre_dep; // Campo no editable
    document.getElementById("actualizarEstado").value = cita.estado;

    // Mostrar el modal de actualización
    const modal = new bootstrap.Modal(
      document.getElementById("actualizarCitaModal")
    );
    modal.show();
  } catch (error) {
    console.error("Error al obtener la cita:", error);
  }
}

async function actualizaCita(idpedido) {
  // Asegúrate de que idPedidoActual contiene el valor correcto
  if (!idPedidoActual) {
    alert("No se puede guardar porque falta el ID de la cita.");
    return;
  }

  // Obtener los valores actualizados del formulario
  const titulo = document.getElementById("actualizarTitulo").value;
  const fechaInicio = document.getElementById("actualizarFechaInicio").value;
  const fechaFin = document.getElementById("actualizarFechaFin").value;
  const telefono = document.getElementById("actualizarTelefono").value;
  const correo = document.getElementById("actualizarCorreo").value;
  const estado = document.getElementById("actualizarEstado").value;

  const citaActualizada = {
    IdCede: 1,
    idpedido: idPedidoActual,
    Titulo: titulo,
    FechaCita: fechaInicio,
    FechaVencimiento: fechaFin,
    Telefono: telefono,
    Correo: correo,
    Estado: estado,
    IdVehiculo: idVehiculoActual,  
    IdDepValidos: idDepValidosActual
  };

  try {
    const response = await fetch(
      `https://import20240918001333.azurewebsites.net/api/Citas/${idPedidoActual}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(citaActualizada),
      }
    );

    if (!response.ok) throw new Error("Error al actualizar la cita");

    alert("Cita actualizada con éxito");
    location.reload(); // Recargar la página para mostrar los cambios
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    alert("Hubo un error al actualizar la cita.");
  }
}
