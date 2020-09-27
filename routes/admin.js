const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/categoria")
const Categoria = mongoose.model("categorias")


router.get('/', (req, res) => {
    res.render('admin/index');
});

router.get('/categoria', (req, res) => {
    Categoria.find().sort({Data: 'desc'}).then((categoria) => {
        res.render('./admin/categorias', {categorias: categoria.map(Categoria => Categoria.toJSON())})
    }).catch((error) => {
        console.log('houve um erro ao listar as categorias ' + erro)
        res.redirect('/admin')
    })
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
            res.redirect("/admin/categoria")
        })
    }

})

router.get('/categoria/edit/:id',(req,res) =>{
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render('admin/editcategoria', {categoria:categoria})
    }).catch((err) =>{
         req.flash("error_msg","Está Categoria não existe")
         res.redirect("/admin/categoria")
    })
    
})

router.post('/categoria/edit',(req,res)=>{
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
        
    Categoria.findOne({_id:req.body.id}).then((categoria) =>{
        var slug = req.body.slug
        var nome = req.body.nome
        categoria.Nome = nome
        categoria.Slug = slug

        categoria.save().then(()=>{
            req.flash("success_msg", "Categoria Editada com Sucesso")
            res.redirect("/admin/categoria")
        }).catch((err) =>{
            req.flash("error_msg","Houve um Erro ao salvar a Edição da Categoria !")
            res.redirect("/admin/categoria")
        })
    }).catch((err) =>{
        req.flash("error_msg","Houve um Erro ao Editar a Categoria!")
        res.redirect("/admin/categoria")
    })
}
})

router.get('/categoria/add',(req,res) =>{
    res.render("admin/addcategoria")
})


module.exports = router