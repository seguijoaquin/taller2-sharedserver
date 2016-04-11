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
    client.query("INSERT INTO users (data) values($1)",[req.body.user],function(err, result) {
      done(); //Devuelvo el cliente al pool xq no necesito más la conexion
      if (err) {
        console.log(err);
      } else {
        req.body.user.id = result.rows[0].id;
        res.sendStatus(201);
      }
    });
  });
});

//Consulta perfil de usuario
//Recibe el id del usuario por url, parsea y busca
//Devuelve un json con el usr
router.get('/[0-9]+',function(req, res, next) {
  //Obtengo usr ID desde url
  var usrID = req.url.substring(1); //Substring después de la primer '/'
  // Get a Postgres client from the connection pool
  pg.connect(urlDB, function(err, client, done) {
    if(err) {
      done(); //Devuelvo el cliente al pool
      console.log(err);
      return res.sendStatus(500);
    }
    client.query("SELECT * FROM users WHERE id = ($1)",[usrID],function(err, result) {
      done(); //Devuelvo el cliente al pool xq no necesito más la conexion
      if (err) {
        console.log(err);
      } else {
        //Chequeo que la query devuelva un usuario
        //En caso de que haya varios, devuelve el primero
        if (result.rowCount) {
          return res.json(result.rows[0].data);
        } else {
          res.sendStatus(418);
        }
      }
    });
  });
});

//Modifica el perfil de un usuario
//Recibe un json con un usuario
router.put('/[0-9]+',function(req, res, next) {
  //Obtengo usr ID desde url
  var usrID = req.url.substring(1); //Substring después de la primer '/'
  // Get a Postgres client from the connection pool
  pg.connect(urlDB, function(err, client, done) {
    if(err) {
      done(); //Devuelvo el cliente al pool
      console.log(err);
      return res.sendStatus(500);
    }
    client.query("UPDATE users SET data = ($1) WHERE id = ($2)", [req.body.user, usrID],function(err, result) {
      done(); //Devuelvo el cliente al pool xq no necesito más la conexion
      if (err) {
        console.log(err);
      } else {
        //Chequeo que la query devuelva un usuario
        //En caso de que haya varios, devuelve el primero
        if (result.rowCount) {
          res.sendStatus(200);
        } else {
          res.sendStatus(418);
        }
      }
    });
  });
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
  //TODO: Chequear si existe el usuario??
  //Obtengo usr ID desde url
  var usrID = req.url.substring(1); //Substring después de la primer '/'
  // Get a Postgres client from the connection pool
  pg.connect(urlDB, function(err, client, done) {
    if(err) {
      done(); //Devuelvo el cliente al pool
      console.log(err);
      return res.sendStatus(500);
    }
    client.query("DELETE FROM users WHERE id = ($1)", [usrID],function(err, result) {
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
