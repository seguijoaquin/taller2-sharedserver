var pg = require('pg');
var Constants = require('../constants/constants.js');

var urlDB = Constants.POSTGRE_URL_DB;

pg.defaults.ssl = true;

function atenderQuery(req, res, next) {
  pg.connect(urlDB,function(err,client, done) {
    if (err) {
      capturarErrorConnect(err,res,done);
    } else {
      next.set_ClientDone(client,done);
      next.launch();
    }
  });
};

function getUsers(req, res, client, done) {
  //TODO: JOIN con tabla de users_interests
  var query = client.query("SELECT * FROM users",function(err, result) {
    done(); //Devuelvo el cliente al pool xq no necesito más la conexion
    if (err) {
      console.log(err);
      res.json({error: err});
    } else {
      query.on('row', function(row,result) {result.addRow(row);});
      query.on('end', function(result) {
        var respuesta = json_handler.armarJsonListaUsuarios(result);
        res.json(respuesta);
      })
    }
  });
}

//Error 500 al querer conectarse a la base de datos
function capturarErrorConnect(err, res, done) {
    done(); //Ante error de connect, devuelvo el client al pool
    res.status(500).json({error: err});
}

function queryExitosa (err, result, res, done) {
  done(); //Devuelvo el cliente al pool xq no necesito más la conexion
  if (err) {
    res.status(500).json({error: err});
  } else {
    res.status(200);
  }
}

module.exports = db_handler;
