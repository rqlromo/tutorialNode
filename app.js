import { log } from "util";

//necesitamos incluir la dependencia de express para poder usar sus métodos. En NodeJs, cuando quieres acceder a las funcionalidades de una librería o módulo de otro archivo, tienes que requerirlo.
var express = require('express');

// Para iniciar el servidor, sólo tenemos que llamar a la función express(), por eso creamos una variable de la llamada a la función
var app = express();

//con esto indicamos donde estan los ficheros estaticos
app.use(express.static(__dirname + '/'));

// Por defecto el boilerplate de Express utiliza Jade, nosotros queremos utilizar ejs en su lugar por lo que tendremos que setear view engine, el motor de plantilla que se utiliza ejs, los archivos de ejs tendran que estar en la carpeta views
app.set('view engine', 'ejs');

// Para poder acceder al body y recuperar los datos ntroducidos en un formulario hay que instalar body_parser, los datos del formulario los encontraremos en el body con la clave name que hayamos indicado
var body_parser = require('body-parser');
app.use(body_parser.urlencoded({extended:true}));

// sirve para escribir en un fichero almacenado en el disco duro de mi ordenador
var fs = require('fs'); 

// form page 
app.get("/", function (req, res) {
  res.render('mainPage')
});


app.post("/userData", function (req, res) {

  const renderPersonHasNoInstructions = () => {
    res.render('instructions',{
      response: 'El usuario no existe', 
      direction: '',
    })
  };

  const renderCongratsMsg = () => {
    res.render('instructions',{
      response: 'Enhorabuena! Has llegado a casa sano y salvo!', 
      direction: '',
    })
  };

  // if(givenUserHasData) {
  //   console.log('recoveredDirections.dones[req.body.name]',recoveredDirections.dones[req.body.name])

  //   response = req.body.name;
  //   direction = recoveredDirections.dones[req.body.name];

  //   recoveredDirections.dones[req.body.name].push('vete a la playa');

  //   console.log('recoveredDirections',recoveredDirections)
  // } else {
  //   response = req.body.name;
  //   direction = 'Debes ' + users.directions[req.body.name][0];

  //   const stepsDone = {
  //     dones:{},
  //   };
  //   var array = [];
  //   array.push(users.directions[req.body.name][0]);
  //   stepsDone.dones[req.body.name] = array;

  //   fs.writeFile(__dirname + '/data/continue-steps.json', JSON.stringify(stepsDone), function (error) {     console.log(error)
  //   });
  // }

  const recoverCurrentInstruction = personData => {
    return personData.instructions[personData.currentInstruction];
  };

  const updateCurrentInstruction = personData => {
    personData.currentInstruction += 1;

    return personData;
  }

  // const recoveredDirections = JSON.parse(file);
  // const givenUserHasData = recoveredDirections.dones[req.body.name] === undefined;

  const renderInstruction = (currentInstruction, personName) => {
    res.render('instructions', {
      response: 'Yo te ayudare a llegar a casa ' + personName, 
      direction: currentInstruction,
    });
  }

  const giveInstruction = (personData, personName) => {
    const currentInstruction = recoverCurrentInstruction(personData);
    renderInstruction(currentInstruction, personName);
  }

  const updatePeopleData = (peopleData, personData, personName) => {
    peopleData[personName] = personData;
    
    return peopleData;
  }

  // TODO: Estamos asumiendo que toda persona que existe en la bbdd tiene instrucciones
  fs.readFile(__dirname + '/data/users-and-directions.json', function (error, file) {  
    let peopleData = JSON.parse(file);
    let personData = peopleData[req.body.name];
    const personHasInstructions = personData !== undefined;
    const personHasArrivedHome = (personData.instructions.length - 1) === personData.currentInstruction;

    console.log('personData',personData);
    console.log('personHasInstructions',personHasInstructions);

    if (personHasInstructions) {
      if (personHasArrivedHome) {
        renderCongratsMsg();
      } else {
        giveInstruction(personData, req.body.name);
        personData = updateCurrentInstruction(personData);
        peopleData = updatePeopleData(peopleData, personData, req.body.name);
        updatePeopleDataInDB(peopleData);
      }
    } else {
      renderPersonHasNoInstructions();
    }
  });

});


// Usamos el método app.listen para escuchar por el puerto. Este método necesita dos argumentos: un puerto y una función callback (de respuesta) que indica qué hacer una vez que el servidor esté funcionando.
app.listen(3000, function () {
  console.log('Server is listening on port 3000!!');
});
