

document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem('username'); // Obtener el nombre de usuario desde localStorage
  const role = localStorage.getItem('role'); // Obtener el rol desde localStorage
  const token = localStorage.getItem('token'); // Verificar si hay un token

  // Mostrar el nombre de usuario si está autenticado
  if (username && token) {
    document.getElementById('user-name').textContent = `Bienvenido, ${username}`;
    document.getElementById('logout-button').style.display = 'inline-block';
     // Ocultar los botones de "Registrarme" e "Inicio de Sesión"
     document.getElementById('register-button').style.display = 'none';
     document.getElementById('registrarme').style.display = 'none';
    
  }
  // Verificar si el rol es administrador
  if (role === 'Admin') {
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
 document.getElementById('logout-button').addEventListener('click', function () {
  // Eliminar token y rol del localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');

  // Redirigir al usuario a la página de inicio de sesión
  window.location.href = 'Paginaprincipal.html';
});

});


// Captura el ID del vehículo desde la URL
const urlParams = new URLSearchParams(window.location.search);
const vehicleId = urlParams.get("id");

// Función para redirigir a la página de cotización
function redirectToCotizar(vehicleId) {
  const cotizarUrl = `smsve.html?id=${vehicleId}`;
  window.location.href = cotizarUrl;
}

document.addEventListener("DOMContentLoaded", function () {
  // Función para obtener el ID del vehículo de la URL
  function getVehicleIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id"); // 'id' es el nombre del parámetro que pasamos en la URL
  }

  // Obtener el ID del vehículo
  const vehicleId = getVehicleIdFromURL();
  if (!vehicleId) {
    console.error("No se encontró el ID del vehículo en la URL");
    return;
  }

  const apiUrl = `https://import20240918001333.azurewebsites.net/api/VehicleApi/${vehicleId}`;

  // Función para obtener los datos del vehículo
  async function fetchVehicleData() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Error al obtener los datos del vehículo");
      }
      const vehicleData = await response.json();
      displayVehicleData(vehicleData);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Función para mostrar los datos del vehículo en el HTML
  function displayVehicleData(data) {
    const mainImage = document.getElementById("main-image");
    mainImage.src =
      data.fotos && data.fotos.length > 0
        ? `https://import20240918001333.azurewebsites.net/uploads/${data.fotos[0].foto1.trim()}`
        : "/Imagenes/vehiculo-grande.jpg";

     console.log("Datos del vehículo:", data);

    const thumbnailContainer = document.getElementById("thumbnail-images");
    thumbnailContainer.innerHTML = "";
    if (data.fotos && data.fotos.length > 0) {
      data.fotos.forEach((foto) => {
        const img = document.createElement("img");
        img.src = `https://import20240918001333.azurewebsites.net/uploads/${foto.foto1.trim()}`;
        img.alt = "Thumbnail";

        // Agregar evento de clic para cambiar la imagen principal
        img.addEventListener("click", function () {
          mainImage.src = img.src; // Cambia la imagen grande por la miniatura seleccionada
        });
        thumbnailContainer.appendChild(img);
      });
    }

    const details = document.getElementById("vehicle-details");
    details.innerHTML = `
      Modelo: ${data.nombreVehiculos}<br>
      Año: ${data.año}<br>
      Precio: ${data.precio}<br>
      Kilometrajes: ${data.kilometraje} km<br>
    `;

    const specs = document.getElementById("vehicle-specs");
    specs.innerHTML = `
      Motor: ${data.motor}<br>
      Transmisión: ${data.transmision}<br>
      Combustible: ${data.combustible}<br>
      Cilindrada: ${data.cilindros}<br>
    `;
    const dallo = document.getElementById("vehicle-dallo");
    dallo.innerHTML = `
      Daño Principal: ${data.daPrincipal}<br>
      Daño Secundario: ${data.daSecundario}<br>

      Exterior/Interior: ${data.exteriorInterior}<br>
    `;
  }

  // Asignar el ID del vehículo al botón Cotizar
  const cotizarButton = document.getElementById("Cotizar");
  cotizarButton.onclick = function () {
    // console.log(vehicleId);
    redirectToCotizar(vehicleId);
  };

  // Llamar a la función para obtener los datos del vehículo
  fetchVehicleData();
});
