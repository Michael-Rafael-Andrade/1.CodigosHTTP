// Importa os tipos de dados e a classe do Sequelize
const { DataTypes, Model } = require('sequelize');

// Importa a conexão que acabamos de criar acima
const sequelize = require('./server.js');

// Criando o modelo usuário
class Usuario extends Model { } // classe herdando de 'Model'

Usuario.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        senha_hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        perfil:{
            type: DataTypes.ENUM('admin', 'bibliotecario', 'usuario'),
            allowNull: false,
            defaultValue: 'usuario' // Todos que cadastrar nasce como 'usuario' comum
        }
    },
    {
        sequelize,
        freezeTableName: true,
        createdAt: 'criada_em',
        updatedAt: 'atualizada_em',
    },
);


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
        },
        usuario_id: {
            type: DataTypes.INTEGER,
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
                'disponivel',
                'emprestado'),
            allowNull: false,
            defaultValue: 'disponível',
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false
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

/* Relação 1 usuário tem muitas categorias */
Usuario.hasMany(Categoria, {
    as: 'categorias', // nome de associação
    foreignKey: 'usuario_id' // Nome da coluna que vai conectar as tabelas
});


/* Uma categoria pertence a um usuário */
Categoria.belongsTo(Usuario, {
    as: 'usuario', // nome de associação
    foreignKey: 'usuario_id' // Nome da coluna que vai conectar as tabelas
});

/* Relação 1 usuário tem muitos livros */
Usuario.hasMany(Livro, {
    as: 'livros', // nome de associação
    foreignKey: 'usuario_id' // Nome da coluna que vai conectar as tabelas
});

/* Um livro pertence a um usuário */
Livro.belongsTo(Usuario, {
    as: 'usuario', // nome da associação
    foreignKey: 'usuario_id' // Nome da coluna que vai conectar as tabelas
})


// Uma categoria tem muitos livros
Categoria.hasMany(Livro, {
    as: 'livros_categoria', // nome de associação
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
module.exports = { Categoria, Livro, Usuario };