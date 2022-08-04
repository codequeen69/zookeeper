const fs = require('fs');
const path = require('path');
const express = require('express');
const {animals} = require('./data/animals.json')

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

function filterByQuery(query, animalsArray){
    let personalityTraitsArray = [];

    //note we save the animalsArray as filertedResults here:
    let filteredResults = animalsArray;

    if(query.personalityTraits){
        //save personality traits as a dedicated array
        //if personalityTraits is a string, place it into a new array and save
        if(typeof query.personalityTraits === 'string'){
            personalityTraitsArray = [query.personalityTraits];
        }else{
            personalityTraitsArray = query.personalityTraits;
        }
        //loop through each trait in the personalityTraits array;
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one 
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
      );

        });
    }

    if(query.diet){
        filteredResults = filteredResults.filter(animal => animal.diet ===query.diet);
    }
    if(query.species){
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if(query.name){
        filteredResults = filteredResults.filter(animal => animal.name ===query.name);
    }
    return filteredResults;
}
function findById(id, animalsArray){
const result = animalsArray.filter(animal => animal.id === id)[0];
return result;
}

function createNewAnimal(body, animalsArray){
    const animal = body;
    animalsArray.push(animal);
    //the synchronous version of write file that doesn' require a callback bc this is a small data set
    fs.writeFileSync(
        //path.join joins the data sub directory where animals.json resides with the directory of the file where we execite the code in __dirname
        path.join(__dirname, './data/animals.json'),
        //stringify saves the data ,null and 2 format the data so it's readable
        JSON.stringify({ animals: animalsArray }, null, 2)
      );
    
    //return finished code to post route for response
    return animal;
};

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
  }
  

//add the route get() requires two arguments res.send() sends the hello string to our clinet
app.get('/api/animals', (req, res) => {
    let results = animals;
   if (req.query){
       results = filterByQuery(req.query, results);
   }
    res.json(results);
});
//param route must come after the other GET route!!
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if(result){
    res.json(result);
    }else{
        res.send(404);
    }
});

app.post('/api/animals', (req, res) =>{
    
    //set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
    
    // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});
// the / indicated the root route of the server
app.get('/', (req, res) => {
  //we are displaying an HTML page in browswer so we use send instead of json path is finding the correnct locateion for html code
  res.sendFile(path.join(__dirname, './public/index.html'));
});
//routes with api deal with transference of JSON data, those without api endpoint serve and HTML page like here
app.get('/animals', (req, res) =>{
  res.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, './public/zookeepers.html'))
});

//* acts as a wildcard. Any route not previously defined will receive the homepage as the response. this route should always come last!!!!!
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//makes the server listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});