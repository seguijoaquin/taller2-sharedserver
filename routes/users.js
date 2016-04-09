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

router.get('/[0-9]+',function(req, res, next) {
  //Responde con el json del usuario
});

router.put('/[0-9]+',function(req, res, next) {
  res.sendStatus(200);
});

router.put('/[0-9]+/photo',function(req, res, next) {
  res.sendStatus(200);
});

router.delete('/[0-9]+',function(req, res, next) {
  res.sendStatus(200);
});

module.exports = router;
