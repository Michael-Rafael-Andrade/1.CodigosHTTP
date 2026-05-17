var express = require('express');
var router = express.Router();

// Importa o seu controller de usuários 
const controllerUsuarios = require('../controller/controllerUsuarios');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.render('usuarios', { title: 'users'});
// });

// Rota GET - Tela de Cadastro
router.get('/cadastro', controllerUsuarios.cria_get);

// Rota POST - Recebe os dados de cadastro
router.post('/cadastro', controllerUsuarios.cria_post);

// Rota GET - Tela de login
router.get('/login', controllerUsuarios.login_get);

// Rota POST - Processa o Login
router.post('/login', controllerUsuarios.login_post);

// Rota GET - Faz o Logout
router.get('/logout', controllerUsuarios.logout);

module.exports = router;
