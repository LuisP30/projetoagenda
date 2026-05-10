const express = require('express')
const homeController = require('./src/controllers/homeController')
const loginController = require('./src/controllers/loginController')
const contatoController = require('./src/controllers/contatoController')
const myPageController = require('./src/controllers/myPageController')
const { loginRequired } = require('./src/middlewares/middleware')
const route = express.Router()

function meuMiddleware(req, res, next){
    // console.log('Middleware que recebe a requisição primeiro')
    next() // next é utilizado para chamar o próximo middleware
}

// Rotas da página inicial

route.get('/', meuMiddleware, homeController.index, /* Aqui é outro middleware -> */ (req, res) => {
    // console.log('Middleware para depois da requisição tratada')
})

// Rotas de login
route.get('/login', loginController.login)
route.post('/login', loginController.loginPost)
route.post('/cadastro', loginController.cadastro)
route.get('/logout', loginController.logout)

// Rotas de contato
route.get('/contato', loginRequired, contatoController.contato)
route.post('/contato/edit', loginRequired, contatoController.create)
// Recebendo o id como parâmetro na URL
route.get('/contato/:id', loginRequired, contatoController.profile)
route.post('/contato/:id', loginRequired, contatoController.update)
route.get('/contato/delete/:id', loginRequired, contatoController.delete)

// Novas rotas
route.get('/mypage', loginRequired, myPageController.myPage)

module.exports = route

// Criei três middlewares de forma diferente acima para fins didáticos.