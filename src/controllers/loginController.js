const Login = require('../models/LoginModel')

exports.login = (req, res, next) => {
    if(req.session.user) return res.redirect('/')
    res.render('login')
}

exports.loginPost = async (req, res, next) => {
    try {
        const login = new Login(req.body)
        req.session.user = await login.logar()
        if(login.errors.length > 0){
            req.flash('errors', login.errors)
            req.session.save(() => {
                return res.redirect('login')
            })
            return
        }
        req.session.user = login.user
        req.flash('success', `Bem-vindo ${req.session.user.email}`)
        req.session.save(() => {
            return res.redirect('/')
        })
        return
    } catch (error) {
        console.log(error)
        return res.render('404')
    }
}

exports.cadastro = async (req, res, next) => {
    try {
        const login = new Login(req.body)
        await login.cadastro()
        if(login.errors.length > 0){
            req.flash('errors', login.errors)
            req.session.save(() => {
                return res.redirect('login')
            })
            return
        }
        req.flash('success', 'Usuário criado com sucesso')
        req.session.save(() => {
            return res.redirect('login')
        })
        return
    } catch (error) {
        console.log(error)
        return res.render('404')
    }
}

exports.logout = (req, res, next) => {
    req.session.destroy()
    res.redirect('/')
}