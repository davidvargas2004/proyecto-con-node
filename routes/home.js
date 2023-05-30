const express = require("express");
const { leerUrls, agregarUrl, eliminarUrl, editarUrlForm,editarUrl,redireccionar} = require("../controllers/homeController");
const urlValidar = require("../middlewares/urlValida");
const verificarUser = require("../middlewares/verificarUser");
const { formPerfil, editarFotoPerfil } = require("../controllers/perfilController");

const router = express.Router();

router.get("/",verificarUser, leerUrls);
router.post("/",verificarUser,urlValidar, agregarUrl);
router.get("/eliminar/:id",verificarUser, eliminarUrl);
router.get("/editar/:id",verificarUser,editarUrlForm);
router.post("/editar/:id",verificarUser,urlValidar,editarUrl);
router.get("/perfil",verificarUser,formPerfil);
router.post("/perfil",verificarUser,editarFotoPerfil);






router.get("/:shortURL",redireccionar);//SEGURIDAD PARA REDICIONAR AL USIARIO SI NO HA INICIADO SESION Y ESTA INCORRECTO ESTO DA UNA ALERTA DE ERROR Y FUNCIONA PARA ENVIAR AL USUARI A EL LINK QUE GUARDO




router.get("/login", (req, res) => {
    res.render("login");
});


module.exports= router;