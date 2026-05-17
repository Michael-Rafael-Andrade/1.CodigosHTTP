const { Livro, Categoria } = require('../model/modelos.js');


exports.cria_sobre = function(req, res){
    const contexto = {
        title: "Biblioteca comunitária"
    };

    return res.render('sobre', contexto);
}