var express = require('express');
var router = express.Router();
var pg = require('pg');
pg.defaults.ssl = true;

var Constants = require('./constants.js');

//var urlDB = process.env.DATABASE_URL;
var urlDB = Constants.POSTGRE_URL_DB;

function query(text, values, cb) {
  //Me conecto a la base de datos postgre esto se repite en todos
  pg.connect( urlDB , function(err, client, done) {
    if(err){
      return handlePgConnectError(err,res,done);
    }
    //Realizo la consulta en text con los parametros values
    client.query(text, values, function(err, result) {
      done();
      if (err) {
        handleQueryError(err,res);
      } else {
        //funcion que se ejecuta si la consulta sale bien
        cb(err, result);
      }
    })
  });
}

function handleQueryError(err,res){
  //La tabla no existe.
  if (err.code == Constants.CODE_TABLA_INEXISTENTE){
    console.log(Constants.ERROR_MSG_DB_TABLA_INEXISTENTE);
    res.status(400);
    res.end();
  }
};


function handlePgConnectError(err,res,done){
  done(); //Devuelvo el cliente al pool
  console.log(Constants.ERROR_MSG_PG_CONNECT);
  console.log(err);
  return res.sendStatus(500);
};

//Listado de usuarios
/* GET users listing. */
router.get(Constants.DIR_LISTADO_USUARIOS, function(req, res, next) {
  // Get a Postgres client from the connection pool
  query(Constants.QUERY_LISTADO_USUARIOS,null,
    function(err, result) {
      query.on('end', function(result) {
        //fired once and only once, after the last row has been returned and after all 'row' events are emitted
        //in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
        var jsonObject = { "users" : [] , metadata : { version : Constants.METADATA_VERSION , count : result.rowCount}}
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
        return res.json(jsonObject);
      })
    }
  );
});

//Alta de usuario
// El objeto json viene con id null, se le asigna id al hacer insert
// obteniendo el nro con su primal key
//Devuelve http 201
router.post(Constants.DIR_ALTA_USUARIOS,function(req, res, next) {
  //TODO: Necesito chequear que la tabla de usuarios esta creada
  //TODO: Necesito chequear si ya existe el usuario a traves del mail

  query(Constants.QUERY_ALTA_USUARIO, [req.body.user.name,req.body.user.email,req.body.user.alias,req.body.user.location.latitude, req.body.user.location.longitude],
    function(err,result){
      var jsonObject = { user : req.body.user, metadata : Constants.METADATA_VERSION};
      res.status(201).json(jsonObject);
      res.end();
      }
  );
});

//Consulta perfil de usuario
//Recibe el id del usuario por url, parsea y busca
//Devuelve un json con el usr
router.get(Constants.DIR_CONSULTA_PERFIL_USUARIO,function(req, res, next) {
  //Obtengo usr ID desde url
  var usrID = req.url.substring(1); //Substring después de la primer '/'

  query(Constants.QUERY_CONSULTA_PERFIL_USUARIO,[usrID],
    function(err,result){
      //Chequeo que la query devuelva un usuario
      //En caso de que haya varios, devuelve el primero
      if (result.rowCount) {
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
        return res.json(jsonObject);
      } else {
        res.sendStatus(404); //User not found
      }
    }
  );
});

//Modifica el perfil de un usuario
//Recibe un json con un usuario
router.put(Constants.DIR_MODIFICACION_PERFIL_USUARIOS,function(req, res, next) {
  //Obtengo usr ID desde url
  var usrID = req.url.substring(1); //Substring después de la primer '/'
  // Get a Postgres client from the connection pool
  if (req.body.user.id == usrID) {
    query(Constants.QUERY_MODIFICACION_PERFIL_USUARIO,
      [req.body.user.name, req.body.user.email, req.body.user.alias,
        req.body.user.location.latitude, req.body.user.location.longitude, usrID],
        function(err, result) {
          res.sendStatus(200);
        });
  } else {
    res.sendStatus(418); // TODO: NO COINCIDE EL ID
  }
});

router.put(Constants.DIR_ACTUALIZA_FOTO_PERFIL,function(req, res, next) {
  res.sendStatus(200);
});

//Baja de usuario.
//Recibe el id por url, lo parsea, busca el usuario y borra
router.delete(Constants.DIR_BAJA_DE_USUARIOS,function(req, res, next) {
  //TODO: Chequear si existe el usuario??
  //Obtengo usr ID desde url
  var usrID = req.url.substring(1); //Substring después de la primer '/'
  // Get a Postgres client from the connection pool
  query(Constants.QUERY_BAJA_DE_USUARIO, [usrID],
    function(err, result) {
      // TODO: verificar si se elimino el usuario o no.
      res.sendStatus(200);
    });
  });

module.exports = router;
