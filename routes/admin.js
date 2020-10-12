const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/categoria")
const Categoria = mongoose.model("categorias")
require("../models/postagem")
const Postagens = mongoose.model("postagens") 
require("../models/usuario")
const Usuarios = mongoose.model("usuarios")
require("../models/raridade")
const Raridade = mongoose.model("raridade")
const {eAdmin} = require("../config/eAdmin")
const multer = require("multer")

const storage = multer.diskStorage({

    destination: function(req,res,cb){
        cb(null,"public/img")
    },
    filename: function(req,file,cb){
        Postagens.findOne({_id:req.body.id}).then((postagem) =>{
            if(!postagem.Img1){   
                cb(null,req.params.id+"1.png")
            }else if(!postagem.Img2){
                cb(null,req.params.id+"2.png")
            }else{
                cb(null,req.params.id+"3.png")
            }  
        }).catch((err) =>{
            req.flash("error_msg","Houve um Erro ao Editar a Postagem!")            
        })
        
        
        
    }
})
const upload = multer({storage})


router.post("/upload/:id",eAdmin,upload.single("arquivo"),(req,res)=>{
    Postagens.findOne({_id:req.body.id}).then((postagem) =>{
        if(!postagem.Img1){
            postagem.Img1 = true
        }else if(!postagem.Img2){
            postagem.Img2 = true
        }else{
            postagem.Img3 = true
        }
        postagem.save().then(()=>{
            req.flash("success_msg", "Imagem Adicionada com Sucesso")
            res.redirect("/admin/postagens")
        }).catch((err) =>{
            req.flash("error_msg","Houve um Erro ao salvar a Edição da Postagem !")
            res.redirect("/admin/postagens")
        })
    }).catch((err) =>{
        req.flash("error_msg","Houve um Erro ao Editar a Postagem!")
        res.redirect("/admin/postagens")
    })

})

router.get('/',eAdmin,(req, res) => {
   res.render("admin/index")
});

router.get("/raridade",eAdmin,(req,res)=>{
    Raridade.find().sort({Data: 'desc'}).lean().then((raridades) => {
        res.render('./admin/raridade',{raridades: raridades})
    }).catch((error)=>{
        console.log('houve um erro ao listar as Raridade ' + erro)
        res.redirect('/admin')
    })
})

router.get('/raridade/add',eAdmin,(req,res)=>{
    res.render("admin/addraridade")
})

router.post("/raridade/nova",eAdmin,(req,res)=>{
    
    
    
    const nova_raridade = {
        Nome: req.body.nome
    }
    new Raridade(nova_raridade).save().then(()=>{
        req.flash("success_msg","Raridade Criada Com Sucesso !")
        res.redirect("/admin/raridade")
    }).catch((err) =>{
        req.flash("error_msg","Houve um Erro ao Salvar, Tente Novamente!")
        res.redirect("/admin/raridade")
    })
})




router.get('/categoria',eAdmin, (req, res) => {
    Categoria.find().sort({Data: 'desc'}).then((categoria) => {
        res.render('./admin/categorias', {categorias: categoria.map(Categoria => Categoria.toJSON())})
    }).catch((error) => {
        console.log('houve um erro ao listar as Categorias ' + erro)
        res.redirect('/admin')
    })
})

router.get("/usuario",eAdmin,(req,res)=>{
    Usuarios.find().sort({Data: 'desc'}).then((usuario) => {
        res.render('./admin/usuario', {usuario: usuario.map(Usuarios => Usuarios.toJSON())})
    }).catch((error) => {
        console.log('houve um erro ao listar os Usuario ' + erro)
        res.redirect('/admin')
    })
})

router.post("/categorias/nova",eAdmin,(req,res)=>{

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

router.get("/categoria/edit/:id",eAdmin,(req,res)=>{
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render('admin/editCategoria',{categoria:categoria})
    }).catch((err) =>{
         req.flash("error_msg","Está Categoria não existe")
         res.redirect("/admin/categoria")
    })
})

router.get("/raridade/edit/:id",eAdmin,(req,res)=>{
    Raridade.findOne({_id:req.params.id}).lean().then((raridade)=>{
        res.render('admin/editraridade', {raridade:raridade})
    }).catch((err) =>{
         req.flash("error_msg","Está Raridade não existe")
         res.redirect("/admin/raridade")
    })
})

router.get("/usuario/edit/:id",eAdmin,(req,res)=>{
    Usuarios.findOne({_id:req.params.id}).lean().then((usuario)=>{
        res.render('admin/editusuario', {usuario:usuario})
    }).catch((err) =>{
         req.flash("error_msg","Este Usuario não existe")
         res.redirect("/admin/usuario")
    })
})


router.post("/usuario/edit",eAdmin,(req,res)=>{
    Usuarios.findOne({_id:req.body.id}).then((usuario) =>{
        usuario.Nome = req.body.nome
        usuario.eAdmin = req.body.admin

        usuario.save().then(()=>{
            req.flash("success_msg", "Usuario Editado com Sucesso")
            res.redirect("/admin/usuario")
        }).catch((err) =>{
            req.flash("error_msg","Houve um Erro ao salvar a Edição de Usuario !")
            res.redirect("/admin/usuario")
        })
    }).catch((err) =>{
        req.flash("error_msg","Houve um Erro ao Editar o Usuario!")
        res.redirect("/admin/usuario")
    })
})

router.post('/categoria/edit',eAdmin,(req,res)=>{
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
})

router.post("/raridade/edit",eAdmin,(req,res)=>{
    Raridade.findOne({_id:req.body.id}).then((raridade) =>{
        raridade.Nome = req.body.nome

        raridade.save().then(()=>{
            req.flash("success_msg", "Raridade Editada com Sucesso")
            res.redirect("/admin/raridade")
        }).catch((err) =>{
            req.flash("error_msg","Houve um Erro ao salvar a Edição da Raridade !")
            res.redirect("/admin/raridade")
        })
    }).catch((err) =>{
        req.flash("error_msg","Houve um Erro ao Editar a Raridade!")
        res.redirect("/admin/raridade")
    })
})


router.post('/categoria/delete',eAdmin,(req,res)=>{
    Categoria.deleteOne({_id:req.body.id}).then(() =>{
        req.flash("success_msg","Categoria Deletada Com Sucesso")
        res.redirect("/admin/categoria")
    }).catch((err)=>{
        req.flash("error_msg","Erro Ao Deletar Categoria")
        res.redirect("/admin/categoria")

    })
})

router.post("/raridade/delete",eAdmin,(req,res)=>{
    Raridade.deleteOne({_id:req.body.id}).then(() =>{
        req.flash("success_msg","Raridade Deletada Com Sucesso")
        res.redirect("/admin/raridade")
    }).catch((err)=>{
        req.flash("error_msg","Erro Ao Deletar Raridade")
        res.redirect("/admin/raridade")

    })
})

router.get('/postagens',eAdmin, (req, res) => { 
    Postagens.find().populate("Categoria").populate("Raridade").sort({Data: 'desc'}).then((postagens) => {
        res.render('./admin/postagens', {postagens: postagens.map(postagens => postagens.toJSON())})
    }).catch((error) => {
        console.log('houve um erro ao listar as categorias ' + erro)
        res.redirect('/admin')
    })
})

router.get("/postagens/addimg/:id",eAdmin,(req,res)=>{
    Postagens.findOne({_id:req.params.id}).lean().then((postagens)=>{
            res.render('admin/addimagem', {postagens:postagens})
    }).catch((err) =>{
         req.flash("error_msg","Esta postagem não existe")
         res.redirect("/admin/postagens")
    })
})

router.get("/postagens/edit/:id",eAdmin,(req,res)=>{
    Postagens.findOne({_id:req.params.id}).lean().then((postagens)=>{
        Categoria.find().lean().then((categoria)=>{
            Raridade.find().lean().then((raridade)=>{
                res.render('admin/editpostagens', {categoria:categoria,raridade:raridade,postagens:postagens})
            }).catch((err) =>{
                req.flash("error_msg","erro ao carregar dados da postagem")
                res.redirect("/admin/postagens")
           })   
        }).catch((err) =>{
            req.flash("error_msg","erro ao carregar dados da postagem")
            res.redirect("/admin/postagens")
       })
    }).catch((err) =>{
         req.flash("error_msg","Esta postagem não existe")
         res.redirect("/admin/postagens")
    })
})

router.post("/postagens/edit",eAdmin,(req,res)=>{
    Postagens.findOne({_id:req.body.id}).then((postagem) =>{
        postagem.Titulo  = req.body.titulo
        postagem.Slug  = req.body.slug
        postagem.Descricao  = req.body.descricao
        postagem.Conteudo  = req.body.conteudo
        postagem.Raridade  = req.body.raridade
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

})

router.post('/postagens/delete',eAdmin,(req,res)=>{
    Postagens.deleteOne({_id:req.body.id}).then(() =>{
        req.flash("success_msg","Postagem Deletada Com Sucesso")
        res.redirect("/admin/postagens")
    }).catch((err)=>{
        req.flash("error_msg","Erro Ao Deletar Postagem")
        res.redirect("/admin/postagens")
    })
})

router.get('/postagens/add',eAdmin,(req,res)=>{


    Categoria.find().lean().then((categorias)=>{
        Raridade.find().lean().then((raridade)=>{
            res.render("admin/addpostagem",{categorias: categorias , raridade:raridade})
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao carregar o Formulário")
            res.redirect("/admin/postagens")
        })
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao carregar o Formulário")
        res.redirect("/admin/postagens")
    })
})

router.post("/postagens/nova",eAdmin,(req,res)=>{
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
            Raridade: req.body.raridade,
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
router.get('/categoria/add',eAdmin,(req,res) =>{
    res.render("admin/addcategoria")
})


module.exports = router