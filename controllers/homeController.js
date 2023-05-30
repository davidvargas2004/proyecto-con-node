
const Url = require('../models/Urls.js');


const leerUrls = async(req, res) => {
    try{
        const urls = await  Url.find({user: req.user.id}).lean()//CON ESTO TRAEMOS AL CLIENTE PARA QUE SU URLS LE QUEDEN EN US SESION CON EL REQ.USERS.ID
        res.render("home", {urls:urls}); 
    }catch(error){
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/");
    }
    
}
const agregarUrl = async(req, res )=>{

    const {origin} = req.body;

    try{
        const url = new Url({origin: origin, shortURL:Date.now(), user: req.user.id})
        await url.save()
        req.flash("mensajes",[{msg: "Url agregada"}]);
        return res.redirect("/")
    }catch(error){
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/");
    }
}

const eliminarUrl = async(req, res)=>{
    const {id} = req.params
    try{
        // await Url.findByIdAndDelete(id);
        const url = await Url.findById(id);
        if(!url.user.equals(req.user.id)){
            throw new Error("no es tu url, te estamos vigilando esto es un acto sospechoso")
        }

        await url.remove();
        req.flash("mensajes",[{msg: "Url eliminada"}])
        return res.redirect("/");
    }catch(error){
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/");
    }

}

const editarUrlForm =async(req,res)=>{
    const {id} = req.params
    try{
        const url=await Url.findById(id).lean()
        if(!url.user.equals(req.user.id)){
            throw new Error("no es tu url, te estamos vigilando esto es un acto sospechoso")
        }
        return res.render('home', {url})
    }catch(error){
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/");
    }
}

const editarUrl = async(req,res)=>{
    const {id} = req.params
    const {origin} = req.body;
    try{
        const url = await Url.findById(id);
        if(!url.user.equals(req.user.id)){
            throw new Error("no es tu url, te estamos vigilando esto es un acto sospechoso")
        }
        await url.updateOne({origin});//para editar un elemento 
        req.flash("mensajes",[{msg: "Url editada"}])
        res.redirect("/");
    }catch(error){
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/");
    }
}

const redireccionar = async(req,res) =>{
    const { shortURL } = req.params;
    try {
        const urlDB = await Url.findOne({ shortURL: shortURL});

        res.redirect(urlDB.origin);
    } catch (error) {
        req.flash("mensajes", [{ msg:"No has INICIADO SESION"}]);
        return res.redirect("/auth/login");
    }
}





module.exports ={
    leerUrls,
    agregarUrl,
    eliminarUrl,
    editarUrlForm,
    editarUrl,
    redireccionar,
    
}




