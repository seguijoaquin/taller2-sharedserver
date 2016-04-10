var express = require('express');
var router = express.Router();
var pg = require('pg');

var urlDB = process.env.DATABASE_URL;
pg.defaults.ssl = true;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  //Leer la base de datos y devolver todo
});

//Alta de usuario
//Recibe objeto json y agrega
//Devuelve http 201
router.post('/',function(req, res, next) {
  //TODO: Necesito chequear si ya existe el usuario a traves del mail

});

//Consulta perfil de usuario
//Recibe el id del usuario por url, parsea y busca
//Devuelve un json con el usr
router.get('/[0-9]+',function(req, res, next) {
  //Responde con el json del usuario
});

//Modifica el perfil de un usuario
//Recibe un json con un usuario
router.put('/[0-9]+',function(req, res, next) {
  res.sendStatus(200);
});

/*Actualiza foto de perfil
Parametros recibidos:
{
"photo": “base_64”
}
*/
router.put('/[0-9]+/photo',function(req, res, next) {
  res.sendStatus(200);
});

//Baja de usuario.
//Recibe el id por url, lo parsea, busca el usuario y borra
router.delete('/[0-9]+',function(req, res, next) {
  //TODO: Chequear si existe el usuario

});


router.post('/profile', function (req, res, next) {
  res.send('profile');
  console.log(req.body);
  res.json(req.body);
});

module.exports = router;
