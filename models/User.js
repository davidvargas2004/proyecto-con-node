const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');
const userSchema = new Schema({
    userName:{
        type: String,
        lowercase: true,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        index: {unique: true},
    },
    password: {
        type: String,
        required: true,
    },
    tokenConfirm: {
        type: String,
        default: null,
    },
    cuentaConfirmada: {
        type: Boolean,
        defatult: false
    },
    imagen: {
        type: String,
        default: null,
        
    }
});


userSchema.pre('save', async function(next){
    const user = this
    if(!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(user.password, salt);
        user.password = hash;
        next();
    } catch (error) {
        console.log(error);
        throw new Error("Error al escribir la contraseña");

    }
});
//hashchamos la clave para no verla gradias al elemenot bcrytpjs estoy lo llamamos lo vinculamos con una funcion async luego la enviamos al sever de mongo db y esto hace que los datos queden en encriptado 

userSchema.methods.comparePassword = async function(caditePassword){
    return await bcrypt.compare(caditePassword, this.password);
}




module.exports = mongoose.model('User', userSchema)














