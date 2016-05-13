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
        sex : result.rows[i].sex,
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

json_handler.armarJsonUsuarioConsultado = function (result) {
  var jsonObject = {
    user : {
      name : result.rows[0].name,
      alias : result.rows[0].alias,
      email : result.rows[0].email,
      sex : result.rows[0].sex,
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
