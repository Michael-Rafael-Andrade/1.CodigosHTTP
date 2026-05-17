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

// Rota GET - mostrar a tela de detalhes
// Quando a URL for '/livros/detalhes/NUMERO,
// o sistema chama a função 'consulta_livro',
// que acabamos de criar no controller
router.get('/detalhes/:id', controllerLivros.consulta_livro);

// Rota GET - Excluir um livro
// Quando o usuário acessar /livros/excluir/NUMERO
// o sistema chama a função 'exclui_livro' do controller.
router.get('/excluir/:id', controllerLivros.exclui_livro);


module.exports = router;

