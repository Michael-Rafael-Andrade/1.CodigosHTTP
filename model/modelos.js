// Importa os tipos de dados e a classe do Sequelize
const { DataTypes, Model } = require('sequelize');

// Importa a conexão que acabamos de criar acima
const sequelize = require('./server.js');

// Define a classe categoria herdando as funcionalidades de Model
class Categoria extends Model { }

// Inicializa a estrutura da tabela no banco de dados
Categoria.init(
    {
        // Atributo ID: Chave Primária e Auto Incremento
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        // Atributo Nome
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,  // A conexão que o modelo deve usar
        freezeTableName: true, // Garante que a tabela se chame 'Categoria' e não 'Cetegorias'
        createdAt: 'criado_em', // Nome customizado para a data de criação
        updatedAt: 'atualizado_em' // Nome customizado para a data de atualização
    }
);

/**
 *  DEFINIÇÃO DO MODELO: LIVRO
 */

class Livro extends Model { }
Livro.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        titulo: {
            type: DataTypes.STRING, allowNull: false
        },
        autor: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(
                'disponível',
                'emprestado'),
            allowNull: false,
            defaultValue: 'disponível',
        }
    },
    {
        sequelize,
        freezeTableName: true,
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em'
    }
);

/*

    RELACIONAMENTO (1 : N)

*/
// Uma categoria tem muitos livros
Categoria.hasMany(Livro, {
    as: 'categoria', // nome de associação
    foreignKey: 'id_categoria' // Nome da coluna que vai conectar as tabelas
});

// Um Livro pertence a uma categoria
Livro.belongsTo(Categoria, {
    as: 'categoria', // nome do atributo de associação 
    foreignKey: 'id_categoria' // Deve ser o mesmo nome colocado acima
})


// APÓS CRIAR OS ELEMENTOS DA TABELA DEVE COMENTAR TODO O CÓDIGO DE CRIAÇÃO DOS ELEMENTOS DENTRO DA TABELA 
// CRIAR O BANCO DE DADOS DENTRO DA TABELA 'biblioteca' QUE ESTÁ DENTRO DO MYSQL.
sequelize.sync({ alter: true }).then(() => {
    // alter: true para aplica alterações de código no BD
    console.log('Modelos sincronizados com o banco de dados. Tabela Livro e Relacionamentos criados! ');
}).catch((error) => {
    console.error('Erro ao sincronizar modelos com o banco de dados: ', error);
});


// Exporta o modelo para ser usado nos controllers
module.exports = { Categoria, Livro };