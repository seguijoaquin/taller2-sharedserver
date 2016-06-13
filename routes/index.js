var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Shared server Interface' });
  //__dirname contiene la ruta del archivo index.js
  //Y necesito la ruta de los archivos html que quiero mandar al browser
  res.sendFile(path.join(__dirname,"../public",index.html));
});

router.get('/test_page', function(req, res, next) {
  res.render('test_page', { title: 'Shared server Interface' });
});

//Captura las rutas de las paginas html en public
router.get('/*.html', function(req, res) {
  res.sendFile(path.join(__dirname,"../public",req.html));
});


module.exports = router;
