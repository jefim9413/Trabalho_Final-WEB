if(process.env.NODE_ENV == "production"){
    module.exports ={mongoURI: "mongodb+srv://jefim9413:jefim1235@cluster0.5lxq6.gcp.mongodb.net/test"}
}else{
    module.exports = {mongoURI:"mongodb://localhost/TRABALHO_FINAL"}
}