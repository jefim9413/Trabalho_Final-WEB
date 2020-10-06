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
    Raridade: {
        type: Schema.Types.ObjectId,
        ref:"raridade",
        required: true
    },
    Categoria:{
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    },
    Img1: {
        type: Boolean,
        default: false,
    },
    
    Img2: {
        type: Boolean,
        default: false,
    },
    
    Img3: {
        type: Boolean,
        default: false,
    },
    Data:{
        type: Date,
        default: Date.now()

    }
})

mogoose.model("postagens", Postagem)