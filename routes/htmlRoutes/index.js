const path = require('path');
const router = require('express').Router();

  // the / indicated the root route of the server
  router.get('/', (req, res) => {
    //we are displaying an HTML page in browswer so we use send instead of json path is finding the correnct locateion for html code
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });
  
  //routes with api deal with transference of JSON data, those without api endpoint serve and HTML page like here
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
  });

  router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'))
  });
  
  //* acts as a wildcard. Any route not previously defined will receive the homepage as the response. this route should always come last!!!!!
  router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

  module.exports = router;
  