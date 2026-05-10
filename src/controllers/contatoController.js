const { userSetter } = require('core-js/es/symbol')
const Contato = require('../models/ContatoModel')

exports.contato = (req, res, next) => {
    res.render('contato', {contato: {}}) // Mandando um contato fake
}
exports.create = async (req, res, next) => {
    try{
        const contato = new Contato(req.body)
        await contato.create()
        if(contato.errors.length > 0){
            req.flash('errors', contato.errors)
            return req.session.save(() => {
                res.redirect('/contato')
            })
        }
        console.log(contato)
        req.flash('success', 'Contato cadastrado!')
        req.session.save(() => {
            res.redirect(`/contato/${contato.contato._id}/`)
        })
    }catch(e){
        console.log(e)
    }
}

exports.update = async (req, res, next) => {
    try{
        if(!req.params.id) return res.render('404')
        const contato = new Contato(req.body)
        await contato.update(req.params.id)
        if(contato.errors.length > 0){
            req.flash('errors', contato.errors)
            return req.session.save(() => {
                res.redirect(`/contato/${req.params.id}/`)
            })
        }
        req.flash('success', 'Contato atualizado!')
        req.session.save(() => {
            res.redirect(`/contato/${contato.contato._id}/`)
        })

    }catch(e){
        console.log(`o erro em update: ${e}`)
    }
}

exports.profile = async (req, res, next) => {
    if(!req.params.id) return res.render('404')

    const user = await Contato.searchById(req.params.id)
    if(!user) return res.render('404')

    res.render('contato', {
        contato: user
    })
}

exports.delete = async (req, res) => {
    if(!req.params.id) return res.render('404')
    try{
        await Contato.deleteContato(req.params.id)
        req.flash('success', 'Contato excluído!')
        req.session.save(() => {
            res.redirect("/")
        })
    }catch(e){
        console.log(e)
    }
}