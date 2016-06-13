var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shared server Interface' });
});

router.get('/test_page', function(req, res, next) {
  res.render('test_page', { title: 'Shared server Interface' });
});

module.exports = router;
