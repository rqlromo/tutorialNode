//necesitamos incluir la dependencia de express para poder usar sus métodos. En NodeJs, cuando quieres acceder a las funcionalidades de una librería o módulo de otro archivo, tienes que requerirlo.
var express = require('express');

// Para iniciar el servidor, sólo tenemos que llamar a la función express(), por eso creamos una variable de la llamada a la función
var app = express();


//con esto indicamos donde estan los ficheros estaticos
app.use(express.static(__dirname + '/'));


// o nos puede devolver un fichero con sendFile() , __dirname es un objeto global de Node que te da la ruta a tu directorio raíz actual. es útil cuando queremos evitar escribir rutas dinámicas o largas.
app.get("/html", function (req, res) {
  res.sendFile(__dirname + '/sendFile.html');
});

//al hacer un post nos puede responder un testo o nos puede devolver un html tambien
app.post("/resPost", function (req, res) {
  // res.send("Soy la respuesta de un form");
  res.sendFile(__dirname + '/resPost.html');
});

// Usamos el método app.listen para escuchar por el puerto. Este método necesita dos argumentos: un puerto y una función callback (de respuesta) que indica qué hacer una vez que el servidor esté funcionando.
app.listen(3000, function () {
  console.log('Server is listening on port 3000!!');
});