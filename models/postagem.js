const mogoose = require('mongoose')
const Schema = mogoose.Schema;

const Postagem = new Schema({
    Titulo: {
        type: String,
        required: true
    },
    Slug: {
        type: String,
        required: true
    },
    Descricao: {
        type: String,
        required: true
    },
    Conteudo:{
        type: String ,
        required: true 
    },
    Categoria:{
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    },
    Imagem: {
        type: Boolean,
        default: false,
    },
    Data:{
        type: Date,
        default: Date.now()

    }
})

mogoose.model("postagens", Postagem)