const mongoose = require('mongoose');

mongoose.connect(process.env.URL)
    .then(()=> {console.log('conectada 👀')})
    .catch(err => {console.log("conexion fallida")})