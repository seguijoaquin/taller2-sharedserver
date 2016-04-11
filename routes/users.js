var express = require('express');
var router = express.Router();
var pg = require('pg');

var urlDB = process.env.DATABASE_URL;
pg.defaults.ssl = true;

/* GET users listing. */
router.get('/', function(req, res, next) {
  // Get a Postgres client from the connection pool
  pg.connect(urlDB, function(err, client, done) {
    if(err) {
      done(); //Devuelvo el cliente al pool
      console.log(err);
      return res.sendStatus(500);
    }
    var query = client.query("SELECT * FROM users",function(err, result) {
      done(); //Devuelvo el cliente al pool xq no necesito más la conexion
      if (err) {
        console.log(err);
      } else {
        //var rows = [];
        query.on('row', function(row,result) {
          //fired once for each row returned
          result.addRow(row);
        });
        query.on('end', function(resultado) {
          //fired once and only once, after the last row has been returned and after all 'row' events are emitted
          //in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
          console.log(result.rowCount + ' users were received');
          //TODO: DEVOLVER EL USER COUNT EN EL CAMPO DE METADATA
          var jsonObject = { "users" : [] , metadata : { version : 0.1 , count : result.rowCount}}
          jsonObject.users.push(resultado);
          return res.json(jsonObject);
          //return res.json({users : rows, metadata : { version : 0.1 , count : result.rowCount}});
        })
      }
    });
  });
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
      if (err) {
        console.log(err);
      } else {
        req.body.user.id = result.rows[0].id;
        client.query("UPDATE users SET data = ($1) WHERE id = ($2)", [req.body.user, req.body.user.id],function(err, result) {
          done(); //Devuelvo el cliente al pool xq no necesito más la conexion
          if (err) {
            console.log(err);
          } else {
            res.sendStatus(201);
          }
        });
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
          res.sendStatus(404); //User not found
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
  if (req.body.user.id == usrID) {
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
  } else {
    res.sendStatus(418); // TODO: NO COINCIDE EL ID
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
