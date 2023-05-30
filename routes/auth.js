const express = require("express");
const {body} = require('express-validator');

const { loginForm, registerForm, registerUser,confirmarCuenta,loginUser, cerrarSesion,} = require("../controllers/authController");

const router = express.Router();





router.get('/register',registerForm);

router.post('/register',[
    body("userName","Ingrese un nombre válido").trim().notEmpty().escape(),
    body("email","Ingrese un email válido").trim().isEmail().normalizeEmail(),
    body("password","Ingrese un password válido").trim().isLength({min:6}).escape().custom((value,{req}) =>{
        if(value !== req.body.repassword){
            throw new Error("No es igual la contraseña");
        }else{
            return value;
        }
        //custom nos sirve ara validar la clave con su repeticion para que nos demuestre si esta correcto o no grcias al value que es (password).
        
    }),

],registerUser);//trim es limpiar los espacios vacios y notEmpty es que no venga vacio



router.get("/confirmar/:tokenConfirm", confirmarCuenta);
router.get('/login', loginForm);


router.post('/login',[//estos corteches sirven para abrir las validaciones dede el backend
    body("email","El email esta incorrecto").trim().isEmail().normalizeEmail(),
    body("password","La contraseña esta incorrecta").trim().isLength({min:6}).escape(),
],loginUser);


  
router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/logout", cerrarSesion) 


module.exports= router;