var pg = require('pg');
var json_handler = require('./json_handler');
var Constants = require('../constants/constants.js');

var urlDB = Constants.POSTGRE_URL_DB;

pg.defaults.ssl = true;

var db_handler = {}

db_handler.atenderQuery = function (req, res, next) {
  pg.connect(urlDB,function(err,client, done) {
    if (err) {
      db_handler.capturarErrorConnect(err,res,done);
    } else {
      next.set_ClientDone(client,done);
      next.launch();
    }
  });
};

db_handler.getUsers = function (req, res, client, done) {
  //TODO: JOIN con tabla de users_interests
  var query = client.query("SELECT * FROM users",function(err, result) {
    done(); //Devuelvo el cliente al pool xq no necesito más la conexion
    if (err) {
      console.log(err);
      res.json({error: err}).end();
    } else {
      query.on('row', function(row,result) {result.addRow(row);});
      query.on('end', function(result) {
        var respuesta = json_handler.armarJsonListaUsuarios(result);
        res.json(respuesta).end();
      })
    }
  });
}

db_handler.addUser = function (req, res, client, done) {
  var photo_profile = "no_photo";
  var query = client.query("INSERT INTO users (name,email,alias,sex,latitude,longitude,photo_profile) values($1,$2,$3,$4,$5,$6,$7) RETURNING id_user",
    [req.body.user.name,req.body.user.email,req.body.user.alias,req.body.user.sex,
      req.body.user.location.latitude,req.body.user.location.longitude,photo_profile],function(err, result) {
    done(); //Devuelvo el cliente al pool xq no necesito más la conexion
    if (err) {
      console.log(err);
      res.status(500).json({error: err}).end();
    } else {
      var id_user = result.rows[0].id_user;
      var jsonObject = json_handler.armarJsonUsuarioNuevo(req,id_user);
      res.status(201).json(jsonObject).end();
    }
  });
}

//Pisa todos los valores que estan en la query
//Si en el json no existen los campos, pone null
//Si el campo location no existe, crashea la app
db_handler.modifyUser = function(req, res, usrID, client, done) {
  var query = client.query("UPDATE users SET name = ($1), email = ($2), alias = ($3), sex = ($4), latitude = ($5), longitude = ($6) WHERE id_user = ($7)",
    [req.body.user.name, req.body.user.email, req.body.user.alias,
      req.body.user.sex, req.body.user.location.latitude,req.body.user.location.longitude, usrID],
    function (err,result) {
      db_handler.queryExitosa (err, result, res, done);
    });
}

db_handler.getUser = function (res, usrID, client, done) {
  var query = client.query("SELECT * FROM users WHERE id_user = ($1)",[usrID],function (err,result) {
    done();
    //Si tiro un id que no existe, la query falla y entra por aca
    if (err) {
      console.log(err);
      res.sendStatus(404).end();
    } else {
      if (result.rowCount) {
        var jsonObject = json_handler.armarJsonUsuarioConsultado(result);
        return res.json(jsonObject);
      } else {
        //No se por que nunca entra aca si hago una query con un id invalido!
        res.sendStatus(404).end(); //User not found
      }
    }
  })
}

db_handler.deleteUser = function (res, usrID, client, done) {
  var query = client.query("DELETE FROM users WHERE id_user = ($1)",[usrID],function (err, result) {
    db_handler.queryExitosa(err,result,res, done);
  });
}


//Error 500 al querer conectarse a la base de datos
db_handler.capturarErrorConnect = function (err, res, done) {
    done(); //Ante error de connect, devuelvo el client al pool
    console.log(err);
    res.sendStatus(500).end();
}

db_handler.queryExitosa = function (err, result, res, done) {
  done(); //Devuelvo el cliente al pool xq no necesito más la conexion
  if (err) {
    console.log(err);
    //res.status(500).json({error: err}).end();
    res.sendStatus(500).end();
  } else {
    res.sendStatus(200).end();
  }
}

module.exports = db_handler;
