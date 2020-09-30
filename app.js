//Carregando Módulos 
const express = require('express')
const handlebars = require('express-handlebars')
const bodyPerser = require("body-parser")
const admin = require("./routes/admin")
const app = express()
const path = require('path')
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require ("connect-flash")
require("./models/postagem")
const Postagens = mongoose.model("postagens") 
//Configarações
    //Sessão
        app.use(session({
            secret:"one_above_all",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    //Middleware
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })    
    //Bodyparser 
        app.use(bodyPerser.urlencoded({extended: true}))
        app.use(bodyPerser.json())
    //Handlebars  
        app.engine('handlebars', handlebars({extname: 'handlebars', defaultLayout: 'main', layoutsDir: __dirname + "/views/layouts"}));
        app.set('view engine', 'handlebars')
    //Mongoose
        mongoose.connect("mongodb://localhost/TRABALHO_FINAL", {useNewUrlParser: true, useUnifiedTopology: true}).then(() =>{
            console.log("Conectado com sucesso!")
        }).catch((err) =>{
            mongoose.Promise = global.Promise;
            console.log("Erro ao conectar: " + err)
        })
    //Public
        app.use(express.static(path.join(__dirname ,"public")))
//Rotas
    app.get("/",(req,res)=>{
        Postagens.find().lean().populate("Categoria").sort({Data: "desc"}).then((postagens)=>{
            res.render("index",{postagens:postagens})
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro interno")
            res.redirect("/404")
        })
    }) 

    app.get("/404",(req,res)=>{
        res.send("Erro 404")
    })

    app.use('/admin',admin)
//Outros
const PORT = 8081
app.listen(PORT,()=>{
    console.log("Servidor Rodando! ")
})