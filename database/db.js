const mongoose = require('mongoose');
require('dotenv').config();



const clientDB = mongoose.connect(process.env.URL)
    .then((m)=> {console.log('conectada 👀')
        return m.connection.getClient()})
    .catch(err => {console.log("conexion fallida"+err)});


module.exports = clientDB;//borrar esto quedamos en la parte de proteger las sesiones 