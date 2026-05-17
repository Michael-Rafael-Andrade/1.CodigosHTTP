const { Livro, Categoria } = require('../model/modelos.js');


exports.cria_sobre = function(req, res){
    const contexto = {
        title: "Biblioteca comunitária"
    };

    // Página pode ser armazenada em cache por 30 dias
    res.set('Cache-control', 'public, max-age=2592000');

    // Express gera Etag automaticamente

    return res.render('sobre', contexto);
}