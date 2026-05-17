// ControllerIndex.js
// Gerencia a tela principal e os filtros

// Importa os modelos Livro e Categoria
const { Livro, Categoria, Usuario } = require('../model/modelos.js');

exports.tela_principal = async function (req, res) {
    try {

        // 1. CRIAÇÃO AUTOMÁTICA DE CATEGORIAS (bulkCreate)
        // Busca todas as categorias para ver se a tabela está vazia
        let categorias = await Categoria.findAll();

        // Se o vetor retornar vazio (0 categorias), criamos as padrão
        // if (categorias.length === 0) {
        //     await Categoria.bulkCreate([
        //         { nome: 'Informática' },
        //         { nome: 'Ficção Científica' },
        //         { nome: 'Romance' },
        //         { nome: 'Biografia' }
        //     ]);
        //     // Busca as categorias novamente para pegar os IDs gerados no banco
        //     categorias = await Categoria.findAll();
        // }

        // Verifica quantas categorias existem no banco
        const totalCategorias = await Categoria.count();

        // Se não houver nenhuma categoria, vamos criar as padrão
        if (totalCategorias === 0) {
            // Busca o primeiro usuário cadastrado no sistema (o que você acabou de criar)
            const primeiroUsuario = await Usuario.findOne();

            // Se existir um usuário, cria as categorias atreladas ao ID dele
            if (primeiroUsuario) {
                await Categoria.bulkCreate([
                    { nome: 'Informática', usuario_id: primeiroUsuario.id },
                    { nome: 'Ficção Científica', usuario_id: primeiroUsuario.id },
                    { nome: 'Romance', usuario_id: primeiroUsuario.id },
                    { nome: 'Biografia', usuario_id: primeiroUsuario.id }
                ]);
                console.log("Categorias padrão criadas com sucesso!");
            }
        }

        // try e catch
        // Pegar o filtro de categoria via query na URL (/?categoria=1)
        const id_categoria_filtro = req.query.categoria;

        // Prepara as opções de busca, incluindo a tabela Categoria (Relacionamento)
        let opcoes_busca = {
            include: { model: Categoria, as: 'categoria' }
        };

        // Guarda o nome do filtro para exibir no HTML
        let nome_categoria_atual = "Todas";

        // Validação de query param da categoria
        if (id_categoria_filtro) {
            const id_cat = Number(id_categoria_filtro);

            // Verifica se é número, inteiro e positivo
            if (Number.isNaN(id_cat) || !Number.isInteger(id_cat) || id_cat <= 0) {
                return res.status(400).send('ID de categoria inválido');
            }

            // Verifica se a categoria realmente existe no banco
            const categoria_existe = await Categoria.findByPk(id_cat);
            if (!categoria_existe) {
                return res.status(404).send('Categoria não encontrada');
            }

            // Adiciona a condição de filtro na busca do Sequelize
            opcoes_busca.where = { id_categoria: id_cat };

            // Define o nome da categoria atual para a tela
            nome_categoria_atual = categoria_existe.nome;
        }

        // Lista os livros (com ou sem filtro) e todas as categorias (para os botões)
        const livros = await Livro.findAll(opcoes_busca);

        // Formata a data de criação padrão BR
        livros.forEach(livro => {
            livro.criado_em_fmt = new Date(livro.criado_em).toLocaleDateString('pt-BR');
        });

        const contexto = {
            titulo_pagina: "Biblioteca Comunitária",
            livros: livros,
            categorias: categorias, // Passa as categorias para renderizar os filtros
            filtro_atual: nome_categoria_atual // Passa o nome para o HTML
        };

        return res.render('index', contexto);

    } catch (error) {
        console.error('Erro ao listar livros: ', error);
        return res.status(500).send('Erro ao listar livros');

    }
}