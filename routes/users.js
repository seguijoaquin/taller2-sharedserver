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
// El objeto json viene con id null, se le asigna id al hacer insert
// obteniendo el nro con su primal key
//Devuelve http 201
router.post('/',function(req, res, next) {
  //TODO: Necesito chequear que la tabla de usuarios esta creada
  //TODO: Necesito chequear si ya existe el usuario a traves del mail
  pg.connect(urlDB, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.sendStatus(500);
    }
    client.query("INSERT INTO users (data) values($1) RETURNING id",[req.body.user],function(err, result) {
      done(); //Devuelvo el cliente al pool xq no necesito más la conexion
      if (err) {
        console.log(err);
      } else {
        req.body.user.id = result.rows[0].id;
        console.log(req.body.user);
        res.status(201).json(req.body.user);
      }
    });
  });
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

  //Obtengo usr ID desde url
  var usrID = req.url.substring(1);
  // Get a Postgres client from the connection pool
  pg.connect(urlDB, function(err, client, done) {
    if(err) {
      done(); //Devuelvo el cliente al pool
      console.log(err);
      return res.sendStatus(500);
    }
    client.query("DELETE FROM users WHERE id=($1)", [id],function(err, result) {
      done(); //Call done() to get the client back to the pool
      if (err) {
        console.log(err);
      } else {
        res.sendStatus(200);
      }
    });
  });
});

module.exports = router;
