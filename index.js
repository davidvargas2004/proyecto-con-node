const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const { create } = require("express-handlebars");
const csrf = require("csurf")



const User = require("./models/User.js");
require('dotenv').config();
require('./database/db.js');


const app = express();


app.use(session({
    secret: 'keyboard cat',
    reverse: false,
    saveUninitialized: false,
    name:'secret-name-blablabla',
    })
);

app.use(flash());


app.use(passport.initialize());
app.use(passport.session());


// LAS PREGUNTAS
passport.serializeUser((user,done)=> done(null,{id: user._id, userName: user.userName})) //req.user
passport.deserializeUser(async(user,done) => {
    const userDB = await User.findById(user.id)
    return done(null, {id: userDB._id, userName: userDB.userName})
})//con esto logramos que la sesion este valida y se conecte a la ruta segura que realizmos en home inicio con el middlewares para verificar que si esxiste y nos crea nuestro login

const hbs = create({
    extname: ".hbs",
    partialsDir:["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.urlencoded({extended:true}))

app.use(csrf()); // aplicativo para el uso de seguridar en token en cuenta, agrega un token a los formularios


app.use((req,res,next) => { 
    res.locals.csrfToken = req.csrfToken()
    res.locals.mensajes = req.flash("mensajes")
    next();
})//lo enviamos como metodo global para que nos de una llave y esoto haga que se pase a todas nuestras rendericaciones, se estableces variabels globales

app.use("/", require('./routes/home'))
app.use("/auth", require('./routes/auth'))

app.use(express.static(__dirname + "/public"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("server andando 🔥"));