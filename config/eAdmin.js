module.exports = {
    eAdmin: function(req,res,next){
        if(req.isAuthenticated()&& req.user.eAdmin == true){
            return next()
        }
        req.flash("error_msg","Você Não é um admin!!")
        res.redirect("/")
    }
}