// ControllerIndex.js
// Gerencia a tela principal e os filtros

// Importa os modelos Livro e Categoria
const { Livro, Categoria } = require('../model/modelos.js');

exports.tela_principal = async (req, res){
    try {
        // try e catch
        // Pegar o filtro de categoria via query na URL (/?categoria=1)
        const id_categoria_filtro = req.query.categoria;

        // Prepara as opções de busca, incluindo a tabela Categoria (Relacionamento)
        let opcoes_busca = {
            include: { model: Categoria, as: 'categoria' }
        };

        // Validação de query param da categoria
        if (id_categoria_filtro) {
            const id_cat = Number(id_categoria_filtro);

            // Verifica se é número, inteiro e positivo
            if (Number.isNaN(id_cat) || !Numberr.isInteger(id_cat) || id_cat <= 0) {
                return res.status(400).send('ID de categoria inválido');
            }

            // Verifica se a categoria realmente existe no banco
            const categoria_existe = await Categoria.findByPk(id_cat);
            if (!categoria_existe) {
                return res.status(404).send('Categoria não encontrada');
            }

            // Adiciona a condição de filtro na busca do Sequelize
            opcoes_busca.where = { id_categoria: id_cat };
        }

        // Lista os livros (com ou sem filtro) e todas as categorias (para os botões)
        const livros = await Livro.findAll(opcoes_busca);
        const categorias = await Categoria.findAll();

        // Formata a data de criação padrão BR
        livros.forEach(livro => {
            livro.criado_em_fmt = new Date(livro.criado_em).toLocaleDateString('pt-BR');
        });

        const contexto = {
            titulo_pagina: "Biblioteca Comunitária",
            livros: livros,
            categorias: categorias, // Passa as categorias para renderizar os filtros
        };

        return res.render('index', contexto);

    } catch (error) {
        console.error('Erro ao listar livros: ', error);
        return res.status(500).send('Erro ao listar livros');

    }
}