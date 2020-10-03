const mogoose = require('mongoose')
const Schema = mogoose.Schema

const Usuario = new Schema({
    Nome:{
        type: String,
        required: true
    },
    Email:{
        type: String,
        required: true
    },
    eAdmin: {
        type: Boolean,
        default: false
    },
    Senha:{
        type: String,
        required: true
    }
})

mogoose.model("usuarios",Usuario)