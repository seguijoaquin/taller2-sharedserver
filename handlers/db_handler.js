var pg = require('pg');
var json_handler = require('./json_handler');
var Constants = require('../constants/constants.js');
var cb_handler = require('./cb_handler.js');

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

db_handler.getUsers = function (req, res, param, client, done) {
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

db_handler.getInterests = function (req, res, param, client, done) {
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

db_handler.addInterest = function (req, res, param, client, done) {
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

function saveUser(req,res,client,done,cb) {
  var photo_profile = "no_photo";
  var name = req.body.user.name;
  var email = req.body.user.email;
  var alias = req.body.user.alias;
  var sex = req.body.user.sex;
  var latitude = req.body.user.location.latitude;
  var longitude = req.body.user.location.longitude;
  var interests = req.body.user.interests;

  var query = client.query(Constants.QUERY_ALTA_USUARIO,[name,email,alias,sex,latitude,longitude,photo_profile],function(err, result) {
    if (err) {
      db_handler.sendError(err,res,done,500);
    } else {
      done();
      var id_user = result.rows[0].id_user;
      cb(id_user);
    }
  });
}

function check_my_category_and_interest (req, res, interest, client, done, cb) {
  //Chequeo las categorias
  var query_category = client.query("SELECT * FROM categories WHERE category=($1)",[interest.category], function(err,result_category) {
    //TODO: Manejo de errores
    done();
    if (result_category.rowCount > 0) {
      var query_interest = client.query("SELECT * FROM interests WHERE category=($1) AND value=($2)",[interest.category,interest.value], function(err,result_interest) {
        done();
        if(result_interest.rowCount > 0) {
          cb(true,true,interest,result_interest.rows[0].id_interest);
        } else {
          cb(true,false,interest,null);
        }
      });
    } else {
      cb(false,false,interest,null);
    }
  });
}

function saveInterest(req,res,client,done,id_interest,id_user,cb) {
  var query = client.query("INSERT INTO users_interests (id_user,id_interest) values ($1,$2)",[id_user,id_interest],function(err,result){
    done();
    if (err) {
      cb(err);
    } else {
      cb(null);
    }
  });
}

function createInterest(req,res,client,done,interest,cb) {
  var query = client.query("INSERT INTO interests (category,value) values ($1,$2) RETURNING id_interest",[interest.category,interest.value],function(err,result){
    done();
    if (err) {
      cb(null,err);
    } else {
      cb(result.rows[0].id_interest,null);
    }
  });
}

function check_category_and_interest (req,res,client,done,id_user,interest,cb) {
  check_my_category_and_interest(req,res,interest,client,done, function(category_exists,interest_exists,my_interest,id_interest){
    if(category_exists) {
      if (interest_exists) {
        saveInterest(req,res,client,done,id_interest,id_user,function(err) {
          if(!err) {console.log("Guardando el interes: "+my_interest.category+" - "+my_interest.value); cb(my_interest,true);}
          else { console.log("ERROR: no se pudo guardar el interes: "+my_interest.category+ " - "+my_interest.value); cb(my_interest,false);}
        });
      } else {
        createInterest(req,res,client,done,my_interest,function(id_interest,err) {
          if (!err) {
            saveInterest(req,res,client,done,id_interest,id_user,function(err) {
              if(!err) {console.log("Guardando el interes: "+my_interest.category+" - "+my_interest.value); cb(my_interest,true);}
              else { console.log("ERROR: no se pudo guardar el interes: "+my_interest.category+ " - "+my_interest.value); cb(my_interest,false);}
            });
          }
        });
      }
    } else {
      console.log("ERROR: No existe la categoria "+my_interest.category);
      cb(my_interest,false);
    }
  });
}

db_handler.checkInterests = function (req, res, id_user, client, done) {
  var interests = req.body.user.interests;
  var valid_interests = [];
  var checked = 0;
  if (interests && interests.length > 0) {
      //Tengo que armar el json con los intereses validos creados
      for (var i = 0; i < interests.length; ++i) {
        check_category_and_interest(req,res,client,done,id_user,interests[i], function(valid_interest,err) {
          valid_interests.push(valid_interest);
        });
      }
  }
  //Si no tiene intereses, devuelvo un json igual al que recibo
  res.json(req.body).status(201).end();
}

db_handler.addUser = function (req, res, param, client, done) {
  var email = req.body.user.email;
  var check_query = client.query("SELECT * FROM users WHERE email=($1)",[email],function (err, check_result) {
    done();
    if (err) { //Si existe error al consultar por email
      db_handler.sendError(err,res,null,500);
    } else {
      if (check_result.rowCount > 0) { //Si la consulta devuelve un email
        db_handler.sendError(Constants.ERROR_EMAIL_ALREADY_EXISTS,res,null,500);
      } else { //Si el email consultado no esta en la tabla users
        //Guardo el usuario y devuelvo id_user
        saveUser(req,res,client,done, function(id_user){
          //Chequeo si hay intereses
          db_handler.checkInterests(req,res,id_user,client,done);
        });
      }
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
    if (err) {return db_handler.sendError(err,res,done,404);}
    if (result.rowCount) {
      var jsonObject = json_handler.armarJsonUsuarioConsultado(result);
      return res.json(jsonObject);
    } else {
      //No se por que nunca entra aca si hago una query con un id invalido!
      res.sendStatus(404).end(); //User not found
    }
  })
}

db_handler.deleteUser = function (req, res, usrID, client, done) {
  var query = client.query("DELETE FROM users WHERE id_user=($1)",[usrID],function (err, result) {
    db_handler.queryExitosa(err,result,res, done);
  });
}

db_handler.updatePhoto = function (req, res, usrID, client, done) {
  var photo = req.body.photo;
  var query = client.query("UPDATE users SET photo_profile=($1) WHERE id_user=($2)",[photo,usrID], function (err, result) {
    db_handler.queryExitosa(err,result,res,done);
  });
}

db_handler.sendError = function (err, res, done, status) {
  if (done) {
    done();
  }
  console.log(err);
  res.json({succes: false, error: err}).status(status).end();
}

db_handler.queryExitosa = function (err, result, res, done) {
  if (err) {
    return db_handler.sendError(err,res,done,500);
  } else {
    done();
    return res.sendStatus(200).end();
  }
}

module.exports = db_handler;
