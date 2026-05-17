// ==================================================
// ARQUIVO COMPLETO: controller/controllerLivros.js
// ==================================================

// Importamos os modelos do Banco de Dados.
// Buscamos Livro e Categoria do arquivo de modelos.
const {
    Livro,
    Categoria
} = require('../model/modelos.js');

// ==================================================
// ROTA GET: EXIBIR FORMULÁRIO DE CADASTRO
// ==================================================
exports.cria_get = async function (req, res) {
    try {
        // Busca todas as categorias no banco.
        // Necessário para preencher o select do HTML.
        const categorias = await Categoria.findAll();

        // Monta o pacote de dados para a View.
        const contexto = {
            titulo_pagina: "Cadastrar Novo Livro",
            categorias: categorias
        };

        // Renderiza a tela enviando o contexto.
        res.render('cria_livro', contexto);

    } catch (error) {
        // Registra o erro no terminal do VS Code.
        console.error('Erro ao carregar form: ', error);
        // Envia resposta de erro 500 para o navegador.
        return res.status(500).send(
            'Erro ao carregar formulário'
        );
    }
};

// ==================================================
// ROTA POST: PROCESSAR DADOS DO FORMULÁRIO
// ==================================================
exports.cria_post = async function (req, res) {
    // Coleta as strings digitadas no formulário.
    const novo_livro = {
        titulo: req.body.titulo,
        autor: req.body.autor,
        id_categoria: req.body.id_categoria,
        usuario_id: req.user.id // necessário para pegar o ID do usuário logado
    };

    // Cria um vetor vazio para listar os erros.
    const erros = [];

    // Valida se o título existe e não está em branco.
    if (!novo_livro.titulo ||
        novo_livro.titulo.trim() === '') {
        erros.push({
            msg: 'Título é obrigatório'
        });
    }

    // Valida se o autor existe e não está em branco.
    if (!novo_livro.autor ||
        novo_livro.autor.trim() === '') {
        erros.push({
            msg: 'Autor é obrigatório'
        });
    }

    // Transforma o ID recebido em formato numérico.
    const id_cat = Number(novo_livro.id_categoria);

    // Valida se a categoria é nula ou inválida.
    if (!novo_livro.id_categoria ||
        Number.isNaN(id_cat) ||
        id_cat <= 0) {
        erros.push({
            msg: 'Selecione uma categoria válida'
        });
    }

    // Se o vetor acumulou qualquer erro durante os testes...
    if (erros.length > 0) {
        // Recarrega as categorias para preencher o select.
        const categorias = await Categoria.findAll();

        // Prepara contexto com dados digitados (old) e erros.
        const contexto = {
            titulo_pagina: 'Cadastrar Novo Livro',
            erros: erros,
            old: novo_livro,
            categorias: categorias
        };

        // Devolve o usuário para a tela com os avisos.
        return res.render('cria_livro', contexto);
    }

    try {
        // Grava o novo registro no banco via Sequelize.
        await Livro.create(novo_livro);
        // Redireciona para a listagem na página raiz.
        return res.redirect('/');

    } catch (error) {
        // Registra no terminal caso o banco falhe.
        console.error('Erro ao criar livro: ', error);
        // Envia uma mensagem amigável de erro 500.
        return res.status(500).send(
            'Erro ao criar livro'
        );
    }
};

// ==================================================
// ROTA GET: ALTERAR STATUS (SEM ACENTOS NA URL)
// ==================================================
exports.altera_status = async function (req, res) {
    // Converte o ID recebido na URL para número.
    const id_livro = Number(req.params.id);
    // Recupera o novo texto de status enviado na URL.
    const novo_status = req.params.novo_status;

    // Define os valores válidos do ENUM sem acento.
    const status_permitidos = [
        'disponivel',
        'emprestado'
    ];

    // Valida se o ID é numérico, inteiro e válido.
    if (!id_livro ||
        Number.isNaN(id_livro) ||
        !Number.isInteger(id_livro) ||
        id_livro <= 0) {
        return res.status(400).send('ID inválido');
    }

    // Valida se o status faz parte da lista aceita.
    if (!status_permitidos.includes(novo_status)) {
        return res.status(400).send('Status inválido');
    }

    try {
        // Executa o comando UPDATE do banco via Sequelize.
        await Livro.update(
            { status: novo_status },
            { where: { id: id_livro } }
        );

        // Recarrega a tela inicial para ver as mudanças.
        return res.redirect('/');

    } catch (error) {
        // Registra a falha técnica interna no console.
        console.error('Erro ao mudar status: ', error);
        // Informa falha de processamento 500.
        return res.status(500).send(
            'Erro ao alterar status do livro'
        );
    }
};

// ==================================================
// ROTA GET: MOSTRAR DETALHES DE UM ÚNICO LIVRO
// ==================================================
exports.consulta_livro = async function (req, res) {
    // Captura o ID do livro direto dos parâmetros da URL.
    const id_livro = Number(req.params.id);

    // Valida se o formato do ID está correto e seguro.
    if (!id_livro ||
        Number.isNaN(id_livro) ||
        !Number.isInteger(id_livro) ||
        id_livro <= 0) {
        return res.status(400).send('ID inválido');
    }

    try {
        // Executa busca por Chave Primária (findByPk).
        // raw: true traz o objeto Javascript limpo.
        const livro = await Livro.findByPk(
            id_livro,
            { raw: true }
        );

        // Se o banco retornar vazio, o livro não existe.
        if (!livro) {
            return res.status(404).send(
                'Livro não encontrado'
            );
        }

        // Converte o carimbo de data para formato nacional.
        livro.criada_em_fmt = new Date(
            livro.criado_em).toLocaleDateString('pt-BR');

        // Estrutura o contexto de dados para a View.
        const contexto = {
            titulo_pagina: "Detalhes do Livro",
            livro: livro
        };

        // Renderiza a tela específica de consulta.
        return res.render('consulta_livro', contexto);

    } catch (error) {
        // Exibe no terminal caso o select falhe.
        console.error('Erro ao buscar livro: ', error);
        // Entrega o código HTTP 500 para o navegador.
        return res.status(500).send(
            'Erro ao recuperar livro'
        );
    }

};

// Rota get: Excluir um livro do banco de dados
exports.exclui_livro = async function (req, res) {
    // Captura o ID do livro direto da URL
    const id_livro = Number(req.params.id);

    // Valida se o formato do ID está correto e seguro.
    if (!id_livro || Number.isNaN(id_livro) || !Number.isInteger(id_livro) || id_livro <= 0) {
        return res.status(400).send('ID inválido');
    }

    try {
        // Exclusão no Banco de Dados:
        // O método 'destroy' do Sequelize apaga a linha
        // inteira da tabela onde o 'id' for igual ao 
        // 'id_livro' que recebemos na URL.
        await Livro.destroy({
            where: { id: id_livro } // Onde a condição para excluir é esta.
        });

        // Redireciona o usuário de volta para 
        // tela inicial (raiz) atualizada.
        return res.redirect('/');
    } catch (error) {
        // Exibe no terminal caso o delete falhe.
        console.error('Erro ao excluir livro: ', error);
        // Entrega o código HTTP 500 paa o navegador.
        return res.status(500).send('Erro ao excluir livro');
    };
};