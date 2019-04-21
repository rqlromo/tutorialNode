
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


app.get("/", function (req, res) {
  res.render('mainPage')
});

const instructionsFlow = (req, res) => {

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

  const recoverCurrentInstruction = personData => {
    return personData.instructions[personData.currentInstruction];
  };

  const updateCurrentInstruction = personData => {
    personData.currentInstruction += 1;

    return personData;
  }

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

  const updatePeopleDataInDb = (db, personData, personName) => {
    db.peopleData[personName] = personData;
    
    return db;
  }

  const updateDb = db => {
    fs.writeFile(__dirname + '/data/users-and-directions.json', JSON.stringify(db), function (error){
      
      console.log('error',error)
    });
  }


  // TODO: Estamos asumiendo que toda persona que existe en la bbdd tiene instrucciones
  fs.readFile(__dirname + '/data/users-and-directions.json', function (error, file) {  
    let db = JSON.parse(file);
    let personData = db.peopleData[db.currentPerson];
    const personHasInstructions = personData !== undefined;

    if (personHasInstructions) {
    const personHasArrivedHome = (personData.instructions.length) === personData.currentInstruction;

      if (personHasArrivedHome) {
        renderCongratsMsg();
      } else {
        giveInstruction(personData, db.currentPerson);
        personData = updateCurrentInstruction(personData);
        db = updatePeopleDataInDb(db, personData, db.currentPerson);
        updateDb(db);
      }
    } else {
      renderPersonHasNoInstructions();
    }
  });
}


app.post("/give-instructions", instructionsFlow);

app.post("/select-person", function(req, res){

  const updatePersonSelected = (db, personName) => {
    db.currentPerson = personName;
    
    return db;
  }

  const updateDbAndRunInstructionsFlow = (db, req, res) => {
    fs.writeFile(__dirname + '/data/users-and-directions.json', JSON.stringify(db), function (error){
      instructionsFlow(req, res);
      if (error) {
        console.log('error',error);
      }
    });
  }
  
  fs.readFile(__dirname + '/data/users-and-directions.json', function (error, file) {  
    let db = JSON.parse(file);
    db = updatePersonSelected(db, req.body.name);
    updateDbAndRunInstructionsFlow(db, req, res);
  });

});


// Usamos el método app.listen para escuchar por el puerto. Este método necesita dos argumentos: un puerto y una función callback (de respuesta) que indica qué hacer una vez que el servidor esté funcionando.
app.listen(3000, function () {
  console.log('Server is listening on port 3000!!');
});
