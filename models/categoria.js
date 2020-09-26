const mengoose = require("mongoose")
const Schema = mengoose.Schema;

const Categoria = new Schema({
    Nome: {
        type: String,
        required: true
    },
    Slug: {
        type: String,
        required: true
    },
    Data: {
        type: Date,
        default: Date.now()
    }
})

mengoose.model("categorias", Categoria)