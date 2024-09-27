document.addEventListener("DOMContentLoaded", function () {
  // Captura el ID del vehículo desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  const vehicleId = parseInt(urlParams.get("id")); // Captura el id del vehículo de la URL

  document
    .getElementById("citaForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

      // Captura los valores del formulario
        
      const nombre = document.getElementById("nombre").value;
      const apellido = document.getElementById("apellido").value;
      const telefono = document.getElementById("telefono").value;
      const correo = document.getElementById("correo").value;
      const fechaCita = document.getElementById("fechaCita").value;


      const comunicacionValue = document.querySelector(
        'input[name="comunicacion"]:checked'
      ).value;

      // console.log(vehicleId);

      // Construye el objeto JSON que se enviará
      const citaData = {
        idCede: 1,
        titulo: "Solicitud de cotización",
        idVehiculo: vehicleId,
        idDepValidos: parseInt(comunicacionValue),
        fechaCita: fechaCita,
        fechaVencimiento: new Date(
          new Date(fechaCita).setDate(new Date(fechaCita).getDate())
        ).toISOString(),
        estado: "A",
        telefono: telefono,
        correo: correo,
      };

      // Realiza la solicitud POST a la API
      fetch("https://import20240918001333.azurewebsites.net/api/Citas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(citaData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al enviar la solicitud");
          }
          return response.json();
        })
        .then((data) => {
          alert("Solicitud enviada con éxito");
          // console.log("Respuesta de la API:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Hubo un problema al enviar la solicitud.");
        });
    });
});
