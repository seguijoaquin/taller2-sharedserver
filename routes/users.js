var express = require('express');
var router = express.Router();
var pg = require('pg');

//var urlDB = process.env.DATABASE_URL;
var urlDB = "postgres://tqezweoinbznuw:8DX2r1Jt6SuzmPlqyRoEUwSQKr@ec2-54-221-249-201.compute-1.amazonaws.com:5432/d1h0hefo2t4jcr"
pg.defaults.ssl = true;



function handleQueryError(err,res){
  //La tabla no existe.
  if (err.code == '42P01'){
    console.log("[ERROR: La tabla consultada es inexistente.]");
    res.status(400);
    res.end();
  }


};


function handlePgConnectError(err,res,done){
    done(); //Devuelvo el cliente al pool
    console.log("[ERROR: No se pudo realizar la conexion a la base de datos]");
    console.log(err);
    return res.sendStatus(500);
}







/* GET users listing. */
router.get('/', function(req, res, next) {
  // Get a Postgres client from the connection pool
  pg.connect(urlDB, function(err, client, done) {

    if(err){
      return handlePgConnectError(err,res,done);
    }

    var query = client.query("SELECT * FROM usuarios",function(err, result) {
      done(); //Devuelvo el cliente al pool xq no necesito más la conexion
      if (err) {
        handleQueryError(err,res);
      } else {
        query.on('row', function(row,result) {
          //fired once for each row returned
          result.addRow(row);
        });
        query.on('end', function(result) {
          //fired once and only once, after the last row has been returned and after all 'row' events are emitted
          //in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
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
          return res.json(jsonObject);
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
    //Si no se pudo conectar a la base de datos manda error
    if(err){
      return handlePgConnectError(err,res,done);
    }

    //client.query("CREATE TABLE IF NOT EXISTS usuarios (id SERIAL PRIMARY KEY, name VARCHAR(40), mail VARCHAR(40), alias VARCHAR(40), latitude REAL, longitude REAL)");
    client.query("INSERT INTO usuarios (name,mail,alias,latitude,longitude) values($1,$2,$3,$4,$5) RETURNING id",
    [req.body.user.name,req.body.user.email,req.body.user.alias,req.body.user.location.latitude,req.body.user.location.longitude],function(err, result) {
      done(); //Devuelvo el cliente al pool xq no necesito más la conexion

      if (err) {
        handleQueryError(err,res);

      } else {
        var jsonObject = { user : req.body.user, metadata : 1.0}
        res.status(201).json(jsonObject);
        res.end();
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

    if(err){
      return handlePgConectError(err,res,done);
    }

    client.query("SELECT * FROM usuarios WHERE id = ($1)",[usrID],function(err, result) {
      done(); //Devuelvo el cliente al pool xq no necesito más la conexion
      if (err) {
        handleQueryError(err,res);
      } else {
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
              version : 1.0
            }
          }
          return res.json(jsonObject);
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

      if(err){
        return handlePgConnectError(err,res,done);
      }

      client.query("UPDATE usuarios SET name = ($1), mail = ($2), alias = ($3), latitude = ($4), longitude = ($5) WHERE id = ($6)",
      [req.body.user.name, req.body.user.email, req.body.user.alias, req.body.user.location.latitude, req.body.user.location.longitude, usrID],function(err, result) {
        done(); //Devuelvo el cliente al pool xq no necesito más la conexion
        if (err) {
          handleQueryError(err,res);
        } else {
          res.sendStatus(200);
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
    if(err){
      return handlePgConectError(err,res,done);
    }

    client.query("DELETE FROM usuarios WHERE id = ($1)", [usrID],function(err, result) {
      done(); //Call done() to get the client back to the pool
      if (err) {
        handleQueryError(err,res);
      } else {

        // TODO: verificar si se elimino el usuario o no.

        res.sendStatus(200);
      }
    });
  });
});

module.exports = router;
