var express = require('express');
var router = express.Router();

/* GET API home. */
router.get('/', function(req, res, next) {
  res.send('Hello xAPI !');
});


/* GET users. */
router.get('/:id', function(req, res, next) {
  res.send('Record ： ' + req.params.id);
});


module.exports = router;
