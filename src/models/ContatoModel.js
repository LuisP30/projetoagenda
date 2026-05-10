const mongoose = require('mongoose')
const validator = require('validator')

const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now() },
})

const ContatoModel = mongoose.model('Contato', ContatoSchema)

function Contato(body){
    this.body = body
    this.errors = []
    this.contato = null
}

// Método que valida campos do cadastro
Contato.prototype.valida = function(){
    // Validação
    this.cleanUp()
    // Validando e-mail
    if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido')
    if(!this.body.nome) this.errors.push('É necessário informar um nome para o contato')
    if(!this.body.email && !this.body.telefone) this.errors.push('É necessário informar ao menos o e-mail ou telefone do contato')
}

Contato.prototype.update = async function(id){
    if(typeof(id) !== 'string') return
    this.valida()
    if(this.errors.length > 0) return
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true })
}


Contato.prototype.create = async function(){
    this.valida()
    if(this.errors.length > 0) return
    this.contato = await ContatoModel.create(this.body)

}

Contato.prototype.cleanUp = function(){
    for(const key in this.body){
        if(typeof this.body[key] !== 'string'){
            this.body[key] = ''
        }
    }
    // Testando se é para cadastro
    if(this.body.emailCadastro && this.body.passwordCadastro){
        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email
        }
    }
}

// Métodos estáticos
Contato.searchById = async (id) => {
    if(typeof(id) !== 'string') return
    const user = await ContatoModel.findById(id)
    return user
}

Contato.searchContatos = async () => {
    const contatos = await ContatoModel.find().sort({ criadoEm: 1 }) // 1 para ordem crescente e -1 para decrescente
    return contatos
}

Contato.deleteContato = async (id) => {
    await ContatoModel.findByIdAndDelete(id)
}

module.exports = Contato