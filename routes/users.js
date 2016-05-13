var express = require('express');
var router = express.Router();
var pg = require('pg');
var Constants = require('../constants/constants.js');
var json_handler = require('../handlers/json_handler.js');
var cb_handler = require('../handlers/cb_handler.js');
var db_handler = require('../handlers/db_handler.js');

var urlDB = Constants.POSTGRE_URL_DB;

pg.defaults.ssl = true;

function validarUsuario(req) {
  var u = req.body.user;
  if (u.name && u.email && u.alias && u.sex && u.location.longitude && u.location.latitude ) {
    if (u.sex == 'F' || u.sex == 'M') {
      return true;
    }
  }
  return false;
}

/* GET users listing. */
router.get('/', function(req, res) {
  var my_cb_handler = cb_handler(req, res, null, db_handler.getUsers);
  db_handler.atenderQuery(req,res,my_cb_handler);
});

//Alta de usuario
router.post('/',function(req, res) {
  if (validarUsuario(req)) {
    var my_cb_handler = cb_handler(req, res,null, db_handler.addUser);
    db_handler.atenderQuery(req,res,my_cb_handler);
  } else {
    console.log(Constants.ERROR_MSG_INVALID_USER);
    res.status(418).json({error: "Invalid user"}); //TODO: DEVOLVER INVALID USER
  }
});

//Consulta perfil de usuario
router.get('/[0-9]+',function(req, res) {
  var usrID = req.url.substring(1); //Substring después de la primer '/'
  var my_cb_handler = cb_handler(req,res,usrID,db_handler.getUser);
  db_handler.atenderQuery(req,res,my_cb_handler);
});

//Modifica el perfil de un usuario
router.put('/[0-9]+',function(req, res) {
  var usrID = req.url.substring(1); //Substring después de la primer '/'
  if (validarUsuario(req)) {
    var my_cb_handler = cb_handler(req, res, usrID, db_handler.modifyUser);
    db_handler.atenderQuery(req,res,my_cb_handler);
  } else {
    console.log(Constants.ERROR_MSG_INVALID_USER);
    res.status(418).json({error: "Invalid user"}); //TODO: DEVOLVER INVALID USER
  }
});

/*Actualiza foto de perfil
Parametros recibidos:
{
"photo": “base_64”
}
*/
router.get('/[0-9]+/photo',function(req, res) {
  var usrID = req.url.match('[0-9]+');
  usrID = usrID[0];
  var my_cb_handler = cb_handler(req,res,usrID,db_handler.updatePhoto);
  db_handler.atenderQuery(req,res,my_cb_handler);
});

//Baja de usuario.
router.delete('/[0-9]+',function(req, res) {
  //TODO: Chequear si existe el usuario??
  var usrID = req.url.substring(1); //Substring después de la primer '/'
  var my_cb_handler = cb_handler(req, res, usrID, db_handler.deleteUser);
  db_handler.atenderQuery(req,res,my_cb_handler);
});

module.exports = router;
