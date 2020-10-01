const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const { use } = require("passport")
const passport = require("passport")

//Model de Usuário
require("../models/usuario")
const Usuario = mongoose.model("usuarios")


module.exports  = function(passport){
    passport.use(new localStrategy({usernameField:'email',passwordField:"senha"},(email,senha,done)=>{
        Usuario.findOne({Email:email}).lean().then((usuario)=>{
            
            if(!usuario){
                return done(null,false,{message: "Está conta não Existe!"})
            }   
            bcrypt.compare(senha,usuario.Senha,(erro,batem)=>{
                 if(batem){
                     return done(null,usuario)
                 }else{
                     return done(null,false,{message: "Senha Incorreta"})
                 }
            })
        })
    }))
    
passport.serializeUser((usuario,done)=>{
    done(null,usuario._id)
})

passport.deserializeUser((id,done)=>{
    Usuario.findById(id,(err,usuario)=>{
        done(err,usuario)
    })
})
}
