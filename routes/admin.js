const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/categoria")
const Categoria = mongoose.model("categorias")


router.get('/', (req, res) => {
    res.render('admin/index');
});

router.get("/categoria",(req,res)=>{
    res.render("admin/categorias")
})
router.post("/categorias/nova",(req,res)=>{

    var erros = []
    
    if(!req.body.nome||typeof req.body.nome == undefined ||req.body.nome == null){
        erros.push({texto: "Nome Inválido"})
    }
    if(!req.body.slug||typeof req.body.slug == undefined ||req.body.slug == null){
        erros.push({texto: "Slug Inválido"})
    }
    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da Categoria é Muito Pequena " })
    }
    if(erros.length > 0 ){
        res.render("admin/addcategoria",{erros : erros})
    }else{    
        const nova_categoria = {
            Nome: req.body.nome,
            Slug: req.body.slug
        }
        console.log(nova_categoria)
        new Categoria(nova_categoria).save().then(()=>{
            req.flash("success_msg","Categoria Criada Com Sucesso !")
            res.redirect("/admin/categoria")
        }).catch((err) =>{
            req.flash("error_msg","Houve um Erro ao Salvar, Tente Novamente!")
            res.redirect("/admin")
        })
    }

})
router.get('/categoria/add',(req,res) =>{
    res.render("admin/addcategoria")
})


module.exports = router