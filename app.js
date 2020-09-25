//Carregando Módulos 
const express = require('express')
const handlebars = require('express-handlebars')
const bodyPerser = require("body-parser")
const admin = require("./routes/admin")
const app = express()
const path = require('path')

//const mongoose = require("mongoose")

//Configarações
    //bodyParser 
        app.use(bodyPerser.urlencoded({extended: true}))
        app.use(bodyPerser.json())
    //Handlebars
  
app.engine('handlebars', handlebars({extname: 'handlebars', defaultLayout: 'main', layoutsDir: __dirname + "/views/layouts"}));
app.set('view engine', 'handlebars')
    //public
        app.use(express.static(path.join(__dirname ,"public")))
//Rotas
    app.use('/admin',admin)
//Outros
const PORT = 8081
app.listen(PORT,()=>{
    console.log("Servidor Rodando! ")
})