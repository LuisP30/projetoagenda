// https://webpack.js.org/
// Importa o módulo 'path' do Node.js para manipulação de caminhos de arquivos
const path = require('path');

// Objeto que será exportado como configuração do Webpack
module.exports = {
    // Define o modo de compilação como desenvolvimento
    mode: 'development',
    // Especifica o ponto de entrada para o processo de empacotamento
    entry: './frontend/main.js',
    // Configuração de saída para os arquivos empacotados
    output: {
        // Caminho de saída para os arquivos gerados
        path: path.resolve(__dirname, 'public', 'assets', 'js'),
        // Nome do arquivo de saída gerado pelo Webpack
        filename: 'bundle.js'
    },
    // Configuração dos módulos do Webpack
    module: {
        // Regras para processar diferentes tipos de arquivos
        rules: [{
            // Exclui o diretório 'node_modules' do processo de empacotamento
            exclude: /node_modules/,
            // Expressão regular para identificar arquivos JavaScript
            test: /\.js$/,
            // Configura o uso do Babel para transpilar arquivos JavaScript
            use: {
                loader: 'babel-loader',
                // Opções específicas para o loader Babel
                options: {
                    // Define os presets do Babel a serem usados
                    presets: ['@babel/env']
                }
            }
        },]
    },
    // Especifica o tipo de mapeamento de origem a ser usado
    devtool: 'source-map'
};
