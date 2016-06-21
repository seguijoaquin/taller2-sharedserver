var C = require('../constants/constants.js');

var json_handler = {}

/*
 * Recibo el resultado de una query sobre la tabla users
 * que me devuelve todos los usuarios de la tabla
 * y armo un objeto JSON con los campos necesarios para devolver
 * segun la especificacion de la API
 */
json_handler.armarJsonListaIntereses = function(result,cb) {
  var jsonObject = { "interests" : [] , metadata : { version : C.METADATA_VERSION , count : result.rowCount}}
  for (var i = 0; i < result.rowCount; i++) {
    var oneInterest = {
      category : result.rows[i].category,
      value : result.rows[i].value
    }
    jsonObject.interests.push(oneInterest);
  }
  cb(jsonObject);
}

json_handler.armarJsonListaCategorias = function(result,cb) {
  var lista_categorias = { "categories" : [], metadata : {version: C.METADATA_VERSION, count : result.rowCount}}
  for (var i = 0; i < result.rowCount; i++) {
    lista_categorias.categories.push(result.rows[i].category);
  }
  cb(lista_categorias);
}

/*
 * Una vez que se da de alta un usuario nuevo, necesito devolver
 * un JSON que contenga los campos que especifica la API que
 * hay que devolver del usuario recien creado
 */
json_handler.armarJsonUsuarioNuevo = function(req,id_user,valid_interests,cb) {
  json_handler.armarUsuarioVacio(function(usuario){
    usuario.user.id = id_user;
    usuario.user.name = req.body.user.name;
    usuario.user.alias = req.body.user.alias;
    usuario.user.email = req.body.user.email;
    usuario.user.sex = req.body.user.sex;
    usuario.user.age = req.body.user.age;
    usuario.user.photo_profile = "no_photo";
    usuario.user.interests = valid_interests;
    usuario.user.location.latitude = req.body.user.location.latitude;
    usuario.user.location.longitude = req.body.user.location.longitude;
    cb(usuario);
  });
}

json_handler.armarUsuarioVacio = function (cb) {
  var usuario = {
    user:
      {
        id: null,
        name:null,
        alias:null,
        email:null,
        sex:null,
        age: null,
        photo_profile:null,
        interests:[],
        location:{latitude:null,longitude:null}
      },
      metadata : {
        version : C.METADATA_VERSION
      }
  };
  cb(usuario);
}


module.exports = json_handler;
