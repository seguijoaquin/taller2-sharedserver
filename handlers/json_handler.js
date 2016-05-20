var Constants = require('../constants/constants.js');

var json_handler = {}

//TODO : Agregar los intereses a los archivos JSON generados
/*
 * Recibo el resultado de una query sobre la tabla users
 * que me devuelve todos los usuarios de la tabla
 * y armo un objeto JSON con los campos necesarios para devolver
 * segun la especificacion de la API
 */
json_handler.armarJsonListaUsuarios = function(result) {
  var jsonObject = { "users" : [] , metadata : { version : Constants.METADATA_VERSION , count : result.rowCount}}
  for (var i = 0; i < result.rowCount; i++) {
    var oneUser = {
      user : {
        id : result.rows[i].id_user,
        name : result.rows[i].name,
        alias : result.rows[i].alias,
        email : result.rows[i].email,
        sex : result.rows[i].sex,
        photo_profile: "http://t2shared.herokuapp.com/users/"+result.rows[i].id_user+"/photo",
        interests: [],
        location : {
          latitude : result.rows[i].latitude,
          longitude : result.rows[i].longitude
        }
      }
    }
    jsonObject.users.push(oneUser);
  }
  return jsonObject;
}

/*
 * Recibo el resultado de una query sobre la tabla users
 * que me devuelve todos los usuarios de la tabla
 * y armo un objeto JSON con los campos necesarios para devolver
 * segun la especificacion de la API
 */
json_handler.armarJsonListaIntereses = function(result) {
  var jsonObject = { "interests" : [] , metadata : { version : Constants.METADATA_VERSION , count : result.rowCount}}
  for (var i = 0; i < result.rowCount; i++) {
    var oneInterest = {
      category : result.category,
      value : result.value
    }
    jsonObject.interests.push(oneInterest);
  }
  return jsonObject;
}

/*
 * Una vez que se da de alta un usuario nuevo, necesito devolver
 * un JSON que contenga los campos que especifica la API que
 * hay que devolver del usuario recien creado
 */
json_handler.armarJsonUsuarioNuevo = function(req,id_user) {
  var jsonObject = {
    user : {
      id : id_user,
      name : req.body.user.name,
      alias : req.body.user.alias,
      email : req.body.user.email,
      sex : req.body.user.sex,
      location : {
        latitude : req.body.user.location.latitude,
        longitude : req.body.user.location.longitude
      }
    },
    metadata : {
      version : Constants.METADATA_VERSION
    }
  }
  return jsonObject;
}

/*
 * Recibo el resultado de una query sobre la tabla users
 * que me devuelve un usuario de la tabla
 * y armo un objeto JSON con los campos necesarios para devolver
 * segun la especificacion de la API
 */
json_handler.armarJsonUsuarioConsultado = function (result) {
  var jsonObject = {
    user : {
      name : result.rows[0].name,
      alias : result.rows[0].alias,
      email : result.rows[0].email,
      sex : result.rows[0].sex,
      photo_profile : result.rows[0].photo_profile,
      location : {
        latitude : result.rows[0].latitude,
        longitude : result.rows[0].longitude
      }
    },
    metadata : {
      version : Constants.METADATA_VERSION
    }
  }
  return jsonObject;
}


module.exports = json_handler;
