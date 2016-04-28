var express = require('express');
var router = express.Router();
var pg = require('pg');
var Constants = require('../constants.js');

var urlDB = Constants.POSTGRE_URL_DB;

pg.defaults.ssl = true;

function capturarErrorConnect(err, res, done) {
  if(err) {
    done(); //Ante error de connect, devuelvo el client al pool
    console.log(err);
    return res.sendStatus(500); //Error de conexion
  }
}

function armarJsonListaUsuarios(result) {
  var jsonObject = { "users" : [] , metadata : { version : 0.1 , count : result.rowCount}}
  for (var i = 0; i < result.rowCount; i++) {
    var oneUser = {
      user : {
        name : result.rows[i].name,
        alias : result.rows[i].alias,
        email : result.rows[i].mail,
        location : {
          latitude : result.rows[i].latitude,
          longitude : result.rows[i].longitude
        }
      }
    }
    jsonObject.users.push(oneUser);
  }
  return jsonObject;
}

function armarJsonUsuarioNuevo (req) {
  var respuesta = { user : req.body.user, metadata : Constants.METADATA_VERSION}
  return respuesta;
}

function armarJsonUsuarioConsultado (result, usrID) {
  var jsonObject = {
    user : {
      id : usrID,
      name : result.rows[0].name,
      alias : result.rows[0].alias,
      email : result.rows[0].mail,
      location : {
        latitude : result.rows[0].latitude,
        longitude : result.rows[0].longitude
      }
    },
    metadata : {
      version : Constants.METADATA_VERSION
    }
  }
  return jsonObject;
}

function queryExitosa (err, result, res, done) {
  done(); //Devuelvo el cliente al pool xq no necesito más la conexion
  if (err) {
    console.log(err);
  } else {
    res.sendStatus(200);
  }
}

function validarUsuario(req,res) {
  if (req.body.user.name && req.body.user.email && req.body.user.alias && req.body.user.location.latitude && req.body.user.location.longitude) {
    return true;
  } else {
    console.log(Constants.ERROR_MSG_INVALID_USER);
    return false;
  }
}


/* GET users listing. */
router.get('/', function(req, res, next) {
  // Get a Postgres client from the connection pool
  pg.connect(urlDB, function(err, client, done) {
    capturarErrorConnect(err,res,done);
    var query = client.query(Constants.QUERY_LISTADO_USUARIOS,function(err, result) {
      done(); //Devuelvo el cliente al pool xq no necesito más la conexion
      if (err) {
        console.log(err);
      } else {
        query.on('row', function(row,result) {result.addRow(row);});
        query.on('end', function(result) {
          var respuesta = armarJsonListaUsuarios(result);
          return res.json(respuesta);
        })
      }
    });
  });
});

//Alta de usuario
router.post('/',function(req, res, next) {
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
          var jsonObject = armarJsonUsuarioNuevo(req);
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
router.get('/[0-9]+',function(req, res, next) {
  var usrID = req.url.substring(1); //Substring después de la primer '/'
  pg.connect(urlDB, function(err, client, done) {
    capturarErrorConnect(err,res,done);
    client.query(Constants.QUERY_CONSULTA_PERFIL_USUARIO,[usrID],function(err, result) {
      done(); //Devuelvo el cliente al pool xq no necesito más la conexion
      if (err) {
        console.log(err);
      } else {
        if (result.rowCount) {
          var jsonObject = armarJsonUsuarioConsultado(result,usrID);
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
router.put('/[0-9]+',function(req, res, next) {
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
router.put('/[0-9]+/photo',function(req, res, next) {
  res.sendStatus(200);
  res.end();
});

//Baja de usuario.
//Recibe el id por url, lo parsea, busca el usuario y borra
router.delete('/[0-9]+',function(req, res, next) {
  //TODO: Chequear si existe el usuario??
  var usrID = req.url.substring(1); //Substring después de la primer '/'
  pg.connect(urlDB, function(err, client, done) {
    capturarErrorConnect(err,res,done);
    client.query(Constants.QUERY_BAJA_DE_USUARIO, [usrID], queryExitosa(err, result, res, done));
  });
});

module.exports = router;
