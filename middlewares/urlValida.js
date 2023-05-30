
const {URL} =require('url');

const urlValidar = (req,res,next) => {
    
    try{
        const {origin} = req.body;
        const urlFrontend = new URL(origin);
        
        if(urlFrontend.origin !== "null"){
            if(urlFrontend.protocol === "https" || urlFrontend.protocol === "https:"){
                return next();
            }
            throw new Error("tiene que tener htpps o htpp");
        }
        throw new Error("no valida 😔");



    }catch (error) {
        if(error.message === "Invalid URL"){
        req.flash("mensajes", [{msg: "URL NO VALIDA :("}]);

        }else{
            req.flash("mensajes", [{msg: error.message}]);
        }
        return res.redirect("/");

    }
    
}

module.exports = urlValidar;
































