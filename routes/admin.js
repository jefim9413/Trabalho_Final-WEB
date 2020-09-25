
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('admin/index');
});

router.get("/categoria",(req,res)=>{
    res.render("admin/categorias")
})

router.get('/categoria/add',(req,res) =>{
    res.render("admin/addcategoria")
})


module.exports = router