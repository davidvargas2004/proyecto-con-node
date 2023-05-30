const mongoose = require('mongoose')

const {Schema} = mongoose

const urlSchema = new Schema({
    origin:{
        type: 'string',
        unique: true,
        required: true
    },
    shortURL:{
        type: 'string',
        unique: true,
        required: true,
        
    },
    user:{
        type: Schema.Types.ObjectId,//traemos el id del usuario con estos comandos
        ref:"User",
        required: true,
    },
})

const Url= mongoose.model('Url', urlSchema)
module.exports= Url