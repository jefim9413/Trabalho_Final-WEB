//Carregando Módulos 
const express = require('express')
const handlebars = require('express-handlebars')
const bodyPerser = require("body-parser")
const admin = require("./routes/admin")
const app = express()

//const mongoose = require("mongoose")

//Configarações
    //bodyParser 
    app.use(bodyPerser.urlencoded({extended: true}))
    app.use(bodyPerser.json())
    //Handlebars
    app.engine('habdlebars',handlebars({defaultLayout: 'main'}))
    app.set('view engine','handlebers');

//Rotas
    app.use('/admin',admin)
//Outros
const PORT = 8081
app.listen(PORT,()=>{
    console.log("Servidor Rodando! ")
})