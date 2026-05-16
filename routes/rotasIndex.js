var express = require('express');
var router = express.Router();
// Importa o controller
const controllerIndex = require('../controller/controllerIndex');

// Quando alguém acessar a raiz ('/'), executa a função tela_principal do controller
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Listagem de livros' });
// });
router.get('/', controllerIndex.tela_principal);

module.exports = router;
