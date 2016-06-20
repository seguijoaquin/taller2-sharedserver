var express = require('express');
var router = express.Router();
var Constants = require('../constants/constants.js');
var cb_handler = require('../handlers/cb_handler.js');
var db_handler = require('../handlers/db_handler.js');


function validarUsuario(req) {
  var u = req.body.user;
  //TODO: Validar formato de campo sex
  return (u.name && u.email && u.alias && u.sex && u.age && u.location.longitude && u.location.latitude);
}

function sendError(err,res,status) {
  console.log(err);
  return res.json({succes: false, error: err}).status(status).end();
}

//Listar usuarios
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
    return sendError(Constants.ERROR_MSG_INVALID_USER,res,500);
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
    return sendError(Constants.ERROR_MSG_INVALID_USER,res,500);
  }
});

//Actualiza foto de perfil
router.put('/[0-9]+/photo',function(req, res) {
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
