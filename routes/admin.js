const { Router } = require('express')
const express = require('express')
const router = express.router()

router.get('/',(req,res)=>{
    res.send("Pagina Principal do Admin")
})


module.exports = router