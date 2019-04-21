const fs = require('fs'); 

const instructionsFlow = (req, res) => {

  const renderPersonHasNoInstructions = () => {
    res.render('instructions',{
      response: 'El usuario no existe', 
      show: false,
    })
  };

  const renderCongratsMsg = () => {
    res.render('instructions',{
      response: 'Enhorabuena! Has llegado a casa sano y salvo!', 
      show: false,
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
      show: true,
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
    fs.writeFile(__dirname + '/../../data/users-and-directions.json', JSON.stringify(db), function (error){
      
      console.log('error',error)
    });
  }


  // TODO: Estamos asumiendo que toda persona que existe en la bbdd tiene instrucciones
  fs.readFile(__dirname + '/../../data/users-and-directions.json', function (error, file) {  
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


module.exports = {
  instructionsFlow
};