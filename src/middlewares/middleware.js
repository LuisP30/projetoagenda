exports.middlewareGlobal = (req, res, next) => {
    // console.log('Middleware global')
    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')
    res.locals.user = req.session.user
    next()
}

exports.middlewareChecaErroCSRF = (err, req, res, next) => {
    // console.log('Middleware para verificar erros de CSRF Token')
    if(err){
        console.log(err)
        return res.send('Erro de CSRF Token')
    }
    next()
}

exports.middlewareCSRFToken = (req, res, next) => {
    // console.log('Middleware para enviar CSRF Token para as páginas')
    res.locals.csrfToken = req.csrfToken()
    next()
}

exports.loginRequired = (req, res, next) => {
    if(!res.locals.user) return res.redirect('/login')
    next()
}