// Importa os tipos de dados e a classe do Sequelize
const { DataTypes, Model } = require('sequelize');

// Importa a conexão que acabamos de criar acima
const sequelize = require('./server.js');

// Define a classe categoria herdando as funcionalidades de Model
class Categoria extends Model{}

// Inicializa a estrutura da tabela no banco de dados
Categoria.init(
    {
        // Atributo ID: Chave Primária e Auto Incremento
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        // Atributo Nome
        nome:{
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

// APÓS CRIAR OS ELEMENTOS DA TABELA DEVE COMENTAR TODO O CÓDIGO DE CRIAÇÃO DOS ELEMENTOS DENTRO DA TABELA 
// CRIAR O BANCO DE DADOS DENTRO DA TABELA 'biblioteca' QUE ESTÁ DENTRO DO MYSQL.
sequelize.sync({ alter: true }).then(() => {
    // alter: true para aplica alterações de código no BD
    console.log('Modelos sincronizados com o banco de dados.');
}).catch((error) => {
    console.error('Erro ao sincronizar modelos com o banco de dados: ',error);
});


// Exporta o modelo para ser usado nos controllers
module.exports = Categoria;