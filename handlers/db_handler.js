var pg = require('pg');
var json_handler = require('./json_handler');
var Constants = require('../constants/constants.js');

var urlDB = Constants.POSTGRE_URL_DB;

pg.defaults.ssl = true;

var db_handler = {}

db_handler.atenderQuery = function (req, res, next) {
  pg.connect(urlDB,function(err,client, done) {
    if (err) {
      done();
      db_handler.sendError(err,res,500);
      return false;
    } else {
      next.set_ClientDone(client,done);
      next.launch();
    }
  });
};

db_handler.getUsers = function (req, res, usrID, client, done) {
  //TODO: JOIN con tabla de users_interests
  var query = client.query("SELECT * FROM users",function(err, result) {
    done(); //Devuelvo el cliente al pool xq no necesito más la conexion
    if (err) {
      db_handler.sendError(err,res,500);
    } else {
      query.on('row', function(row,result) {result.addRow(row);});
      query.on('end', function(result) {
        var respuesta = json_handler.armarJsonListaUsuarios(result);
        res.json(respuesta).end();
      })
    }
  });
}

db_handler.getInterests = function (req, res, usrID, client, done) {
  var query = client.query("SELECT * FROM interests",function(err, result) {
    done();
    if (err) {
      db_handler.sendError(err,res,500);
    } else {
      query.on('row', function(row,result) {result.addRow(row);});
      query.on('end', function (result) {
        var respuesta = json_handler.armarJsonListaIntereses(result);
        res.json(respuesta).end();
      })
    }
  });
}

db_handler.addInterest = function (req, res, usrID, client, done) {
  var i = req.body.interest;
  var query = client.query("INSERT INTO interests (category,value) values($1,$2) RETURNING id_interest",[i.category,i.value],function(err,result) {
    done();
    if (err) {
      db_handler.sendError(err,res,500);
    } else {
      res.sendStatus(201).end();
    }
  });
}

db_handler.addUser = function (req, res, usrID, client, done) {
  // TODO : chequear intereses y agregar en caso necesario
  var photo_profile = "no_photo";
  var u = req.body.user;
  var check_query = client.query("SELECT * FROM users WHERE email=($1)",[u.email],function (err, result_check) {
    if(result_check.rowCount > 0) {
      done();
      db_handler.sendError("Ya existe mail",res,500);
    } else {
      var query = client.query("INSERT INTO users (name,email,alias,sex,latitude,longitude,photo_profile) values($1,$2,$3,$4,$5,$6,$7) RETURNING id_user",
        [u.name,u.email,u.alias,u.sex,u.location.latitude,u.location.longitude,photo_profile],function(err, result) {
        done(); //Devuelvo el cliente al pool xq no necesito más la conexion
        if (err) {
          db_handler.sendError(err,res,500);
        } else {
          var id_user = result.rows[0].id_user;
          var jsonObject = json_handler.armarJsonUsuarioNuevo(req,id_user);
          res.status(201).json(jsonObject).end();
        }
      });
    }
  });
}

//Pisa todos los valores que estan en la query
//Si en el json no existen los campos, pone null
//Si el campo location no existe, crashea la app
db_handler.modifyUser = function(req, res, usrID, client, done) {
  var u = req.body.user;
  var query = client.query("UPDATE users SET name=($1),email=($2),alias=($3),sex=($4),latitude=($5),longitude=($6) WHERE id_user=($7)",
    [u.name, u.email,u.alias,u.sex, u.location.latitude,u.location.longitude, usrID],
    function (err,result) {
      db_handler.queryExitosa (err, result, res, done);
    });
}

db_handler.getUser = function (req, res, usrID, client, done) {
  var query = client.query("SELECT * FROM users WHERE id_user = ($1)",[usrID],function (err,result) {
    done();
    //Si tiro un id que no existe, la query falla y entra por aca
    if (err) {
      db_handler.sendError(err,res,404);
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

db_handler.deleteUser = function (req, res, usrID, client, done) {
  var query = client.query("DELETE FROM users WHERE id_user=($1)",[usrID],function (err, result) {
    db_handler.queryExitosa(err,result,res, done);
  });
  return false;
}

db_handler.updatePhoto = function (req, res, usrID, client, done) {
  var photo = req.body.photo;
  var query = client.query("UPDATE users SET photo_profile=($1) WHERE id_user=($2)",[photo,usrID], function (err, result) {
    db_handler.queryExitosa(err,result,res,done);
  });
}

db_handler.sendError = function (err, res, status) {
  console.log(err);
  res.json({succes: false, error: err}).status(status).end();
}

db_handler.queryExitosa = function (err, result, res, done) {
  done(); //Devuelvo el cliente al pool xq no necesito más la conexion
  if (err) {
    db_handler.sendError(err,res,500);
  } else {
    res.sendStatus(200).end();
  }
}

module.exports = db_handler;
