const mogoose = require('mongoose')
const Schema = mogoose.Schema;

const Raridades = new Schema({
    Nome:{
        type: String,
        required: true
    },
    Data:{
        type: Date,
        default:Date.now()
    }
})

mogoose.model("raridade",Raridades)