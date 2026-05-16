var express = require('express');
var router = express.Router();
// Importa o controller de livros
const controllerLivros = require('../controller/controllerLivros');

/* Rota livros */
// router.get('/', function(req, res, next){
//     res.render('livros', { title: 'Livros'} );
// });

// Rota para mostrar a tela de criação do livro
router.get('/criar', controllerLivros.cria_get);

// Rota para recebe os dados do formulário de criação
router.post('/criar', controllerLivros.cria_post);

// Rota para alterar o status
router.get('/novo_status/:id/:novo_status', controllerLivros.altera_status);


module.exports = router;

