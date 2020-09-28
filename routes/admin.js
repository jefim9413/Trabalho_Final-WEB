const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/categoria")
const Categoria = mongoose.model("categorias")
require("../models/postagem")
const Postagens = mongoose.model("postagens") 



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

router.post('/categoria/delete',(req,res)=>{
    Categoria.deleteOne({_id:req.body.id}).then(() =>{
        req.flash("success_msg","Categoria Deletada Com Sucesso")
        res.redirect("/admin/categoria")
    }).catch((err)=>{
        req.flash("error_msg","Erro Ao Deletar Categoria")
        res.redirect("/admin/categoria")

    })
})

router.get('/postagens', (req, res) => {
    
    Postagens.find().populate("Categoria").sort({Data: 'desc'}).then((postagens) => {
        res.render('./admin/postagens', {postagens: postagens.map(postagens => postagens.toJSON())})
    }).catch((error) => {
        console.log('houve um erro ao listar as categorias ' + erro)
        res.redirect('/admin')
    })
})

router.get("/postagens/edit/:id",(req,res)=>{
    Postagens.findOne({_id:req.params.id}).lean().then((postagens)=>{
        Categoria.find().lean().then((categoria)=>{
            res.render('admin/editpostagens', {categoria:categoria,postagens:postagens})
        }).catch((err) =>{
            req.flash("error_msg","erro ao carregar dados da postagem")
            res.redirect("/admin/postagens")
       })
        
    }).catch((err) =>{
         req.flash("error_msg","Esta postagem não existe")
         res.redirect("/admin/postagens")
    })
})

router.post("/postagens/edit",(req,res)=>{
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
    
    Postagens.findOne({_id:req.body.id}).then((postagem) =>{
        postagem.Titulo  = req.body.titulo
        postagem.Slug  = req.body.slug
        postagem.Descricao  = req.body.descricao
        postagem.Conteudo  = req.body.conteudo
        postagem.Categoria  = req.body.categoria
        postagem.save().then(()=>{
            req.flash("success_msg", "Postagem Editada com Sucesso")
            res.redirect("/admin/postagens")
        }).catch((err) =>{
            req.flash("error_msg","Houve um Erro ao salvar a Edição da Postagem !")
            res.redirect("/admin/postagens")
        })
    }).catch((err) =>{
        req.flash("error_msg","Houve um Erro ao Editar a Postagem!")
        res.redirect("/admin/postagens")
    })
}
})

router.post('/postagens/delete',(req,res)=>{
    Postagens.deleteOne({_id:req.body.id}).then(() =>{
        req.flash("success_msg","Postagem Deletada Com Sucesso")
        res.redirect("/admin/postagens")
    }).catch((err)=>{
        req.flash("error_msg","Erro Ao Deletar Postagem")
        res.redirect("/admin/postagens")
    })
})

router.get('/postagens/add',(req,res)=>{
    Categoria.find().lean().then((categorias)=>{
        res.render("admin/addpostagem",{categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao carregar o Formulário")
        res.redirect("/admin")
    })
})

router.post("/postagens/nova",(req,res)=>{
    var erros = []
    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria Invalida, Registre uma Catedoria"})
    }
    if(erros.length > 0){
        res.render("admin/postagens",{erros:erros})
    }else{
        const nova_postagem = {
            Titulo: req.body.titulo,
            Slug:req.body.slug,
            Descricao: req.body.descricao,
            Conteudo: req.body.conteudo,
            Categoria: req.body.categoria   
        }
        new Postagens(nova_postagem).save().then(()=>{  
            req.flash("success_msg","Postagem Criada Com Sucesso !")
            res.redirect("/admin/postagens")
        }).catch((err) =>{
            req.flash("error_msg","Houve um Erro ao Salvar, Tente Novamente!")
            res.redirect("/admin/postagens")
        })
    }

})
router.get('/categoria/add',(req,res) =>{
    res.render("admin/addcategoria")
})


module.exports = router