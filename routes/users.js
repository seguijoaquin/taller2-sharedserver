var express = require('express');
var router = express.Router();
var pg = require('pg');
var Constants = require('../constants/constants.js');
var json_handler = require('../handlers/json_handler.js');
var cb_handler = require('../handlers/cb_handler.js');
var db_handler = require('../handlers/db_handler.js');

var urlDB = Constants.POSTGRE_URL_DB;

pg.defaults.ssl = true;

function validarUsuario(req,res) {
  if (req.body.user.name && req.body.user.email && req.body.user.alias && req.body.user.location.latitude && req.body.user.location.longitude) {
    return true;
  } else {
    console.log(Constants.ERROR_MSG_INVALID_USER);
    res.sendStatus(418); //TODO: DEVOLVER INVALID USER
    res.end();
    return false;
  }
}

/* GET users listing. */
router.get('/', function(req, res) {
  var my_cb_handler = cb_handler(req, res, db_handler.getUsers);
  db_handler.atenderQuery(req,res,my_cb_handler);
});

//Alta de usuario
router.post('/',function(req, res) {
  //TODO: Necesito chequear que la tabla de usuarios esta creada
  //TODO: Necesito chequear si ya existe el usuario a traves del mail
  if (validarUsuario(req, res)) {
    pg.connect(urlDB, function(err, client, done) {
      capturarErrorConnect(err,res,done);
      client.query(Constants.QUERY_ALTA_USUARIO,
      [req.body.user.name,req.body.user.email,req.body.user.alias,req.body.user.location.latitude,req.body.user.location.longitude],function(err, result) {
        done(); //Devuelvo el cliente al pool xq no necesito más la conexion
        if (err) {
          console.log(err);
        } else {
          var jsonObject = json_handler.armarJsonUsuarioNuevo(req);
          res.status(201).json(jsonObject);
          res.end();
        }
      });
    });
  }
});

//Consulta perfil de usuario
//Recibe el id del usuario por url, parsea y busca
//Devuelve un json con el usr
router.get('/[0-9]+',function(req, res) {
  var usrID = req.url.substring(1); //Substring después de la primer '/'
  pg.connect(urlDB, function(err, client, done) {
    capturarErrorConnect(err,res,done);
    client.query(Constants.QUERY_CONSULTA_PERFIL_USUARIO,[usrID],function(err, result) {
      done(); //Devuelvo el cliente al pool xq no necesito más la conexion
      if (err) {
        console.log(err);
      } else {
        if (result.rowCount) {
          var jsonObject = json_handler.armarJsonUsuarioConsultado(result,usrID);
          return res.json(jsonObject);
        } else {
          res.sendStatus(404); //User not found
          res.end();
        }
      }
    });
  });
});

//Modifica el perfil de un usuario
//Recibe un json con un usuario
router.put('/[0-9]+',function(req, res) {
  var usrID = req.url.substring(1); //Substring después de la primer '/'
  if (req.body.user.id == usrID) {
    pg.connect(urlDB, function(err, client, done) {
      capturarErrorConnect(err,res,done);
      client.query(Constants.QUERY_MODIFICACION_PERFIL_USUARIO,
      [req.body.user.name, req.body.user.email, req.body.user.alias, req.body.user.location.latitude, req.body.user.location.longitude, usrID],
      queryExitosa (err, result, res, done));
    });
  } else {
    res.sendStatus(418); // TODO: NO COINCIDE EL ID
    res.end();
  }
});

/*Actualiza foto de perfil
Parametros recibidos:
{
"photo": “base_64”
}
*/
router.put('/[0-9]+/photo',function(req, res) {
  res.sendStatus(200);
  res.end();
});

//Baja de usuario.
//Recibe el id por url, lo parsea, busca el usuario y borra
router.delete('/[0-9]+',function(req, res) {
  //TODO: Chequear si existe el usuario??
  var usrID = req.url.substring(1); //Substring después de la primer '/'
  pg.connect(urlDB, function(err, client, done) {
    capturarErrorConnect(err,res,done);
    client.query(Constants.QUERY_BAJA_DE_USUARIO, [usrID], queryExitosa(err, result, res, done));
  });
});

module.exports = router;
