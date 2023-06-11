const { json } = require("express");
const User = require("../models/User");
const {validationResult}= require("express-validator");
const nodemailer = require("nodemailer");
require('dotenv').config()


const registerForm = (req, res) => {
    res.render('register');
}


const loginForm = (req, res) => {
    res.render('login');
}








const registerUser = async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash("mensajes", errors.array());
        return res.redirect("/auth/register");
    }

    const {userName,email,password} = req.body
    try {
        let user = await User.findOne({email:email});
        if (user) throw new Error("ya existe el usuario");
        
        user = new User({userName,email,password,cuentaConfirmada:false,tokenConfirm:Date.now()});
        await user.save();

        //  correo para que el clietne valide

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.USEREMAIL,
                pass: process.env.PASSEMAIL
            }
         });

        await transport.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: user.email, // list of receivers
            subject: "Verifica tu cuenta de correo", // Subject line
            // text: "Hello world?", // plain text body
            html: `<a href="${process.env.PATHHEROKU || 'http://localhost:5000'}auth/confirmar/${user.tokenConfirm}" >Verirfica tu cuenta aqui</a>`, // html body
        });

        req.flash("mensajes", [{msg:"Revisa el correo electronico y valida tú cuenta"}]);

        return res.redirect("/auth/login")
        
        
    }catch (error){
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/auth/register");
    
    }
    
}

const confirmarCuenta = async(req,res) => {
    const {tokenConfirm} = req.params;
    try {
        const user = await User.findOne({tokenConfirm: tokenConfirm});
        if(!user) throw new Error('No existe el usuario en nuestras bases de datos');

        user.cuentaConfirmada = true;
        user.tokenConfirm = null;
        


        await user.save();
        //Entrar al /confirmar/tokendelusuario se puede obsrvar en la base de datos, para validar el estado de cuenta confirmada 
        req.flash("mensajes", [{msg:"Cuenta verificada, puedes iniciar sesión."}]);
        res.render("login");

    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/auth/login");
        
    }

}
//validamos una cuenta con tokenconfirm esto nos acepta la cuenta y la valida como registro exitoso esto esta anclado a auth.js y conecta con authController.js para traer el elemto a confirmar toca con la deficion de findOne.



const loginUser = async(req, res) => {

    const errors = validationResult(req);//crear validos temporar que notifique al cliente lo conectamos con flash() enviamos las alertas para que se reflejen en el login
    if(!errors.isEmpty()){
         req.flash("mensajes", errors.array());
         return res.redirect("/auth/login");
         //el metodo flash funciona para crear respuestar ermengenter y rapidas para validaciones o notificaciones al usuario
    }


    const {email, password} = req.body;
    try {
        const user = await User.findOne({email:email});

        if(!user) throw new Error('No existe usuario');

        if(!user.cuentaConfirmada) throw new Error('Te falta confirmar la cuenta');

         if(!(await user.comparePassword(password))) throw new Error('Clave incorrecta');


         //me esta creando el usuario con passport
        req.login(user, function(err){
            if(err) throw new Error('Error al crear la sesion');
        return res.redirect('/');

        })


    } catch (error){ 
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/auth/login");
        
    }
}
//creamos el login en login.hbs usamos el metodo post establecimos la ruta luego el en user.js usamos el userSchema para comprobar la contraseña gracias a bycrytjs luego creamos el controlador que nos permite validar si la contraseña es correcta si estas funciones no se activan nos dirige al home que nos falta encriptarlo

const cerrarSesion = (req, res) => {
    req.logout(function(err){
        if(err) throw new Error('Error al cerrar sesion');
    });
    return res.redirect("/auth/login");
};//lo que hicimos fue llamar a la funcion logout que es el cierre que participa el passport con esto hace que la cuetnta terminde y deje de estar activa hicimos uan llamada callbak para los errores ya que nos enviava un error de not fuction por lo tanto controlamos el error y redirigimos a el login 


const formPerfil = async (req,res) => {
    return res.render('perfil')
}

module.exports ={
    loginForm,
    registerForm,
    registerUser,
    confirmarCuenta,
    loginUser,
    cerrarSesion,
}












