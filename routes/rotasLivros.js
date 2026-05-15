var express = require('express');
var router = express.Router();

/* Rota livros */
router.get('/', function(req, res, next){
    res.render('livros', { title: 'Livros'} );
});

module.exports = router;

