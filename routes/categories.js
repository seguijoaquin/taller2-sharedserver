var express = require('express');
var router = express.Router();
var cb_handler = require('../handlers/cb_handler.js');
var db_handler = require('../handlers/db_handler.js');

//Listar categorias
router.get('/', function(req, res) {
  var my_cb_handler = cb_handler(req, res, null, db_handler.getCategories);
  db_handler.atenderQuery(req,res,my_cb_handler);
});

//Agregar nueva categoria
router.post('/', function (req, res) {
  var my_cb_handler = cb_handler(req,res,null, db_handler.addCategory);
  db_handler.atenderQuery(req,res,my_cb_handler);
});

module.exports = router;
