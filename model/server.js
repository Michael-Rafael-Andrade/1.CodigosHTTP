// Importa o módulo Sequelize para permitir a comunicação com o banco de dados
const { Sequelize } = require('sequelize');

// Instanciar ou criar a conexão cm o banco de dados 'biblioteca' exigido no exercício
const sequelize = new Sequelize(
    'biblioteca',      // nome da base de dados  
    'fullstack',      //  nome do usuário do banco de dados
    'BancoDeDados',  // senha do usuário
    {
        host: 'localhost', // endereço do BD
        dialect: 'mysql'  // dialeto do BD
    }
 );

 // APÓS O TESTE DE CONEXÃO COM O BANCO DE DADOS, DEVE COMENTAR ESTAS LINHAS PARA NÃO FICAR SINCRONIZANDO CONSTANTEMENTE COM O BANCO DE DADOS, BD.
 // CONEXÃO COM O BANCO DE DADOS
 sequelize.authenticate().then(() => {
    console.log('Conexão com banco de dados estabelecida com sucesso.');
 }).catch((error) => {
    console.error('Erro ao se conectar ao banco de dados: ', error);
 });

 module.exports = sequelize; // exportando o módulo