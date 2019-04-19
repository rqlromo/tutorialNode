//necesitamos incluir la dependencia de express para poder usar sus métodos. En NodeJs, cuando quieres acceder a las funcionalidades de una librería o módulo de otro archivo, tienes que requerirlo.
var express = require('express');

// Para iniciar el servidor, sólo tenemos que llamar a la función express(), por eso creamos una variable de la llamada a la función
var app = express();


//con esto indicamos donde estan los ficheros estaticos
app.use(express.static(__dirname + '/'));

// Cuando hacemos una búsqueda en la url del navegador hacemos un get y la respuesta puede ser un mesaje en una pantalla en blanco con res.send()
app.get("/text", function (req, res) {
  res.send("Hola Mundo!");
});

// o nos puede devolver un fichero con sendFile() , __dirname es un objeto global de Node que te da la ruta a tu directorio raíz actual. es útil cuando queremos evitar escribir rutas dinámicas o largas.
app.get("/html", function (req, res) {
  res.sendFile(__dirname + '/sendFile.html');
});

//En funcion de la url que pongamos mostrara una cosa u otra


// Usamos el método app.listen para escuchar por el puerto. Este método necesita dos argumentos: un puerto y una función callback (de respuesta) que indica qué hacer una vez que el servidor esté funcionando.
app.listen(3000, function () {
  console.log('Server is listening on port 3000!!');
});