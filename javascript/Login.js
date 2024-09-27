window.onload = function() {
    const loginButton = document.getElementById('loginButton');
    
    loginButton.addEventListener('click', function() {
        // console.log("Botón clickeado");
        iniciarSesion();
    });
};


document.addEventListener("DOMContentLoaded", function () {
    // console.log("DOM cargado");
    
    const loginButton = document.getElementById('loginButton');
    
    loginButton.addEventListener('click', function() {
        // console.log("Botón clickeado");
        iniciarSesion();
    });
});

async function iniciarSesion() {
    // console.log("iniciarSesion llamada");

    // Obtener los valores de los campos de entrada
    const email = document.getElementById('exampleInputEmail1').value;
    const password = document.getElementById('password').value;
    // console.log("Email: ", email, "Password: ", password);

    // Crear el objeto de la solicitud
    const data = {
        email: email,
        password: password
    };

    try {
        // Realizar la solicitud POST
        const response = await fetch('https://import20240918001333.azurewebsites.net/api/Auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Verificar si la respuesta fue exitosa
        if (response.ok) {
            const result = await response.json();
            // console.log("Respuesta: ", result);

            // Almacenar el token y el rol en localStorage
            localStorage.setItem('token', result.token); // Almacenar el token
            localStorage.setItem('role', result.rol);
            localStorage.setItem('username', result.nombre);    // Almacenar el rol

            alert('Inicio de sesión exitoso');
            // Redirigir a la página principal o a la página que desees
            window.location.href = 'Paginaprincipal.html'; // Cambia esto por la ruta correcta
        } else {
            // Manejo de errores si la respuesta no es exitosa
            alert('Error al iniciar sesión: ' + response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Ocurrió un error al procesar la solicitud');
    }
}