const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
})

const LoginModel = mongoose.model('Login', LoginSchema)

class Login{
    constructor(body){
        this.body = body
        this.errors = []
        this.user = null
    }
    async logar(){
        this.valida()
        if(this.errors.length > 0) return
        this.user = await LoginModel.findOne({ email: this.body.email})
        if(!this.user){
            this.errors.push('E-mail não cadastrado')
            return
        }
        const senhaCorreta = bcryptjs.compareSync(this.body.password, this.user.password)
        if(!senhaCorreta){
            this.errors.push('Senha incorreta')
            return null
        }
        return this.user
    }
    async cadastro(){
        this.valida()
        if(this.errors.length > 0) return
        await this.userExists()
        if(this.errors.length > 0) return
        const salt = bcryptjs.genSaltSync()
        this.body.password = bcryptjs.hashSync(this.body.password, salt)
        this.user = await LoginModel.create(this.body)

        
    }
    async userExists(){
        this.user = await LoginModel.findOne({ email: this.body.email })
        if(this.user) this.errors.push('Já existe um usuário com este e-mail')
    }
    cleanUp(){
        for(const key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = ''
            }
        }
        // Testando se é para cadastro
        if(this.body.emailCadastro && this.body.passwordCadastro){
            this.body = {
                email: this.body.emailCadastro,
                password: this.body.passwordCadastro
            }
        }
    }
    // Método que valida campos do cadastro
    valida(){
        // Validação
        this.cleanUp()
        // Validando e-mail
        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido')
        // Validando senha
        if(this.body.password.length < 3 || this.body.password.length > 50) this.errors.push('A senha precisa ter entre 3 e 50 caracteres')
    }

}


module.exports = Login