var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  //Leer la base de datos y devolver todo
});

//Alta de usuario
router.post('/',function(req, res, next) {
  //Agrego el json a la base de datos
  res.sendStatus(201);
});
module.exports = router;
