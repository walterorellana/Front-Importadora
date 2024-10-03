document.addEventListener("DOMContentLoaded", async function () {
    // Verificar si existe un vehicleId en la URL
    const params = new URLSearchParams(window.location.search);
    const vehicleId = params.get('id');
    // console.log(vehicleId)
    if (vehicleId) {
        try {
            // Realizar la solicitud GET a la API
            const response = await fetch(`https://import20240918001333.azurewebsites.net/api/VehicleApi/${vehicleId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Si necesitas autenticación
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener los datos del vehículo');
            }

            const vehiculo = await response.json();

            // Precargar los campos del formulario con los datos del vehículo
            document.getElementById('nombre').value = vehiculo.nombreVehiculos;
            document.getElementById('danio-principal').value = vehiculo.daPrincipal;
            document.getElementById('danio-secundario').value = vehiculo.daSecundario;
            document.getElementById('kilometraje').value = vehiculo.kilometraje;
            document.getElementById('precio').value = vehiculo.precio;
            document.getElementById('anio').value = vehiculo.año;
            document.getElementById('motor').value = vehiculo.motor;
            document.getElementById('transmicion').value = vehiculo.transmision;
            document.getElementById('combustible').value = vehiculo.combustible;
            document.getElementById('interior').value = vehiculo.exteriorInterior;
            document.getElementById('cilindrada').value = vehiculo.cilindros;
            document.getElementById('serie').value = vehiculo.serie;
            document.getElementById('tipo').value = vehiculo.tipoVehiculosCol;
            document.getElementById('detalles-equipo').value = vehiculo.detallesEquipos;
            document.getElementById('especificaciones-tecnicas').value = vehiculo.especfTecnicas;

            

        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al cargar los datos del vehículo.');
        }
        document.getElementById('updateButton').style.display = 'inline-block'; 
        document.getElementById('registerButton').style.display = 'none';
    }
});
function actualizarVehiculo(event) {
    event.preventDefault();

    const vehicleId = new URLSearchParams(window.location.search).get('id'); // Obtener el ID de la URL

    const formData = new FormData(document.getElementById('vehicleForm'));

    const vehicleData = {
        idCede:1,
        idVehiculo:parseInt(vehicleId),
        nombreVehiculos: formData.get('nombre'),
        daPrincipal: formData.get('danio-principal'),
        daSecundario: formData.get('danio-secundario'),
        kilometraje: formData.get('kilometraje'),
        precio: formData.get('precio'),
        allo: formData.get('anio'),
        motor: formData.get('motor'),
        transmision: formData.get('transmicion'),
        combustible: formData.get('combustible'),
        exteriorInterior: formData.get('interior'),
        cilindros: formData.get('cilindrada'),
        serie: formData.get('serie'),
        detallesEquipos: formData.get('detalles-equipo'),
        especfTecnicas: formData.get('especificaciones-tecnicas'),
        tipoVehiculosCol: formData.get('tipo')
    };
    // console.log(vehicleId)
    fetch(`https://import20240918001333.azurewebsites.net/api/VehicleApi`, {
        method: 'PUT', // O PATCH si solo actualizas algunos campos
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Si es necesario
        },
        body: JSON.stringify(vehicleData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el vehículo');
        }
        return response.json();
    })
    .then(data => {
        // console.log('Vehículo actualizado:', data);
        alert('El vehículo ha sido actualizado correctamente.');

        eliminarFotoPorVehiculo(vehicleId)
        subirFotos(vehicleId);
        // Redirigir o hacer alguna acción adicional si es necesario
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al actualizar el vehículo.');
    });
}

// Agregar el evento de envío al formulario
document.getElementById('vehicleForm').addEventListener('submit', actualizarVehiculo);

function registrarVehiculo(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('vehicleForm'));

    const vehicleData = {// Manejar la carga de fotos según sea necesario
        nombreVehiculos: formData.get('nombre'),
        daPrincipal: formData.get('danio-principal'),
        daSecundario: formData.get('danio-secundario'),
        kilometraje: formData.get('kilometraje'),
        precio: formData.get('precio'),
        allo: formData.get('anio'),
        motor: formData.get('motor'),
        transmision: formData.get('transmicion'),
        combustible: formData.get('combustible'),
        exteriorInterior: formData.get('interior'),
        cilindros: formData.get('cilindrada'),
        serie: formData.get('serie'),
        detallesEquipos: formData.get('detalles-equipo'),
        especfTecnicas: formData.get('especificaciones-tecnicas'),
        tipoVehiculosCol: formData.get('tipo')
    };

    fetch('https://import20240918001333.azurewebsites.net/api/VehicleApi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(vehicleData)
    })
    .then(response => response.json())
    .then(data => {
        // console.log('Success:', data);
        const vehicleId = data.vehicleId; 
        if (vehicleId) {
            
            // console.log('ID del vehículo creado:', vehicleId);
            subirFotos(vehicleId);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

let vehicleId; 
async function subirFotos(vehicleId) {
  const form = document.getElementById('uploadForm');
  const formData = new FormData();

  const fotos = document.getElementById('fotoFile').files; // Obtener todos los archivos seleccionados

  // Agregar todos los archivos al FormData
  for (let i = 0; i < fotos.length; i++) {
      formData.append('fotoFiles', fotos[i]);
  }

  // Agregar información adicional a FormData
  formData.append('idCede', 1); // Cambia por el ID de la cede
  formData.append('idVehiculo', vehicleId); // Cambia por el ID del vehículo

  const url2 = 'https://import20240918001333.azurewebsites.net/api/Fotos';

  try {
      const response = await fetch(url2, {
          method: 'POST',
          body: formData,
      });

      if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const result = await response.json();

      alert("Vehiculo Guardado");

      // Restablecer el formulario
      document.getElementById("vehicleForm").reset();

      document.getElementById("uploadForm").reset();
    //   console.log('Fotos subidas con éxito:', result);
  } catch (error) {
      console.error('Error al subir las fotos:', error);
  }
}
  

function eliminarFotoPorVehiculo(idVehiculo) {
    // Confirmar si el usuario realmente quiere eliminar la foto
    // const confirmar = confirm("¿Estás seguro de que deseas eliminar las fotos de este vehículo?");
    // if (!confirmar) return; // Si el usuario cancela, no se hace nada.

    // Realizar la solicitud DELETE
    fetch(`https://import20240918001333.azurewebsites.net/api/Fotos/${idVehiculo}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Añade token si es necesario
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar la foto del vehículo');
        }
        alert('Foto(s) eliminada(s) correctamente');
        // Aquí puedes redirigir o actualizar la interfaz si es necesario
    })
    .catch((error) => {
        console.error('Error al eliminar la foto:', error);
        alert('Hubo un problema al eliminar la foto.');
    });
}
