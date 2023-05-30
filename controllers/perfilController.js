
const formidable = require('formidable');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');//file sistem, guardado temporal
const User = require("../models/User");


module.exports.formPerfil = async (req, res) => {
        try {
                const user = await User.findById(req.user.id);
                return res.render("perfil", {user: req.user, imagen: user.imagen});
        } catch (error) {
                req.flash("mensajes", [{msg: "Error al leer el usuario"}]);
                return res.redirect("/perfil");
        }; 
};


module.exports.editarFotoPerfil = async (req, res) => {
        const form = new formidable.IncomingForm()
        form.maxFileSize = 50* 1024 * 1024 //50mb
        form.parse(req,async(err, fields,files)=>{
               try {
                if(err){
                        throw new Error('falló la subida de imagen')
                }
                const file= files.myFile
                if(file.originalFilename === ""){
                        throw new Error('Por favor agrega una imagen...')
                }
                if(!(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')){
                        throw new Error('EL formato de la imagen no es compatible.');
                }
                if(file.size >  50* 1024 * 1024 ){
                        throw new Error('La imagen esta Pesada, carga una menos pesada que sea igual o menor a 5mb')

                }

                //guardar la imagen en un directorio de archivos local
                const extension = file.mimetype.split('/')[1];
                const dirFile = path.join(__dirname, `../public/img/perfiles/${req.user.id}.${extension}`);


                fs.renameSync(file.filepath , dirFile);

                //acomodar la imagen con Jimp para el tamaño y el peso sean los requeridos
                const image= await Jimp.read(dirFile);
                image.resize(200,200).quality(90).writeAsync(dirFile);


                //enviar la imagen en base de datos, en formato string url para despues entrar a ella al archivo donde la guardamos

                const user = await User.findById(req.user.id);
                user.imagen = `${req.user.id}.${extension}`;
                await user.save();






                
                req.flash("mensajes", [{msg: "YA SE SUBIÓ LA IMAGEN"}]);
               } catch (error) {
                req.flash("mensajes", [{msg: error.message}]);
               }finally{
                return res.redirect('/perfil');
               }
        })
};