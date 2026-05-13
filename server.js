require('dotenv').config()

const express = require('express')
const routes = require('./routes')
const path = require('path')
const app = express()

// Fazendo conexão com o banco de dados
const mongoose = require('mongoose')
mongoose.connect(process.env.CONNECTIONSTRING)
.then(
    () => {
        app.emit('dbconnected')
    } // Servidor emitindo sinal
).catch(e => console.log(e))

// Sessões
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
// Helmet
const helmet = require('helmet')
app.use(helmet())
app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      workerSrc: ["'self'", "blob:"],
      objectSrc: ["'none'"],
      formAction: ["'self'", "http:"],
    },
  }));

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'public')))

// Sessões
const sessionOptions = session({
    secret: '12345',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
})
app.use(sessionOptions)
app.use(flash())

app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

// CSRF Token
const csrf = require('csurf')
app.use(csrf())
// Middlewares
const { middlewareCSRFToken, middlewareGlobal, middlewareChecaErroCSRF } = require('./src/middlewares/middleware')
const exp = require('constants')
app.use(middlewareCSRFToken)
app.use(middlewareGlobal) // Quando não passo a rota, ele fica disponível em todas as rotas
app.use(middlewareChecaErroCSRF)


app.use(routes)
const porta = 3000
// Caso ocorra o evento de banco de dados conectado, o servidor é iniciado na porta especificada
app.on('dbconnected', () => {
    app.listen(porta, () => {
        console.log(`Servidor ouvindo no endereço: http://127.0.0.1:${porta}`)
    })
})