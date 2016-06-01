var pg = require('pg');
var json_handler = require('./json_handler');
var Cons = require('../constants/constants.js');
var cb_handler = require('./cb_handler.js');

var urlDB = Cons.POSTGRE_URL_DB;

pg.defaults.ssl = true;

var db_handler = {}

db_handler.atenderQuery = function (req, res, next) {
  pg.connect(urlDB,function(err,client, done) {
    if (err) {
      sendError(err,res,done,Cons.ERROR_CONNECTION);
    } else {
      next.set_ClientDone(client,done);
      next.launch();
    }
  });
};

/*
 * Son intereses validos los que tienen una categoria existente
 * en la tabla categories.
 * Inserto en valid_interests todos los intereses que llegan el req.body
 * cuya categoria esta en la tabla categories. Y lo devuelvo.
 */
function getValidCategories (interests,client,done,valid_categories,cb) {
  var checked = 0;
  for (var i = 0; i<interests.length;++i) {
    client.query(Cons.QUERY_GET_CATEGORIES,[interests[i].category], function(err,result){
      //done(); TODO: REVISAR si hay que llamar a done
      if (err) {sendError(err,res,done,Cons.STATUS_ERROR);}
      else {
        if (hayResultado(result)) {
          valid_categories.push(result.rows[0]);
        }
        if(++checked == interests.length) cb(valid_categories);
      }
    });
  }
}

function processInterests(valid_interests,cb) {
  for (var i in valid_interests) {
    cb(valid_interests[i].category,valid_interests[i].value);
  }
}

function createInterest(res,client,done,category,value,cb) {
  var query = client.query("INSERT INTO interests (category,value) values ($1,$2) RETURNING id_interest",[category,value],function(err,result){
    //done();
    if (err) { cb("no_id_interest","No se puede crear el interes: "+category+" - "+value);
    } else {
      cb(result.rows[0].id_interest,err);
    }
  });
}

function saveInterests(res,client,done,id_user,category,value) {
  client.query(Cons.QUERY_SELECT_ONE_INTEREST,[category,value], function(err,result){
    //done();
    if (err) {sendError(err,res,done,Cons.STATUS_ERROR);
    } else {
      if (hayResultado(result)) {
        //Si el interes ya existe, obtengo el id_interest y lo inserto en users_interests
        save_one_interest(res,client,done,id_user,result.rows[0].id_interest);
      } else {
        //Si no existe, lo creo para obtener el id_interest e insertarlo en users_interests
        createInterest(res,client,done,category,value,function (id_interest,err) {
          if (err) {
            console.error(err);
          } else {
            save_one_interest(res,client,done,id_user,id_interest);
          }
        });
      }
    }
  });
}

function save_one_interest(res,client,done,id_user,id_interest) {
  client.query(Cons.QUERY_SAVE_ONE_INTEREST,[id_user,id_interest],function(err,result){
    //done(); TODO:REVISAR si corresponde llamar
    //console.log(result);
    if (err) {sendError(err,res,done,Cons.STATUS_ERROR);}
  });
}

function getValidInterests(interests,valid_categories,cb) {
  var valid_interests = [];
  var checked = 0;
  var i = 0;
  var j = 0;

  while (i<valid_categories.length) {
    while (j<interests.length) {
      if(valid_categories[i].category == interests[j].category) {
        valid_interests.push(interests[j]);
        ++i;
        ++j;
      }else{
        ++j;
      }
      if (++checked == valid_categories.length) cb(valid_interests);
    }
  }
}

function checkInterests(req, res, client, done, cb) {
  var interests = req.body.user.interests;
  var valid_categories = [];
  var err = null;
  var has_interests = (interests && interests.length > 0);
  if (has_interests) {
    //Verifico que la categoria exista, si existe la agrego a los intereses validos, sino no
    getValidCategories(interests,client,done,valid_categories,function (categorias_validas) {
      //Una vez que tengo las categorias que estan en la tabla categories,
      //me guardo el vector de intereses que tienen esas categorias, y el resto se descarta
      getValidInterests(interests,valid_categories, function(valid_interests){
        cb(has_interests,valid_interests,err);
      });
    });
  } else {
    //Devuelvo: Has interests false, vector vacío, y error null
    var valid_interests = [];
    cb(has_interests,valid_interests,err);
  }
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
  var id_user = "";

  client.query(Cons.QUERY_ADD_USER,[name,email,alias,sex,latitude,longitude,photo_profile],function(err, result) {
    if (err) {
      cb(id_user,err);
    } else {
      //done(); TODO: REVISAR si hay que llamarlo
      id_user = result.rows[0].id_user;
      cb(id_user,err);
    }
  });
}

function devolverUser(req,res,id_user,done,valid_interests) {
  done();
  var usuario = json_handler.armarJsonUsuarioNuevo(req,id_user);
  usuario.user.interests = valid_interests;
  res.json(usuario).status(Cons.STATUS_CREATED).end();
}

db_handler.getInterests = function (req, res, param, client, done) {
  var query = client.query(Cons.QUERY_GET_INTERESTS,function(err, result) {
    done();
    if (err) {
      sendError(err,res,done,Cons.STATUS_ERROR);
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
  var category = req.body.interests.category;
  var value = req.body.interests.value;
  createInterest(res,client,done,category,value,function(id_interest,err) {
    if (err) {
      sendError(err,res,done,Cons.STATUS_ERROR);
    } else {
      res.sendStatus(Cons.STATUS_CREATED).end();
    }
  });
}

db_handler.addUser = function(req, res, param, client, done) {
  //var email = req.body.user.email;
  var email = "";
  var check_query = client.query(Cons.QUERY_SELECT_EMAILS,[email],function (err, check_result) {
    //done(); //No se si es necesario llamarlo si todavia hay que hacer querys
    //Si existe error al consultar por email
    if (err) { sendError(err,res,done,Cons.STATUS_ERROR);
    } else {
      //Si la consulta devuelve un email existente
      if (hayResultado(check_result)) {
        sendError(Cons.ERROR_EMAIL_ALREADY_EXISTS,res,done,Cons.STATUS_ERROR);
      } else { //Si el email consultado no esta en la tabla users
        //Chequeo si hay intereses
        checkInterests(req,res,client,done, function (has_interests,valid_interests, err) {
          if (err) { sendError(err,res,done,Cons.STATUS_ERROR);
          } else {
            saveUser(req,res,client,done,function (id_user,err) {
              if(err) { sendError(Cons.ERROR_SAVE_USER,res,done,Cons.STATUS_ERROR);
              } else {
                if (has_interests) {
                  processInterests(valid_interests, function(category,value) {
                    saveInterests(res,client,done,id_user,category,value);
                  });
                }
                devolverUser(req,res,id_user,done,valid_interests);
              }
            });
          }
        });
      }
    }
  });
}

db_handler.getUsers = function (req, res, param, client, done) {
  //TODO: JOIN con tabla de users_interests
  var query = client.query(Cons.QUERY_GET_USERS,function(err, result) {
    done(); //Devuelvo el cliente al pool xq no necesito más la conexion
    if (err) {
      sendError(err,res,done,Cons.STATUS_ERROR);
    } else {
      query.on('row', function(row,result) {result.addRow(row);});
      query.on('end', function(result) {
        var respuesta = json_handler.armarJsonListaUsuarios(result);
        res.json(respuesta).end();
      });
    }
  });
}

//Pisa todos los valores que estan en la query
//Si en el json no existen los campos, pone null
//Si el campo location no existe, crashea la app
db_handler.modifyUser = function(req, res, usrID, client, done) {
  var u = req.body.user;
  var query = client.query(Cons.QUERY_UPDATE_USERS,[u.name, u.email,u.alias,u.sex, u.location.latitude,u.location.longitude, usrID],function (err,result) {
      queryExitosa (err, result, res, done);
    });
}

db_handler.getUser = function (req, res, usrID, client, done) {
  var query = client.query(Cons.QUERY_GET_ONE_USER,[usrID],function (err,result) {
    done();
    if (err) { sendError(err,res,done,Cons.STATUS_NOT_FOUND);}
    else {
      if (hayResultado(result)) {
        var jsonObject = json_handler.armarJsonUsuarioConsultado(result);
        res.json(jsonObject).end();
      } else {
        res.sendStatus(Cons.STATUS_NOT_FOUND).end(); //User not found
      }
    }
  });
}

db_handler.deleteUser = function (req, res, usrID, client, done) {
  var query = client.query(Cons.QUERY_DELETE_USER,[usrID],function (err, result) {
    queryExitosa(err,result,res, done);
  });
}

db_handler.updatePhoto = function (req, res, usrID, client, done) {
  var photo = req.body.photo;
  var query = client.query(Cons.QUERY_UPDATE_PHOTO_PROFILE,[photo,usrID], function (err, result) {
    queryExitosa(err,result,res,done);
  });
}

function hayResultado (result) {
    return (result.rowCount > 0);
}

function sendError (err, res, done, status) {
  console.log(err);
  if (done) {done();}
  res.json({succes: false, error: err}).status(status).end();
}

function queryExitosa (err, result, res, done) {
  if (err) {
    sendError(err,res,done,Cons.STATUS_ERROR);
  } else {
    done();
    res.sendStatus(Cons.STATUS_SUCCESS).end();
  }
}

module.exports = db_handler;
