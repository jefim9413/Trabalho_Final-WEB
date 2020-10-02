const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/usuario")
const Usuarios = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require("passport")

router.get("/registro",(req,res)=>{
    res.render("usuario/registro")
})

router.post("/registro", (req,res)=>{
    var erros = []
    if(!req.body.nome||typeof req.body.nome == undefined ||req.body.nome == null){
        erros.push({texto: "Nome Inválido"})
    }
    if(!req.body.email||typeof req.body.email == undefined ||req.body.email == null){
        erros.push({texto: "Email Inválido"})
    }
    if(!req.body.senha||typeof req.body.senha == undefined ||req.body.senha == null){
        erros.push({texto: "Senha Inválido"})
    }
    if(req.body.senha.lenght < 4){
        erros.push({texto: "Senha Muito Curta"})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As Senhas São Diferentes"})
    }
    if(erros.length > 0){
        res.render("usuario/registro",{erros})
    }else{
        Usuarios.findOne({Email: req.body.email}).lean().then((usuario)=>{
            if(usuario){
                req.flash("error_msg","Já Existem Uma conta com Esse Email Em Nosso Sistema")
                res.redirect("/usuarios/registro")
            }else{
                 const novoUsuario = new Usuarios({
                     Nome: req.body.nome,
                     Email: req.body.email,
                     Senha: req.body.senha
                 })
                 
                 bcrypt.genSalt(10,(erro,salt)=>{
                     bcrypt.hash(novoUsuario.Senha,salt,(erro,hash)=>{
                         if(erro){
                             req.flash("error_msg","Houve Um erro durante o salvamento")
                             res.redirect("/")
                         }
                         novoUsuario.Senha = hash
                         
                         novoUsuario.save().then(()=>{
                            req.flash("success_msg","Usuario Criado Com Sucesso!")
                            res.redirect("/")
                         }).catch((err)=>{
                             req.flash("erro_msg","Houve Um Erro Ao Criar um Usuario")
                             res.redirect("/usuario/registro")
                         })
                     })
                 })
            }
        }).catch((err)=>{
            req.flash("error_msg","Houve Um erro Interno")
            res.redirect("/")
        })
    }
})

router.get("/login",(req,res)=>{
    res.render("usuario/login")
})


router.post("/login",(req,res,next)=>{
    passport.authenticate("local",{
        successRedirect:"/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req,res,next)
})
module.exports = router