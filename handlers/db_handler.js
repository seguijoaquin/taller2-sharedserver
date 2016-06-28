var pg = require('pg');
var json_handler = require('./json_handler');
var C = require('../constants/constants.js');
var cb_handler = require('./cb_handler.js');

var urlDB = C.POSTGRE_URL_DB;

pg.defaults.ssl = true;

var db_handler = {};

db_handler.atenderQuery = function (req, res, next) {
  pg.connect(urlDB,function(err,client, done) {
    if (err) return sendError(err,res,done,C.ERROR_CONNECTION);

    next.set_ClientDone(client,done);
    next.launch();
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
    /* jshint -W083 */
    client.query(C.QUERY_GET_ONE_CATEGORY,[interests[i].category], function(err,result){
      if (err) return sendError({"success" : false, "error" : err, "description" : "Error al obtener categorias\n"},res,done,C.STATUS_ERROR);

      if (hayResultado(result)) valid_categories.push(result.rows[0]);
      if(++checked == interests.length) cb(valid_categories);
    });
  }
}

function processInterests(valid_interests,cb) {
  //Por cada interes valido llamo separadamente a una instancia de saveInterests
  for (var i in valid_interests) {
    cb(valid_interests[i].category,valid_interests[i].value);
  }
}

function createInterest(res,client,done,category,value,cb) {
  var query = client.query(C.QUERY_CREATE_INTEREST,[category,value],function(err,result){
    if (err) return cb("no_id_interest","No se puede crear el interes: "+category+" - "+value);

    cb(result.rows[0].id_interest,err);
  });
}

function saveInterests(res,client,done,id_user,category,value) {
  client.query(C.QUERY_SELECT_ONE_INTEREST,[category,value], function(err,result){
    if (err) return sendError(err,res,done,C.STATUS_ERROR);

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
  });
}

function save_one_interest(res,client,done,id_user,id_interest) {
  client.query(C.QUERY_SAVE_ONE_INTEREST,[id_user,id_interest],function(err,result){
    if (err) return sendError(err,res,done,C.STATUS_ERROR);
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
  var err = {"success" : true, "error" : null, "description" : "No error\n"};
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
    return cb(has_interests,valid_interests,err);
  }
}

function saveUser(req,res,client,done,cb) {
  var photo_profile = "no_photo";
  var name = req.body.user.name;
  var email = req.body.user.email.toLowerCase();
  var alias = req.body.user.alias;
  var sex = req.body.user.sex.toLowerCase();
  var age = req.body.user.age;
  var latitude = req.body.user.location.latitude;
  var longitude = req.body.user.location.longitude;
  var interests = req.body.user.interests;

  query = client.query(C.QUERY_ADD_USER,[name,email,alias,sex,age,latitude,longitude,photo_profile],function(err, result) {
    if (err) return cb("no_id",{"success" : false});
  });

  query.on('end',function(result) {
    cb(result.rows[0].id_user,{"success" : true});
  });
}

function devolverUser(req,res,id_user,done,valid_interests,status) {
  done();
  json_handler.armarJsonUsuarioNuevo(req,id_user,valid_interests,function(usuario) {
      res.status(status).json(usuario).end();
  });
}

db_handler.getCategories = function (req,res,param,client,done) {
  var query = client.query(C.QUERY_GET_CATEGORIES,function(err,result) {
    done();
    if (err) return sendError(err,res,done,C.STATUS_ERROR);
  });

  query.on('end',function(result) {
    json_handler.armarJsonListaCategorias(result,function(respuesta) {
      return res.json(respuesta).end();
    });
  });
};

db_handler.addCategory = function (req,res,param,client,done) {
  //TODO: Alta de categorias
};

db_handler.getInterests = function (req, res, param, client, done) {
  var query = client.query(C.QUERY_GET_INTERESTS,function(err, result) {
    done();
    if (err) return sendError(err,res,done,C.STATUS_ERROR);

    query.on('end', function (result) {
      json_handler.armarJsonListaIntereses(result,function(respuesta){
        return res.json(respuesta).end();
      });
    });
  });
};

db_handler.addInterest = function (req, res, param, client, done) {
  var category = req.body.interest.category.toLowerCase();
  var value = req.body.interest.value.toLowerCase();
  if (category) {
    createInterest(res,client,done,category,value,function(id_interest,err) {
      if (err) return sendError(err,res,done,C.STATUS_ERROR);

      res.sendStatus(C.STATUS_CREATED).end();
    });
  } else {
    return sendError(C.ERROR_INVALID_CATEGORY,res,done,C.STATUS_ERROR);
  }
};

db_handler.addUser = function(req, res, param, client, done) {
  //TODO: Descomentar para validar unicidad de emails en alta
  var email = ""; /*req.body.user.email;*/
  var check_query = client.query(C.QUERY_SELECT_EMAILS,[email],function (err, check_result) {
    //Si existe error al consultar por email
    if (err) return sendError(err,res,done,C.STATUS_ERROR);
    //Si la consulta devuelve un email existente
    if (hayResultado(check_result)) return sendError(C.ERROR_EMAIL_ALREADY_EXISTS,res,done,C.STATUS_ERROR);
    //Si el email consultado no esta en la tabla users
    //Chequeo si hay intereses
    checkInterests(req,res,client,done, function (has_interests,valid_interests, err) {
      if (err.success == 'false') return sendError(C.ERROR_CHECK_INTERESTS,res,done,C.STATUS_ERROR);
      saveUser(req,res,client,done,function (id_user,err) {
        if(err.success == 'false') return sendError(C.ERROR_SAVE_USER,res,done,C.STATUS_ERROR);
        if (has_interests) {
          processInterests(valid_interests, function(category,value) {
            saveInterests(res,client,done,id_user,category,value);
          });
        }
        devolverUser(req,res,id_user,done,valid_interests,C.STATUS_CREATED);
      });
    });
  });
};

db_handler.getUsers = function (req, res, param, client, done) {
  var query = client.query(C.QUERY_GET_USERS,function(err, result) {
    if (err) return sendError(err,res,done,C.STATUS_ERROR);
  });

  var lista_usuarios = {users:[],metadata: { version: C.METADATA_VERSION, count: 0}};
  var usuario_nuevo;
  var id_control = null;
  query.on('row', function(row) {
    //console.log(row);
    if (id_control != row.id_user) {
      id_control = row.id_user;
      usuario_nuevo = {user: {id: null,name: null,alias:null,email:null,sex:null,age:null,photo_profile:null,interests:[],location:{latitude:null,longitude:null}}};
      usuario_nuevo.user.id=id_control;
      usuario_nuevo.user.name = row.name;
      usuario_nuevo.user.alias = row.alias;
      usuario_nuevo.user.email = row.email;
      usuario_nuevo.user.sex = row.sex;
      usuario_nuevo.user.age = row.age;
      usuario_nuevo.user.photo_profile = "https://t2shared.herokuapp.com/users/"+id_control+"/photo";
      if(row.category !== null) {
        usuario_nuevo.user.interests.push({category:row.category,value:row.value});
      }
      usuario_nuevo.user.location.latitude = row.latitude;
      usuario_nuevo.user.location.longitude = row.longitude;
      lista_usuarios.users.push(usuario_nuevo);
      lista_usuarios.metadata.count++;
    } else
      if (row.category !== null) {
        usuario_nuevo.user.interests.push({category:row.category,value:row.value});
      }
  });

  query.on('end',function(){
    done();
    res.json(lista_usuarios).end();
  });
};

function updateUser (req,res,client,done,usrID,cb) {
  var photo_profile = req.body.photo_profile;
  var name = req.body.user.name;
  var email = req.body.user.email.toLowerCase();
  var alias = req.body.user.alias;
  var sex = req.body.user.sex.toLowerCase();
  var age = req.body.user.age;
  var latitude = req.body.user.location.latitude;
  var longitude = req.body.user.location.longitude;
  var interests = req.body.user.interests;

  var query = client.query(C.QUERY_UPDATE_USERS,[name,email,alias,sex,age,latitude,longitude,photo_profile,usrID],function(err, result) {
    if (err) return cb({"success" : false});
  });
  query.on('end',function(result) {
    cb({"succes" : true});
  });
}

function deleteAllInterests (client,done,usrID,cb) {
  var query = client.query(C.QUERY_DELETE_USERS_INTERESTS,[usrID],function (err,result) {
    if (err) cb({"success" : false});
  });
  query.on('end',function(result) {
    cb({"succes" : true});
  });
}

//Pisa todos los valores que estan en la query
//Si en el json no existen los campos, pone null
//Si el campo location no existe, crashea la app
//Borra todos los intereses del usuario y crea intereses nuevos
db_handler.modifyUser = function(req, res, usrID, client, done) {
  //Chequeo si hay intereses
  checkInterests(req,res,client,done, function (has_interests,valid_interests, err) {
    if (err.success == 'false') return sendError(C.ERROR_CHECK_INTERESTS,res,done,C.STATUS_ERROR);
    updateUser(req,res,client,done,usrID,function (err) {
      if(err.success == 'false') return sendError(C.ERROR_SAVE_USER,res,done,C.STATUS_ERROR);
      deleteAllInterests(client,done,usrID,function(err){
        if(err.success == 'false') return sendError(C.ERROR_UPDATE_INTERESTS,res,done,C.STATUS_ERROR);
        if (has_interests) {
          processInterests(valid_interests, function(category,value) {
            saveInterests(res,client,done,usrID,category,value);
          });
        }
      });
      devolverUser(req,res,usrID,done,valid_interests,C.STATUS_SUCCESS);
    });
  });
};


db_handler.getUser = function (req, res, usrID, client, done) {
  var query = client.query(C.QUERY_GET_ONE_USER,[usrID],function (err,result) {
    done();
    if (err) return sendError(err,res,done,C.STATUS_ERROR);
    if (!hayResultado(result)) return sendError(C.USER_NOT_FOUND,res,done,C.STATUS_NOT_FOUND); //User not found

  });

  json_handler.armarUsuarioVacio(function(usuario){
    query.on('row',function(row){
      //Verifico que un campo no sea null para no sobreescribir en cada iteracion
      //console.log(row);
      if(usuario.user.id === null) {
        usuario.user.id = row.id_user;
        usuario.user.name = row.name;
        usuario.user.alias = row.alias;
        usuario.user.email = row.email;
        usuario.user.sex = row.sex;
        usuario.user.age = row.age;
        usuario.user.photo_profile = row.photo_profile;
        usuario.user.location.latitude = row.latitude;
        usuario.user.location.longitude = row.longitude;
      }
      if(row.id_interest) usuario.user.interests.push({category:row.category,value:row.value});
    });
    query.on('end',function(result){
      if (hayResultado(result)) res.json(usuario).end();
    });
  });

};

db_handler.deleteUser = function (req, res, usrID, client, done) {
  var query = client.query(C.QUERY_DELETE_USER,[usrID],function (err, result) {
    queryExitosa(err,result,res, done);
  });
};

db_handler.updatePhoto = function (req, res, usrID, client, done) {
  var photo = req.body.photo;
  var query = client.query(C.QUERY_UPDATE_PHOTO_PROFILE,[photo,usrID], function (err, result) {
    queryExitosa(err,result,res,done);
  });
};

db_handler.getPhoto = function (req, res, usrID, client, done) {
  var query = client.query(C.QUERY_GET_ONE_USER_PHOTO,[usrID],function (err,result) {
    done();
    if (err) return sendError(err,res,done,C.STATUS_ERROR);
    if (!hayResultado(result)) return sendError(C.USER_NOT_FOUND,res,done,C.STATUS_NOT_FOUND); //User not found
  });

  query.on('end',function(result) {
    if (hayResultado(result)) {
      var img = new Buffer(result.rows[0].photo_profile, 'base64');

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
      });
      res.end(img);
    }
    //res.json(result.rows[0].photo_profile).end();
  });
};


function hayResultado (result) {
    return (result.rowCount > 0);
}

function sendError (err, res, done, status) {
  console.log(err);
  if (done) {done();}
  res.status(status).json({success: false, error: err}).end();
}

function queryExitosa (err, result, res, done) {
  if (err) return sendError(err,res,done,C.STATUS_ERROR);
  done();
  res.sendStatus(C.STATUS_SUCCESS).end();
}

module.exports = db_handler;
