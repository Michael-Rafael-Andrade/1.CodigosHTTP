// Importa os modelos
const { Livro, Categoria } = require('../model/modelos.js');

// Rota GET para exibir o formulário
exports.cria_get = async function (req, res){
    try{
        // Busca as categorias para preenche o <select> do formulário HTML
        const categorias = await Categoria.findAll();

        const contexto = {
            titulo_pagina: "Cadastrar Novo Livro",
            categorias: categorias
        };

        res.render('cria_livro', contexto);
    } catch(error){
        console.error('Erro ao carrega formulário: ', error);
        return res.status(500).send('Erro ao carregar formulário');
    }
};

// Rota POST para processar o formulário
exports.cria_post = async function(req, res){
    const novo_livro = {
        titulo: req.body.titulo,
        autor: req.body.autor,
        id_categoria: req.body.id_categoria
        // O status padrão é 'disponível', já definidio no modelo!
    };

    // Validação simples igual ao projeto de Demandas
    const erros = [];
    if(!novo_livro.titulo || novo_livro.titulo.trim() === ''){
        erros.push({
            msg: 'Título é obrigatório'
        });
    }
    if(!novo_livro.autor || novo_livro.autor.trim() === ''){
        erros.push({
            msg: 'Autor é obrigatório' 
        });
    }

    const id_cat = Number(novo_livro.id_categoria);
    if(!novo_livro.id_categoria || Number.isNaN(id_cat) || id_cat <= 0){
        erros.push({
            msg: 'Selecione uma categoria válida'
        });
    }

    if(erros.length > 0){
        const categorias = await Categoria.findAll();
        const contexto = {
            titulo_pagina: 'Cadastrar Novo Livro',
            erros: erros,
            old: novo_livro,
            categorias: categorias
        };
        return res.render('cria_livro', contexto);
    }

    try{
        await Livro.create(novo_livro);
        return res.redirect('/'); // Volta para tela inicial
    } catch(error){
        console.error('Erro ao criar livro: ', error);
        return res.status(500).send('Erro ao criar livro');
    }  

};

// Altera o status via URL
exports.altera_status = async function(req, res){
    const id_livro = Number(req.params.id);
    const novo_status = req.params.novo_status;

    // Seus ENUMs definidos no modelo
    const status_permitidos = ['disponível', 'emprestado'];

    // Validações do PDF de Parâmetros de URL
    if(!id_livro || Number.isNaN(id_livro) || !Number.isInteger(id_livro) || id_livro <= 0){
        return res.status(400).send('ID de livro inválido');
    }
    if(!status_permitidos.includes(novo_status)){
        return res.status(400).send('Status inválido');
    }
    try {
        await Livro.update(
            { status: novo_status }, // novos valores
            { where: { id: id_livro } } // condição
        );
        return res.redirect('/');
    } catch (error) {
        console.error('Erro ao alterar status: ', error);
        return res.status(500).send('Erro ao alterar status');
    }
};