iniciarSesion();
mostrarContrasena();

function iniciarSesion() {
    var email = document.getElementById("exampleInputEmail1").value;
    var password = document.getElementById("password").value;
    var nombre = document.getElementById("nombre").value;
    var apellido = document.getElementById("apellido").value;
    var telefono = document.getElementById("telefono").value;
    var errorMensaje = document.getElementById("errorMensaje");

    // Validar que ningún campo esté en blanco
    if (email === '' || password === '' || nombre === '' || apellido === '' || telefono === '') {
        errorMensaje.innerText = "Por favor completa todos los campos.";
        return;
    }

    // Validar formato de correo electrónico
    var emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormat.test(email)) {
        errorMensaje.innerText = "Por favor ingresa un correo electrónico válido.";
        return;
    }

}

function limpiarCampos() {
    document.getElementById("exampleInputEmail1").value = "";
    document.getElementById("password").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("errorMensaje").innerText = ""; // Limpiar el mensaje de error
}

function mostrarContrasena() {
    var passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

// Función para iniciar sesión y enviar los datos
async function iniciarSesion() {
    // Capturar los datos del formulario
    const correo = document.getElementById('exampleInputEmail1').value;
    const password = document.getElementById('password').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const errorMensaje = document.getElementById('errorMensaje');

    // Validación de datos
    if (!correo || !password || !nombre || !apellido || !telefono) {
        errorMensaje.textContent = "Por favor, completa todos los campos.";
        return;
    }

    // Crear el objeto que vamos a enviar en la solicitud
    const data = {
        idCede:1,
        idRoles:2, 
        Correo: correo,
        Contrasena: password,
        Nombre: nombre,
        Apellido: apellido,
        Telefono: telefono
    };

    try {
        // Hacer la solicitud POST a la API
        const response = await fetch('https://import20240918001333.azurewebsites.net/api/Usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Manejar la respuesta de la API
        if (response.ok) {
            const result = await response.json();
            // console.log("Usuario registrado con éxito:", result);
            // Redirigir o mostrar mensaje de éxito
            window.location.href = 'Paginaprincipal.html';
        } else {
            const error = await response.json();
            errorMensaje.textContent = `Error: ${error.message || "No se pudo registrar el usuario."}`;
        }
    } catch (error) {
        console.error("Error al enviar los datos:", error);
        errorMensaje.textContent = "Ocurrió un error al intentar enviar los datos.";
    }
}