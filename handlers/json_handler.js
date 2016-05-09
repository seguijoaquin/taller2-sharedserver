var Constants = require('../constants/constants.js');

var json_handler = {}

json_handler.armarJsonListaUsuarios = function(result) {
  var jsonObject = { "users" : [] , metadata : { version : Constants.METADATA_VERSION , count : result.rowCount}}
  for (var i = 0; i < result.rowCount; i++) {
    var oneUser = {
      user : {
        name : result.rows[i].name,
        alias : result.rows[i].alias,
        email : result.rows[i].email,
        photo_profile: result.rows[i].photo_profile,
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

json_handler.armarJsonUsuarioNuevo = function(req) {
  var respuesta = { user : req.body.user, metadata : Constants.METADATA_VERSION}
  return respuesta;
}

json_handler.armarJsonUsuarioConsultado = function (result, usrID) {
  var jsonObject = {
    user : {
      id : usrID,
      name : result.rows[0].name,
      alias : result.rows[0].alias,
      email : result.rows[0].email,
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
