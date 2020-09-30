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
        type: Number,
        default: 0
    },
    Senha:{
        type: String,
        required: true
    }
})

mogoose.model("usuarios",Usuario)