var express = require('express');
var router = express.Router();
// Importa o controller de livros
const controllerLivros = require('../controller/controllerLivros');

/* Rota livros */
// router.get('/', function(req, res, next){
//     res.render('livros', { title: 'Livros'} );
// });

// // Rota para mostrar a tela de criação do livro
// router.get('/criar', controllerLivros.cria_get);

// // Rota para recebe os dados do formulário de criação
// router.post('/criar', controllerLivros.cria_post);

// // Rota para alterar o status
// router.get('/novo_status/:id/:novo_status', controllerLivros.altera_status);

// // Rota GET - mostrar a tela de detalhes
// // Quando a URL for '/livros/detalhes/NUMERO,
// // o sistema chama a função 'consulta_livro',
// // que acabamos de criar no controller
// router.get('/detalhes/:id', controllerLivros.consulta_livro);

// // Rota GET - Excluir um livro
// // Quando o usuário acessar /livros/excluir/NUMERO
// // o sistema chama a função 'exclui_livro' do controller.
// router.get('/excluir/:id', controllerLivros.exclui_livro);


// AUTENTICAÇÃO DO USUÁRIO
// Middleware que verifica se o usuário está autenticado.
// Caso contrário, redireciona para a tela de login antes de executar o controller.
function ehAutenticado(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/usuarios/login');
}

// Rota para método get da criação de livro

// Rota para mostrar a tela de criação do livro
router.get('/criar', ehAutenticado, controllerLivros.cria_get);

// Rota para recebe os dados do formulário de criação
router.post('/criar',  ehAutenticado, controllerLivros.cria_post);

// Rota para alterar o status
router.get('/novo_status/:id/:novo_status',  ehAutenticado, controllerLivros.altera_status);

// Rota GET - mostrar a tela de detalhes
// Quando a URL for '/livros/detalhes/NUMERO,
// o sistema chama a função 'consulta_livro',
// que acabamos de criar no controller
router.get('/detalhes/:id', controllerLivros.consulta_livro);

// Rota GET - Excluir um livro
// Quando o usuário acessar /livros/excluir/NUMERO
// o sistema chama a função 'exclui_livro' do controller.
router.get('/excluir/:id',  ehAutenticado, controllerLivros.exclui_livro);


// FIM - AUTENTICAÇÃO DO USUÁRIO

module.exports = router;

