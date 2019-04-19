//necesitamos incluir la dependencia de express para poder usar sus métodos. En NodeJs, cuando quieres acceder a las funcionalidades de una librería o módulo de otro archivo, tienes que requerirlo.
var express = require('express');

// Para iniciar el servidor, sólo tenemos que llamar a la función express(), por eso creamos una variable de la llamada a la función
var app = express();


//con esto indicamos donde estan los ficheros estaticos
app.use(express.static(__dirname + '/'));


// Por defecto el boilerplate de Express utiliza Jade, nosotros queremos utilizar ejs en su lugar por lo que tendremos que setear view engine, el motor de plantilla que se utiliza ejs, los archivos de ejs tendran que estar en la carpeta views
app.set('view engine', 'ejs');


// utilizamos render para visualizar el fichero ejs que deseemos
app.get("/htmlDinamic", function (req, res) {
  res.render('htmlDinamic', {name: 'Colega'})
});


// Usamos el método app.listen para escuchar por el puerto. Este método necesita dos argumentos: un puerto y una función callback (de respuesta) que indica qué hacer una vez que el servidor esté funcionando.
app.listen(3000, function () {
  console.log('Server is listening on port 3000!!');
});






// // use res.render to load up an ejs view file

// // index page 
// app.get("/", function (req, res) {
//   res.render('main')
// });

// // otro page 
// app.get('/otro', function(req, res) {
//   res.render('otro', {name: 'raquel'});
// });