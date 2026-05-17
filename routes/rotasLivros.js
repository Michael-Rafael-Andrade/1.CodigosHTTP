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
function ehAutenticado(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/usuarios/login');
}

// Middleware que verifica se o usuário é Bibliotecário
function ehBibliotecario(req, res, next) {
    // 1. Verifica se a pessoa está logada
    if (req.isAuthenticated()) {
        // 2. Verifica se a pessoa tem o perfil correto
        if (req.user.perfil === 'bibliotecario') {
            return next(); // Tudo certo, deixa acessar a página!
        } else {
            // Está logado, mas NÃO é bibliotecário (Usuário comum)
            return res.status(403).send("Acesso Negado: Você não tem permissão para realizar esta ação.");
            // Dica: em vez de send(), você poderia usar res.redirect('/') se preferir.
        }
    }
    // Se não estiver logado, manda para o login
    return res.redirect('/usuarios/login');
}

// Rota para método get da criação de livro

// Rota para mostrar a tela de criação do livro
router.get('/criar', ehBibliotecario, controllerLivros.cria_get);

// Rota para recebe os dados do formulário de criação
router.post('/criar', ehBibliotecario, controllerLivros.cria_post);

// Rota para alterar o status
router.get('/novo_status/:id/:novo_status', ehBibliotecario, controllerLivros.altera_status);

// Rota GET - mostrar a tela de detalhes
// Quando a URL for '/livros/detalhes/NUMERO,
// o sistema chama a função 'consulta_livro',
// que acabamos de criar no controller
router.get('/detalhes/:id', controllerLivros.consulta_livro); // Qualquer usuário pode ver

// Rota GET - Excluir um livro
// Quando o usuário acessar /livros/excluir/NUMERO
// o sistema chama a função 'exclui_livro' do controller.
router.get('/excluir/:id', ehBibliotecario, controllerLivros.exclui_livro);


// FIM - AUTENTICAÇÃO DO USUÁRIO

module.exports = router;

