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

  document
    .getElementById("filters-form")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Evitar que el formulario recargue la página
      // console.log("hola")

      // Obtener los valores de los filtros

      const priceRange = document.getElementById("price-range").value;
      const yearRange = document.getElementById("year-range").value;
      const nameSearch = document.getElementById("name-search").value;

      // console.log("Filtros:", {priceRange, yearRange, nameSearch});

      // Aplicar los filtros a los vehículos cargados
      aplicarFiltros(priceRange, yearRange, nameSearch);
    });

  function aplicarFiltros(priceRange, yearRange, nameSearch) {
    // Crear una copia de los vehículos para aplicar los filtros
    let filteredVehiculos = [...vehiculos]; // Copia del array original

    // console.log("Vehículos antes de filtrar:", filteredVehiculos); // Verificar si el array original tiene datos

    // Filtrar por rango de precios
    if (priceRange) {
      filteredVehiculos = filteredVehiculos.filter((vehiculo) => {
        const precioVehiculo = parseFloat(vehiculo.precio);
        return precioVehiculo <= priceRange;
      });
      // console.log("Filtrado por precio:", filteredVehiculos); // Verificar si el filtro de precio funciona
    }

    // Filtrar por año
    if (yearRange) {
      filteredVehiculos = filteredVehiculos.filter(
        (vehiculo) => vehiculo.año === parseInt(yearRange)
      );
      // console.log("Filtrado por año:", filteredVehiculos); // Verificar si el filtro de año funciona
    }

    // Filtrar por nombre
    if (nameSearch) {
      filteredVehiculos = filteredVehiculos.filter((vehiculo) =>
        vehiculo.nombreVehiculos
          .toLowerCase()
          .includes(nameSearch.toLowerCase())
      );
      // console.log("Filtrado por nombre:", filteredVehiculos); // Verificar si el filtro de nombre funciona
    }

    // Verificar si los vehículos filtrados están correctos
    // console.log("Vehículos filtrados:", filteredVehiculos);

    // Renderizar los vehículos filtrados
    renderVehiculo(filteredVehiculos);
  }
});
// script.js
function toggleDropdown() {
  const dropdownContent = document.querySelector(".dropdown-content");
  const arrow = document.querySelector(".arrow");

  if (
    dropdownContent.style.display === "none" ||
    dropdownContent.style.display === ""
  ) {
    dropdownContent.style.display = "flex";
    arrow.style.transform = "rotate(0deg)"; // Flecha hacia abajo
  } else {
    dropdownContent.style.display = "none";
    arrow.style.transform = "rotate(180deg)"; // Flecha hacia arriba
  }
}

// Cierra el menú desplegable si se hace clic fuera de él
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn") && !event.target.matches(".arrow")) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    const arrow = document.querySelector(".arrow");
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.style.display === "flex") {
        openDropdown.style.display = "none";
        arrow.style.transform = "rotate(180deg)"; // Flecha hacia arriba
      }
    }
  }
};

let currentPage = 1;
const itemsPerPage = 8; // Número de vehículos por página

async function fetchVehiculos() {
  try {
    const response = await fetch(
      "https://import20240918001333.azurewebsites.net/api/VehicleApi"
    );
    if (!response.ok) {
      throw new Error("Error al obtener los datos de la API");
    }
    const data = await response.json();
    vehiculos = data.vehiculos;
    // console.log(data);
    if (Array.isArray(data.vehiculos)) {
      renderVehiculo(data.vehiculos);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchFotoPorVehiculo(idVehiculo) {
  try {
    const response = await fetch(
      `https://import20240918001333.azurewebsites.net/api/Fotos/${idVehiculo}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener la foto del vehículo");
    }
    const foto = await response.json();
    return foto.foto1 ? foto.foto1 : null; // Retorna la ruta de la foto si existe, o null si no.
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function renderVehiculo(vehiculos) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVehiculos = vehiculos.slice(startIndex, endIndex);

  const contentSection = document.getElementById("content-section");
  contentSection.innerHTML = ""; // Limpiar el contenido anterior

  for (const vehiculo of paginatedVehiculos) {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4"; 

    // Obtener la foto del vehículo, si no existe en los datos actuales
    let imagePath =
      vehiculo.fotos && vehiculo.fotos[0]
        ? vehiculo.fotos[0].foto1.trim()
        : null;

    // Si no se encontró la foto en el objeto, haz una solicitud para obtenerla
    if (!imagePath) {
      imagePath = await fetchFotoPorVehiculo(vehiculo.idVehiculo);
    }

    // Si aún no se encuentra una imagen, asignar una imagen predeterminada
    if (!imagePath) {
      imagePath = "/images/Craga.png";
    }

    // Inserta el contenido HTML de la tarjeta
    card.innerHTML = `
 <div class="col-md-4 mb-4">
                <div class="card" style="width: 18rem;">
                    <img src="https://import20240918001333.azurewebsites.net/uploads/${imagePath}" alt="Imagen de vehículo" onerror="this.onerror=null; this.src='/Imagenes/Craga.png';">
                    <div class="card-body">
                        <h5 class="card-title">${vehiculo.nombreVehiculos}</h5>
                        <p class="card-text">Año: ${vehiculo.año}</p>
                        <p class="card-text">Precio: ${vehiculo.precio}</p>
                        <div class="buttons">
                            <button class="btn btn-danger eliminar" style="display: none;">Eliminar</button>
                            <button class="btn btn-warning actualizar" style="display: none;" onclick="actualizarVehiculo(${vehiculo.idVehiculo})">Actualizar</button>
                            <button class="btn btn-primary mas-info">Más Información</button>
                        </div>
                    </div>
                </div>
            </div>
    `;

    // Obtener el rol desde localStorage
    const role = localStorage.getItem("role");

    // Mostrar botones si el rol es "Admin"
    if (role === "Admin") {
      const eliminarButton = card.querySelector(".eliminar");
      const actualizarButton = card.querySelector(".actualizar"); 

      if (eliminarButton && actualizarButton) {
        eliminarButton.style.display = "inline-block"; // Mostrar el botón de eliminar
        actualizarButton.style.display = "inline-block"; // Mostrar el botón de actualizar

        eliminarButton.addEventListener("click", function () {
          if (confirm("¿Estás seguro de que quieres eliminar este vehículo?")) {
            eliminarVehiculo(vehiculo.idCede, vehiculo.idVehiculo);
          }
        });

        actualizarButton.addEventListener("click", function () {
          const vehicleId = vehiculo.idVehiculo;
          window.location.href = `formvehi.html?id=${vehicleId}`;
        });
      }
    }

    // Agregar el evento al botón "Más Información", que siempre estará visible
    const masInfoButton = card.querySelector(".mas-info");
    masInfoButton.addEventListener("click", function () {
      const vehicleId = vehiculo.idVehiculo;
      window.location.href = `dtavehicu.html?id=${vehicleId}`;
    });

    // Añadir la tarjeta a la sección de contenido
    contentSection.appendChild(card);
  }

  // Renderizar paginación después de mostrar los vehículos
  renderPagination(vehiculos.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = ""; // Limpiar el contenido anterior

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.onclick = () => {
      currentPage = i;
      fetchVehiculos(); // Vuelve a obtener los vehículos para la nueva página
    };
    paginationContainer.appendChild(pageButton);
  }
}

let vehiculos = [];

// Llama a fetchVehiculos al cargar la página
fetchVehiculos();

async function eliminarVehiculo(idCede, idVehiculo) {
  const url = `https://import20240918001333.azurewebsites.net/api/VehicleApi/1/${idVehiculo}`;

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
        "Content-Type": "application/json", // Si es necesario
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el vehículo");
    }

    // Si la eliminación fue exitosa, vuelve a cargar los vehículos
    fetchVehiculos();
  } catch (error) {
    console.error("Error:", error);
    alert("Hubo un problema al eliminar el vehículo.");
  }
}

document
  .getElementById("filters-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que el formulario recargue la página

    // Obtener los valores de los filtros
    const category = document.getElementById("category").value;
    const priceRange = document.getElementById("price-range").value;
    const inStock = document.getElementById("in-stock").checked;

    // Filtrar los vehículos usando los criterios seleccionados
    aplicarFiltros(category, priceRange, inStock);
  });

function aplicarFiltros(category, priceRange, inStock) {
  // Asumiendo que tienes un array 'vehiculos' con todos los datos cargados previamente
  let filteredVehiculos = vehiculos;

  // Filtrar por categoría (si no es 'all')
  if (category !== "all") {
    filteredVehiculos = filteredVehiculos.filter(
      (vehiculo) => vehiculo.categoria === category
    );
  }

  // Filtrar por rango de precios (ajustar según tu lógica de precios)
  filteredVehiculos = filteredVehiculos.filter((vehiculo) => {
    const precioVehiculo = parseFloat(vehiculo.precio);
    console.log(precioVehiculo)
    return precioVehiculo <= priceRange;
    
  });

  // Filtrar por stock
  if (inStock) {
    filteredVehiculos = filteredVehiculos.filter(
      (vehiculo) => vehiculo.enStock === true
    );
  }

  // Renderizar los vehículos filtrados
  renderVehiculo(filteredVehiculos);
}
